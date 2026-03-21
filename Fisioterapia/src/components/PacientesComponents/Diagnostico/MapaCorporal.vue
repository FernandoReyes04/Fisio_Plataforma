<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'

const props = defineProps({
  sexo: String,
  loader: Boolean,
  initialData: {
    type: Object,
    default: null
  }
})

// --- ESTADO DE LA UI ---
const showMcGillModal = ref(false)
const showSimboloModal = ref(false)
const puntoTemporal = ref({ x: 0, y: 0 })

// --- ESTADO DE LOS DATOS ---
// Aquí guardamos los puntos. Cada punto tiene coordenada, símbolo, tipo Y SU PROPIO NIVEL DE DOLOR (Slider)
const puntosDolor = ref([]) 

// Simbología clínica (Tal cual tu imagen)
const simbolosDolor = [
    { codigo: '///', etiqueta: 'Como una puñalada', color: 'text-red-600' },
    { codigo: '000', etiqueta: 'Hormigueos', color: 'text-blue-600' },
    { codigo: 'XXX', etiqueta: 'Ardiente', color: 'text-orange-600' },
    { codigo: '===', etiqueta: 'Entumecimiento', color: 'text-gray-600' }
]

// Datos McGill (Estático)
const mcgillGroups = [
  { title: 'Temporal I', options: ['A golpes', 'Continuo'] },
  { title: 'Temporal II', options: ['Periódico', 'Repetitivo', 'Insistente', 'Interminable'] },
  { title: 'Localización I', options: ['Impreciso', 'Bien delimitado', 'Extenso'] },
  { title: 'Localización II', options: ['Repartido', 'Propagado'] },
  { title: 'Punción', options: ['Como un pinchazo', 'Como agujas', 'Como un clavo', 'Punzante', 'Perforante'] },
  { title: 'Incisión', options: ['Como si cortase', 'Como una cuchilla'] },
  { title: 'Constricción', options: ['Como un pellizco', 'Como si apretara', 'Como agarrotado', 'Opresivo', 'Como si exprimiera'] },
  { title: 'Tracción', options: ['Tirantez', 'Como un tirón', 'Como si estirara', 'Como si arrancara', 'Como si desgarrara'] },
  { title: 'Térmico I', options: ['Calor', 'Como si quemara', 'Abrasador', 'Como hierro candente'] },
  { title: 'Térmico II', options: ['Frialdad', 'Helado'] },
  { title: 'Sensibilidad táctil', options: ['Como si rozara', 'Como un hormigueo', 'Como si arañara', 'Como si raspara', 'Como un escozor', 'Como un picor'] },
  { title: 'Consistencia', options: ['Pesadez'] },
  { title: 'Miscelánea sensorial I', options: ['Como hinchado', 'Como un peso', 'Como un flato', 'Como espasmos'] },
  { title: 'Miscelánea sensorial II', options: ['Como latidos', 'Concentrado', 'Como si pasara corriente', 'Calambrazos'] },
  { title: 'Miscelánea sensorial III', options: ['Seco', 'Como martillazos', 'Agudo', 'Como si fuera a explotar'] },
  { title: 'Tensión emocional', options: ['Fastidioso', 'Preocupante', 'Angustioso', 'Exasperante', 'Que amarga la vida'] },
  { title: 'Signos vegetativos', options: ['Nauseoso'] },
  { title: 'Miedo', options: ['Que asusta', 'Temible', 'Aterrador'] },
  { title: 'Categoría valorativa', options: ['Débil', 'Soportable', 'Intenso', 'Terriblemente molesto'] }
]
const mcgillIntensidad = ['Leve, débil, ligero', 'Moderado, molesto, incómodo', 'Fuerte', 'Extenuante, exasperante', 'Insoportable']

// Variables Reactivas (Formularios)
const detallesDolor = reactive({
  fisiologia: '', tipoLocalizacion: '', tiempo: '', cualidad: '', comportamiento: '', factores: '' 
})
const mcgillSeleccion = reactive({ palabras: [], intensidad: '' })

