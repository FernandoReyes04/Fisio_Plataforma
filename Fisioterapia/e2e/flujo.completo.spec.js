import { test, expect } from './fixtures'

// Datos de prueba: 2 mujeres, 2 hombres
const testPatients = [
  {
    name: 'María García López',
    cedula: '1234567801',
    edad: 28,
    sexo: 'Mujer',
    telefono: '89123456',
    correo: 'maria@test.com'
  },
  {
    name: 'Ana Rodríguez Pérez',
    cedula: '1234567802',
    edad: 35,
    sexo: 'Mujer',
    telefono: '89234567',
    correo: 'ana@test.com'
  },
  {
    name: 'Juan Martínez Hernández',
    cedula: '1234567803',
    edad: 42,
    sexo: 'Hombre',
    telefono: '89345678',
    correo: 'juan@test.com'
  },
  {
    name: 'Carlos López Sánchez',
    cedula: '1234567804',
    edad: 31,
    sexo: 'Hombre',
    telefono: '89456789',
    correo: 'carlos@test.com'
  }
]

test.describe('Flujo Completo: Cita, Diagnóstico y PDF', () => {
  test('01 - Login exitoso', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Verificar que estamos en Dashboard
    await expect(page).toHaveURL(/\/Inicio/)
    
    // Verificar que se muestra el contenido del dashboard
    await expect(page.locator('text=FisioLabs')).toBeVisible()
  })

  test('02 - Crear 4 pacientes (2 mujeres, 2 hombres)', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    for (const patient of testPatients) {
      // Navegar a agregar paciente
      await page.goto('/Pacientes/AgregarPaciente')
      await page.waitForLoadState('networkidle')
      
      // Rellenar formulario
      await page.fill('input[name="nombre"]', patient.name)
      await page.fill('input[name="cedula"]', patient.cedula)
      await page.fill('input[name="edad"]', patient.edad.toString())
      await page.fill('input[name="telefono"]', patient.telefono)
      await page.fill('input[name="correo"]', patient.correo)
      
      // Seleccionar sexo
      await page.select('select[name="sexo"]', patient.sexo)
      
      // Enviar formulario
      await page.click('button:has-text("Guardar")')
      
      // Esperar confirmación
      await page.waitForTimeout(1000)
      
      // Verificar que se redirige a lista de pacientes o muestra éxito
      const urlRegex = /\/Pacientes|\/Expediente/
      await page.waitForURL(urlRegex, { timeout: 5000 })
      
      console.log(`✅ Paciente creado: ${patient.name}`)
    }
  })

  test('03 - Crear cita para cada paciente', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Navegar a calendario
    await page.goto('/Inicio/Calendario')
    await page.waitForLoadState('networkidle')
    
    // Para cada paciente, crear una cita
    for (let i = 0; i < testPatients.length; i++) {
      // Click en botón para crear cita
      const createButtons = await page.locator('button:has-text("Nueva Cita")').all()
      if (createButtons.length > 0) {
        await createButtons[0].click()
      }
      
      await page.waitForTimeout(500)
      
      // Rellenar datos de cita
      const pacienteName = testPatients[i].name
      await page.fill('input[name="paciente"]', pacienteName)
      
      // Seleccionar paciente de dropdown
      await page.click(`text=${pacienteName}`)
      
      // Seleccionar hora y fecha
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const date = tomorrow.toISOString().split('T')[0]
      
      await page.fill('input[type="date"]', date)
      await page.fill('input[type="time"]', '10:00')
      
      // Guardar cita
      await page.click('button:has-text("Guardar Cita")')
      
      await page.waitForTimeout(1000)
      
      console.log(`✅ Cita creada para: ${pacienteName}`)
    }
  })

  test('04 - Crear diagnóstico para cada paciente', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Navegar a lista de pacientes
    await page.goto('/Pacientes')
    await page.waitForLoadState('networkidle')
    
    for (const patient of testPatients) {
      // Buscar paciente en la lista
      await page.fill('input[placeholder="Buscar paciente"]', patient.name)
      await page.waitForTimeout(500)
      
      // Click en paciente
      const patientRow = page.locator(`text=${patient.name}`)
      await patientRow.first().click()
      
      await page.waitForURL(/\/Expediente/, { timeout: 5000 })
      
      // Click en Diagnóstico
      await page.click('text=Diagnóstico')
      
      await page.waitForLoadState('networkidle')
      
      // Rellenar diagnóstico
      // Completar interrogatorio
      if (await page.locator('text=Interrogatorio').isVisible()) {
        await page.click('text=Completar Interrogatorio')
        
        await page.waitForLoadState('networkidle')
        
        // Rellenar algunos campos del interrogatorio
        const inputs = await page.locator('input[type="radio"]').all()
        for (let i = 0; i < Math.min(5, inputs.length); i++) {
          await inputs[i].click()
        }
        
        // Guardar interrogatorio
        const saveButtons = await page.locator('button:has-text("Guardar")').all()
        if (saveButtons.length > 0) {
          await saveButtons[0].click()
        }
      }
      
      await page.waitForTimeout(1000)
      
      // Rellenar mapa corporal si está disponible
      if (await page.locator('text=Mapa Corporal').isVisible()) {
        // Click en áreas del cuerpo para seleccionar
        const svg = page.locator('svg').first()
        const box = await svg.boundingBox()
        if (box) {
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
        }
      }
      
      // Guardar diagnóstico
      const saveDiagButtons = await page.locator('button:has-text("Guardar Diagnóstico")').all()
      if (saveDiagButtons.length > 0) {
        await saveDiagButtons[0].click()
      }
      
      await page.waitForTimeout(1000)
      
      console.log(`✅ Diagnóstico creado para: ${patient.name}`)
      
      // Volver a lista de pacientes
      await page.goto('/Pacientes')
      await page.waitForLoadState('networkidle')
    }
  })

  test('05 - Generar PDF de diagnóstico', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Navegar a lista de pacientes
    await page.goto('/Pacientes')
    await page.waitForLoadState('networkidle')
    
    // Para el primer paciente, generar PDF
    const patient = testPatients[0]
    
    await page.fill('input[placeholder="Buscar paciente"]', patient.name)
    await page.waitForTimeout(500)
    
    const patientRow = page.locator(`text=${patient.name}`)
    await patientRow.first().click()
    
    await page.waitForURL(/\/Expediente/, { timeout: 5000 })
    
    // Click en Diagnóstico
    await page.click('text=Diagnóstico')
    
    await page.waitForLoadState('networkidle')
    
    // Buscar botón para generar PDF
    const pdfButtons = await page.locator('button:has-text("PDF"), button:has-text("Descargar"), button:has-text("Exportar")').all()
    
    if (pdfButtons.length > 0) {
      // Esperar a que se descargue el PDF
      const downloadPromise = page.waitForEvent('download')
      await pdfButtons[0].click()
      const download = await downloadPromise
      
      console.log(`✅ PDF descargado: ${download.suggestedFilename()}`)
      
      // Verificar que el archivo se descargó
      expect(download.suggestedFilename()).toMatch(/\.pdf$/)
    }
  })

  test('06 - Cambiar fisioterapeuta asignado', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Navegar a lista de pacientes
    await page.goto('/Pacientes')
    await page.waitForLoadState('networkidle')
    
    const patient = testPatients[0]
    
    // Buscar paciente
    await page.fill('input[placeholder="Buscar paciente"]', patient.name)
    await page.waitForTimeout(500)
    
    const patientRow = page.locator(`text=${patient.name}`)
    await patientRow.first().click()
    
    await page.waitForURL(/\/Expediente/, { timeout: 5000 })
    
    // Click en Diagnóstico
    await page.click('text=Diagnóstico')
    
    await page.waitForLoadState('networkidle')
    
    // Buscar selector de fisioterapeuta
    const fisioBefore = await page.locator('select[name="fisioterapeuta"], input[name="fisio"]').first().inputValue()
    
    // Cambiar fisioterapeuta
    const fisioSelect = page.locator('select[name="fisioterapeuta"]').first()
    if (await fisioSelect.isVisible()) {
      const options = await fisioSelect.locator('option').all()
      if (options.length > 1) {
        // Elegir una opción diferente
        await fisioSelect.selectOption({ index: (options.length > 1 ? 1 : 0) })
        
        const fisioAfter = await fisioSelect.inputValue()
        
        console.log(`✅ Fisio cambiado de: ${fisioBefore} a: ${fisioAfter}`)
        
        expect(fisioAfter).not.toBe(fisioBefore)
        
        // Guardar cambios
        const saveButtons = await page.locator('button:has-text("Guardar")').all()
        if (saveButtons.length > 0) {
          await saveButtons[0].click()
        }
        
        await page.waitForTimeout(1000)
      }
    }
  })
})
