<script setup>
import DenunciaComponente from 'src/components/DenunciaComponente.vue';
</script>

<template>
    <q-page>
        <div class="denuncias-container row justify-center items-center q-mt-xl">
            <DenunciaComponente />
        </div>
    </q-page>
</template>


<style lang="scss">
.denuncias-container{
    height: 100vh;
    margin-top: 0;
}
</style>