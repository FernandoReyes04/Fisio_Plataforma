import { createRouter, createWebHistory } from 'vue-router'
import Panel from '@/views/layouts/PanelHome.vue'
import Navegacion from '@/views/Navegacion/NavegacionView.vue'
import LayoutInicio from '@/views/Navegacion/Inicio/LayoutInicio.vue'
import LayoutPacientes from '@/views/Navegacion/Pacientes/LayoutPacientes.vue'
import LayoutMetricas from '@/views/Navegacion/Metricas/LayoutMetricas.vue'
import AgregarPaciente from '@/views/Navegacion/Pacientes/AgregarPaciente.vue'
import LayoutAjustes from '@/views/Navegacion/Ajustes/LayoutAjustes.vue'
import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'
import NotFound from '@/views/layouts/NotFound.vue'
import Expediente from '@/views/Navegacion/Pacientes/Expediente.vue'
import FormLogin from '@/views/layouts/FormLogin.vue'
import Interrogatorio from '@/views/Navegacion/Pacientes/CompletarInterrogatio.vue'
import EditarPaciente from '@/views/Navegacion/Pacientes/EditarPaciente.vue'
import Fisioterapeutas from '@/views/Fisioterapeutas/LayoutFT.vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import Diagnostico from '@/views/Navegacion/Pacientes/Diagnostico/Diagnostico.vue'
import DiagnosticoPasado from '@/views/Navegacion/Pacientes/Diagnostico/DiagnosticoEspecifico.vue'
import Calendario from '@/views/Navegacion/Calendario/Calendario.vue'
import Usuario from '@/views/Navegacion/Ajustes/Usuario.vue'
import Catalogos from '@/views/Navegacion/Ajustes/Catalogos.vue'
import Equipo from '@/views/Navegacion/Ajustes/Equipo.vue'
import Contraseñas from '@/views/Navegacion/Ajustes/Contraseñas.vue'

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/:pathMatch(.*)*',
         name: 'NotFound',
         component: NotFound,
         meta: { requiresAuth: false }
      },
      {
         path: '/',
         name: 'login',
         component: FormLogin,
         meta: { verifyToken: false }
      },
      {
         path: '/',
         name: 'Panel',
         component: Panel,
         meta: { verifyToken: true },
         children: [
            {
               path: 'Inicio',
               name: 'Inicio',
               component: Navegacion,
               meta: { title: 'Dashboard - Fisiolabs' },
               redirect: { name: 'Dashboard' },
               children: [
                  {
                     path: '',
                     name: 'Dashboard',
                     component: LayoutInicio
                  },
                  {
                     path: 'Fisioterapeutas',
                     name: 'Fisioterapeutas',
                     component: Fisioterapeutas
                  }
               ]
            },
            {
               path: 'Pacientes',
               name: 'Pacientes',
               component: Navegacion,
               redirect: { name: 'ListaPacientes' },
               meta: { title: 'Pacientes - Fisiolabs' },
               children: [
                  {
                     path: '',
                     name: 'ListaPacientes',
                     component: LayoutPacientes
                  },
                  {
                     path: 'AgregarPaciente',
                     name: 'AgregarPaciente',
                     component: AgregarPaciente
                  },
                  {
                     path: 'Expediente/:id',
                     name: 'Expediente',
                     meta: { title: 'Expediente - Fisiolabs' },
                     component: Expediente
                  },
                  {
                     path: 'Interrogatorio/:id',
                     name: 'Interrogatorio',
                     component: Interrogatorio,
                     meta: { idExistente: true }
                  },
                  {
                     path: 'EditarPaciente/:id',
                     name: 'EditarPaciente',
                     meta: { title: 'Perfil - Fisiolabs' },
                     component: EditarPaciente
                  },
                  {
                     path: 'Diagnostico/:id/:diagnosticoId?',
                     name: 'Diagnostico',
                     meta: { title: 'Diagnostico - Fisiolabs' },
                     component: Diagnostico
                  },
                  {
                     path: 'Diagnosticos/:id/:diagnosticoId?',
                     name: 'Diagnosticos',
                     meta: { title: 'Diagnosticos - Fisiolabs' },
                     component: DiagnosticoPasado
                  },
               ]
            },
            {
               path: 'Metricas',
               name: 'Metricas',
               component: Navegacion,
               meta: { title: 'Metricas - Fisiolabs' },
               redirect: { name: 'Estadisticas' },
               children: [
                  {
                     path: '',
                     name: 'Estadisticas',
                     component: LayoutMetricas
                  }
               ]
            },
            {
               path: 'Calendario',
               name: 'Calendario',
               component: Calendario,
               meta: { title: 'Calendario - Fisiolabs' },
            },
            {
               path: 'Ajustes',
               name: 'Ajustes',
               component: Navegacion,
               meta: { title: 'Ajustes - Fisiolabs' },
               redirect: { name: 'Configuracion' },
               children: [
                  {
                     path: '',
                     name: 'Configuracion',
                     component: LayoutAjustes,
                     redirect: { name: 'Usuario' },
                     children:[
                        {
                           path:'Usuario',
                           name:'Usuario',
                           component:Usuario
                        },
                        {
                           path:'Contrasenas',
                           name:'Contrasenas',
                           component:Contraseñas
                        },
                        {
                           path:'Catalogos',
                           name:'Catalogos',
                           component:Catalogos
                        },
                        {
                           path:'Equipo',
                           name:'Equipo',
                           component:Equipo
                        }
                     ]
                  }
               ]
            }
         ]
      }
   ]
})

router.beforeEach(async (to, from, next) => {
   //AfterEach --NOTA--
   /* Verificamos si existe el id para el interrogatorio */
   if (to.meta.idExistente) {

      const response = await pacientesQueries.getDatosPaciente(to.params.id)

      if (response == null) {
         return next({ name: 'NotFound' })
      } else if(response.verificado === true){
         return next({ name: 'NotFound' })
      }else{
         return next()
      }
   }

   /* Verifica que el token sea autentico */
   if (to.meta.verifyToken) {
      const token = localStorage.getItem(import.meta.env.VITE_CREDENCIALES)

      if (!token || token === '') {
         localStorage.removeItem(import.meta.env.VITE_CREDENCIALES)
         localStorage.removeItem(import.meta.env.VITE_USUARIO)
         return next('/')
      }

      const response = await usuariosQueries.verifyUser(token)
      if (!response || response.verify === false) {
         localStorage.removeItem(import.meta.env.VITE_CREDENCIALES)
         localStorage.removeItem(import.meta.env.VITE_USUARIO)
         return next('/')
      }

      return next()
   }

   /*
    * Redireccion a la ruta "/"
    * Si tengo acceso no me permitira ver el login
    * */
   if (to.name === 'login') {
      if (localStorage.getItem(import.meta.env.VITE_CREDENCIALES) != null) {
         return next({ name: 'Dashboard' })
      }
   }

   /* Cambia el titulo dependiendo de la pagina */
   if (to.meta.title) {
      document.title = to.meta.title
   } else {
      document.title = 'Fisiolabs' // Título por defecto
   }


   return next()
})

export default router