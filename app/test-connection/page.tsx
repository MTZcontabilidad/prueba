import { createClient } from "@/lib/supabase/server";

export default async function TestConnection() {
  const supabase = await createClient();
  
  // Verificar el usuario autenticado
  const { data: user, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user?.user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test de Conexión con Supabase</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error de autenticación:</p>
          <p>{userError?.message || "No hay usuario autenticado"}</p>
        </div>
      </div>
    );
  }

  // Intentar obtener datos de la tabla CLIENTE
  const { data: clientes, error: clientesError } = await supabase
    .from('CLIENTE')
    .select('*')
    .limit(5);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Test de Conexión con Supabase</h1>
      
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p className="font-bold">✓ Usuario autenticado:</p>
        <p>{user.user.email}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Datos de la tabla CLIENTE:</h2>
        {clientesError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error al obtener clientes:</p>
            <p>{clientesError.message}</p>
            <p className="text-sm mt-2">Código: {clientesError.code}</p>
            <p className="text-sm">Detalles: {clientesError.details}</p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="font-semibold mb-2">Se encontraron {clientes?.length || 0} clientes:</p>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(clientes, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Información de conexión:</h3>
        <ul className="text-sm space-y-1">
          <li>URL de Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL}</li>
          <li>Proyecto ID: gyxqhfsqdgblxywmlpnd</li>
          <li>Tabla: CLIENTE</li>
          <li>RLS habilitado: Sí</li>
          <li>Política: "Temporary access to CLIENTE" (PERMISSIVE)</li>
        </ul>
      </div>
    </div>
  );
}