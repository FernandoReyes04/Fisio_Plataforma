# 📊 ESTADO DE EJECUCIÓN DE TESTS E2E

**Fecha**: 20 de marzo de 2026
**Estado**: ✅ Tests creados y ejecutables | ❌ Falla en autenticación

## 🎯 Resumen

Se han creado **6 tests E2E completos** que validan todo el flujo de trabajo de la aplicación Fisioterapia:

| Test | Descripción | Estado |
|------|-----------|--------|
| 01 - Login | Validar autenticación | ❌ FALLA (credenciales) |
| 02 - Crear 4 pacientes | 2 mujeres, 2 hombres | 🟡 BLOQUEADO (por login) |
| 03 - Crear citas | Agendar cita para cada paciente | 🟡 BLOQUEADO (por login) |
| 04 - Diagnósticos | Completar interrogatorio + mapa corporal | 🟡 BLOQUEADO (por login) |
| 05 - Generar PDF | Exportar diagnóstico en PDF | 🟡 BLOQUEADO (por login) |
| 06 - Cambiar Fisio | Modificar fisioterapeuta asignado | 🟡 BLOQUEADO (por login) |

## ⚙️ Qué Falta

**ACCIÓN REQUERIDA**: Configurar credenciales correctas

1. **Abrir archivo**: `e2e/fixtures.js`
2. **Buscar líneas**:
```javascript
const USERNAME = 'admin'        // ← CAMBIAR AQUÍ
const PASSWORD = 'admin'        // ← CAMBIAR AQUÍ
```

3. **Verificar en BD** (ejecutar en MySQL):
```sql
mysql> SELECT usuario_nombre FROM usuario;
+---------------+
| usuario_nombre|
+---------------+
| admin         |
| Fernando      |
+---------------+
```

4. **Actualizar fixtures.js** con credenciales REALES:
```javascript
const USERNAME = 'admin'      // o 'Fernando'
const PASSWORD = 'TU_PASS'    // contraseña real
```

## 🚀 Ejecutar Tests (una vez configuradas credenciales)

```bash
cd /home/fernandoreyes/Documentos/FISIOLABS/Fisioterapia

# Ejecutar todos los tests
npm run test:e2e

# Ver interfaz visual interactiva
npm run test:e2e:ui

# Modo debug paso a paso
npm run test:e2e:debug
```

## 📋 Estructura de Tests

**Archivo**: `/e2e/flujo.completo.spec.js`
**Pacientes de Prueba** (hardcoded):
- María García López (Mujer, 28 años)
- Ana Rodríguez Pérez (Mujer, 35 años)
- Juan Martínez Hernández (Hombre, 42 años)
- Carlos López Sánchez (Hombre, 31 años)

**Flujo validado**:
```
Login → Crear Pacientes → Agendar Citas → Hacer Diagnósticos → Generar PDFs → Cambiar Fisioterapeuta
```

## 🐛 Issues Conocidos

### Login falla con TimeoutError
```
Error: page.waitForURL: Timeout 15000ms exceeded
```
**Causa**: Credenciales incorrectas o backend no responde a login
**Solución**: 
1. Verifica credenciales en `e2e/fixtures.js`
2. Verifica que backend está en puerto 5223: `curl http://localhost:5223/swagger`
3. Prueba login manual en navegador

### Selectores de elementos no encontrados
**Solución**: 
1. Ejecuta `npm run test:e2e:ui` para ver interfaz visual
2. Inspecciona los elementos en Dev Tools
3. Actualiza selectores en `e2e/flujo.completo.spec.js`

## 📸 Artefactos Generados

Después de ejecutar tests, se generan:

```
playwright-report/          → Reporte HTML interactivo
test-results/              → Screenshots y videos de fallos
login-error.png            → Screenshot cuando falla login
```

Ver reporte:
```bash
npx playwright show-report
```

## 📝 Próximos Pasos

1. ✅ **Configurar credenciales** en `e2e/fixtures.js`
2. ⏳ **Re-ejecutar tests** con credenciales correctas
3. ⏳ **Ajustar selectores** si la UI ha cambiado
4. ⏳ **Validar flujo completo** sin fallos
5. ⏳ **Integrar en CI/CD** (GitHub Actions/Azure DevOps)

## 🔍 Debugging

### Ver qué hace el test paso a paso
```bash
npm run test:e2e:ui
```
Luego en la interfaz, haz click en cada paso para ver el estado de la UI

### Grabar video de test
Ya está habilitado - se graba automáticamente en fallos

### Agregar más logs
Edita `e2e/flujo.completo.spec.js` y agrega:
```javascript
console.log(`Info: ${variable}`)
```

## 📞 Soporte

Si los tests aún fallan:
1. Verifica que el backend está corriendo y accesible
2. Asegúrate que la BD está actualizada
3. Prueba login manual en navegador
4. Revisa console.log en output de tests

---

**Última actualización**: 20 de marzo de 2026
**Framework**: Playwright
**Browser**: Chromium
**Reportes**: HTML interactivos con videos y screenshots
