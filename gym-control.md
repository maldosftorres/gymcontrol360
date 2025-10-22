# 🚀 ROADMAP TÉCNICO – GYMCONTROL 360 v1

**Stack final:**

- **Backend:** NestJS + TypeORM + MySQL
- **Frontend:** Vite + React + Tailwind CSS
- **Agente local:** Node
- **Infraestructura:** Docker Compose (LAN + Cloud-ready)
- **Windows:** Sistema solo para sistema operativo Windows
---

## 🧱 Sprint 1 — Infraestructura y Core Base ✅ **COMPLETADO**

**Objetivo:** levantar la arquitectura técnica y los módulos base.

### ✅ Entregables

- ✅ Setup **NestJS (API, DTOs, Auth JWT + Refresh Tokens)**.
- ✅ Setup **Vite + React + Tailwind + React Router**.
- ✅ Configuración de entorno **Docker Compose (API + DB + Web)**.
- ✅ Módulo **Usuarios y Roles** (Administrador, Entrenador, Socio).
- ✅ CRUD de **Socios** (con carga de foto local y mock S3).

📍 **Entrega:** Login JWT + panel React funcional + CRUD operativo. ✅ **CUMPLIDO**

---

## 💳 Sprint 2 — Membresías y Caja

**Objetivo:** cubrir el flujo financiero principal del gimnasio.

### ✅ Entregables

- CRUD de **Membresías** (tipo, duración, precio, estado).
- Asignación de membresías a socios.
- Registro de **Pagos totales o parciales**.
- Módulo de **Caja** (apertura, cierre, movimientos).
- Generación de **ticket PDF** (impresión básica).

📍 **Entrega:** flujo alta socio → membresía → pago → ticket.

---

## 🕒 Sprint 3 — Control de Acceso y Visitas

**Objetivo:** registrar ingresos, asistencias y manejar puerta/acceso.

### ✅ Entregables

- Registro de **visitas manuales**.
- API de **acceso (puerta, huella placeholder)**.
- Validación de membresía vigente en check-in.
- Historial de accesos por socio.

📍 **Entrega:** check-in funcional y validación activa de membresía.

---

## 🧾 Sprint 4 — Reportes y Backups

**Objetivo:** agregar visibilidad y seguridad de datos.

### ✅ Entregables

- **Reportes:** socios activos/inactivos, ingresos, pagos pendientes.
- **Respaldos manuales** (dump MySQL descargable).
- **Respaldos automáticos en nube (S3 / MinIO)**.
- **Envió de emails** automáticos (SMTP + plantillas Handlebars).

📍 **Entrega:** email por vencimiento y backup funcional.

---

## 💪 Sprint 5 — Rutinas y Entrenadores

**Objetivo:** habilitar el manejo de rutinas personalizadas.

### ✅ Entregables

- CRUD de **Rutinas** y **Ejercicios**.
- Asignación de rutinas a socios.
- Vista de rutina por entrenador y socio.
- Importación desde **Excel/CSV (csv-parser)**.

📍 **Entrega:** entrenador crea rutina → socio la visualiza.

---

## 🔌 Sprint 6 — Integraciones Hardware

**Objetivo:** conectar dispositivos locales al sistema.

### ✅ Entregables

- **Agente Local (Node/.NET)** con endpoints:

  - `/finger/enroll` y `/finger/verify` (DigitalPersona 4500).
  - `/relay/open` (pulso seco para puerta).
  - `/ticket/print` (ESC/POS).
  - `/rfid/read` (lector teclado/serial).

- Configuración de **dispositivos** desde backend.
- **Comunicación tokenizada segura.**

📍 **Entrega:** huella, ticket y puerta operativos desde interfaz.

---

## 🧍‍♂️ Sprint 7 — Portal de Socios (Vite React)

**Objetivo:** ofrecer autogestión a los socios.

### ✅ Entregables

- Login del socio.
- Vistas: perfil, membresía, pagos, rutinas, asistencias.
- Envio de recordatorios y notificaciones web.
- Diseño responsive **mobile-first**.

📍 **Entrega:** socio accede a su cuenta y ve información actualizada.

---

## 📊 Sprint 8 — Dashboard y Deploy

**Objetivo:** cerrar la versión estable para producción.

### ✅ Entregables

- Dashboard Admin (Recharts): socios activos, ingresos, vencimientos, asistencias.
- Modo oscuro + refinamiento UI.
- **Testing E2E:** Jest + Cypress.
- **Deploy Docker Compose** + manual de instalación LAN.

📍 **Entrega:** versión 1.0 completa, probada y lista para operar.

---

## 🔒 Extras paralelos

- Validaciones **Zod (frontend)** y **class-validator (backend)**.
- Manejo global de errores (Nest Exception Filters).
- Fetching con **React Query / TanStack**.
- ESLint deshabilitado según definición inicial.

---

## 📋 Resumen general

| Semana | Módulo                                  | Objetivo             | Estado |
| :----- | :-------------------------------------- | :------------------- | :----- |
| 1      | Core base + Auth + Socios               | Fundaciones técnicas | ✅     |
| 2      | Membresías + Caja                       | Flujo financiero     | ⏳     |
| 3      | Accesos + Visitas                       | Control físico       | ⏳     |
| 4      | Reportes + Backups + Emails             | Seguridad            | ⏳     |
| 5      | Rutinas + Entrenadores                  | Componente deportivo | ⏳     |
| 6      | Hardware (huella, ticket, puerta, RFID) | Integraciones        | ⏳     |
| 7      | Portal de Socios                        | Autogestión          | ⏳     |
| 8      | Dashboard + QA + Deploy                 | Cierre y entrega     | ⏳     |

---

## 📦 Checklist de cierre v1.0

✅ CRUDs completos.
✅ Pagos parciales y tickets.
✅ Control de acceso funcional.
✅ Rutinas y entrenadores.
✅ Backups y notificaciones.
✅ Portal socio operativo.
✅ Hardware conectado.
✅ Dashboard y KPIs.
✅ Manual Docker + Deploy.

---

**Versión final esperada:** sistema de gimnasio completamente operativo, con control financiero, registro de accesos, rutinas, autogestión de socios y soporte físico LAN.
