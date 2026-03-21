<script setup>
import EdadPacientes from '@/components/Metricas/EdadPacientes.vue';
import TopFisios from '@/components/Metricas/TopFisios.vue';
import MotivosAlta from '@/components/Metricas/MotivosAlta.vue'
import SexoPacientes from '@/components/Metricas/SexoPacientes.vue'
import NuevosUsuarios from '@/components/InicioComponents/Charts/NuevosUsuarios.vue'
import CitasChart from '@/components/InicioComponents/Charts/CitasChart.vue'
import Fisiotepeutas from '@/components/InicioComponents/Fisiotepeutas.vue'
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Columna 1 -->
        <div class="flex flex-col gap-4">
            <!-- Top 5 Fisioterapeutas -->
            <div class="bg-white border border-blue-50 shadow-sm rounded-sm">
                <h2 class="text-lg shadow-lg font-semibold mb-4 p-4 bg-blue-600 text-white">Fisioterapeutas del mes
                    <p class="text-sm text-cyan-100 font-normal">Los fisioterapeutas con más actividad en el mes</p>
                </h2>
                <div class="flex justify-center p-4">
                    <TopFisios />
                </div>
            </div>
            <!-- Motivos de Alta -->
            <div class="bg-white border border-blue-50 shadow-sm rounded-sm">
                <h2 class="text-lg shadow-lg font-semibold p-4 bg-blue-600 text-white">
                    Motivos de alta
                    <p class="text-sm text-cyan-100 font-normal">Distribución de los motivos de alta de los casos finalizados</p>
                </h2>
                <MotivosAlta/>
            </div>
        </div>

        <!-- Columna 2 -->
        <div class="flex flex-col gap-4">
            <!-- Gráfico de Edades -->
            <div class="bg-white border border-blue-50 shadow-sm rounded-sm">
                <h2 class="text-lg shadow-lg font-semibold p-4 bg-blue-600 text-white">Edades de los pacientes
                    <p class="text-sm text-cyan-100 font-normal">Promedio de edades por mes</p>
                </h2>
                <EdadPacientes />
            </div>


            <!-- Gráfico de Sexo -->
            <div class="bg-white border border-blue-50 shadow-sm rounded-sm">
                <h2 class="text-lg shadow-lg font-semibold p-4 bg-blue-600 text-white">Sexo de los pacientes
                    <p class="text-sm text-cyan-100 font-normal">Distribución del sexo de los pacientes</p>
                </h2>
                <SexoPacientes />
            </div>

            <div>
                <h2 class="text-lg shadow-lg font-semibold p-4 bg-blue-600 text-white">Pacientes de la semana
                    <p class="text-sm text-cyan-100 font-normal">Número de pacientes agregados en la semana</p>
                </h2>
                <NuevosUsuarios/>
            </div>
        </div>
    </div>
</template>
