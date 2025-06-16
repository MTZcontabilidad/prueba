"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
;
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Database, Table, Search, Play, Download, RefreshCw } from "lucide-react";

interface TableInfo {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string;
}

interface TableSummary {
  name: string;
  columns: TableInfo[];
  rowCount?: number;
  sampleData?: unknown[];
}

interface QueryResult {
  data: unknown[] | null;
  error: string | null;
  count?: number;
  executionTime: number;
}

export function DatabaseDashboard() {
  const [tables, setTables] = useState<TableSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [customQuery, setCustomQuery] = useState<string>("");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    analyzeTables();
  }, []);

  const analyzeTables = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Intentar obtener esquema completo
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('table_name, column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .order('table_name')
        .order('ordinal_position');

      if (schemaError) {
        console.warn('No se pudo acceder a information_schema:', schemaError);
        await analyzeKnownTables();
      } else if (schemaData) {
        await processSchemaData(schemaData);
      }
    } catch (err) {
      console.error('Error analizando base de datos:', err);
      await analyzeKnownTables();
    } finally {
      setLoading(false);
    }
  };

  const processSchemaData = async (schemaData: TableInfo[]) => {
    const tablesMap = new Map<string, TableInfo[]>();
    
    schemaData.forEach((col: TableInfo) => {
      if (!tablesMap.has(col.table_name)) {
        tablesMap.set(col.table_name, []);
      }
      tablesMap.get(col.table_name)?.push(col);
    });

    const tablesSummary: TableSummary[] = [];
    
    for (const [tableName, columns] of tablesMap) {
      try {
        const { data, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(3);
        
        tablesSummary.push({
          name: tableName,
          columns,
          rowCount: count || 0,
          sampleData: data || []
        });
      } catch {
        tablesSummary.push({
          name: tableName,
          columns,
          rowCount: undefined,
          sampleData: []
        });
      }
    }

    setTables(tablesSummary);
  };

  const analyzeKnownTables = async () => {
    const knownTables = [
      'CLIENTE', 'cliente', 'clientes',
      'PRODUCTO', 'producto', 'productos', 
      'PEDIDO', 'pedido', 'pedidos',
      'USUARIO', 'usuario', 'usuarios',
      'users', 'profiles', 'notes'
    ];

    const foundTables: TableSummary[] = [];

    for (const tableName of knownTables) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(3);

        if (!error && data !== null) {
          const columns: TableInfo[] = [];
          if (data.length > 0) {
            Object.keys(data[0]).forEach(key => {
              columns.push({
                table_name: tableName,
                column_name: key,
                data_type: typeof data[0][key],
                is_nullable: 'unknown',
                column_default: ''
              });
            });
          }

          foundTables.push({
            name: tableName,
            columns,
            rowCount: count || 0,
            sampleData: data
          });
        }
      } catch {
        // Tabla no existe, continuar
      }
    }

    setTables(foundTables);
  };

  const executeCustomQuery = async () => {
    if (!customQuery.trim()) return;
    
    setQueryLoading(true);
    const startTime = Date.now();
    
    try {
      // Detectar tipo de consulta
      const queryLower = customQuery.toLowerCase().trim();
      
      if (queryLower.startsWith('select')) {
        // Para consultas SELECT, usar el cliente de Supabase
        const tableName = extractTableName(customQuery);
        if (tableName) {
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact' });
          
          const executionTime = Date.now() - startTime;
          setQueryResult({
            data,
            error: error?.message || null,
            count,
            executionTime
          });
        } else {
          setQueryResult({
            data: null,
            error: 'No se pudo detectar el nombre de la tabla',
            executionTime: Date.now() - startTime
          });
        }
      } else {
        // Para otras consultas, mostrar mensaje informativo
        setQueryResult({
          data: null,
          error: 'Solo se soportan consultas SELECT por seguridad',
          executionTime: Date.now() - startTime
        });
      }
    } catch (err) {
      setQueryResult({
        data: null,
        error: err instanceof Error ? err.message : 'Error desconocido',
        executionTime: Date.now() - startTime
      });
    } finally {
      setQueryLoading(false);
    }
  };

  const extractTableName = (query: string): string | null => {
    const match = query.match(/from\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    return match ? match[1] : null;
  };

  const loadTableData = async (tableName: string) => {
    setSelectedTable(tableName);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(50);
      
      if (!error && data) {
        setTables(prev => prev.map(table => 
          table.name === tableName 
            ? { ...table, sampleData: data }
            : table
        ));
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const exportTableData = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      
      if (!error && data) {
        const csv = convertToCSV(data);
        downloadCSV(csv, `${tableName}.csv`);
      }
    } catch (err) {
      console.error('Error exportando datos:', err);
    }
  };

  const convertToCSV = (data: unknown[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Analizando base de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Base de Datos</h1>
          <p className="text-muted-foreground">
            Analiza y gestiona tu base de datos Supabase
          </p>
        </div>
        <Button onClick={analyzeTables} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tablas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Filas</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.reduce((sum, table) => sum + (table.rowCount || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tablas con Datos</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.filter(table => (table.rowCount || 0) > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={error ? "destructive" : "default"}>
              {error ? "Error" : "Conectado"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tablas</TabsTrigger>
          <TabsTrigger value="query">Consultas</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
        </TabsList>

        {/* Tab de Tablas */}
        <TabsContent value="tables" className="space-y-4">
          {tables.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No se encontraron tablas accesibles</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tables.map((table) => (
                <Card key={table.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Table className="h-5 w-5" />
                          {table.name}
                        </CardTitle>
                        <CardDescription>
                          {table.columns.length} columnas • {table.rowCount || 0} filas
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadTableData(table.name)}
                        >
                          <Search className="h-4 w-4 mr-1" />
                          Ver Datos
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportTableData(table.name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Columna</th>
                            <th className="text-left py-2">Tipo</th>
                            <th className="text-left py-2">Nullable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((col, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="py-2 font-medium">{col.column_name}</td>
                              <td className="py-2">
                                <Badge variant="secondary">{col.data_type}</Badge>
                              </td>
                              <td className="py-2">{col.is_nullable}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab de Consultas */}
        <TabsContent value="query" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ejecutar Consulta</CardTitle>
              <CardDescription>
                Ejecuta consultas SELECT en tu base de datos (solo lectura por seguridad)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="query">Consulta SQL</Label>
                <Textarea
                  id="query"
                  placeholder="SELECT * FROM nombre_tabla LIMIT 10;"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button onClick={executeCustomQuery} disabled={queryLoading}>
                <Play className="h-4 w-4 mr-2" />
                {queryLoading ? 'Ejecutando...' : 'Ejecutar'}
              </Button>
            </CardContent>
          </Card>

          {/* Resultado de Consulta */}
          {queryResult && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
                <CardDescription>
                  Tiempo de ejecución: {queryResult.executionTime}ms
                  {queryResult.count && ` • ${queryResult.count} filas`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {queryResult.error ? (
                  <div className="text-red-500 bg-red-50 p-4 rounded">
                    <strong>Error:</strong> {queryResult.error}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-96">
                      {JSON.stringify(queryResult.data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab de Datos */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Tabla</CardTitle>
                <CardDescription>
                  Elige una tabla para ver sus datos detallados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {tables.map((table) => (
                    <Button
                      key={table.name}
                      variant={selectedTable === table.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => loadTableData(table.name)}
                    >
                      {table.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mostrar datos de la tabla seleccionada */}
            {selectedTable && (
              <Card>
                <CardHeader>
                  <CardTitle>Datos de {selectedTable}</CardTitle>
                  <CardDescription>
                    Mostrando primeras 50 filas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const table = tables.find(t => t.name === selectedTable);
                    if (!table?.sampleData || table.sampleData.length === 0) {
                      return <p className="text-muted-foreground">No hay datos disponibles</p>;
                    }

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border">
                          <thead>
                            <tr className="bg-gray-50">
                              {Object.keys(table.sampleData[0]).map(key => (
                                <th key={key} className="border p-2 text-left font-medium">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.sampleData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                {Object.values(row).map((value, cellIdx) => (
                                  <td key={cellIdx} className="border p-2">
                                    {value === null ? (
                                      <span className="text-gray-400 italic">null</span>
                                    ) : (
                                      String(value)
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 