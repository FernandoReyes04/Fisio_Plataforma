<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['datosDiagnostico'])

const defaultSections = [
  { clave: 'diagnostico', titulo: 'Diagnóstico', tipoRespuesta: 'text', esObligatoria: true, esSistema: true, activa: true, orden: 1, placeholder: 'Ingrese el diagnóstico', opciones: [] },
  { clave: 'refiere', titulo: 'Refiere', tipoRespuesta: 'text', esObligatoria: true, esSistema: true, activa: true, orden: 2, placeholder: 'Ingrese nombre del personal médico que lo refirió aquí', opciones: [] },
  { clave: 'categoria', titulo: 'Categoría', tipoRespuesta: 'text', esObligatoria: true, esSistema: true, activa: true, orden: 3, placeholder: 'Ingrese la categoría', opciones: [] },
  { clave: 'diagnosticoPrevio', titulo: 'Diagnóstico previo del médico', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 4, placeholder: 'Ingrese el diagnóstico previo del médico', opciones: [] },
  { clave: 'terapeuticaEmpleada', titulo: 'Terapéutica empleada y tratamientos afines', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 5, placeholder: 'Ingrese la terapéutica empleada y tratamientos afines', opciones: [] },
  { clave: 'diagnosticoFuncional', titulo: 'Diagnóstico funcional', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 6, placeholder: 'Ingrese el diagnóstico funcional', opciones: [] },
  { clave: 'padecimientoActual', titulo: 'Padecimiento actual', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 7, placeholder: '', opciones: [] },
  { clave: 'inspeccion', titulo: 'Inspección general y específica', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 8, placeholder: 'Ingrese la inspección general y específica', opciones: [] },
  { clave: 'exploracionFisicaDescripcion', titulo: 'Palpación, sensibilidad y medidas antropométricas', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 9, placeholder: 'Ingrese la palpación, sensibilidad y medidas antropométricas', opciones: [] },
  { clave: 'estudiosComplementarios', titulo: 'Pruebas complementarias', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 10, placeholder: '', opciones: [] },
  { clave: 'diagnosticoNosologico', titulo: 'Diagnóstico nosológico', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 11, placeholder: 'Ingrese el diagnóstico nosológico', opciones: [] },
  { clave: 'cortoPlazo', titulo: 'Objetivos a corto plazo', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 12, placeholder: 'Ingrese los objetivos a corto plazo', opciones: [] },
  { clave: 'medianoPlazo', titulo: 'Objetivos a mediano plazo', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 13, placeholder: 'Ingrese los objetivos a mediano plazo', opciones: [] },
  { clave: 'largoPlazo', titulo: 'Objetivos a largo plazo', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 14, placeholder: 'Ingrese los objetivos a largo plazo', opciones: [] },
  { clave: 'tratamientoFisioterapeutico', titulo: 'Tratamiento fisioterapéutico', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 15, placeholder: '', opciones: [] },
  { clave: 'sugerencias', titulo: 'Sugerencias y recomendaciones', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 16, placeholder: 'Ingrese las sugerencias y recomendaciones', opciones: [] },
  { clave: 'pronostico', titulo: 'Pronósticos y recomendaciones', tipoRespuesta: 'textarea', esObligatoria: true, esSistema: true, activa: true, orden: 17, placeholder: 'Ingrese los pronósticos y recomendaciones', opciones: [] }
]

const responseTypes = [
  { value: 'text', label: 'Texto corto' },
  { value: 'textarea', label: 'Texto largo' },
  { value: 'number', label: 'Numérico' },
  { value: 'date', label: 'Fecha' },
  { value: 'select', label: 'Lista desplegable' },
  { value: 'radio', label: 'Opción única' },
  { value: 'checkbox', label: 'Múltiples opciones' },
  { value: 'image', label: 'Subir imagen' }
]

const sectionList = ref([])
const isSavingStructure = ref(false)

const modalOpen = ref(false)
const editingSectionKey = ref(null)
const sectionModal = reactive({
  titulo: '',
  tipoRespuesta: 'text',
  esObligatoria: false,
  activa: true,
  placeholder: '',
  opcionesTexto: ''
})

