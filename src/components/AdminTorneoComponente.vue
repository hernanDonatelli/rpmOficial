<script setup>
import { onMounted, ref } from 'vue';
import { useApiStore } from 'src/stores/api';

onMounted(async () => {
    await useApi.getPlataformas(JSON.parse(localStorage.getItem('token')))
    // const tokenStorage = localStorage.getItem('token')
    // console.log(tokenStorage)
    // if(tokenStorage){
    //     const usuario = useApi.getUser(tokenStorage)
    //     console.log(usuario)

    // }
    // useApi.loginApi()
})

const useApi = useApiStore()

const nombre = ref(null)
const plataforma = ref(null)
const puntosClasifica = ref(null)
const puntosCarreraCorta = ref(null)
const puntosCarrera = ref(null)
const imagen = ref([])
const editNombre = ref(null)
const editPlataforma = ref(null)
const editPuntosClasifica = ref(null)
const editPuntosCarreraCorta = ref(null)
const editPuntosCarrera = ref(null)
const editImagen = ref(null)

const crearTorneo = async () => {

    const formData = new FormData(formulario)
    
    useApi.createTorneoApi(useApi.tokenApi, formData)
}

const editarTorneo = () => {

}

const onReset = () => {
    nombre.value = null;
    plataforma.value = null;
    puntosClasifica.value = null;
    puntosCarreraCorta.value = null;
    puntosCarrera.value = null;
    imagen.value = null;
};

</script>

<template>
    <h4 class="text-uppercase text-center q-mt-xl q-mb-lg">Administrar Torneos</h4>

    <div class="row flex justify-around q-mb-xl">

        <!-- Formulario de Creacion de Torneo -->
        <div class="col-4">
            <h5 class="text-uppercase q-mt-none">Crear Torneo</h5>
            <q-form id="formulario" method="POST" enctype="multipart/form-data" @submit.prevent="crearTorneo"
                @reset="onReset" class="q-gutter-md">

                <div class="form-group">
                    <q-select filled dense name="plataforma" v-model="plataforma" :options="useApi.plataformas"
                        hint="Seleccionar una opción" label="Plataforma" />

                </div>
                <div class="form-group">
                    <q-input filled dense name="nombre" v-model="nombre" label="Nombre de Torneo" hint="Texto y numeros" />

                </div>

                <div class="form-group">
                    <q-input filled dense name="puntosClasifica" v-model="puntosClasifica" label="Puntos de Qualy"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense name="puntosCarreraCorta" v-model="puntosCarreraCorta"
                        label="Puntos de Series/Carrera Corta" hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense name="puntosCarrera" v-model="puntosCarrera" label="Puntos de Carrera/Final"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-file filled dense bottom-slots name="imagen" v-model="imagen" label="Buscar imagen" counter
                        max-files="1">
                        <template v-slot:before>
                            <q-icon name="attachment" />
                        </template>

                        <template v-slot:append>
                            <q-icon v-if="imagen !== null" name="close" @click.stop.prevent="imagen = null"
                                class="cursor-pointer" />
                            <q-icon name="search" @click.stop.prevent />
                        </template>

                        <template v-slot:hint>
                            Formatos: .jpg .png
                        </template>
                    </q-file>
                </div>
                <q-btn type="submit" color="green-13" text-color="black" label="Crear Torneo" />
                <q-btn type="reset" color="red-13" text-color="white" label="Limpiar Campos" />
            </q-form>
        </div>

        <!-- Formulario de Edicion de Torneo -->
        <div class="col-4">
            <h5 class="text-uppercase q-mt-none">Editar Torneo</h5>
            <q-form method="POST" enctype="multipart/form-data" @submit.prevent="editarTorneo" @reset="onReset"
                class="q-gutter-md">
                <input type="hidden" name="idTorneo" id="idTorneo" />

                <div class="form-group">
                    <q-select filled dense v-model="editPlataforma" :options="useApi.plataformas"
                        hint="Seleccionar una opción" label="Plataforma" />

                </div>
                <div class="form-group">
                    <q-input filled dense v-model="editNombre" label="Nombre de Torneo" hint="Texto y numeros" />

                </div>

                <div class="form-group">
                    <q-input filled dense v-model="editPuntosClasifica" label="Puntos de Qualy"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense v-model="editPuntosCarreraCorta" label="Puntos de Series/Carrera Corta"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense v-model="editPuntosCarrera" label="Puntos de Carrera/Final"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-file filled dense bottom-slots v-model="editImagen" label="Buscar imagen" counter max-files="1">
                        <template v-slot:before>
                            <q-icon name="attachment" />
                        </template>

                        <template v-slot:append>
                            <q-icon v-if="imagen !== null" name="close" @click.stop.prevent="imagen = null"
                                class="cursor-pointer" />
                            <q-icon name="search" @click.stop.prevent />
                        </template>

                        <template v-slot:hint>
                            Formatos: .jpg .png
                        </template>
                    </q-file>
                </div>
                <q-btn color="grey-13" text-color="black" label="Cargar datos" />
                <q-btn color="green-13" text-color="black" label="Editar Torneo" />
            </q-form>
        </div>
    </div>
</template>


<style lang="scss" scoped></style>