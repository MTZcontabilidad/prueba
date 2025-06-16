# ✅ CHECKLIST DE VERIFICACIÓN POST-MIGRACIÓN

## 🔍 VERIFICACIONES RÁPIDAS

### 1. Base de Datos
- [ ] Ejecutar script `migracion_usuarios.sql` en Supabase
- [ ] Verificar que tabla `clients` tiene 127 registros
- [ ] Verificar que tabla `users` se pobló correctamente
- [ ] Verificar políticas RLS activas
- [ ] Verificar índices creados

### 2. Aplicación
- [ ] `npm install` (si hay nuevas dependencias)
- [ ] `npm run dev`
- [ ] No hay errores en consola
- [ ] Página carga correctamente

### 3. Funcionalidades a Probar

#### Autenticación:
- [ ] Crear nueva cuenta con todos los campos
- [ ] Login con usuario existente
- [ ] Intentar 5 logins fallidos (verificar bloqueo)
- [ ] Recuperar contraseña
- [ ] Cerrar sesión

#### Gestión de Clientes:
- [ ] Ver listado de clientes
- [ ] Buscar clientes
- [ ] Crear nuevo cliente
- [ ] Editar cliente existente
- [ ] Eliminar cliente
- [ ] Exportar a CSV

#### Perfil de Usuario:
- [ ] Acceder a /profile
- [ ] Ver información personal
- [ ] Editar y guardar cambios
- [ ] Cambiar configuraciones
- [ ] Ver último acceso

### 4. Validaciones
- [ ] RUT se formatea automáticamente
- [ ] RUT inválido muestra error
- [ ] Email inválido muestra error
- [ ] Campos requeridos funcionan

### 5. Seguridad
- [ ] Rutas protegidas redirigen a login
- [ ] Usuario no puede ver datos de otros clientes
- [ ] Campos sensibles no son editables

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Error: "relation users does not exist"
**Solución**: Ejecutar el script de migración de usuarios

### Error: "permission denied for table"
**Solución**: Verificar políticas RLS en Supabase

### Error: "column X does not exist"
**Solución**: Verificar que se ejecutó la migración completa

### Login no funciona
**Solución**: Verificar que el trigger de sincronización está activo

## 📞 SOPORTE

Si encuentras algún problema:
1. Revisar logs en Supabase Dashboard
2. Verificar Network tab en navegador
3. Revisar console.log en navegador
4. Verificar que todas las migraciones se ejecutaron

---

**Checklist creado**: ${new Date().toLocaleDateString('es-CL')}
**Para usar después de**: Ejecutar scripts de migración SQL