const datosDiagnostico = reactive({
  diagnostico: null,
  refiere: null,
  categoria: null,
  diagnosticoPrevio: null,
  terapeuticaEmpleada: null,
  diagnosticoFuncional: null,
  padecimientoActual: null,
  inspeccion: null,
  exploracionFisicaDescripcion: null,
  estudiosComplementarios: null,
  diagnosticoNosologico: null,
  cortoPlazo: null,
  medianoPlazo: null,
  largoPlazo: null,
  tratamientoFisioterapeutico: null,
  sugerencias: null,
  pronostico: null
})

const customResponses = reactive({})

const subPreguntas = reactive({
  que: '',
  como: '',
  cuando: '',
  actual: ''
})

const listaPruebas = [
  'Radiografías',
  'Tomografía computarizada',
  'Resonancia magnética',
  'Gammagrafía ósea',
  'Ecografía',
  'Electromiografía',
  'Pruebas de laboratorio',
  'Dinamometría isocinética'
]
const pruebasSeleccionadas = ref([])
const pruebasNotasAdicionales = ref('')

const tratamientoPlazos = reactive({
  corto: '',
  mediano: '',
  largo: ''
})

const orderedSections = computed(() => [...sectionList.value].sort((a, b) => a.orden - b.orden))

const parsePadecimientoActual = (value) => {
  if (!value || typeof value !== 'string') return
  const m1 = value.match(/1\.\s*¿Qué sucedió\?:\s*(.*)/)
  const m2 = value.match(/2\.\s*¿Cómo sucedió\?:\s*(.*)/)
  const m3 = value.match(/3\.\s*¿Cuándo sucedió\?:\s*(.*)/)
  const m4 = value.match(/4\.\s*Estado actual:\s*(.*)/)
  subPreguntas.que = m1?.[1] || ''
  subPreguntas.como = m2?.[1] || ''
  subPreguntas.cuando = m3?.[1] || ''
  subPreguntas.actual = m4?.[1] || ''
}

