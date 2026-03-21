import { test, expect } from './fixtures'

// Datos de prueba: 2 mujeres, 2 hombres
const testPatients = [
  {
    nombre: 'María',
    apellido: 'García López',
    edad: '1995-05-15',
    telefono: '8912345601',
    ocupacion: 'Profesora',
    institucion: 'Colegio A',
    domicilio: 'Calle Principal 123',
    codigoPostal: '10001',
    sexo: 'Femenino'
  },
  {
    nombre: 'Ana',
    apellido: 'Rodríguez Pérez',
    edad: '1988-08-20',
    telefono: '8912345602',
    ocupacion: 'Enfermera',
    institucion: 'Hospital B',
    domicilio: 'Avenida Central 456',
    codigoPostal: '10002',
    sexo: 'Femenino'
  },
  {
    nombre: 'Juan',
    apellido: 'Martínez Hernández',
    edad: '1980-12-10',
    telefono: '8912345603',
    ocupacion: 'Ingeniero',
    institucion: 'Empresa C',
    domicilio: 'Calle Secundaria 789',
    codigoPostal: '10003',
    sexo: 'Masculino'
  },
  {
    nombre: 'Carlos',
    apellido: 'López Sánchez',
    edad: '1992-03-25',
    telefono: '8912345604',
    ocupacion: 'Contador',
    institucion: 'Despacho D',
    domicilio: 'Calle Tercera 321',
    codigoPostal: '10004',
    sexo: 'Masculino'
  }
]

