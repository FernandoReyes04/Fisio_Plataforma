<script setup>
import ApexCharts from 'apexcharts'
import { onMounted, ref } from 'vue'
import { graficos } from "@/api/graficos/charts.js"

const citasStats = ref({})
const chartCitas = ref(null)
let citasPendientes = ref(null)
const loader = ref(true)

onMounted(() => {
    getEstadisticas()
})

const getEstadisticas = async () => {
    let response = await graficos.estadosCitas()
    console.log(response)
    citasStats.value = response
    citasPendientes.value = response.pendientes
    loader.value = false
    initializeChart()
}

const initializeChart = () => {
    if (chartCitas.value && typeof ApexCharts !== 'undefined') {
        const chart = new ApexCharts(chartCitas.value, getChartOptions())
        chart.render()
    }
}

const getChartOptions = () => {
    const { concluidados, inasistencias, cancelados, pendientes, total } = citasStats.value

    var max = total - pendientes

    const porcentajeConcluidos = (concluidados / max) * 100
    const porcentajeInasistencias = (inasistencias / max) * 100
    const porcentajeCancelados = (cancelados / max) * 100

    return {
        series: [porcentajeConcluidos, porcentajeInasistencias, porcentajeCancelados],
        colors: ["#1C64F2", "#ffbe0b", "#e63946"],
        chart: {
            height: 320,
            width: 300,
            type: "pie",
        },
        stroke: {
            colors: ["white"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                labels: {
                    show: true,
                },
                size: "100%",
                dataLabels: {
                    offset: -25
                }
            },
        },
        labels: ["Concluidas", "Inasistidas", "Canceladas"],
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: "Inter, sans-serif",
            },
            formatter: function (val) {
                return val.toFixed(1) + "%"
            },
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val.toFixed(2) + "%"
                }
            }
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value + "%"
                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return value + "%"
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    }
}
</script>

<template>
    <div class="rounded-sm border border-blue-50 shadow telefono:w-full flex-shrink-0 flex flex-col">
            <h2 class="text-lg mb-6 shadow-lg rounded-t-sm font-semibold p-2 bg-blue-600 text-white w-full text-center top-0">
                Estados de las citas
                <p class="text-sm text-cyan-100 font-normal">Distribución del mes</p>
            </h2>
        <!-- Loader mientras se cargan los datos -->
        <div v-show="loader" class="animate-pulse h-[280px] w-[280px] bg-gray-200 rounded-full mt-8"></div>

        <!-- Gráfico cuando los datos están listos -->
        <div v-show="!loader" class="pb-2" ref="chartCitas"></div>

        <p v-show="!loader" class="text-gray-600 font-semibold text-center text-sm pb-3">
            Citas pendientes: <span class="text-blue-600">{{ citasPendientes }}</span>
        </p>
    </div>
</template>

<style scoped>
</style>
