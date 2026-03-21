/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {
            screens: {
                /* Anchos */
                'telefono': {'max': '767px'},  // Ancho maximo de 767px
                'tablet': {'min': '768px', 'max': '1023px'}, // Ancho mínimo de 768px y máximo de 1023px
                'laptop': {'min': '1024px', 'max': '1919px'}, // Ancho minimo de 1024px
                'desktop': '1920px',

                /* Alturas */
                'short': {'raw': '(max-height: 880px)'}, // Altura máxima de 880px
            },
            boxShadow: {
                'basic': '0 4px 6px rgba(0, 0, 0, 0.1)', // Define tu propio estilo de box-shadow
            },
            backgroundColor: {
                'fondo': '#F9FAFD',
                'principal': '#0062FF',
                'pHover': '#238dff',
                'difuminado': 'rgba(95,95,95,0.5)',
            },
            colors:{
                'principal': '#0062FF'
            },
            fontSize:{
                'normal': '32px'
            },
            fontFamily:{
                'poppins': 'Poppins',
                'Prompt': 'Prompt'
            },
            borderWidth: {
                'principal': '.5px', // Define el ancho del borde principal
            },
            borderColor: {
                'principal': 'rgba(0, 0, 0, 0.11)', // Define el color del borde principal
            },
            padding:{
                'pLogin': '100px'
            }
        },
    },
    plugins: [
        flowbitePlugin,
        require('tailwindcss-animated')
    ],
}

