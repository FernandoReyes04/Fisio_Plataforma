import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'

export const verify = async () =>{
   /* Verifica que el token JWT sea correcto */
   const response = await usuariosQueries.verifyUser(localStorage.getItem(import.meta.env.VITE_CREDENCIALES))

   return response
}

//FECHA ACTUAL
const hoy = new Date();
const anio = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses en JavaScript van de 0 a 11
const dia = String(hoy.getDate()).padStart(2, '0');
export const fechaActual = `${anio}-${mes}-${dia}`;

//BASE 64 IMG

export const base64IMG = 'data:image/png;base64,'
export const base64PDF = 'data:application/pdf;base64,'