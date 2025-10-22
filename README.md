# 🏋️‍♂️ GymControl 360

**Sistema de gestión integral para gimnasios** - Monorepo con Backend NestJS + Frontend React

## 📋 Tabla de Contenido

- [🚀 Tecnologías](#-tecnologías)
- [🏗️ Arquitectura](#️-arquitectura)
- [⚡ Inicio Rápido](#-inicio-rápido)
- [🔧 Desarrollo](#-desarrollo)
- [📱 Frontend](#-frontend)
- [🔧 Backend](#-backend)
- [🗄️ Base de Datos](#️-base-de-datos)

## 🚀 Tecnologías

### Backend (NestJS)
- **Framework**: NestJS + TypeScript
- **Base de Datos**: PostgreSQL + TypeORM
- **Autenticación**: JWT
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI

### Frontend (React)
- **Framework**: React 18 + TypeScript + Vite
- **Enrutamiento**: React Router v6+
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Estados**: Context API

## 🏗️ Arquitectura

```
gym-control-360/
├── src/                    # Backend NestJS
│   ├── modules/           # Módulos de negocio
│   ├── database/          # Entidades y migraciones
│   ├── common/            # Enums y utilidades
│   └── config/            # Configuración
├── web/                   # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── components/    # Componentes reutilizables
│   │   ├── auth/          # Contexto de autenticación
│   │   ├── lib/           # Utilidades y configuración
│   │   └── routes/        # Configuración de rutas
│   └── public/
└── package.json           # Configuración del monorepo
```

## ⚡ Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### Instalación

1. **Clonar repositorio**:
```bash
git clone <repository-url>
cd gym-control-360
```

2. **Instalar dependencias**:
```bash
npm install
cd web && npm install && cd ..
```

3. **Configurar base de datos**:
```bash
# Crear base de datos PostgreSQL
createdb gymcontrol360

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de BD
```

4. **Ejecutar migraciones**:
```bash
npm run typeorm:migration:run
npm run seed:run
```

5. **Iniciar desarrollo** (Backend + Frontend simultáneamente):
```bash
npm run dev
```

Esto iniciará:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

### Credenciales de Prueba
- **Usuario**: `admin`
- **Contraseña**: `admin`

## 🔧 Desarrollo

### Scripts Principales

```bash
# Ejecutar ambos proyectos simultáneamente
npm run dev

# Solo backend
npm run backend:dev

# Solo frontend  
npm run frontend:dev

# Builds de producción
npm run build

# Tests
npm run test
```

### Estructura de Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia backend + frontend en modo desarrollo |
| `npm run backend:dev` | Solo backend con hot reload |
| `npm run frontend:dev` | Solo frontend con hot reload |
| `npm run build` | Build de producción (ambos proyectos) |
| `npm run backend:build` | Build solo del backend |
| `npm run frontend:build` | Build solo del frontend |
- [📚 Documentación](#-documentación)
- [🚀 Deployment](#-deployment)

## 🚀 Tecnologías

### Backend (NestJS)
- **Framework:** NestJS + TypeScript
- **Base de Datos:** MySQL + TypeORM
- **Autenticación:** JWT + Refresh Tokens
- **Validación:** Class Validator + Zod
- **Documentación:** Swagger/OpenAPI
- **Testing:** Jest

### Frontend (React)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS
- **Routing:** React Router v6+
- **Formularios:** React Hook Form + Zod
- **HTTP Client:** Axios

## 🏗️ Arquitectura

```
gymcontrol360/
├── 📁 src/                    # Backend NestJS
│   ├── 📁 modules/           # Módulos de negocio
│   ├── 📁 database/          # Entidades y migraciones
│   ├── 📁 common/            # Enums y utilidades
│   └── 📁 config/            # Configuración
├── 📁 web/                   # Frontend React
│   ├── 📁 src/
│   │   ├── 📁 auth/         # Autenticación
│   │   ├── 📁 components/   # Componentes reutilizables
│   │   ├── 📁 pages/        # Páginas
│   │   ├── 📁 routes/       # Configuración de rutas
│   │   └── 📁 lib/          # Utilidades
│   └── 📁 public/           # Archivos estáticos
└── 📄 package.json          # Scripts monorepo
```

## ⚡ Inicio Rápido

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- npm o yarn

### 1. Clonar e instalar dependencias

```bash
# Clonar repositorio
git clone <repo-url>
cd gymcontrol360

# Instalar dependencias del backend
npm install

# Instalar dependencias del frontend
cd web && npm install && cd ..
```

### 2. Configurar base de datos

```bash
# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de MySQL
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=tu_usuario
# DB_PASSWORD=tu_password
# DB_DATABASE=gymcontrol360
```

### 3. Ejecutar migraciones y seeds

```bash
# Ejecutar migraciones
npm run migration:run

# Poblar datos iniciales
npm run seed:run
```

### 4. Iniciar en modo desarrollo

```bash
# Ejecutar backend + frontend simultáneamente
npm run dev
```

**URLs disponibles:**
- 🖥️ **Frontend:** http://localhost:5173
- 🔙 **Backend API:** http://localhost:3000
- 📖 **Swagger Docs:** http://localhost:3000/api/docs

### Credenciales de prueba:
- **Usuario:** `admin`
- **Contraseña:** `admin`

## 🔧 Desarrollo

### Scripts disponibles

```bash
# Desarrollo
npm run dev                    # Ejecutar backend + frontend
npm run backend:dev           # Solo backend
npm run frontend:dev          # Solo frontend

# Build
npm run build                 # Build completo
npm run backend:build         # Build backend
npm run frontend:build        # Build frontend

# Base de datos
npm run migration:create      # Crear migración
npm run migration:run         # Ejecutar migraciones
npm run seed:run             # Ejecutar seeds

# Testing
npm run test                 # Tests backend
npm run test:e2e            # Tests E2E
```

### Estructura de desarrollo

#### Backend (Puerto 3000)
- **API REST:** `/api/*`
- **Swagger:** `/api/docs`
- **Health Check:** `/health`

#### Frontend (Puerto 5173)
- **Login:** `/login`
- **Dashboard:** `/`
- **Reportes:** `/reports`
- **Configuración:** `/settings`

## 📚 Documentación

### Módulos Backend
- **👥 Empresas:** Gestión de empresas/gimnasios
- **🏢 Sedes:** Múltiples ubicaciones
- **👤 Usuarios:** Autenticación y perfiles
- **🎫 Membresías:** Planes y suscripciones
- **👥 Socios:** Gestión de miembros
- **💰 Pagos:** Procesamiento de pagos
- **📊 Reportes:** Analytics y métricas

### Frontend Features
- ✅ **Autenticación JWT** con persistencia
- ✅ **Dashboard responsivo** con métricas
- ✅ **Gestión de miembros** y pagos
- ✅ **Reportes** con filtros y exportación
- ✅ **Configuración** del sistema
- ✅ **UI/UX moderna** estilo SaaS

## 🚀 Deployment

### Backend (Producción)

```bash
# Build
npm run backend:build

# Ejecutar migraciones
npm run migration:run

# Iniciar
npm run start:prod
```

### Frontend (Producción)

```bash
# Build para producción
npm run frontend:build

# Los archivos estáticos están en web/dist/
```

### Docker (Opcional)

```bash
# Construir imagen
docker build -t gymcontrol360 .

# Ejecutar
docker run -p 3000:3000 -p 5173:5173 gymcontrol360
```

### Variables de entorno importantes

```env
# Backend
NODE_ENV=production
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=gymcontrol360
JWT_SECRET=your-jwt-secret

# Frontend
VITE_API_URL=https://your-api-domain.com/api
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

---

**¡Desarrollado con ❤️ para la gestión moderna de gimnasios!**
- **Base de datos:** MySQL 8.0
- **Contenedores:** Docker + Docker Compose

## 📋 Prerrequisitos

- Node.js 18+
- Docker y Docker Compose
- Git

## 🛠️ Instalación

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd gymcontrol360/backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Levantar base de datos con Docker**
```bash
docker-compose up mysql -d
```

5. **Ejecutar migraciones (si las hay)**
```bash
npm run migration:run
```

6. **Iniciar en modo desarrollo**
```bash
npm run start:dev
```

### Docker Compose (Recomendado)

1. **Levantar todo el stack**
```bash
cd gymcontrol360
docker-compose up -d
```

Esto levantará:
- Backend API en http://localhost:3000
- MySQL en puerto 3306
- phpMyAdmin en http://localhost:8080

## 📚 Documentación API

Una vez iniciado el servidor, la documentación Swagger estará disponible en:
http://localhost:3000/api/docs

## 🗄️ Base de datos

La estructura inicial de la base de datos se carga automáticamente desde `gymcontrol360.sql`.

### Acceso a phpMyAdmin
- URL: http://localhost:8080
- Usuario: root
- Contraseña: gymcontrol123

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📁 Estructura del proyecto

```
src/
├── common/          # Utilidades y decoradores compartidos
│   └── enums/       # Enumeraciones
├── config/          # Configuraciones (DB, etc.)
├── database/        # Entidades y configuración DB
│   └── entities/    # Entidades TypeORM
└── modules/         # Módulos funcionales
    ├── auth/        # Autenticación y autorización
    ├── empresas/    # Gestión de empresas (tenants)
    ├── sedes/       # Gestión de sedes/sucursales
    ├── usuarios/    # Gestión de usuarios
    ├── socios/      # Gestión de socios
    └── membresias/  # Gestión de membresías
```

## 🔧 Scripts disponibles

- `npm run start` - Iniciar en producción
- `npm run start:dev` - Iniciar en desarrollo (watch mode)
- `npm run start:debug` - Iniciar en modo debug
- `npm run build` - Compilar para producción
- `npm run migration:generate` - Generar nueva migración
- `npm run migration:run` - Ejecutar migraciones pendientes

## 🌟 Características principales

### Sprint 1 - Core base
- ✅ Setup NestJS con TypeORM y MySQL
- ✅ Autenticación JWT con refresh tokens
- ✅ Módulo de usuarios y roles
- ✅ CRUD de empresas (tenants)
- ✅ Estructura base de socios
- ✅ Documentación Swagger

### Próximos Sprints
- Membresías y sistema de pagos
- Control de acceso y visitas
- Reportes y backups
- Rutinas y entrenadores
- Integraciones hardware
- Portal de socios

## 🚀 Deploy

Para producción, asegúrate de:

1. Cambiar las contraseñas por defecto
2. Configurar variables de entorno seguras
3. Usar HTTPS
4. Configurar backups automáticos
5. Monitoreo y logs

## 📝 Licencia

Propietario - GymControl 360

---

Para más información, consulta la documentación completa en el archivo `gym-control.md` del proyecto.