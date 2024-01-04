<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FooterComponent from './FooterComponent.vue'

const route = useRoute()
const router = useRouter()

onMounted(() => {
    if(route.fullPath === '/error-404'){
        setTimeout(() => {
            router.push('/')
        }, 4500);
    }
})
</script>

<template>
    <div class="bg-blue-grey-9 text-white text-center q-pa-md flex flex-center">
        <div class="flex column error404">
            <div class="text404" style="font-size: 15vh">
                404
            </div>

            <div class="text-h4 text-white" style="opacity:.6">
                <p class="text-h6">Oops. Hubo un error al procesar la url!</p>
                <p class="text-body2">Debes estar Registrado y Logueado con tus credenciales para contactarnos.</p>
            </div>
        </div>
    </div>

    <FooterComponent />
</template>


<style lang="scss">
.error404{
    min-height: 59vh;

    .text404{
        padding-top: 7rem;
    }
}
</style>