const parseEstudiosComplementarios = (value) => {
  if (!value || typeof value !== 'string') return
  const [lista, notas] = value.split('\nNotas extra:')
  pruebasSeleccionadas.value = (lista || '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean)
  pruebasNotasAdicionales.value = (notas || '').trim()
}

const parseTratamientoFisioterapeutico = (value) => {
  if (!value || typeof value !== 'string') return
  const corto = value.match(/Corto plazo:\s*(.*)/)
  const mediano = value.match(/Mediano plazo:\s*(.*)/)
  const largo = value.match(/Largo plazo:\s*(.*)/)
  tratamientoPlazos.corto = corto?.[1] || ''
  tratamientoPlazos.mediano = mediano?.[1] || ''
  tratamientoPlazos.largo = largo?.[1] || ''
}

const applyInitialData = () => {
  if (!props.initialData) return

  const data = props.initialData

  Object.keys(datosDiagnostico).forEach((key) => {
    if (data[key] !== undefined) {
      datosDiagnostico[key] = data[key]
    }
  })

  parsePadecimientoActual(data.padecimientoActual)
  parseEstudiosComplementarios(data.estudiosComplementarios)
  parseTratamientoFisioterapeutico(data.tratamientoFisioterapeutico)

  const secciones = Array.isArray(data.seccionesDinamicas) ? data.seccionesDinamicas : []
  secciones.forEach((section) => {
    if (!section || section.esSistema) return
    setCustomValue(section.clave, section.respuesta ?? null)
  })
}

const normalizeSection = (item, index) => ({
  clave: item.clave,
  titulo: item.titulo,
  tipoRespuesta: item.tipoRespuesta || 'text',
  esObligatoria: !!item.esObligatoria,
  esSistema: !!item.esSistema,
  activa: item.activa !== false,
  orden: item.orden ?? index + 1,
  placeholder: item.placeholder || '',
  opciones: Array.isArray(item.opciones) ? item.opciones : []
})

const normalizeOrder = () => {
  sectionList.value = orderedSections.value.map((section, index) => ({ ...section, orden: index + 1 }))
}

const parseOptionsText = (text) => text
  .split('\n')
  .map(x => x.trim())
  .filter(Boolean)

const getSystemValue = (clave) => datosDiagnostico[clave]

const setSystemValue = (clave, value) => {
  datosDiagnostico[clave] = value
}

const getCustomValue = (clave) => customResponses[clave]

const setCustomValue = (clave, value) => {
  customResponses[clave] = value
}

const clearSectionData = (section) => {
  if (section.esSistema) {
    if (section.clave === 'padecimientoActual') {
      subPreguntas.que = ''
      subPreguntas.como = ''
      subPreguntas.cuando = ''
      subPreguntas.actual = ''
    } else if (section.clave === 'estudiosComplementarios') {
      pruebasSeleccionadas.value = []
      pruebasNotasAdicionales.value = ''
    } else if (section.clave === 'tratamientoFisioterapeutico') {
      tratamientoPlazos.corto = ''
      tratamientoPlazos.mediano = ''
      tratamientoPlazos.largo = ''
    } else {
      setSystemValue(section.clave, null)
    }
    return
  }

  setCustomValue(section.clave, null)
}

const persistSectionStructure = async () => {
  isSavingStructure.value = true
  normalizeOrder()
  const payload = sectionList.value.map((section) => ({
    clave: section.clave,
    titulo: section.titulo,
    tipoRespuesta: section.tipoRespuesta,
    esObligatoria: section.esObligatoria,
    esSistema: section.esSistema,
    activa: section.activa,
    orden: section.orden,
    placeholder: section.placeholder,
    opciones: section.opciones || []
  }))

  await pacientesCommand.saveDiagnosticoFormSections(payload)
  isSavingStructure.value = false
}

const loadSections = async () => {
  const response = await pacientesQueries.getDiagnosticoFormSections()

  if (!response || response.length === 0) {
    sectionList.value = defaultSections.map((item, index) => normalizeSection(item, index))
    return
  }

  sectionList.value = response.map((item, index) => normalizeSection({
    clave: item.clave,
    titulo: item.titulo,
    tipoRespuesta: item.tipoRespuesta,
    esObligatoria: item.esObligatoria,
    esSistema: item.esSistema,
    activa: item.activa,
    orden: item.orden,
    placeholder: item.placeholder,
    opciones: item.opciones
  }, index))
}

const buildDynamicSectionsPayload = () => orderedSections.value
  .filter(section => section.activa)
  .map(section => ({
    clave: section.clave,
    titulo: section.titulo,
    tipoRespuesta: section.tipoRespuesta,
    esObligatoria: section.esObligatoria,
    esSistema: section.esSistema,
    orden: section.orden,
    respuesta: section.esSistema ? getSystemValue(section.clave) : getCustomValue(section.clave)
  }))

const resetModal = () => {
  sectionModal.titulo = ''
  sectionModal.tipoRespuesta = 'text'
  sectionModal.esObligatoria = false
  sectionModal.activa = true
  sectionModal.placeholder = ''
  sectionModal.opcionesTexto = ''
  editingSectionKey.value = null
}

const openCreateModal = () => {
  resetModal()
  modalOpen.value = true
}

const openEditModal = (section) => {
  editingSectionKey.value = section.clave
  sectionModal.titulo = section.titulo
  sectionModal.tipoRespuesta = section.tipoRespuesta
  sectionModal.esObligatoria = section.esObligatoria
  sectionModal.activa = section.activa
  sectionModal.placeholder = section.placeholder || ''
  sectionModal.opcionesTexto = (section.opciones || []).join('\n')
  modalOpen.value = true
}

const applyModalToSection = async () => {
  if (!sectionModal.titulo.trim()) {
    return false
  }

  const opciones = ['select', 'radio', 'checkbox'].includes(sectionModal.tipoRespuesta)
    ? parseOptionsText(sectionModal.opcionesTexto)
    : []

  if (editingSectionKey.value) {
    const index = sectionList.value.findIndex(x => x.clave === editingSectionKey.value)
    if (index >= 0) {
      const old = sectionList.value[index]
      sectionList.value[index] = {
        ...old,
        titulo: sectionModal.titulo.trim(),
        tipoRespuesta: old.esSistema ? old.tipoRespuesta : sectionModal.tipoRespuesta,
        esObligatoria: sectionModal.esObligatoria,
        activa: sectionModal.activa,
        placeholder: sectionModal.placeholder,
        opciones
      }
    }
  } else {
    const newKey = `custom_${Date.now()}`
    sectionList.value.push({
      clave: newKey,
      titulo: sectionModal.titulo.trim(),
      tipoRespuesta: sectionModal.tipoRespuesta,
      esObligatoria: sectionModal.esObligatoria,
      esSistema: false,
      activa: sectionModal.activa,
      orden: sectionList.value.length + 1,
      placeholder: sectionModal.placeholder,
      opciones
    })
    setCustomValue(newKey, sectionModal.tipoRespuesta === 'checkbox' ? [] : null)
  }

  await persistSectionStructure()
  return true
}

const saveSection = async () => {
  const ok = await applyModalToSection()
  if (!ok) return
  modalOpen.value = false
  resetModal()
}

const saveAndAddSection = async () => {
  const ok = await applyModalToSection()
  if (!ok) return
  resetModal()
}

const moveSection = async (index, direction) => {
  const target = index + direction
  if (target < 0 || target >= orderedSections.value.length) return

  const copy = [...orderedSections.value]
  const current = copy[index]
  copy[index] = copy[target]
  copy[target] = current

  sectionList.value = copy.map((item, idx) => ({ ...item, orden: idx + 1 }))
  await persistSectionStructure()
}

const deleteSection = async (section) => {
  sectionList.value = sectionList.value.filter(x => x.clave !== section.clave)
  clearSectionData(section)
  await persistSectionStructure()
}

const toggleCheckboxValue = (section, option) => {
  const current = Array.isArray(getCustomValue(section.clave)) ? [...getCustomValue(section.clave)] : []
  const idx = current.indexOf(option)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(option)
  setCustomValue(section.clave, current)
}

const handleImageUpload = (section, event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const result = String(reader.result || '')
    const [, base64] = result.split(',')
    setCustomValue(section.clave, {
      nombre: file.name,
      tipoContenido: file.type,
      contenidoBase64: base64 || ''
    })
  }
  reader.readAsDataURL(file)
}

