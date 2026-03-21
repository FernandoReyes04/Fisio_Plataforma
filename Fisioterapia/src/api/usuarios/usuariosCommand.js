import { apiUrl, autorizationFormData, autorizationJSON, sinAutorizationJSON } from '@/api/headers.js'
import axios from 'axios'
import { irInicio } from '@/router/rutasUtiles.js'
import { globalCommand } from '@/api/global/globaCommand.js'
import { NotificacionesModal } from '@/helpers/notifications/NotificacionGeneral.js'
import { ref } from 'vue'

export const usuarioCommand = {
  updateInstitutionLogo: async (logoFile) => {
    try {
      const formData = new FormData()
      formData.append('logo', logoFile)

      const [data, config] = autorizationFormData(formData)
      await axios.put(apiUrl + '/Usuario/Logo', data, config)

      return { success: true }
    } catch (error) {
      if (!error.response) {
        return { success: false, message: 'No se pudo conectar con el servidor' }
      }

      return { success: false, message: error.response?.data || 'Error al actualizar el logo' }
    }
  },

  /*Login*/
  login: async (username, contrasena) => {
    try {
      const JSON = {
        username: username,
        contraseña: contrasena,
        recordarme: true
      }

      const [data, config] = sinAutorizationJSON(JSON)
      const response = await axios.post(apiUrl + '/Cuenta/Login', data, config)

      //Se agrega la credencial al localStorage
      localStorage.setItem(import.meta.env.VITE_CREDENCIALES, response.data.accessToken)
      localStorage.setItem(import.meta.env.VITE_USUARIO, response.data.usuario.username)

      //Te redirecciona al Dashboard
      irInicio()

      //El return solo es para saber si, si se ejecuto correctamente
      return null
    } catch (error) {
      if (!error.response) {
        return 'No se pudo conectar con el servidor'
      }

      if (error.response.status === 400) {
        return 'Rellena los campos solicitados'
      } else if (error.response.status === 404) {
        return 'Nombre de usuario y/o contraseña incorrectos'
      }

      return 'Ocurrió un error al iniciar sesión'
    }
  },

  /*FISIOTERAPEUTAS*/

  agregarIntegrante: async (nombre, correo, telefono, especialidadId, cedula, foto, ) => {
    try {
      const formData = new FormData();

      // Agregar los campos al FormData
      formData.append('nombre', nombre);
      formData.append('correo', correo);
      formData.append('telefono', telefono);
      formData.append('especialidadId', especialidadId);
      formData.append('cedula', cedula);
      formData.append('foto', foto);

      const [data, config] = autorizationFormData(formData)

      const response = await axios.post(apiUrl + '/Fisio', data, config)
      await NotificacionesModal.ExitosoSimple(response.data)
      //El return solo es para saber si, si se ejecuto correctamente
      return true
    } catch (error) {
      await NotificacionesModal.PantallaError(error.response.data.detail)
    }
  },

  editarEstadoFisio: async (fisioId) => {
    try {
      const JSON = {
        fisioId
      }
      const [data, config] = autorizationJSON(JSON)
      await axios.put(apiUrl + '/Fisio/Estatus', data, config)
    } catch (error) {
      await NotificacionesModal.PantallaError(error.response.data.detail)
    }
  },

  changePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    const JSON = {
      contraseñaActual: currentPassword,
      nuevaContraseña: newPassword,
      confirmarContraseña: confirmNewPassword
    }
    const [data, config] = autorizationJSON(JSON)
    try {
      const response = await axios.put(apiUrl + '/Cuenta/Contraseña', data, config)
      if (response.status === 200) {
        await NotificacionesModal.ExitosoSimple('Clave actualizada correctamente')
        currentPassword.value = ''
        newPassword.value = ''
        confirmNewPassword.value = ''
      }
    } catch (error) {
      await NotificacionesModal.PantallaError(error.response.data.detail)
    }
  },

  changeKey: async (currentKey, newKey, confirmNewKey) => {
    const JSON = {
      claveActual: currentKey,
      claveNueva: newKey,
      confirmarClave: confirmNewKey
    }

    const [data, config] = autorizationJSON(JSON)
    try {
      const response = await axios.put(apiUrl + '/Cuenta/Clave', data, config)

      if (response.status === 200) {
        await NotificacionesModal.ExitosoSimple('Clave actualizada correctamente')
        currentKey.value = ''
        newKey.value = ''
        confirmNewKey.value = ''
      }
    } catch (error) {
      await NotificacionesModal.PantallaError(error.response.data.detail)
    }
  },

  updateUserDetails: async (userName, email, phone, specialityId, foto) => {
    const formData = new FormData()
    formData.append('nombre', userName)
    formData.append('correo', email)
    formData.append('telefono', phone)
    formData.append('especialidadId', specialityId)
    formData.append('foto', foto)

    const [data, config] = autorizationFormData(formData)
    try {
      const response = await axios.put(apiUrl + '/Usuario', data, config)
      await NotificacionesModal.ExitosoSimple(response.data)
    } catch (error) {
      await NotificacionesModal.PantallaError(error.response.data.detail)
    }
  }

}