// Objeto final a emitir
let mapa = reactive({
  valores: [], // Se usará para compatibilidad si es necesario
  rangoDolor: [], // Se llenará con los valores de los sliders
  notas: null, 
  rangos: [],
  puntos: [],
  detallesDolor: null,
  mcgill: null
})

const emit = defineEmits(['mapaC'])

// Propiedad computada para saber si hay datos activos
const hayDatos = computed(() => puntosDolor.value.length > 0)

// --- LÓGICA DEL MAPA (CLIC EN PÍXELES) ---
const registrarClicImagen = (event) => {
    const rect = event.target.getBoundingClientRect();
    // Calculamos porcentaje para responsive
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    puntoTemporal.value = { x, y };
    showSimboloModal.value = true; 
}

const confirmarPunto = (simbolo) => {
    // Agregamos el punto con un nivel de dolor inicial de 0
    puntosDolor.value.push({
        x: puntoTemporal.value.x,
        y: puntoTemporal.value.y,
        simbolo: simbolo.codigo,
        tipo: simbolo.etiqueta,
        color: simbolo.color,
        nivel: 0 // Slider inicia en 0
    });
    showSimboloModal.value = false;
}

const eliminarPunto = (index) => {
    puntosDolor.value.splice(index, 1);
}

// --- WATCHER GLOBAL (Construye la nota final con TODO) ---
watch([detallesDolor, mcgillSeleccion, puntosDolor], () => {
  
  // 1. Recopilamos los Rangos de Dolor para el backend (array de enteros)
  mapa.rangos = puntosDolor.value.map(p => parseInt(p.nivel));
  mapa.rangoDolor = [...mapa.rangos]; // Compatibilidad con tu estructura anterior
  mapa.puntos = puntosDolor.value.map(p => ({ ...p }))
  mapa.detallesDolor = { ...detallesDolor }
  mapa.mcgill = {
    palabras: [...mcgillSeleccion.palabras],
    intensidad: mcgillSeleccion.intensidad
  }

  // 2. Construimos el Reporte de Texto (Notas)
  let texto = `--- MAPA CORPORAL (Puntos y Niveles) ---\n`;
  
  if (puntosDolor.value.length > 0) {
      puntosDolor.value.forEach((p, i) => {
          texto += `Zona ${i+1} (${p.tipo}): Intensidad ${p.nivel}/10\n`;
      });
  } else {
      texto += "Sin zonas marcadas.\n";
  }

  texto += `\n--- SEMIOLOGÍA DEL DOLOR ---\n` +
    `● Fisiología: ${detallesDolor.fisiologia || 'No especificado'}\n` +
    `● Tipo Localización: ${detallesDolor.tipoLocalizacion || 'No especificado'}\n` +
    `● Evolución: ${detallesDolor.tiempo || 'No especificado'}\n` +
    `● Cualidad: ${detallesDolor.cualidad || 'No especificado'}\n` +
    `● Comportamiento: ${detallesDolor.comportamiento || 'No especificado'}\n` +
    `● Factores/Notas: ${detallesDolor.factores || 'Ninguno'}`;

  if (mcgillSeleccion.palabras.length > 0 || mcgillSeleccion.intensidad) {
    texto += `\n\n--- CUESTIONARIO DE McGILL ---\n`;
    if (mcgillSeleccion.palabras.length > 0) texto += `Descriptores: ${mcgillSeleccion.palabras.join(', ')}\n`;
    if (mcgillSeleccion.intensidad) texto += `Intensidad Global: ${mcgillSeleccion.intensidad}`;
  }

  mapa.notas = texto;
  emit('mapaC', mapa); // Emitimos el cambio al componente padre
}, { deep: true })

// --- FUNCIONES AUXILIARES ---
const toggleMcGillOption = (palabra) => {
  const index = mcgillSeleccion.palabras.indexOf(palabra)
  if (index === -1) mcgillSeleccion.palabras.push(palabra)
  else mcgillSeleccion.palabras.splice(index, 1)
}

