<script setup>
import {onMounted, ref, watch} from 'vue'
import ApexCharts from 'apexcharts'
import {graficos} from "@/api/graficos/charts.js";

let chartEdad = ref(null)
let chartInstance = ref(null)
let joven = ref(null)
let adulto = ref(null)
let promedio = ref(null)
let mes = ref(6)
let loader = ref(false)
let chartData = ref({
  series: [],
  categories: []
})

onMounted(() => {
    recibirDatos()
})

watch(mes, () => {
  recibirDatos(mes)
})

const recibirDatos = async () =>{
  loader.value = true
  let response = await graficos.edadesPacientes(mes.value)
  joven.value = response.menor
  adulto.value = response.mayor
  promedio.value = response.promedio
  chartData.value.categories = response.mes.map(item => item.mes)
  chartData.value.series = response.mes.map(item => item.promedio)
  initializeChart()
  loader.value = false
}

const initializeChart = () => {
  if (chartInstance && typeof chartInstance.destroy === 'function') {
    chartInstance.destroy() // Destruye el gráfico anterior solo si ya existe
  }
  if (chartEdad.value && typeof ApexCharts !== 'undefined') {
    chartInstance = new ApexCharts(chartEdad.value, {
      ...options,  // Usa las opciones existentes
      series: [{
        name: 'Edad promedio',
        data: chartData.value.series,
        color: '#1C64F2'
      }],
      xaxis: {
        ...options.xaxis,
        categories: chartData.value.categories
      }
    })
    chartInstance.render()
  }
}

const options = {
    chart: {
        sparkline: {
            enabled: false
        },
        type: 'bar',
        width: '100%',
        height: 250,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,
            columnWidth: '100%',
            borderRadiusApplication: 'end',
            borderRadius: 6,
            dataLabels: {
                position: 'top'
            }
        }
    },
    legend: {
        show: true,
        position: 'bottom'
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        shared: true,
        intersect: false,
        formatter: function(value) {
            return value
        }
    },
    xaxis: {
        labels: {
            show: true,
            style: {
                fontFamily: 'Inter, sans-serif',
                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
            },
            formatter: function(value) {
                return value
            }
        },
        axisTicks: {
            show: false
        },
        axisBorder: {
            show: false
        }
    },
    yaxis: {
        labels: {
            show: true,
            style: {
                fontFamily: 'Inter, sans-serif',
                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
            }
        }
    },
    grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
            left: 2,
            right: 2,
            top: -20
        }
    },
    fill: {
        opacity: 1
    }
}

</script>

<template>

    <div class="w-full rounded-lg p-4 md:p-6">
        <div class="grid grid-cols-3 py-3">
            <dl>
                <dt class="text-base font-normal text-gray-500 pb-1">Más joven</dt>
                <dd class="leading-none text-xl font-bold text-blue-500">{{ joven }} años</dd>
            </dl>
            <dl>
                <dt class="text-base font-normal text-gray-500 pb-1">Más adulto</dt>
                <dd class="leading-none text-xl font-bold text-blue-800">{{ adulto }} años</dd>
            </dl>
            <span
                class="bg-blue-100 text-blue-800 font-medium inline-flex justify-center items-center px-2.5 py-1 rounded-sm">
                    Edad promedio: {{ promedio }}
            </span>
        </div>

        <div ref="chartEdad"></div>
        <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
            <div class="flex justify-between items-center pt-5">
                <!-- Button -->
              <div class="flex gap-2 items-center">
                <select class="border-none text-gray-600 rounded-sm cursor-pointer text-sm" v-model="mes">
                  <option value = 6 >Ultimos 6 meses</option>
                  <option value = 3 >Ultimos 3 meses</option>
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