watch(subPreguntas, () => {
  datosDiagnostico.padecimientoActual =
    `1. ¿Qué sucedió?: ${subPreguntas.que || ''}\n` +
    `2. ¿Cómo sucedió?: ${subPreguntas.como || ''}\n` +
    `3. ¿Cuándo sucedió?: ${subPreguntas.cuando || ''}\n` +
    `4. Estado actual: ${subPreguntas.actual || ''}`
}, { deep: true })

watch([pruebasSeleccionadas, pruebasNotasAdicionales], () => {
  const seleccion = pruebasSeleccionadas.value.join(', ')
  const notas = pruebasNotasAdicionales.value ? `\nNotas extra: ${pruebasNotasAdicionales.value}` : ''
  datosDiagnostico.estudiosComplementarios = seleccion + notas
})

watch(tratamientoPlazos, () => {
  datosDiagnostico.tratamientoFisioterapeutico =
    `Corto plazo: ${tratamientoPlazos.corto || ''}\n` +
    `Mediano plazo: ${tratamientoPlazos.mediano || ''}\n` +
    `Largo plazo: ${tratamientoPlazos.largo || ''}`
}, { deep: true })

watch([datosDiagnostico, sectionList, customResponses], () => {
  emit('datosDiagnostico', {
    ...datosDiagnostico,
    seccionesDinamicas: buildDynamicSectionsPayload()
  })
}, { deep: true })

onMounted(async () => {
  await loadSections()
  applyInitialData()
})
</script>