const enviarMapa = () => {
  emit('mapaC', mapa)
}

onMounted(() => {
  if (!props.initialData) return

  if (Array.isArray(props.initialData.puntos)) {
    puntosDolor.value = props.initialData.puntos.map(p => ({ ...p }))
  }

  if (props.initialData.detallesDolor) {
    detallesDolor.fisiologia = props.initialData.detallesDolor.fisiologia || ''
    detallesDolor.tipoLocalizacion = props.initialData.detallesDolor.tipoLocalizacion || ''
    detallesDolor.tiempo = props.initialData.detallesDolor.tiempo || ''
    detallesDolor.cualidad = props.initialData.detallesDolor.cualidad || ''
    detallesDolor.comportamiento = props.initialData.detallesDolor.comportamiento || ''
    detallesDolor.factores = props.initialData.detallesDolor.factores || ''
  }

  if (props.initialData.mcgill) {
    mcgillSeleccion.palabras = Array.isArray(props.initialData.mcgill.palabras)
      ? [...props.initialData.mcgill.palabras]
      : []
    mcgillSeleccion.intensidad = props.initialData.mcgill.intensidad || ''
  }
})

defineExpose({ enviarMapa })
</script>

<template>
  <div v-if="showSimboloModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden">
          <div class="bg-blue-600 p-4">
              <h3 class="text-white font-bold text-lg text-center">¿Qué sensación tiene aquí?</h3>
          </div>
          <div class="p-6 grid grid-cols-2 gap-4">
              <button 
                  v-for="simbolo in simbolosDolor" 
                  :key="simbolo.codigo"
                  @click="confirmarPunto(simbolo)"
                  class="flex flex-col items-center justify-center p-4 border-2 border-gray-100 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                  <span class="text-2xl font-black mb-2 tracking-widest" :class="simbolo.color">{{ simbolo.codigo }}</span>
                  <span class="text-xs font-medium text-gray-600 group-hover:text-blue-700">{{ simbolo.etiqueta }}</span>
              </button>
          </div>
          <div class="bg-gray-50 p-3 text-center border-t">
              <button @click="showSimboloModal = false" class="text-sm text-gray-500 hover:text-red-500">Cancelar</button>
          </div>
      </div>
  </div>

  <div v-if="showMcGillModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
        <div>
          <h2 class="text-xl font-bold text-blue-800">Cuestionario de Dolor de McGill (MPQ)</h2>
          <p class="text-sm text-gray-500">Indique sus sentimientos y sensaciones.</p>
        </div>
        <button @click="showMcGillModal = false" class="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(grupo, idx) in mcgillGroups" :key="idx" class="border p-3 rounded-md hover:shadow-sm">
            <h3 class="font-bold text-sm text-gray-800 mb-2 border-b pb-1">{{ grupo.title }}</h3>
            <div class="flex flex-col gap-1">
              <label v-for="opcion in grupo.options" :key="opcion" class="flex items-center cursor-pointer hover:bg-blue-50 p-1 rounded">
                <input type="checkbox" :checked="mcgillSeleccion.palabras.includes(opcion)" @change="toggleMcGillOption(opcion)" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                <span class="ml-2 text-sm text-gray-600">{{ opcion }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="mt-8 border-t pt-4">
          <h3 class="font-bold text-blue-800 mb-2">Intensidad del dolor (en su conjunto)</h3>
          <div class="space-y-2">
            <label v-for="intensidad in mcgillIntensidad" :key="intensidad" class="flex items-center cursor-pointer">
              <input type="radio" name="mcgill_intensidad" :value="intensidad" v-model="mcgillSeleccion.intensidad" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">{{ intensidad }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
        <button @click="mcgillSeleccion.palabras = []; mcgillSeleccion.intensidad = ''" class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">Limpiar</button>
        <button @click="showMcGillModal = false" class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 shadow">Guardar y Cerrar</button>
      </div>
    </div>
  </div>

  <div v-if="props.loader" class="h-[402px] flex justify-center items-center text-gray-600">
      <svg aria-hidden="true" role="status" class="inline w-10 h-10 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
      </svg>
      Cargando mapa corporal...
  </div>
  
  <div v-else class="animate-fade">
      
    <div class="flex flex-col md:flex-row gap-6 mb-8">
        
        <div class="w-full md:w-1/2 flex flex-col items-center">
            <div class="relative border rounded shadow-sm bg-white cursor-crosshair select-none overflow-hidden w-full" style="max-width: 500px;">
                <img 
                    src="@/assets/CuerpoHumano/mapa_musculos.jpg" 
                    alt="Mapa Muscular" 
                    class="w-full h-auto object-contain"
                    @click="registrarClicImagen"
                >
                <div 
                    v-for="(punto, index) in puntosDolor" 
                    :key="index"
                    class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    :style="{ top: punto.y + '%', left: punto.x + '%' }"
                    @click.stop="eliminarPunto(index)"
                >
                    <span class="text-lg font-black leading-none drop-shadow-md bg-white bg-opacity-75 px-1 rounded border border-gray-200" :class="punto.color">
                        {{ punto.simbolo }}
                    </span>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 shadow-lg">
                        Clic para borrar
                    </div>
                </div>
            </div>
            <p class="text-xs text-gray-400 mt-2 text-center">Haga clic sobre la zona exacta del dolor para marcarlo.</p>
            
            <div class="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
                 <span class="flex items-center gap-1"><b class="text-red-600">///</b> Puñalada</span>
                 <span class="flex items-center gap-1"><b class="text-blue-600">000</b> Hormigueos</span>
                 <span class="flex items-center gap-1"><b class="text-orange-600">XXX</b> Ardiente</span>
                 <span class="flex items-center gap-1"><b class="text-gray-600">===</b> Entumecimiento</span>
            </div>
        </div>

        <div class="w-full md:w-1/2 space-y-4">
            
            <div class="bg-orange-50 border border-orange-200 rounded p-4">
                <h4 class="font-bold text-orange-800 text-sm mb-2 uppercase">Simbología del Dolor</h4>
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div v-for="s in simbolosDolor" :key="s.codigo" class="flex items-center gap-2">
                        <span class="font-black w-8" :class="s.color">{{ s.codigo }}</span>
                        <span class="text-gray-700">{{ s.etiqueta }}</span>
                    </div>
                </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                 <div>
                     <h4 class="font-bold text-blue-800 text-sm">Cuestionario McGill</h4>
                     <p class="text-xs text-gray-500">Evaluación cualitativa y cuantitativa.</p>
                 </div>
                 <button @click="showMcGillModal = true" class="bg-white border border-blue-300 text-blue-600 text-xs font-bold px-3 py-2 rounded hover:bg-blue-100 shadow-sm whitespace-nowrap">
                     Abrir Cuestionario
                 </button>
            </div>

            <div class="border rounded shadow-sm">
                 <div class="bg-gray-100 px-4 py-2 border-b">
                    <h4 class="font-bold text-gray-700 text-sm">Semiología (Automática)</h4>
                 </div>
                 <textarea 
                    readonly 
                    v-model="mapa.notas" 
                    class="w-full h-40 text-xs p-2 bg-white resize-none focus:outline-none"
                    placeholder="La información se generará aquí..."
                 ></textarea>
            </div>
        </div>
    </div>

    <div v-if="hayDatos" class="animate-fade-down space-y-6">
        
        <section class="rounded-sm border shadow">
            <details open class="group">
              <summary class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                Escala del dolor por zonas<span class="text-blue-600">*</span>
                <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                </svg>
              </summary>
              
              <div class="px-6 py-3 text-gray-500 flex flex-col gap-4">
                <div v-for="(punto, index) in puntosDolor" :key="index" class="border-b pb-4 last:border-0 last:pb-0">
                    <header class="flex justify-between items-center mb-2">
                        <h3 class="font-bold text-blue-700 text-sm">Zona {{ index + 1 }} ({{ punto.tipo }}):</h3>
                        <button @click="eliminarPunto(index)" class="text-xs text-red-500 hover:underline">Eliminar zona</button>
                    </header>
                    <div class="relative pt-1 pb-1">
                        <input type="range" v-model="punto.nivel" min="0" max="10" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                        <span class="absolute top-0 right-0 transform -translate-y-full font-bold text-blue-600 text-lg">{{ punto.nivel }}</span>
                    </div>
                    <div class="flex justify-between text-xs font-medium text-gray-400">
                        <span>Sin dolor</span>
                        <span>Dolor insoportable</span>
                    </div>
                </div>
              </div>
            </details>
        </section>

        <section class="rounded-sm border shadow">
            <details open class="group">
              <summary class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                Descripción detallada del Dolor<span class="text-blue-600">*</span>
                <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                </svg>
              </summary>

              <div class="px-6 py-4 bg-blue-50 border-t border-blue-100">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 mb-1">1. Fisiología</label>
                      <select v-model="detallesDolor.fisiologia" class="input-primary w-full text-xs bg-white">
                        <option value="" disabled>Seleccione...</option>
                        <optgroup label="Nociceptivo">
                          <option value="Nociceptivo: Somático">Somático</option>
                          <option value="Nociceptivo: Visceral">Visceral</option>
                        </optgroup>
                        <optgroup label="Neuropático">
                          <option value="Neuropático: Disestesias continuas">Disestesias continuas</option>
                          <option value="Neuropático: Dolor paroxístico">Dolor paroxístico</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-500 mb-1">2. Tipo de Localización</label>
                      <select v-model="detallesDolor.tipoLocalizacion" class="input-primary w-full text-xs bg-white">
                        <option value="" disabled>Seleccione...</option>
                        <option value="Localizado">Localizado</option>
                        <option value="Irradiado">Irradiado</option>
                        <option value="Referido">Referido</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-500 mb-1">3. Evolución</label>
                      <select v-model="detallesDolor.tiempo" class="input-primary w-full text-xs bg-white">
                        <option value="" disabled>Seleccione...</option>
                        <option value="Agudo">Agudo</option>
                        <option value="Subagudo">Subagudo</option>
                        <option value="Crónico">Crónico</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-500 mb-1">Cualidad</label>
                      <select v-model="detallesDolor.cualidad" class="input-primary w-full text-xs bg-white">
                        <option value="" disabled>Seleccione...</option>
                        <option value="Pungitivo">Pungitivo (Punzada)</option>
                        <option value="Terebrante">Terebrante (Taladrante)</option>
                        <option value="Constrictivo">Constrictivo (Opresivo)</option>
                        <option value="Fulgurante">Fulgurante (Descarga)</option>
                        <option value="Urente">Urente (Quemante)</option>
                        <option value="Sordo">Sordo</option>
                        <option value="Cólico">Cólico</option>
                        <option value="Pulsátil">Pulsátil</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-500 mb-1">Comportamiento</label>
                      <select v-model="detallesDolor.comportamiento" class="input-primary w-full text-xs bg-white">
                        <option value="" disabled>Seleccione...</option>
                        <option value="Constante">Constante</option>
                        <option value="Intermitente">Intermitente</option>
                        <option value="Latente">Latente</option>
                      </select>
                    </div>
                  </div>

                  <div class="mt-4">
                    <label class="block text-xs font-bold text-gray-500 mb-1">Factores Agravantes / Notas adicionales</label>
                    <textarea v-model="detallesDolor.factores" class="input-primary w-full text-xs bg-white resize-none" rows="2" placeholder="Ej: Empeora con el frío..."></textarea>
                  </div>
              </div>
            </details>
        </section>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  background-color: #0d6efd; 
}
input[type="range"]::-moz-range-thumb {
  background-color: #0d6efd; 
}
input[type="range"]::-ms-thumb {
  background-color: #0d6efd; 
}
</style>