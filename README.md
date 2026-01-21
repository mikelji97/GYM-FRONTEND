# 🏋️ GYM MIKE - Frontend

> **Descripción:** Aplicación frontend moderna para la gestión integral de un gimnasio. Permite a los usuarios reservar clases y consultar sesiones, mientras que los administradores gestionan recursos y visualizan estadísticas globales.

---

## 📋 Funcionalidades

### 👤 Usuarios
* **Autenticación:** Registro y gestión de inicio de sesión seguro.
* **Clases:** Visualización de oferta de clases y sesiones disponibles.
* **Reservas:** Capacidad de reservar sesiones y cancelar reservas existentes.
* **Dashboard Personal:** Estadísticas de rendimiento (reservas confirmadas, canceladas y asistencia).

### 🛡️ Administradores
* **Gestión Total:** Todas las funcionalidades de usuario incluidas.
* **Gestión de Recursos:** Crear, editar y eliminar Clases y Sesiones.
* **Gestión de Usuarios:** Administración de perfiles y roles.
* **Analítica:**
    * Visualización de estadísticas específicas por usuario.
    * **Dashboard Global:** Métricas generales del gimnasio.
    * Vista completa de todas las reservas del sistema.

---

## 🛠️ Tecnologías Utilizadas

El proyecto ha sido construido utilizando la última tecnología del ecosistema React:

* **Core:** React 19
* **Build Tool:** Vite
* **Estilos:** Tailwind CSS 4
* **Routing:** React Router DOM
* **Http Client:** Axios

---

## 🚀 Instalación y Despliegue

⚠️ **Requisito Previo:** Este proyecto requiere que el backend (API) esté funcionando.
[Consulta el repositorio del Backend aquí](https://github.com/mikelji97/GYM-API).

### 1. Clonar el repositorio
```bash
git clone [https://github.com/mikelji97/GYM-FRONTEND.git](https://github.com/mikelji97/GYM-FRONTEND.git)
cd GYM-FRONTEND
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la URL del backend
Por defecto, la API apunta a local. Si tu backend está en otra dirección, modifica el archivo de configuración:

* **Archivo:** `src/services/api.js`
* **Línea 3:**

```javascript
// Cambiar esta línea si tu API está en otro host/puerto
const API_URL = '[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)';
```

### 4. Ejecutar servidor de desarrollo
```bash
npm run dev
```
📍 La aplicación estará disponible en: `http://localhost:5173`

---

## 📂 Estructura del Proyecto

```text
src/
├── 🧩 components/      # Componentes reutilizables (Navbar, Layout, ProtectedRoute)
├── 🔐 context/         # Contexto de autenticación y estado global
├── 📄 pages/           # Vistas principales
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Classes.jsx
│   ├── Sessions.jsx
│   ├── Bookings.jsx
│   └── Users.jsx
└── 📡 services/        # Configuración de Axios para llamadas a la API
```

---

## 🧪 Usuarios de Prueba (Seeders)

Una vez ejecutados los *seeders* en el backend (Laravel), puedes utilizar las siguientes credenciales para probar los diferentes roles:

| Email | Password | Rol |
| :--- | :--- | :--- |
| `admin@gym.com` | `password` | **Administrador** |
| `juan@gmail.com` | `password` | Usuario |
| `maria@gmail.com` | `password` | Usuario |
| `carlos@gmail.com` | `password` | Usuario |
| `ana@gmail.com` | `password` | Usuario |
| `pedro@gmail.com` | `password` | Usuario |

---

## 📜 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local. |
| `npm run build` | Genera los archivos optimizados para producción. |
| `npm run preview` | Previsualiza localmente el build de producción. |
| `npm run lint` | Ejecuta ESLint para verificar la calidad del código. |

---

## ✒️ Autor

**Mikel** - *Proyecto desarrollado como parte de un sprint académico de desarrollo Fullstack.*
