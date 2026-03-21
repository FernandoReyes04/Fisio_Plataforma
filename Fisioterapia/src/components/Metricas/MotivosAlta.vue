<script setup>
import ApexCharts from 'apexcharts'
import {onMounted, ref, watch} from 'vue'
import { graficos } from "@/api/graficos/charts.js";

let altasChart = ref(null)
let chartIntance = ref(null)
let motivosAlta = ref([])
let mes = ref(6)
let desercion = ref('')
let maximo = ref('')
let fallecimiento = ref('')
let finalizacion = ref('')
let loader = ref(false)

let chartData = ref({
  series: [],
  labels: []
})

var colores = []

onMounted(() => {
  obtenerDatos()
})

watch(mes, () => {
  obtenerDatos(mes);
})

const obtenerDatos = async () => {
  loader.value = true
  const response = await graficos.motivosAlta(mes.value)
  motivosAlta.value = response

  // Actualizar los datos del gráfico con los nombres y totales dinámicos
  const series = motivosAlta.value.map(motivo => motivo.total);
  const labels = motivosAlta.value.map(motivo => motivo.nombre);

  motivosAlta.value.forEach(motivo => {
    if (motivo.nombre === 'Deserción') {
      desercion.value = motivo.total
    } else if (motivo.nombre === 'Máxima funcionalidad') {
      maximo.value = motivo.total
    } else if (motivo.nombre === 'Fallecimiento') {
      fallecimiento.value = motivo.total
    } else if (motivo.nombre === 'Finalización de tratamiento') {
      finalizacion.value = motivo.total
    }
  })

  for (let i = 0; i < response.length; i++) {
      switch (response[i].nombre) {
        case 'Deserción':
          colores.push("#FDBA8C")
          break;
        case 'Finalización de tratamiento':
          colores.push("#1C64F2")
          break;
        case 'Fallecimiento':
          colores.push("#ce79e8")
          break;
        case 'Máxima funcionalidad':
          colores.push("#16bdca")
          break;
      }
  }
  // Actualizar chartData con los datos dinámicos
  chartData.value.series = series;
  chartData.value.labels = labels;

  iniciarGrafico(); // Renderizar el gráfico con los nuevos datos
  loader.value = false
}

const iniciarGrafico = () => {
  if (chartIntance && typeof chartIntance.destroy === 'function') {
    chartIntance.destroy() // Destruye el gráfico anterior solo si ya existe
  }
  if (altasChart.value && typeof ApexCharts !== 'undefined') {
    chartIntance = new ApexCharts(altasChart.value, getChartOptions());
    chartIntance.render();
  }
}

const getChartOptions = () => {
  return {
    series: chartData.value.series,
    colors: colores,
    chart: {
      height: 300,
      width: "100%",
      type: "donut",
    },
    stroke: {
      colors: ["transparent"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: 20,
            },
            total: {
              showAlways: true,
              show: true,
              label: "Altas",
              fontFamily: "Inter, sans-serif",
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return sum;
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              formatter: function (value) {
                return value;
              },
            },
          },
          size: "80%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels: chartData.value.labels,  // Usar los labels dinámicos
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value;
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return value;
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
  };
}
</script>

<template>

    <div class="w-full p-4 md:p-6">
        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div class="grid grid-cols-3 gap-3 mb-2">
                <dl class="bg-orange-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                    <dt class="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-500 text-orange-600 dark:text-orange-300 text-sm font-medium flex items-center justify-center mb-1">{{ desercion }}</dt>
                    <dd class="text-orange-600 dark:text-orange-300 text-sm font-medium">Deserción</dd>
                </dl>
                <dl class="bg-teal-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                    <dt class="w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-500 text-teal-600 dark:text-teal-300 text-sm font-medium flex items-center justify-center mb-1">{{ maximo }}</dt>
                    <dd class="text-teal-600 dark:text-teal-300 text-sm font-medium">Máxima funcionalidad</dd>
                </dl>
              <dl class="bg-pink-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                <dt class="w-8 h-8 rounded-full bg-pink-100 dark:bg-gray-500 text-pink-600 dark:text-pink-300 text-sm font-medium flex items-center justify-center mb-1"> {{ fallecimiento }}</dt>
                <dd class="text-pink-600 dark:text-blue-300 text-sm font-medium">Fallecimiento</dd>
              </dl>
                <dl class="bg-blue-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                    <dt class="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-500 text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center justify-center mb-1"> {{ fallecimiento }}</dt>
                    <dd class="text-blue-600 dark:text-blue-300 text-sm font-medium">Finalización</dd>
                </dl>
            </div>
        </div>
        <!-- Donut Chart -->
        <div class="py-6" ref="altasChart"></div>

        <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
            <div class="flex justify-between items-center pt-5">
                <!-- Button -->
              <div class="flex gap-2 items-center">
                <select class="border-none text-gray-600 rounded-sm cursor-pointer text-sm" v-model="mes">
                  <option value= 6 >Últimos 6 meses</option>
                  <option value= 3 >Últimos 3 meses</option>
                  <option value= 1 >Último mes</option>
                </select>
                <svg v-if="loader" aria-hidden="true" class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>