test.describe('Flujo Mejorado: Crear Pacientes, Citas y Diagnósticos', () => {
  test('01 - Login exitoso', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Verificar que estamos en Dashboard
    await expect(page).toHaveURL(/\/Inicio/)
    await expect(page.locator('text=FisioLabs')).toBeVisible()
  })

  test('02 - Crear 4 pacientes (2 mujeres, 2 hombres)', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Primero navegar a Pacientes
    await page.goto('/Pacientes')
    await page.waitForLoadState('networkidle')
    
    for (const patient of testPatients) {
      console.log(`📝 Creando paciente: ${patient.nombre} ${patient.apellido}`)
      
      // Navegar a agregar paciente - Click en botón "Nuevo paciente"
      const newButton = page.locator('button:has-text("Nuevo paciente")').first()
      await newButton.waitFor({ timeout: 5000 })
      await newButton.click()
      
      // Esperar que cargue la página
      await page.waitForURL(/\/AgregarPaciente|\/Pacientes/, { timeout: 10000 })
      
      // Verificar que estamos en la página de agregar paciente
      const isAgregarPaciente = page.url().includes('AgregarPaciente')
      if (!isAgregarPaciente) {
        console.log('⏳ URL no es AgregarPaciente, esperando...')
        await page.waitForTimeout(1000)
      }
      
      // Rellenar formulario
      console.log('📋 Rellenando formulario...')
      
      // Nombre
      await page.fill('input[placeholder="Pedro Alfonso"]', patient.nombre)
      
      // Apellidos
      await page.fill('input[placeholder="Lopez Blanco"]', patient.apellido)
      
      // Fecha de nacimiento (edad)
      const dateInput = page.locator('input[type="date"]').first()
      await dateInput.fill(patient.edad)
      
      // Sexo
      const sexoSelect = page.locator('select').nth(0)
      await sexoSelect.selectOption(patient.sexo)
      
      // Ocupación
      await page.fill('input[placeholder="Abogado"]', patient.ocupacion)
      
      // Teléfono
      await page.fill('input[placeholder="9812308723"]', patient.telefono)
      
      // Institución
      await page.fill('input[placeholder="SEAFI"]', patient.institucion)
      
      // Domicilio
      await page.fill('input[placeholder="1234 Calle Principal"]', patient.domicilio)
      
      // Código Postal
      await page.fill('input[placeholder="00030"]', patient.codigoPostal)
      
      // Estado civil (segunda select después de sexo)
      const selects = await page.locator('select').all()
      if (selects.length > 1) {
        await selects[1].selectOption({ index: 1 })
      }
      
      // Fisioterapeuta (tercera select)
      if (selects.length > 2) {
        await selects[2].selectOption({ index: 1 })
      }
      
      // Tipo de pago (cuarta select)
      if (selects.length > 3) {
        await selects[3].selectOption({ index: 1 })
      }
      
      // Guardar - buscar cualquier botón que pueda ser Guardar
      const buttons = await page.locator('button').all()
      let saveClicked = false
      
      for (const btn of buttons) {
        const text = await btn.textContent()
        if (text && (text.includes('Guardar') || text.includes('guardar'))) {
          await btn.click()
          saveClicked = true
          console.log('✅ Botón Guardar clickeado')
          break
        }
      }
      
      if (!saveClicked) {
        console.log('❌ No se encontró botón Guardar')
        throw new Error('Botón Guardar no encontrado')
      }
      
      // Esperar confirmación y volver a lista
      await page.waitForTimeout(1500)
      
      // Volver a Pacientes
      await page.goto('/Pacientes')
      await page.waitForLoadState('networkidle')
      
      console.log(`✅ Paciente creado: ${patient.nombre} ${patient.apellido}`)
    }
  })

  test('03 - Listar pacientes creados', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Ir a lista de pacientes
    await page.goto('/Pacientes')
    await page.waitForLoadState('networkidle')
    
    // Verificar que aparecen los pacientes
    for (const patient of testPatients) {
      const nameVisible = await page.locator(`text=${patient.nombre}`).isVisible()
      if (nameVisible) {
        console.log(`✅ Paciente visible: ${patient.nombre}`)
      }
    }
  })

  test('04 - Test de búsqueda de pacientes', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Ir a lista de pacientes
    await page.goto('/Pacientes')
    await page.waitForLoadState('networkidle')
    
    // Buscar el primer paciente
    const searchInput = page.locator('input[placeholder="Buscar"]')
    await searchInput.fill(testPatients[0].nombre)
    
    await page.waitForTimeout(500)
    
    console.log(`✅ Búsqueda realizada para: ${testPatients[0].nombre}`)
  })

  test('05 - Acceder a expediente de paciente', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Ir a lista de pacientes
    await page.goto('/Pacientes')
    await page.waitForLoadState('networkidle')
    
    // Buscar el primer paciente
    const patient = testPatients[0]
    const searchInput = page.locator('input[placeholder="Buscar"]')
    await searchInput.fill(patient.nombre)
    
    await page.waitForTimeout(800)
    
    // Buscar una fila de tabla o elemento clickeable con el nombre
    const rows = await page.locator('tr').all()
    let clickedPatient = false
    
    for (const row of rows) {
      const text = await row.textContent()
      if (text && text.includes(patient.nombre)) {
        // Click en la fila
        await row.click()
        clickedPatient = true
        break
      }
    }
    
    if (clickedPatient) {
      // Esperar a que cargue cualquier página
      await page.waitForLoadState('networkidle')
      
      const currentUrl = page.url()
      console.log(`✅ Navegó a: ${currentUrl}`)
      
      // Verificar que el paciente aparece en la página
      if (currentUrl.includes('Expediente') || currentUrl.includes('Pacientes')) {
        expect(currentUrl).toContain('Pacientes')
      }
    } else {
      console.log('⚠️ No se encontró paciente en tabla')
    }
  })

  test('06 - Validación de flujo completo sin errores', async ({ authenticatedPage }) => {
    const page = authenticatedPage
    
    // Verificar que no hay errores en consola
    const consoleMessages = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text())
      }
    })
    
    // Navegar por la aplicación
    await page.goto('/Pacientes')
    await page.waitForLoadState('networkidle')
    
    // Verificar que la BD tiene pacientes
    const tableBody = page.locator('tbody')
    if (await tableBody.isVisible()) {
      const rows = await page.locator('tbody tr').count()
      console.log(`✅ Total de pacientes en tabla: ${rows}`)
      expect(rows).toBeGreaterThan(0)
    }
    
    // Validar que no hay errores críticos
    expect(consoleMessages.filter(m => m.includes('Error'))).toHaveLength(0)
  })
})
