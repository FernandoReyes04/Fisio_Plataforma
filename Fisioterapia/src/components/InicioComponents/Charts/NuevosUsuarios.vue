<script setup>
import { onMounted, ref } from 'vue'
import ApexCharts from 'apexcharts'
import { graficos } from "@/api/graficos/charts.js";

let chartRef = ref(null)
let diasSemana = ref({})
let total = ref(null)
let porcentaje = ref('')
let chartLoaded = ref(false)

onMounted(() => {
    getEstadisticas()
})

const getEstadisticas = async () =>{
    let response = await graficos.nuevosPacientes()
    diasSemana.value = response.semana
    total.value = response.total
    porcentaje.value = response.porcentaje
    chartLoaded.value = true  // Indica que los datos ya están cargados
    initializeChart()
}

const initializeChart = () => {
    const categories = Object.keys(diasSemana.value)
    const seriesData = Object.values(diasSemana.value)

    const options = {
        chart: {
            height: 250,
            width: 300,
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            }
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shadeIntensity: 1,
                gradientToColors: ['#1C64F2'],
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 4,
            curve: 'smooth',
            colors: ['#1C64F2']
        },
        grid: {
            show: false,
            padding: {
                left: 2,
                right: 2,
                top: 0
            }
        },
        series: [
            {
                name: 'Nuevos pacientes',
                data: seriesData
            }
        ],
        xaxis: {
            categories: categories,
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            show: false
        }
    }

    if (chartRef.value && typeof ApexCharts !== 'undefined') {
        let chart = new ApexCharts(chartRef.value, options)
        chart.render()
    }
}
</script>

<template>
    <div class="rounded-sm border border-blue-50 shadow p-6 telefono:w-full flex-shrink-0 flex flex-col items-center">
        <div class="flex justify-between mb-1 w-full">
            <div>
                <h5 class="leading-none text-2xl font-bold text-gray-900 pb-2">{{ total }}</h5>
                <p class="text-base font-normal text-gray-500">Pacientes esta semana</p>
            </div>
            <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-center" :class="{'text-green-500': porcentaje > 0, 'text-yellow-500': porcentaje <= 0}">
                {{ porcentaje + "%" }}
                <svg v-if="porcentaje > 0" class="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 10 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 13V1m0 0L1 5m4-4 4 4" />
                </svg>
                <svg v-else class="w-3 h-3 ms-1 rotate-180 text-yellow-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 10 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 13V1m0 0L1 5m4-4 4 4" />
                </svg>
            </div>
        </div>

        <!-- Loader que simula el gráfico -->
        <div v-show="!chartLoaded" class="w-[300px] h-full bg-gray-300 rounded-lg animate-pulse mb-3"></div>

        <!-- Gráfico real -->
        <div v-show="chartLoaded" ref="chartRef" class="mb-3"></div>
    </div>
</template>

<style scoped>
</style>
