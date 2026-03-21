<script setup>
import { onMounted, ref } from 'vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'

const lastPacientes = ref([])
const loader = ref(false)

onMounted(() => {
    ultimosPacientes()
})

const ultimosPacientes = async () => {
    loader.value = true
    lastPacientes.value = await pacientesQueries.getUltimosPacientes()
    loader.value = false
}
</script>

<template>
    <div class="animate-pulse" v-if="loader">
        <div class="px-6 py-4 bg-blue-300 mt-3 mb-3 rounded"></div>
        <div class="px-6 py-4 bg-gray-300 mb-5 rounded" v-for="load in 7"></div>
    </div>
    <div v-else class="overflow-x-auto rounded border shadow">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-base text-white bg-principal">
            <tr>
                <th scope="col" class="px-6 py-3 truncate">
                    Nombre del paciente
                </th>
                <th scope="col" class="px-6 py-3">
                    Edad
                </th>
                <th scope="col" class="px-6 py-3">
                    Sexo
                </th>
                <th scope="col" class="px-6 py-3">
                    Teléfono
                </th>
            </tr>
            </thead>

            <tbody>
            <tr class="bg-white border-b hover:bg-gray-100 cursor-pointer" v-for="pacientes in lastPacientes"
                :key="pacientes.id">
                <td class="px-6 py-4 tablet:p-4 laptop:p-4 font-medium text-gray-900 whitespace-nowrap">
                    {{ pacientes.nombre }}
                </td>
                <td class="px-6 py-4 tablet:p-4 laptop:p-4 ">
                    {{ pacientes.edad }} años
                </td>
                <td class="px-6 py-4 tablet:p-4 laptop:p-4 ">
                    {{ pacientes.sexo }}
                </td>
                <td class="px-6 py-4 tablet:p-4 laptop:p-4 ">
                    {{ pacientes.telefono }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>

</style>