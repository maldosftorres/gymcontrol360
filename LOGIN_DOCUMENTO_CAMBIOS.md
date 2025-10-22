# Sistema de Login con Número de Documento - Implementado

## ✅ Cambios Realizados

### Backend (NestJS)

#### 1. **LoginDto actualizado** (`src/modules/usuarios/dto/login.dto.ts`)
- Cambió de `username` a `documentoNumero`
- Eliminada validación de email, ahora solo requiere string no vacío

#### 2. **UsuariosService actualizado** (`src/modules/usuarios/usuarios.service.ts`)
- **Método `login()`**: Ahora busca usuarios por `documentoNumero` en lugar de email
- **Validaciones en `create()`**: Añadida verificación de unicidad para `documentoNumero`
- **Validaciones en `update()`**: Añadida verificación de unicidad para `documentoNumero`
- **Logs actualizados**: Muestran `documentoNumero` en lugar de email
- **Response del login**: Retorna `documentoNumero` como `username`

#### 3. **CreateUsuarioDto actualizado** (`src/modules/usuarios/dto/create-usuario.dto.ts`)
- Campo `documentoNumero` ahora es **obligatorio** (no opcional)
- Añadida validación `@IsNotEmpty()` para asegurar que tenga valor

### Frontend (React + TypeScript)

#### 1. **Tipos actualizados** (`web/src/types/index.ts`)
- `LoginCredentials`: Cambió `username` por `documentoNumero`
- `CreateUsuarioDto`: Campo `documentoNumero` ahora obligatorio (no opcional)

#### 2. **Página de Login actualizada** (`web/src/pages/Login.tsx`)
- **Schema de validación**: Cambió validación de email por string simple para documento
- **Interfaz**: 
  - Campo "Email" cambió a "Número de Documento"
  - Icono cambió de `Mail` a `CreditCard`
  - Placeholder actualizado a "12345678"
  - Autocompletado cambiado de "email" a "off"

#### 3. **Página de Usuarios actualizada** (`web/src/pages/Usuarios.tsx`)
- Campo `documentoNumero` marcado como **obligatorio** con asterisco (*)
- Atributo `required` añadido al input
- Placeholder descriptivo añadido
- Estado inicial del formulario incluye `documentoNumero: ''`
- Función `resetForm` actualizada para incluir campo documento

## 🔐 Flujo de Login Actualizado

### Antes:
1. Usuario ingresa **email** y contraseña
2. Sistema busca por campo `email` en base de datos
3. Valida contraseña y retorna token

### Ahora:
1. Usuario ingresa **número de documento** y contraseña
2. Sistema busca por campo `documentoNumero` en base de datos
3. Valida contraseña y retorna token
4. El `username` en la respuesta es el número de documento

## 🛡️ Validaciones de Seguridad

### Backend:
- ✅ **Unicidad de documento**: No se permiten números de documento duplicados
- ✅ **Unicidad de email**: Mantenida para evitar correos duplicados  
- ✅ **Campo obligatorio**: `documentoNumero` es requerido al crear usuarios
- ✅ **Validación en actualización**: Verifica unicidad al actualizar documentos

### Frontend:
- ✅ **Validación de formulario**: Campo documento es obligatorio
- ✅ **Interfaz clara**: Indica con (*) los campos requeridos
- ✅ **Feedback visual**: Placeholder explicativo para el usuario

## 🎯 Beneficios del Cambio

1. **Más Práctico**: Los usuarios del gimnasio pueden recordar fácilmente su número de documento
2. **Menos Confusión**: No depende de correos electrónicos que pueden olvidarse
3. **Identificación Única**: Cada persona tiene un documento único
4. **Simplicidad**: Proceso de login más directo y simple
5. **Familiar**: Los usuarios están acostumbrados a usar su documento para identificarse

## 📋 Datos de Prueba Sugeridos

Para probar el sistema, asegúrate de que los usuarios tengan números de documento únicos:

```sql
-- Ejemplos de usuarios con documentos
INSERT INTO usuarios (documento_numero, password_hash, ...) VALUES
('12345678', 'hash_password', ...),
('87654321', 'hash_password', ...),
('11223344', 'hash_password', ...);
```

## ✨ Próximos Pasos Sugeridos

1. **Actualizar seeds**: Modificar datos de prueba para incluir números de documento
2. **Documentación**: Actualizar manuales de usuario
3. **Testing**: Crear casos de prueba para validar el nuevo flujo
4. **Migración**: Si hay datos existentes, considerar script de migración

El sistema ahora es más intuitivo y práctico para el contexto de un gimnasio, donde los usuarios pueden usar su documento de identidad para acceder al sistema.