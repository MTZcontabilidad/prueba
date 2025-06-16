"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
}

export function DatabaseAnalyzer() {
  const [tables, setTables] = useState<TableSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeTables = async () => {
      const supabase = createClient();
      
      try {
        // Obtener información de las tablas y columnas
        const { data: tableInfo, error: schemaError } = await supabase
          .from('information_schema.columns')
          .select('table_name, column_name, data_type, is_nullable, column_default')
          .eq('table_schema', 'public')
          .order('table_name')
          .order('ordinal_position');

        if (schemaError) {
          console.error('Error obteniendo esquema:', schemaError);
          // Intentar método alternativo
          await analyzeTablesAlternative();
          return;
        }

        if (tableInfo) {
          // Agrupar por tabla
          const tablesMap = new Map<string, TableInfo[]>();
          
          tableInfo.forEach((col: TableInfo) => {
            if (!tablesMap.has(col.table_name)) {
              tablesMap.set(col.table_name, []);
            }
            tablesMap.get(col.table_name)?.push(col);
          });

          // Convertir a array y obtener conteo de filas
          const tablesSummary: TableSummary[] = [];
          
          for (const [tableName, columns] of tablesMap) {
            try {
              const { count } = await supabase
                .from(tableName)
                .select('*', { count: 'exact', head: true });
              
              tablesSummary.push({
                name: tableName,
                columns,
                rowCount: count || 0
              });
            } catch {
              tablesSummary.push({
                name: tableName,
                columns,
                rowCount: undefined
              });
            }
          }

          setTables(tablesSummary);
        }
      } catch (err) {
        console.error('Error analizando base de datos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    const analyzeTablesAlternative = async () => {
      const supabase = createClient();
      
      // Lista de tablas conocidas para probar
      const knownTables = ['CLIENTE', 'cliente', 'clientes', 'users', 'profiles'];
      const foundTables: TableSummary[] = [];

      for (const tableName of knownTables) {
        try {
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact' })
            .limit(1);

          if (!error && data !== null) {
            // Inferir estructura de la primera fila
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
              rowCount: count || 0
            });
          }
        } catch {
          // Tabla no existe, continuar
        }
      }

      setTables(foundTables);
    };

    analyzeTables();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Analizando Base de Datos...</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error al Analizar</h2>
        <p className="text-red-500">{error}</p>
        <p className="mt-2 text-sm text-gray-600">
          Verifica los permisos de tu usuario en Supabase para acceder a information_schema
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Análisis de Base de Datos Supabase</h2>
      
      {tables.length === 0 ? (
        <p className="text-gray-500">No se encontraron tablas accesibles</p>
      ) : (
        <div className="space-y-6">
          {tables.map((table) => (
            <div key={table.name} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-600">
                  📊 {table.name}
                </h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {table.rowCount !== undefined ? `${table.rowCount} filas` : 'Conteo no disponible'}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Columna</th>
                      <th className="text-left py-2 px-3">Tipo</th>
                      <th className="text-left py-2 px-3">Nullable</th>
                      <th className="text-left py-2 px-3">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium">{col.column_name}</td>
                        <td className="py-2 px-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {col.data_type}
                          </span>
                        </td>
                        <td className="py-2 px-3">{col.is_nullable}</td>
                        <td className="py-2 px-3 text-gray-600">
                          {col.column_default || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 