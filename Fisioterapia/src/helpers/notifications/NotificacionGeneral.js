import Swal from 'sweetalert2'

export const primaryColor = '#0062FF'
export const cancelColor = '#ce4257'
export const warningColor = '#C27803'

export const NotificacionesModal = {
   ExitosoSimple: async (msg = 'Proceso completado con exito', textBtn = 'Aceptar') => {
      return await Swal.fire({
         allowOutsideClick: false,
         allowEscapeKey: false,
         position: 'center',
         icon: 'success',
         iconColor: 'green',
         showConfirmButton: true,
         confirmButtonColor: `${primaryColor}`,
         confirmButtonText: textBtn,
         customClass: {
            popup: 'rounded-sm'
         },
         html: `<p class="text-lg font-semibold">${msg}</p>`
      })
   },
   PantallaError: async (msg = 'Error') => {
      return await Swal.fire({
         allowOutsideClick: false,
         allowEscapeKey: false,
         position: 'center',
         icon: 'error',
         iconColor: 'red',
         showConfirmButton: true,
         confirmButtonColor: `${primaryColor}`,
         confirmButtonText: 'Aceptar',
         customClass: {
            popup: 'rounded-sm'
         },
         html: `<p class="text-lg font-semibold">${msg}</p>`
      })
   },
   PantallaWarning: async (msg = 'Warning', msgAceptar = 'Aceptar', msgNegar = 'Cancelar') => {
      return await Swal.fire({
         allowOutsideClick: false,
         allowEscapeKey: false,
         position: 'center',
         icon: 'warning',
         showConfirmButton: true,
         confirmButtonColor: `${primaryColor}`,
         confirmButtonText: msgAceptar,
         showCancelButton: true,
         cancelButtonText: msgNegar,
         customClass: {
            popup: 'rounded-sm',
            cancelButton: 'rounded-sm',
            confirmButton: 'rounded-sm'
         },
         html: `<p class="text-lg font-semibold">${msg}</p>`
      })
   },
   PantallaArchivar: async (msg = 'Eliminar', msgAceptar = 'Aceptar', msgNegar = 'Cancelar') => {
      return await Swal.fire({
         allowOutsideClick: false,
         allowEscapeKey: false,
         position: 'center',
         icon: 'error',
         iconHtml:`
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
         `,
         iconColor: `${warningColor}`,
         showConfirmButton: true,
         confirmButtonColor: `${primaryColor}`,
         confirmButtonText: msgAceptar,
         showCancelButton: true,
         cancelButtonText: msgNegar,
         customClass: {
            popup: 'rounded-sm',
            cancelButton: 'rounded-sm',
            confirmButton: 'rounded-sm'
         },
         html: `<p class="text-lg font-semibold">${msg}</p>`
      })
   },

   PantallaPonerActivo: async (msg = 'Eliminar', msgAceptar = 'Aceptar', msgNegar = 'Cancelar') => {
      return await Swal.fire({
         allowOutsideClick: false,
         allowEscapeKey: false,
         position: 'center',
         icon: 'error',
         iconHtml:`
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>

         `,
         iconColor: `${primaryColor}`,
         showConfirmButton: true,
         confirmButtonColor: `${primaryColor}`,
         confirmButtonText: msgAceptar,
         showCancelButton: true,
         cancelButtonText: msgNegar,
         customClass: {
            popup: 'rounded-sm',
            cancelButton: 'rounded-sm',
            confirmButton: 'rounded-sm'
         },
         html: `<p class="text-lg font-semibold">${msg}</p>`
      })
   }


}