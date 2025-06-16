// Script para generar el panel HTML con credenciales preconfiguradas
// Ejecutar con: node scripts/generate-panel.mjs

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('🔧 Generando panel HTML con credenciales...');
console.log(`📍 URL: ${supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'No configurada'}`);
console.log(`🔑 Key: ${supabaseKey ? '✅ Configurada' : '❌ No configurada'}`);

const htmlTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Control - Supabase Database</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .tab-button.active {
            background-color: #3b82f6;
            color: white;
        }
        .table-container {
            max-height: 400px;
            overflow-y: auto;
        }
        .query-result {
            max-height: 300px;
            overflow-y: auto;
        }
        .credentials-configured {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        <i class="fas fa-database text-blue-600 mr-2"></i>
                        Panel de Control Supabase
                    </h1>
                    <p class="text-gray-600">Gestiona tu base de datos de manera visual</p>
                    ${supabaseUrl && supabaseKey ? `
                    <div class="mt-2 p-2 bg-green-100 border border-green-200 rounded">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        <span class="text-green-800 text-sm">Credenciales preconfiguradas</span>
                    </div>
                    ` : `
                    <div class="mt-2 p-2 bg-yellow-100 border border-yellow-200 rounded">
                        <i class="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                        <span class="text-yellow-800 text-sm">Configura tus credenciales abajo</span>
                    </div>
                    `}
                </div>
                <div class="flex items-center space-x-4">
                    <div id="connection-status" class="flex items-center">
                        <div class="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                        <span>Desconectado</span>
                    </div>
                    <button onclick="connectDatabase()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-plug mr-2"></i>Conectar
                    </button>
                    ${supabaseUrl && supabaseKey ? `
                    <button onclick="autoConnect()" class="credentials-configured px-4 py-2 rounded-lg hover:opacity-90 transition">
                        <i class="fas fa-bolt mr-2"></i>Conexión Rápida
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>

        <!-- Configuración -->
        <div id="config-section" class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">
                <i class="fas fa-cog text-gray-600 mr-2"></i>Configuración
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">URL de Supabase</label>
                    <input type="text" id="supabase-url" value="${supabaseUrl}" placeholder="https://tu-proyecto.supabase.co" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">API Key (Anon)</label>
                    <input type="password" id="supabase-key" value="${supabaseKey}" placeholder="tu-api-key-anonima" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <button type="button" onclick="togglePassword()" class="mt-2 text-sm text-blue-600 hover:text-blue-800">
                        <i class="fas fa-eye mr-1"></i>Mostrar/Ocultar
                    </button>
                </div>
            </div>
            <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-800">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <strong>Importante:</strong> Usa solo la API key anónima. Nunca ingreses tu service key aquí.
                </p>
            </div>
            ${supabaseUrl && supabaseKey ? `
            <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-800">
                    <i class="fas fa-info-circle mr-2"></i>
                    <strong>¡Listo para usar!</strong> Las credenciales ya están configuradas. Haz clic en "Conexión Rápida" para empezar.
                </p>
            </div>
            ` : ''}
        </div>

        <!-- Estadísticas -->
        <div id="stats-section" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" style="display: none;">
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-blue-100 rounded-full">
                        <i class="fas fa-table text-blue-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold text-gray-800" id="total-tables">0</h3>
                        <p class="text-gray-600">Total Tablas</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-green-100 rounded-full">
                        <i class="fas fa-database text-green-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold text-gray-800" id="total-rows">0</h3>
                        <p class="text-gray-600">Total Filas</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-purple-100 rounded-full">
                        <i class="fas fa-check-circle text-purple-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold text-gray-800" id="tables-with-data">0</h3>
                        <p class="text-gray-600">Con Datos</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-red-100 rounded-full">
                        <i class="fas fa-exclamation-circle text-red-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold text-gray-800" id="empty-tables">0</h3>
                        <p class="text-gray-600">Vacías</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenido Principal -->
        <div id="main-content" class="bg-white rounded-lg shadow-md" style="display: none;">
            <!-- Tabs -->
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6 py-4">
                    <button class="tab-button active py-2 px-4 text-sm font-medium text-gray-700 rounded-lg" onclick="showTab('tables')">
                        <i class="fas fa-table mr-2"></i>Tablas
                    </button>
                    <button class="tab-button py-2 px-4 text-sm font-medium text-gray-700 rounded-lg" onclick="showTab('query')">
                        <i class="fas fa-search mr-2"></i>Consultas
                    </button>
                    <button class="tab-button py-2 px-4 text-sm font-medium text-gray-700 rounded-lg" onclick="showTab('data')">
                        <i class="fas fa-list mr-2"></i>Datos
                    </button>
                    <button class="tab-button py-2 px-4 text-sm font-medium text-gray-700 rounded-lg" onclick="showTab('tools')">
                        <i class="fas fa-tools mr-2"></i>Herramientas
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
                <!-- Tablas Tab -->
                <div id="tables-tab" class="tab-content active">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-semibold">Estructura de Tablas</h2>
                        <button onclick="refreshTables()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-sync-alt mr-2"></i>Actualizar
                        </button>
                    </div>
                    <div id="tables-list" class="space-y-4">
                        <div class="text-center py-8">
                            <i class="fas fa-database text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">Conecta tu base de datos para ver las tablas</p>
                        </div>
                    </div>
                </div>

                <!-- Consultas Tab -->
                <div id="query-tab" class="tab-content">
                    <h2 class="text-xl font-semibold mb-4">Ejecutar Consultas</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Consulta SQL</label>
                            <textarea id="query-input" rows="6" placeholder="SELECT * FROM tu_tabla LIMIT 10;" 
                                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"></textarea>
                        </div>
                        <div class="flex space-x-4">
                            <button onclick="executeQuery()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                                <i class="fas fa-play mr-2"></i>Ejecutar
                            </button>
                            <button onclick="clearQuery()" class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition">
                                <i class="fas fa-trash mr-2"></i>Limpiar
                            </button>
                            <button onclick="loadSampleQueries()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                                <i class="fas fa-lightbulb mr-2"></i>Ejemplos
                            </button>
                        </div>
                        <div id="query-result" class="query-result"></div>
                    </div>
                </div>

                <!-- Datos Tab -->
                <div id="data-tab" class="tab-content">
                    <h2 class="text-xl font-semibold mb-4">Explorar Datos</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Seleccionar Tabla</label>
                            <select id="table-selector" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Selecciona una tabla...</option>
                            </select>
                        </div>
                        <div class="flex space-x-4">
                            <button onclick="loadTableData()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                                <i class="fas fa-download mr-2"></i>Cargar Datos
                            </button>
                            <button onclick="exportTableData()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                                <i class="fas fa-file-export mr-2"></i>Exportar CSV
                            </button>
                            <button onclick="analyzeTable()" class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
                                <i class="fas fa-chart-bar mr-2"></i>Analizar
                            </button>
                        </div>
                        <div id="table-data" class="table-container"></div>
                    </div>
                </div>

                <!-- Herramientas Tab -->
                <div id="tools-tab" class="tab-content">
                    <h2 class="text-xl font-semibold mb-4">Herramientas Adicionales</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-3">
                                <i class="fas fa-code-branch text-blue-600 mr-2"></i>
                                Generador de Código
                            </h3>
                            <p class="text-gray-600 mb-4">Genera código para tus operaciones más comunes</p>
                            <button onclick="generateCode()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Generar Código
                            </button>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-3">
                                <i class="fas fa-copy text-green-600 mr-2"></i>
                                Backup de Datos
                            </h3>
                            <p class="text-gray-600 mb-4">Exporta toda tu base de datos como backup</p>
                            <button onclick="fullBackup()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Crear Backup
                            </button>
                        </div>
                    </div>
                    <div id="tools-result" class="mt-6"></div>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div id="loading" class="text-center py-8" style="display: none;">
            <div class="loader mb-4"></div>
            <p class="text-gray-600">Cargando datos...</p>
        </div>
    </div>

    <script>
        let supabase = null;
        let currentTables = [];

        // Configuración preestablecida
        const PRESET_CONFIG = {
            url: '${supabaseUrl}',
            key: '${supabaseKey}'
        };

        // Función para conectar automáticamente
        async function autoConnect() {
            if (PRESET_CONFIG.url && PRESET_CONFIG.key) {
                document.getElementById('supabase-url').value = PRESET_CONFIG.url;
                document.getElementById('supabase-key').value = PRESET_CONFIG.key;
                await connectDatabase();
            } else {
                alert('No hay credenciales preconfiguradas. Configura manualmente.');
            }
        }

        // Función para mostrar/ocultar contraseña
        function togglePassword() {
            const keyInput = document.getElementById('supabase-key');
            if (keyInput.type === 'password') {
                keyInput.type = 'text';
            } else {
                keyInput.type = 'password';
            }
        }

        // Función para conectar a la base de datos
        async function connectDatabase() {
            const url = document.getElementById('supabase-url').value;
            const key = document.getElementById('supabase-key').value;

            if (!url || !key) {
                alert('Por favor ingresa la URL y la API Key de Supabase');
                return;
            }

            try {
                supabase = window.supabase.createClient(url, key);
                
                // Probar conexión
                const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1);
                
                if (error && error.code !== 'PGRST116') {
                    throw new Error('Error de conexión: ' + error.message);
                }

                updateConnectionStatus(true);
                document.getElementById('config-section').style.display = 'none';
                document.getElementById('stats-section').style.display = 'grid';
                document.getElementById('main-content').style.display = 'block';
                
                await loadDatabaseInfo();
                
            } catch (error) {
                alert('Error al conectar: ' + error.message);
                updateConnectionStatus(false);
            }
        }

        // Actualizar estado de conexión
        function updateConnectionStatus(connected) {
            const statusElement = document.getElementById('connection-status');
            if (connected) {
                statusElement.innerHTML = '<div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div><span>Conectado</span>';
            } else {
                statusElement.innerHTML = '<div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div><span>Desconectado</span>';
            }
        }

        // Cargar información de la base de datos
        async function loadDatabaseInfo() {
            showLoading(true);
            try {
                await discoverTables();
                await updateStats();
                populateTableSelector();
            } catch (error) {
                console.error('Error cargando información:', error);
            } finally {
                showLoading(false);
            }
        }

        // Descubrir tablas
        async function discoverTables() {
            currentTables = [];
            
            // Lista de tablas comunes para probar
            const commonTables = ['CLIENTE', 'cliente', 'clientes', 'PRODUCTO', 'producto', 'productos', 
                                'PEDIDO', 'pedido', 'pedidos', 'USUARIO', 'usuario', 'usuarios', 
                                'users', 'profiles', 'notes'];

            for (const tableName of commonTables) {
                try {
                    const { data, error, count } = await supabase
                        .from(tableName)
                        .select('*', { count: 'exact' })
                        .limit(1);

                    if (!error && data !== null) {
                        const columns = data.length > 0 ? Object.keys(data[0]) : [];
                        currentTables.push({
                            name: tableName,
                            columns: columns,
                            rowCount: count || 0,
                            sampleData: data
                        });
                    }
                } catch (err) {
                    // Tabla no existe, continuar
                }
            }

            displayTables();
        }

        // Mostrar tablas
        function displayTables() {
            const tablesContainer = document.getElementById('tables-list');
            
            if (currentTables.length === 0) {
                tablesContainer.innerHTML = \`
                    <div class="text-center py-8">
                        <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
                        <p class="text-gray-600">No se encontraron tablas accesibles</p>
                        <p class="text-sm text-gray-500 mt-2">Verifica los permisos de tu API key</p>
                    </div>
                \`;
                return;
            }

            let html = '';
            currentTables.forEach(table => {
                html += \`
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-lg font-semibold text-gray-800">
                                <i class="fas fa-table text-blue-600 mr-2"></i>
                                \${table.name}
                            </h3>
                            <div class="flex items-center space-x-2">
                                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    \${table.rowCount} filas
                                </span>
                                <button onclick="exportTable('\${table.name}')" class="text-purple-600 hover:text-purple-800">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                            \${table.columns.map(col => \`
                                <div class="bg-gray-50 px-2 py-1 rounded text-xs text-gray-700">
                                    \${col}
                                </div>
                            \`).join('')}
                        </div>
                        \${table.sampleData.length > 0 ? \`
                            <div class="mt-3 p-3 bg-gray-50 rounded text-xs">
                                <strong>Ejemplo:</strong><br>
                                <pre class="mt-1 text-gray-600">\${JSON.stringify(table.sampleData[0], null, 2)}</pre>
                            </div>
                        \` : ''}
                    </div>
                \`;
            });
            
            tablesContainer.innerHTML = html;
        }

        // Actualizar estadísticas
        function updateStats() {
            const totalTables = currentTables.length;
            const totalRows = currentTables.reduce((sum, table) => sum + table.rowCount, 0);
            const tablesWithData = currentTables.filter(table => table.rowCount > 0).length;
            const emptyTables = totalTables - tablesWithData;

            document.getElementById('total-tables').textContent = totalTables;
            document.getElementById('total-rows').textContent = totalRows;
            document.getElementById('tables-with-data').textContent = tablesWithData;
            document.getElementById('empty-tables').textContent = emptyTables;
        }

        // Poblar selector de tablas
        function populateTableSelector() {
            const selector = document.getElementById('table-selector');
            selector.innerHTML = '<option value="">Selecciona una tabla...</option>';
            
            currentTables.forEach(table => {
                const option = document.createElement('option');
                option.value = table.name;
                option.textContent = \`\${table.name} (\${table.rowCount} filas)\`;
                selector.appendChild(option);
            });
        }

        // Cambiar tabs
        function showTab(tabName) {
            // Ocultar todos los tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remover clase active de todos los botones
            document.querySelectorAll('.tab-button').forEach(button => {
                button.classList.remove('active');
            });
            
            // Mostrar tab seleccionado
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');
        }

        // Cargar consultas de ejemplo
        function loadSampleQueries() {
            if (currentTables.length === 0) {
                alert('Primero conecta tu base de datos');
                return;
            }

            const firstTable = currentTables[0].name;
            const sampleQueries = [
                \`SELECT * FROM \${firstTable} LIMIT 10;\`,
                \`SELECT COUNT(*) FROM \${firstTable};\`,
                \`SELECT * FROM \${firstTable} WHERE id = 1;\`
            ];

            const queryInput = document.getElementById('query-input');
            queryInput.value = sampleQueries.join('\\n\\n-- ');
        }

        // Ejecutar consulta personalizada
        async function executeQuery() {
            const query = document.getElementById('query-input').value.trim();
            if (!query) {
                alert('Por favor ingresa una consulta');
                return;
            }

            const resultContainer = document.getElementById('query-result');
            resultContainer.innerHTML = '<div class="loader mb-4"></div><p>Ejecutando consulta...</p>';

            try {
                // Extraer nombre de tabla de la consulta
                const tableName = extractTableName(query);
                if (!tableName) {
                    throw new Error('No se pudo identificar la tabla en la consulta');
                }

                const startTime = Date.now();
                const { data, error, count } = await supabase
                    .from(tableName)
                    .select('*', { count: 'exact' });

                const executionTime = Date.now() - startTime;

                if (error) {
                    throw new Error(error.message);
                }

                resultContainer.innerHTML = \`
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p class="text-green-800">
                            <i class="fas fa-check-circle mr-2"></i>
                            Consulta ejecutada exitosamente en \${executionTime}ms
                            \${count ? \` • \${count} filas\` : ''}
                        </p>
                    </div>
                    <div class="bg-gray-50 border rounded-lg p-4">
                        <h4 class="font-semibold mb-2">Resultado:</h4>
                        <pre class="text-sm text-gray-700 overflow-auto max-h-64">\${JSON.stringify(data, null, 2)}</pre>
                    </div>
                \`;
            } catch (error) {
                resultContainer.innerHTML = \`
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p class="text-red-800">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Error: \${error.message}
                        </p>
                    </div>
                \`;
            }
        }

        // Extraer nombre de tabla de la consulta
        function extractTableName(query) {
            const match = query.match(/from\\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
            return match ? match[1] : null;
        }

        // Limpiar consulta
        function clearQuery() {
            document.getElementById('query-input').value = '';
            document.getElementById('query-result').innerHTML = '';
        }

        // Cargar datos de tabla
        async function loadTableData() {
            const tableName = document.getElementById('table-selector').value;
            if (!tableName) {
                alert('Por favor selecciona una tabla');
                return;
            }

            const container = document.getElementById('table-data');
            container.innerHTML = '<div class="loader mb-4"></div><p>Cargando datos...</p>';

            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(50);

                if (error) {
                    throw new Error(error.message);
                }

                if (!data || data.length === 0) {
                    container.innerHTML = '<p class="text-gray-600 text-center py-4">No hay datos en esta tabla</p>';
                    return;
                }

                // Crear tabla HTML
                const headers = Object.keys(data[0]);
                let html = \`
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse border border-gray-300">
                            <thead class="bg-gray-100">
                                <tr>
                                    \${headers.map(header => \`<th class="border border-gray-300 px-4 py-2 text-left font-medium">\${header}</th>\`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                \`;

                data.forEach(row => {
                    html += '<tr class="hover:bg-gray-50">';
                    headers.forEach(header => {
                        const value = row[header];
                        html += \`<td class="border border-gray-300 px-4 py-2">\${value === null ? '<span class="text-gray-400 italic">null</span>' : String(value)}</td>\`;
                    });
                    html += '</tr>';
                });

                html += '</tbody></table></div>';
                container.innerHTML = html;

            } catch (error) {
                container.innerHTML = \`
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p class="text-red-800">Error: \${error.message}</p>
                    </div>
                \`;
            }
        }

        // Analizar tabla
        async function analyzeTable() {
            const tableName = document.getElementById('table-selector').value;
            if (!tableName) {
                alert('Por favor selecciona una tabla');
                return;
            }

            const container = document.getElementById('table-data');
            container.innerHTML = '<div class="loader mb-4"></div><p>Analizando tabla...</p>';

            try {
                const { data, error, count } = await supabase
                    .from(tableName)
                    .select('*', { count: 'exact' });

                if (error) {
                    throw new Error(error.message);
                }

                const analysis = {
                    totalRows: count,
                    columns: data.length > 0 ? Object.keys(data[0]).length : 0,
                    sampleSize: data.length,
                    hasNulls: data.some(row => Object.values(row).some(val => val === null))
                };

                container.innerHTML = \`
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 class="font-semibold mb-3">Análisis de \${tableName}</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-600">\${analysis.totalRows}</div>
                                <div class="text-sm text-gray-600">Total Filas</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-600">\${analysis.columns}</div>
                                <div class="text-sm text-gray-600">Columnas</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-purple-600">\${analysis.sampleSize}</div>
                                <div class="text-sm text-gray-600">Muestra</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold \${analysis.hasNulls ? 'text-red-600' : 'text-green-600'}">
                                    \${analysis.hasNulls ? 'Sí' : 'No'}
                                </div>
                                <div class="text-sm text-gray-600">Valores Nulos</div>
                            </div>
                        </div>
                    </div>
                \`;
            } catch (error) {
                container.innerHTML = \`
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p class="text-red-800">Error: \${error.message}</p>
                    </div>
                \`;
            }
        }

        // Exportar datos de tabla
        async function exportTableData() {
            const tableName = document.getElementById('table-selector').value;
            if (!tableName) {
                alert('Por favor selecciona una tabla');
                return;
            }

            await exportTable(tableName);
        }

        // Exportar tabla a CSV
        async function exportTable(tableName) {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*');

                if (error) {
                    throw new Error(error.message);
                }

                if (!data || data.length === 0) {
                    alert('No hay datos para exportar');
                    return;
                }

                const csv = convertToCSV(data);
                downloadCSV(csv, \`\${tableName}.csv\`);
                
            } catch (error) {
                alert('Error exportando datos: ' + error.message);
            }
        }

        // Generar código
        function generateCode() {
            const resultContainer = document.getElementById('tools-result');
            if (currentTables.length === 0) {
                resultContainer.innerHTML = '<p class="text-red-600">Primero conecta tu base de datos</p>';
                return;
            }

            const firstTable = currentTables[0];
            const code = \`
// Código JavaScript para \${firstTable.name}
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('${supabaseUrl}', '${supabaseKey}');

// Obtener todos los registros
async function getAll\${firstTable.name}() {
    const { data, error } = await supabase
        .from('\${firstTable.name}')
        .select('*');
    
    if (error) console.error('Error:', error);
    return data;
}

// Insertar nuevo registro
async function insert\${firstTable.name}(record) {
    const { data, error } = await supabase
        .from('\${firstTable.name}')
        .insert([record]);
    
    if (error) console.error('Error:', error);
    return data;
}

// Actualizar registro
async function update\${firstTable.name}(id, updates) {
    const { data, error } = await supabase
        .from('\${firstTable.name}')
        .update(updates)
        .eq('id', id);
    
    if (error) console.error('Error:', error);
    return data;
}
            \`;

            resultContainer.innerHTML = \`
                <div class="bg-gray-50 border rounded-lg p-4">
                    <h4 class="font-semibold mb-2">Código Generado para \${firstTable.name}</h4>
                    <pre class="text-sm text-gray-700 overflow-auto max-h-64">\${code}</pre>
                    <button onclick="copyToClipboard(\\\`\${code}\\\`)" class="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        Copiar Código
                    </button>
                </div>
            \`;
        }

        // Backup completo
        async function fullBackup() {
            if (currentTables.length === 0) {
                alert('No hay tablas para respaldar');
                return;
            }

            const resultContainer = document.getElementById('tools-result');
            resultContainer.innerHTML = '<div class="loader mb-4"></div><p>Creando backup...</p>';

            try {
                const backup = {
                    timestamp: new Date().toISOString(),
                    tables: {}
                };

                for (const table of currentTables) {
                    const { data, error } = await supabase
                        .from(table.name)
                        .select('*');
                    
                    if (!error && data) {
                        backup.tables[table.name] = data;
                    }
                }

                const backupJson = JSON.stringify(backup, null, 2);
                downloadCSV(backupJson, \`backup_\${new Date().toISOString().split('T')[0]}.json\`);

                resultContainer.innerHTML = \`
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p class="text-green-800">
                            <i class="fas fa-check-circle mr-2"></i>
                            Backup creado exitosamente
                        </p>
                    </div>
                \`;
            } catch (error) {
                resultContainer.innerHTML = \`
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p class="text-red-800">Error: \${error.message}</p>
                    </div>
                \`;
            }
        }

        // Copiar al portapapeles
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Código copiado al portapapeles');
            });
        }

        // Convertir a CSV
        function convertToCSV(data) {
            if (data.length === 0) return '';
            
            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => {
                        const value = row[header];
                        return typeof value === 'string' ? \`"\${value}"\` : value;
                    }).join(',')
                )
            ].join('\\n');
            
            return csvContent;
        }

        // Descargar CSV
        function downloadCSV(content, filename) {
            const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Actualizar tablas
        async function refreshTables() {
            await loadDatabaseInfo();
        }

        // Mostrar/ocultar loading
        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }

        // Auto-conectar si hay credenciales preconfiguradas
        window.onload = function() {
            if (PRESET_CONFIG.url && PRESET_CONFIG.key) {
                // Auto-conectar después de 1 segundo
                setTimeout(() => {
                    const autoConnectBtn = document.querySelector('.credentials-configured');
                    if (autoConnectBtn) {
                        autoConnectBtn.style.animation = 'pulse 2s infinite';
                    }
                }, 1000);
            }
        };
    </script>
</body>
</html>`;

// Escribir el archivo
const outputPath = path.join('public', 'database-panel-configured.html');
fs.writeFileSync(outputPath, htmlTemplate);

console.log('✅ Panel HTML generado exitosamente!');
console.log(`📄 Archivo: ${outputPath}`);
console.log('🌐 Para usar: Abre el archivo en tu navegador o visita /database-panel-configured.html en tu servidor'); 