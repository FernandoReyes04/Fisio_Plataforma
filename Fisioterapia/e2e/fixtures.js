import { test as base } from '@playwright/test'

export const test = base.extend({
  async authenticatedPage({ page }, use) {
    console.log('🔐 Iniciando login...')
    
    // Navegar a la aplicación
    await page.goto('/')
    
    // Esperar a que cargue el formulario de login
    try {
      await page.waitForURL('/', { waitUntil: 'domcontentloaded', timeout: 10000 })
    } catch (error) {
      console.error('❌ Error: No se pudo cargar la página principal')
      console.error('   Verifica que el servidor dev está corriendo: npm run dev')
      throw error
    }
    
    // **IMPORTANTE**: Usuario "fernando" existe en BD, reemplaza PASSWORD con contraseña real
    const USERNAME = 'fernando'     // ← Usuario que existe en BD
    const PASSWORD = '12345'        // ← Contraseña de Fernando
    
    try {
      // Realizar login con los selectores correctos
      console.log(`📝 Ingresando usuario: "${USERNAME}"`)
      
      const usernameInput = page.locator('input[type="text"][placeholder="Nombre de usuario"]')
      await usernameInput.waitFor({ timeout: 5000 })
      await usernameInput.fill(USERNAME)
      
      const passwordInput = page.locator('input[type="password"][placeholder="Contraseña"]')
      await passwordInput.fill(PASSWORD)
      
      // Click en botón "Iniciar sesión"
      const loginButton = page.locator('button:has-text("Iniciar sesión")')
      await loginButton.click()
      
      console.log('⏳ Esperando respuesta del servidor...')
      
      // Esperar a que redirija a Dashboard
      await page.waitForURL(/\/Inicio|\/Dashboard/, { waitUntil: 'networkidle', timeout: 15000 })
      
      console.log('✅ Login exitoso!')
      
    } catch (error) {
      console.error('❌ Error en login:')
      console.error(`   - Usuario: "fernando"`)
      console.error('   - Verifica que el backend está corriendo en puerto 5223')
      console.error('   - Comprueba la CONTRASEÑA en e2e/fixtures.js')
      console.error(`   - URL actual: ${page.url()}`)
      
      // Capturar pantalla para debugging
      await page.screenshot({ path: 'login-error.png' })
      console.error('   📸 Screenshot guardado en: login-error.png')
      
      throw error
    }
    
    await use(page)
  }
})

export { expect } from '@playwright/test'
