export const globalCommand = {

   postImage: async (titulo, image) => {
      //Se añada el titulo y carpeta al public_id
      const publicId = `FotoPerfil/${titulo}`

      const formData = new FormData()
      formData.append('file', image)
      formData.append('upload_preset', 'g2k9muta')
      formData.append('public_id', publicId)

      try {
         const response = await fetch(`https://api.cloudinary.com/v1_1/doi0znv2t/image/upload`, {
            method: 'POST',
            body: formData
         })

         const data = await response.json()

         return data
      } catch (error) {
         console.error('Error subiendo la imagen:', error)
      }
   }

}
