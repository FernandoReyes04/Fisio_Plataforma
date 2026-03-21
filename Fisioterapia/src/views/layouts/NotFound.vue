<script setup>

</script>

<template>
    <div class="w-screen h-screen flex justify-center items-center flex-col">
        <h1 class="not-found-title">404</h1>
        <p class="not-found-message">Lo sentimos, la página que buscas no existe.</p>
        <router-link :to="{name: 'login'}" class="btnStyle text-white bg-principal">Volver al inicio</router-link>
    </div>
</template>

<style scoped>
.not-found-title {
    font-size: 6rem;
    color: #0d6efd ; /* Color de texto principal */
    margin-bottom: 1rem;
}

.btnStyle{
    margin-top: 20px;
    padding: 10px 20px;
    border-radius: 3px;
}
</style>