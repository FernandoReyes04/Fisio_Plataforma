const apiUrl = import.meta.env.VITE_API_URL

const sinAutorizationJSON = (data) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return [data, config]
}

const autorization = () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(import.meta.env.VITE_CREDENCIALES)}`
    }
  }
  return config
}

const autorizationJSON = (data) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(import.meta.env.VITE_CREDENCIALES)}`
    }
  }

  return [data, config]
}

const autorizationFormData = (data) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(import.meta.env.VITE_CREDENCIALES)}`
    }
  }

  return [data, config]
}

// Exporta las funciones de configuración para que puedan ser llamadas desde otros módulos
export { autorization, autorizationJSON, sinAutorizationJSON, autorizationFormData, apiUrl }