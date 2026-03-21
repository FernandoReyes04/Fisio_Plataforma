<script setup>
import ApexCharts from 'apexcharts'
import {onMounted, ref, watch} from 'vue'
import {graficos} from "@/api/graficos/charts.js";

let sexoChart = ref(null)
let chartInstance = ref(null)
let hombres = ref(null)
let mujeres = ref(null)
let mes = ref(0)
let loader = ref(false)

onMounted(()=>{
  recibirDatos()
})

watch(mes, () => {
  recibirDatos(mes);
})


const recibirDatos = async () =>{
  loader.value = true
  let response = await graficos.sexoPacientes(mes.value)
  console.log(response)
  hombres.value = response.masculino
  mujeres.value = response.feminino
  iniciarGrafico()
  loader.value = false
}
const iniciarGrafico = () =>{
  if (chartInstance && typeof chartInstance.destroy === 'function') {
    chartInstance.destroy() // Destruye el gráfico anterior solo si ya existe
  }
    if (sexoChart.value && typeof ApexCharts !== 'undefined') {
        chartInstance = new ApexCharts(sexoChart.value, getChartOptions());
        chartInstance.render();
    }
}

const getChartOptions = () => {
    return {
        series: [ mujeres.value, hombres.value],
        colors: ["#ffafcc", "#1C64F2"],
        chart: {
            height: 249,
            width: "100%",
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
        labels: ["Mujer", "Hombre"],
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        legend: {
            position: "left",
            offsetY: 100,
            offsetX: 50,
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
                    return value  + "%"
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

    <div class="w-full p-4 md:p-6">
        <!-- Line Chart -->
        <div class="py-6" ref="sexoChart"></div>

        <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
            <div class="flex justify-between items-center pt-5">
              <div class="flex gap-2 items-center">
                <select class="border-none text-gray-600 rounded-sm cursor-pointer text-sm" v-model="mes">
                  <option value= 0 >Total</option>
                  <option value= 6 >Ultimos 6 meses</option>
                  <option value= 3 >Ultimos 3 meses</option>
                  <option value= 1 >Ultimo mes</option>
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