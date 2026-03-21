# Tests E2E - Flujo Completo de Fisioterapia

Este directorio contiene tests end-to-end (E2E) que validan el flujo completo de la aplicación FisioLabs.

## 📋 Descripción de Tests

Los tests cubren el siguiente flujo de trabajo:

### Test 01: Login
- ✅ Verifica que el usuario puede autenticarse correctamente
- ✅ Valida que se redirige al Dashboard después del login

### Test 02: Crear 4 Pacientes
- ✅ Crea 2 pacientes mujeres (María y Ana)
- ✅ Crea 2 pacientes hombres (Juan y Carlos)
- ✅ Valida que los datos se guardan correctamente

### Test 03: Crear Citas
- ✅ Crea una cita para cada paciente
- ✅ Asigna fecha y hora a cada cita
- ✅ Valida que las citas aparecen en el calendario

### Test 04: Crear Diagnósticos
- ✅ Completa el interrogatorio para cada paciente
- ✅ Registra análisis de mapa corporal
- ✅ Guarda diagnósticos completamente

### Test 05: Generar PDF
- ✅ Descarga el PDF del diagnóstico
- ✅ Valida que el archivo se genera correctamente

### Test 06: Cambiar Fisioterapeuta
- ✅ Modifica el fisioterapeuta asignado a un paciente
- ✅ Valida que el cambio se persiste

## 🚀 Cómo Ejecutar

### Instalación Previa
```bash
cd Fisioterapia
npm install
```

### Ejecutar todos los tests
```bash
npm run test:e2e
```

### Ejecutar tests en modo UI (interactivo)
```bash
npm run test:e2e:ui
```
Esto abre una interfaz visual donde puedes ver y re-ejecutar cada test.

### Ejecutar tests en modo debug
```bash
npm run test:e2e:debug
```
Permite pausar y inspeccionar cada paso del test.

### Ejecutar un test específico
```bash
npx playwright test e2e/flujo.completo.spec.js -g "Login exitoso"
```

## 📋 Prerequisitos

1. **Backend corriendo**: Asegúrate que el backend (.NET) está ejecutándose en el puerto correspondiente
2. **Base de datos**: La BD debe estar disponible y actualizada
3. **Servidor dev activado**: Los tests inician `npm run dev` automáticamente

## ⚙️ Configuración

El archivo `playwright.config.js` configura:
- URL base: `http://localhost:5173`
- Servidor dev: Inicia automáticamente si no está activo
- Browser: Chromium
- Screenshots: Se capturan solo en fallos
- Videos: Se graban solo en fallos

## 📊 Resultados

Después de ejecutar, los resultados se guardan en:
- `playwright-report/index.html` - Reporte HTML interactivo

Abre el reporte con:
```bash
npx playwright show-report
```

## � Configurar Credenciales Correctas

**PASO CRÍTICO ANTES DE EJECUTAR TESTS:**

1. Abre `e2e/fixtures.js`
2. Busca estas líneas:
```javascript
const USERNAME = 'admin'        // ← Cambiar según usuario real
const PASSWORD = 'admin'        // ← Cambiar según contraseña  
```

3. Reemplaza con credenciales válidas de tu base de datos:
   - Usuarios disponibles de BD: `admin`, `Fernando`
   - Encuentra la contraseña correcta (solicita a admin)

**Alternativa: Crear usuario de prueba**
```sql
-- Conectarse a MySQL como usuario vacío
mysql -u root -p fisio

-- Insertar usuario test con contraseña conocida
INSERT INTO usuario (usuario_nombre, contrasena) 
VALUES ('test_user', SHA2('test123', 256));
```

## ⚠️ Errores Comunes

### "Login timeout - URL no cambia"
✅ **Solución**: Actualiza credenciales en `e2e/fixtures.js`

### "Element not found - input password"
✅ **Solución**: Los selectores pueden haber cambiado. Ejecuta:
```bash
npm run test:e2e:ui
```
Esto abre una interfaz visual donde puedes inspeccionar y grabar interacciones.


Los 4 pacientes están definidos en `e2e/flujo.completo.spec.js`:
```javascript
const testPatients = [
  { name: 'María García López', cedula: '1234567801', ... }, // Mujer
  { name: 'Ana Rodríguez Pérez', cedula: '1234567802', ... }, // Mujer
  { name: 'Juan Martínez Hernández', cedula: '1234567803', ... }, // Hombre
  { name: 'Carlos López Sánchez', cedula: '1234567804', ... } // Hombre
]
```

### Selectores Comunes
Si los tests fracasan por selectores antiguos, actualiza en `flujo.completo.spec.js`:
- Nombres de inputs
- IDs de botones
- Clases CSS

## 🐛 Troubleshooting

### "Timeout esperando navegación"
- Verifica que el backend está corriendo
- Comprueba la URL base en `playwright.config.js`

### "Elemento no encontrado"
- Los selectores pueden haber cambiado
- Ejecuta `npm run test:e2e:ui` para inspeccionar visualmente
- Usa Developer Tools del navegador para identificar nuevos selectores

### "Credenciales inválidas"
- Actualiza el email/password en `e2e/fixtures.js`
- Verifica que el usuario existe en la BD

## 📈 Mantenimiento

1. **Actualizar selectores**: Si la UI cambia, actualiza los locators en `flujo.completo.spec.js`
2. **Agregar más tests**: Duplica un bloque `test.describe()` y modifica según necesidad
3. **Cambiar datos**: Edita `testPatients` con nuevos datos según requerimientos

## 📝 Best Practices

✅ Ejecuta tests regularmente (CI/CD)
✅ Mantén selectores actualizados
✅ Documenta cambios en este README
✅ Usa `page.waitForLoadState('networkidle')` para esperas de red
✅ Captura pantallas para debugging: `await page.screenshot()`