<template>
  <div class="flex flex-col gap-2 text-sm">
    <section class="rounded-sm border shadow p-3 bg-blue-50 flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-700">Constructor de secciones</h3>
        <p class="text-xs text-gray-500">Edita, ordena, elimina y agrega nuevas secciones del formulario.</p>
      </div>
      <button class="button-primary" @click="openCreateModal">Agregar sección</button>
    </section>

    <section v-for="(section, index) in orderedSections" :key="section.clave" class="rounded-sm border shadow" v-show="section.activa">
      <details open class="group">
        <summary class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-4 py-3 telefono:text-center cursor-pointer gap-2">
          <span>{{ section.titulo }}</span>
          <span v-if="section.esObligatoria" class="text-blue-600">*</span>
          <div class="ml-auto flex items-center gap-1" @click.stop>
            <button class="px-2 py-1 text-xs border rounded bg-white" :disabled="index===0 || isSavingStructure" @click="moveSection(index, -1)">↑</button>
            <button class="px-2 py-1 text-xs border rounded bg-white" :disabled="index===orderedSections.length-1 || isSavingStructure" @click="moveSection(index, 1)">↓</button>
            <button class="px-2 py-1 text-xs border rounded bg-white" @click="openEditModal(section)">Editar</button>
            <button class="px-2 py-1 text-xs border rounded bg-red-50 text-red-600" @click="deleteSection(section)">Eliminar</button>
          </div>
        </summary>

        <div class="px-6 py-3">
          <template v-if="section.clave === 'padecimientoActual'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">1. ¿Qué sucedió?</label>
                <textarea v-model="subPreguntas.que" rows="2" class="input-primary w-full resize-none" placeholder="Describa el suceso..."></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">2. ¿Cómo sucedió?</label>
                <textarea v-model="subPreguntas.como" rows="2" class="input-primary w-full resize-none" placeholder="Mecanismo de lesión..."></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">3. ¿Cuándo sucedió?</label>
                <input type="text" v-model="subPreguntas.cuando" class="input-primary w-full" placeholder="Fecha o tiempo aproximado" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">4. ¿Cómo se encuentra actualmente?</label>
                <textarea v-model="subPreguntas.actual" rows="2" class="input-primary w-full resize-none" placeholder="Estado actual..."></textarea>
              </div>
            </div>
          </template>

          <template v-else-if="section.clave === 'estudiosComplementarios'">
            <p class="mb-3 text-xs text-gray-500">Seleccione las pruebas a realizar:</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <div v-for="prueba in listaPruebas" :key="prueba" class="flex items-center">
                <input type="checkbox" :id="`prueba-${prueba}`" :value="prueba" v-model="pruebasSeleccionadas"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
                <label :for="`prueba-${prueba}`" class="ml-2 text-sm font-medium text-gray-900 cursor-pointer select-none">{{ prueba }}</label>
              </div>
            </div>
            <label class="block text-xs font-bold text-gray-500 mb-1">Otras pruebas o notas:</label>
            <textarea v-model="pruebasNotasAdicionales" class="input-primary resize-none h-20"
              placeholder="Ingrese otras pruebas especiales o notas adicionales..."></textarea>
          </template>

          <template v-else-if="section.clave === 'tratamientoFisioterapeutico'">
            <div class="text-gray-500 flex flex-col gap-3">
              <div>
                <label class="block mb-2 font-medium text-xs tracking-wide">Corto plazo</label>
                <textarea v-model="tratamientoPlazos.corto" class="input-primary resize-none" placeholder="Tratamiento a corto plazo..."></textarea>
              </div>
              <div>
                <label class="block mb-2 font-medium text-xs tracking-wide">Mediano plazo</label>
                <textarea v-model="tratamientoPlazos.mediano" class="input-primary resize-none" placeholder="Tratamiento a mediano plazo..."></textarea>
              </div>
              <div>
                <label class="block mb-2 font-medium text-xs tracking-wide">Largo plazo</label>
                <textarea v-model="tratamientoPlazos.largo" class="input-primary resize-none" placeholder="Tratamiento a largo plazo..."></textarea>
              </div>
            </div>
          </template>

          <template v-else-if="section.esSistema">
            <textarea v-if="section.tipoRespuesta === 'textarea'" v-model="datosDiagnostico[section.clave]" class="input-primary resize-none" :placeholder="section.placeholder"></textarea>
            <input v-else :type="section.tipoRespuesta === 'number' ? 'number' : section.tipoRespuesta === 'date' ? 'date' : 'text'" v-model="datosDiagnostico[section.clave]" class="input-primary" :placeholder="section.placeholder" />
          </template>

          <template v-else>
            <textarea v-if="section.tipoRespuesta === 'textarea'" :value="getCustomValue(section.clave) || ''" @input="setCustomValue(section.clave, $event.target.value)" class="input-primary resize-none" :placeholder="section.placeholder"></textarea>
            <input v-else-if="section.tipoRespuesta === 'text'" type="text" :value="getCustomValue(section.clave) || ''" @input="setCustomValue(section.clave, $event.target.value)" class="input-primary" :placeholder="section.placeholder" />
            <input v-else-if="section.tipoRespuesta === 'number'" type="number" :value="getCustomValue(section.clave) || ''" @input="setCustomValue(section.clave, $event.target.value)" class="input-primary" :placeholder="section.placeholder" />
            <input v-else-if="section.tipoRespuesta === 'date'" type="date" :value="getCustomValue(section.clave) || ''" @input="setCustomValue(section.clave, $event.target.value)" class="input-primary" />

            <select v-else-if="section.tipoRespuesta === 'select'" class="input-primary" :value="getCustomValue(section.clave) || ''" @change="setCustomValue(section.clave, $event.target.value)">
              <option value="">Seleccione una opción</option>
              <option v-for="option in section.opciones" :key="option" :value="option">{{ option }}</option>
            </select>

            <div v-else-if="section.tipoRespuesta === 'radio'" class="flex flex-col gap-2">
              <label v-for="option in section.opciones" :key="option" class="flex items-center gap-2">
                <input type="radio" :name="section.clave" :checked="getCustomValue(section.clave) === option" @change="setCustomValue(section.clave, option)" />
                <span>{{ option }}</span>
              </label>
            </div>

            <div v-else-if="section.tipoRespuesta === 'checkbox'" class="flex flex-col gap-2">
              <label v-for="option in section.opciones" :key="option" class="flex items-center gap-2">
                <input type="checkbox" :checked="Array.isArray(getCustomValue(section.clave)) && getCustomValue(section.clave).includes(option)" @change="toggleCheckboxValue(section, option)" />
                <span>{{ option }}</span>
              </label>
            </div>

            <div v-else-if="section.tipoRespuesta === 'image'" class="flex flex-col gap-3">
              <input type="file" accept="image/*" @change="handleImageUpload(section, $event)" class="input-primary" />
              <div v-if="getCustomValue(section.clave)" class="border rounded p-2 bg-gray-50">
                <p class="text-xs text-gray-600">{{ getCustomValue(section.clave).nombre }}</p>
                <img :src="`data:${getCustomValue(section.clave).tipoContenido};base64,${getCustomValue(section.clave).contenidoBase64}`" class="mt-2 max-h-40 rounded" />
              </div>
            </div>
          </template>
        </div>
      </details>
    </section>

    <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4" @click.self="modalOpen=false">
      <div class="bg-white rounded shadow-lg w-full max-w-xl p-4 flex flex-col gap-3">
        <h3 class="font-semibold text-lg">{{ editingSectionKey ? 'Editar sección' : 'Nueva sección' }}</h3>

        <div>
          <label class="block text-sm mb-1">Título</label>
          <input v-model="sectionModal.titulo" class="input-primary" placeholder="Ej. Escala de dolor subjetiva" />
        </div>

        <div>
          <label class="block text-sm mb-1">Tipo de respuesta</label>
          <select v-model="sectionModal.tipoRespuesta" class="input-primary" :disabled="!!editingSectionKey && orderedSections.find(x => x.clave === editingSectionKey)?.esSistema">
            <option v-for="type in responseTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">Placeholder</label>
          <input v-model="sectionModal.placeholder" class="input-primary" placeholder="Texto de ayuda" />
        </div>

        <div v-if="['select','radio','checkbox'].includes(sectionModal.tipoRespuesta)">
          <label class="block text-sm mb-1">Opciones (una por línea)</label>
          <textarea v-model="sectionModal.opcionesTexto" class="input-primary resize-none h-28" placeholder="Opción 1\nOpción 2\nOpción 3"></textarea>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="sectionModal.esObligatoria" />
            Respuesta obligatoria
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="sectionModal.activa" />
            Sección activa
          </label>
        </div>

        <div class="flex justify-end gap-2">
          <button class="px-3 py-2 border rounded" @click="modalOpen = false">Cancelar</button>
          <button v-if="!editingSectionKey" class="px-3 py-2 border rounded bg-blue-50" @click="saveAndAddSection">Guardar y agregar</button>
          <button class="button-primary" @click="saveSection">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>
