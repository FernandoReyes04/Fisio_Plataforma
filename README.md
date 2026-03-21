# FisioLabs Plataforma

Guía completa para instalar y ejecutar **Frontend + Backend** en entorno local, de forma secuencial y sencilla.

---

## 1) ¿Qué necesitas tener instalado antes?

### Requisitos obligatorios

- **Git** (para clonar el repositorio)
- **Node.js 20+** y **npm**
- **.NET SDK 8.0**
- **MySQL 8.x**

### Recomendado

- **VS Code**
- Extensiones: C#, Vue/JavaScript, ESLint

---

## 2) Clonar el repositorio

```bash
git clone https://github.com/FernandoReyes04/Fisio_Plataforma.git
cd Fisio_Plataforma
```

La estructura principal del repo es:

- `Fisioterapia/` → Frontend (Vue + Vite)
- `FisioterapiaBack/` → Backend (.NET 8)
- `db_backups/` → Scripts SQL de respaldo/seed

---

## 3) Configurar base de datos (MySQL)

El backend está configurado por defecto para conectarse a:

- Host: `127.0.0.1`
- Puerto: `3306`
- Base de datos: `fisio`
- Usuario: `root`
- Password: `admin`

(Ver `FisioterapiaBack/Presentation/appsettings.json` en `ConnectionStrings:ConexionMaestra`)

### Paso 3.1 Crear la BD

```sql
CREATE DATABASE fisio;
```

### Paso 3.2 Importar datos iniciales (opcional pero recomendado)

Desde terminal (ajusta password/archivo si lo necesitas):

```bash
mysql -u root -p fisio < db_backups/seed_10_pacientes_20260304.sql
```

Si quieres restaurar otro respaldo completo:

```bash
mysql -u root -p fisio < db_backups/fisio_3306_merged_20260302_202904.sql
```

---

## 4) Levantar Backend (.NET)

### Paso 4.1 Ir al backend

```bash
cd FisioterapiaBack
```

### Paso 4.2 Restaurar paquetes

```bash
dotnet restore
```

### Paso 4.3 Ejecutar API

```bash
dotnet run --project Presentation --launch-profile http
```

Backend por defecto en:

- `http://localhost:5223`
- Swagger: `http://localhost:5223/swagger`

> Nota: el backend permite CORS para `http://localhost:5173` y `http://localhost:5174`.

---

## 5) Levantar Frontend (Vue + Vite)

En **otra terminal**:

### Paso 5.1 Ir al frontend

```bash
cd Fisioterapia
```

### Paso 5.2 Instalar dependencias

```bash
npm install
```

### Paso 5.3 Verificar `.env`

Archivo: `Fisioterapia/.env`

Valores esperados por defecto:

```env
VITE_API_URL=http://localhost:5223
VITE_API_LOCAL=http://localhost:5223
VITE_CREDENCIALES=Credenciales
VITE_USUARIO=Usuario
```

### Paso 5.4 Ejecutar frontend

```bash
npm run fisio
```

Frontend por defecto en:

- `http://localhost:5173`

---

## 6) Orden recomendado de arranque (secuencial)

1. Iniciar MySQL
2. Verificar/importar base `fisio`
3. Levantar backend (`FisioterapiaBack`)
4. Levantar frontend (`Fisioterapia`)
5. Abrir `http://localhost:5173`

---

## 7) Validaciones rápidas

- Backend vivo:
  - `http://localhost:5223/swagger`
- Frontend vivo:
  - `http://localhost:5173`
- Si el login carga pero no consulta datos, revisar:
  - URL del API en `.env`
  - conexión MySQL en `appsettings.json`
  - que backend esté ejecutándose

---

## 8) Problemas comunes y solución

### Error: `dotnet: command not found`
Instala .NET 8 SDK y verifica:

```bash
dotnet --version
```

Debe mostrar versión `8.x`.

### Error de conexión MySQL
- Revisa que MySQL esté iniciado.
- Verifica usuario/password/puerto en `FisioterapiaBack/Presentation/appsettings.json`.
- Confirma que exista la base `fisio`.

### Error CORS en navegador
- Asegúrate de entrar por `http://localhost:5173` (o `5174`).
- Backend debe estar ejecutándose con la configuración actual de `Program.cs`.

### Error de puertos ocupados
- Cambia puerto de Vite o libera el puerto.
- Mantén `VITE_API_URL` apuntando al puerto real del backend.

---

## 9) Scripts útiles

### Frontend (`Fisioterapia/package.json`)

- Desarrollo: `npm run fisio`
- Build producción: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`

### Backend

- Restore: `dotnet restore`
- Run API: `dotnet run --project Presentation --launch-profile http`

---

## 10) Flujo rápido (copy/paste)

### Terminal 1 (Backend)

```bash
cd Fisio_Plataforma/FisioterapiaBack
dotnet restore
dotnet run --project Presentation --launch-profile http
```

### Terminal 2 (Frontend)

```bash
cd Fisio_Plataforma/Fisioterapia
npm install
npm run fisio
```

Abre: `http://localhost:5173`

---

Si quieres, en un siguiente paso se puede agregar Docker Compose para levantar MySQL + Backend + Frontend con un solo comando.