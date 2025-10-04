# 🎵 Music Taste - Red Social Musical

Una plataforma social para compartir tu pasión por la música. Los usuarios pueden crear posts, interactuar con otros usuarios y descubrir nuevas canciones y artistas.

## 🚀 Tecnologías Utilizadas

- **Vue 3** - Framework frontend con Composition API
- **Vite** - Build tool
- **Supabase** - Backend (Postgres + Auth + Realtime)
- **Tailwind CSS** - Estilos
- **Vue Router** - Navegación SPA
- **TypeScript** - Tipado estático

## 📋 Funcionalidades

- ✅ **Autenticación:** Registro e inicio de sesión
- ✅ **Posts:** Crear, ver y gestionar publicaciones
- ✅ **Perfiles:** Ver y editar perfil de usuario
- ✅ **Interacciones:** Sistema de likes y comentarios
- ✅ **Responsive:** Diseño adaptable a móviles

## 🛠️ Configuración del Proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://rjzxerblvkelvjpvtfmn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica_aqui
```

**⚠️ IMPORTANTE:** Reemplazar `tu_clave_publica_aqui` con la clave pública de tu proyecto Supabase.

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

### 4. Build para producción
```bash
npm run build
```

## 🗄️ Estructura de Base de Datos

El proyecto utiliza las siguientes tablas en Supabase:

- **users** - Información de usuarios
- **posts** - Publicaciones de usuarios
- **comments** - Comentarios en posts
- **likes_posts** - Likes en posts

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables (Composition API)
├── views/         # Páginas principales (Composition API)
├── services/      # Servicios de API
├── models/        # Tipos TypeScript
├── lib/          # Utilidades (store, supabase)
├── composables/  # Composables reutilizables
└── router/       # Configuración de rutas
```

## 🔑 Credenciales de Prueba

Para probar la aplicación, puedes crear una cuenta nueva o usar estas credenciales de prueba (si existen):

- **Email:** test@example.com
- **Password:** test123

### 👑 Usuario Administrador

Para acceder al panel de administración, crea un usuario con el nickname `admin`:

1. Registrarse con nickname: `admin`
2. Iniciar sesión con ese usuario
3. Aparecerá la opción "⚙️ Administración" en el menú de usuario
4. Acceder a `/admin` para gestionar usuarios

## 📱 Rutas Disponibles

- `/` - Lista de posts de todos los usuarios
- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/user/:nick_name` - Perfil público de usuario
- `/user/detail/:nick_name` - Editar perfil (requiere autenticación)

## 🎯 Características Técnicas

- **SPA:** Navegación sin recarga de página
- **Composition API:** Vue 3 con `<script setup>` para mejor rendimiento
- **TypeScript:** Tipado estático completo
- **Responsive:** Diseño mobile-first
- **Accesible:** Etiquetas semánticas y ARIA
- **Optimizado:** Queries eficientes y manejo de errores
- **Componentes:** Arquitectura modular y reutilizable
- **Tree-shaking:** Mejor optimización del bundle

---

## 🔧 Configuración Rápida

### 1. Variables de Entorno Requeridas
Crear archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://rjzxerblvkelvjpvtfmn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqenhlcmJsdmtlbHZqcHZ0Zm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTg4MDAsImV4cCI6MjA3NDkzNDgwMH0.O44KOCc_etDGMNHNBEN-Zu7HUO9SH7Rc1tuOpkQMvC0
```

### 2. Ejecutar el Proyecto
```bash
npm install
npm run dev
```

## 🗄️ Base de Datos
El proyecto usa estas tablas en Supabase:
- `users` - Usuarios
- `posts` - Publicaciones  
- `comments` - Comentarios
- `likes_posts` - Likes

## 🎯 Funcionalidades a Probar
- ✅ Registro/Login de usuarios
- ✅ Crear posts con imágenes
- ✅ Ver posts de todos los usuarios
- ✅ Dar likes y comentar
- ✅ Editar perfil de usuario
- ✅ Panel de administración (gestionar usuarios)
- ✅ Navegación responsive
- ✅ Actualización en tiempo real de comentarios
- ✅ Sistema de likes interactivo

## 📱 Rutas Principales
- `/` - Lista de posts
- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/user/:nick_name` - Perfil de usuario
- `/admin` - Panel de administración (solo para usuario 'admin')

## 🏗️ Arquitectura Composition API

El proyecto utiliza **Vue 3 Composition API** con `<script setup>` para:

- **Mejor rendimiento:** Tree-shaking optimizado
- **TypeScript mejorado:** Inferencia de tipos superior
- **Código más limpio:** Lógica reutilizable y organizada
- **Mantenibilidad:** Componentes más fáciles de mantener

### Ejemplo de Componente:
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

const increment = () => {
  count.value++
}

onMounted(() => {
  console.log('Component mounted')
})
</script>
```

---
## 📱 Rutas Principales Resta verificar como utilizar y craear el admin en la tabla de auth

user_admin ->  tabla de user (no implementado el admin desde la tabla de auth)
email: leitoorellana58@gmail.com
password: leonardoorellana2


random user-> 
email: dualipa@gmail.com
password: dualipa