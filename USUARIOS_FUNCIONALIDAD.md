# Funcionalidad de Usuarios y Socios - Implementada

## ✅ Funcionalidades Completadas

### Backend (NestJS)
1. **DTOs creados**:
   - `CreateUsuarioDto`: Para crear nuevos usuarios con validaciones
   - `UpdateUsuarioDto`: Para actualizar usuarios existentes

2. **Servicio de Usuarios (`UsuariosService`)**:
   - `create()`: Crea usuario y automáticamente el socio si el rol es 'SOCIO'
   - `findAll()`: Lista usuarios con filtros por empresa y sede
   - `findOne()`: Obtiene un usuario específico
   - `update()`: Actualiza datos del usuario
   - `remove()`: Eliminación suave (soft delete)
   - `generateSocioCodigo()`: Genera códigos únicos para socios (SOC-001, SOC-002, etc.)

3. **Controlador de Usuarios (`UsuariosController`)**:
   - `POST /usuarios`: Crear nuevo usuario/socio
   - `GET /usuarios`: Listar usuarios
   - `GET /usuarios/:id`: Obtener usuario específico
   - `PATCH /usuarios/:id`: Actualizar usuario
   - `DELETE /usuarios/:id`: Eliminar usuario

4. **Características especiales**:
   - Transacciones de base de datos para garantizar consistencia
   - Encriptación de contraseñas con bcrypt
   - Validación de emails únicos
   - Generación automática de códigos de socio
   - Relaciones automáticas entre Usuario y Socio

### Frontend (React + TypeScript)
1. **Tipos TypeScript** actualizados en `types/index.ts`:
   - `Usuario`: Interface completa del usuario
   - `Socio`: Interface del socio
   - `CreateUsuarioDto`: Para formularios de creación
   - `Empresa` y `Sede`: Interfaces relacionadas

2. **Servicios API** (`services/usuarios.api.ts`):
   - Funciones para todas las operaciones CRUD de usuarios
   - Integración con axios e interceptores

3. **Componentes**:
   - `DataTable`: Tabla avanzada con acciones (editar/eliminar)
   - `BasicDataTable`: Tabla simple para compatibilidad
   - `SimpleCard`: Componente de tarjeta genérico

4. **Página de Usuarios** (`pages/Usuarios.tsx`):
   - Listado completo de usuarios con información de socios
   - Formulario completo para crear/editar usuarios
   - Funcionalidad de búsqueda y filtros
   - Acciones de editar y eliminar
   - Indicadores de estado visual

5. **Navegación**:
   - Ruta `/usuarios` agregada al enrutador
   - Opción "Usuarios" en el sidebar con ícono

## 🔄 Flujo de Creación de Usuario/Socio

1. **Usuario llena formulario** con datos básicos y rol
2. **Backend valida datos** (email único, campos requeridos)
3. **Se crea usuario** con contraseña encriptada
4. **Si rol es 'SOCIO'**: Se crea automáticamente registro de socio
5. **Se genera código único** para el socio (SOC-001, SOC-002, etc.)
6. **Transacción completa** asegura consistencia de datos

## 🎯 Casos de Uso Principales

### Crear Socio
- Se llena formulario con datos personales
- Rol se establece como 'SOCIO' (por defecto)
- Sistema crea usuario Y socio automáticamente
- Se asigna código único al socio

### Crear Entrenador/Administrador
- Se llena formulario y se selecciona rol específico
- Solo se crea el usuario (no el registro de socio)
- Puede gestionar otros usuarios y socios

### Gestión de Usuarios
- Ver lista completa con información del socio
- Editar datos personales y configuración
- Cambiar estados (activo/inactivo/suspendido)
- Eliminar usuarios (soft delete)

## 🛡️ Validaciones y Seguridad

- **Emails únicos**: No se permiten emails duplicados
- **Contraseñas seguras**: Encriptación con bcrypt (12 rounds)
- **Validación de tipos**: DTOs con class-validator
- **Transacciones**: Rollback automático en caso de error
- **Soft delete**: Los datos se marcan como inactivos, no se eliminan

## 📊 Información Mostrada en la Tabla

- Código del socio (si aplica)
- Nombre completo
- Email
- Rol (Administrador/Entrenador/Socio)
- Estado con indicadores visuales
- Teléfono
- Fecha de alta
- Acciones (Editar/Eliminar)

La funcionalidad está completamente implementada y lista para uso. El sistema automáticamente crea socios cuando el usuario tiene rol 'SOCIO', manteniendo la integridad relacional de los datos.