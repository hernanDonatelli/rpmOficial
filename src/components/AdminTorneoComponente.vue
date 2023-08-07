<script setup>
import { onMounted, ref } from 'vue';
import { useApiStore } from 'src/stores/api';

onMounted(async () => {
    await useApi.getPlataformas(JSON.parse(localStorage.getItem('token')))

})

const useApi = useApiStore()

const selected = ref([])
const nombre = ref(null)
const plataforma = ref(null)
const puntosClasifica = ref(null)
const puntosCarreraCorta = ref(null)
const puntosCarrera = ref(null)
const imagen = ref([])
const idTorneo = ref(null)
let editNombre = ref(null)
let editPlataforma = ref(null)
let editPuntosClasifica = ref(null)
let editPuntosCarreraCorta = ref(null)
let editPuntosCarrera = ref(null)
let editStatus = ref(null)
const confirm = ref(false)

///////////////////////////////////////////////////////////////

//METODOS
const crearTorneo = async () => {

    const formData = new FormData(formulario)

    useApi.createTorneoApi(useApi.tokenApi, formData)
}


const cargarTorneo = () => {
    const datos = selected.value

    datos.forEach(item => {
        idTorneo.value = item.id
        editPlataforma.value = item.simulator
        editNombre.value = item.name
        editPuntosCarrera.value = item.racePoints
        editPuntosClasifica.value = item.qualyPoints
        editPuntosCarreraCorta.value = item.shortRacePoints
        editStatus = item.status
    });
}

const editarTorneo = () => {
    const newObj = {
        idTorneo: idTorneo.value,
        nombre: editNombre.value,
        plataforma: editPlataforma.value,
        puntosCarrera: editPuntosCarrera.value,
        puntosClasifica: editPuntosClasifica.value,
        puntosCarreraCorta: editPuntosCarreraCorta.value,
        status: editStatus
    }
    console.log(newObj);
    useApi.editTorneoApi(useApi.tokenApi, newObj)
}

const deleteTorneo = () => {
    const datos = selected.value

    datos.forEach(item => {
        useApi.deleteTorneoApi(useApi.tokenApi, item.id)
    });
}

const onReset = () => {
    nombre.value = null;
    plataforma.value = null;
    puntosClasifica.value = null;
    puntosCarreraCorta.value = null;
    puntosCarrera.value = null;
    imagen.value = null;
};

const columns = [
    { name: 'ID', required: true, label: 'ID', align: 'center', field: row => row.id, format: val => `${val}`, sortable: true },
    { name: 'nombre', align: 'center', label: 'Nombre', field: row => row.name },
    { name: 'plataforma', align: 'center', label: 'Plataforma', field: row => row.simulator },
    { name: 'puntosQualy', align: 'center', label: 'Ptos. Qualy', field: row => row.qualyPoints },
    { name: 'puntosCarreraCorta', align: 'center', label: 'Ptos. Serie/ShortRace', field: row => row.shortRacePoints },
    { name: 'puntosCarrera', align: 'center', label: 'Ptos. Carrera', field: row => row.racePoints },
    { name: 'status', align: 'center', label: 'Status', field: row => row.status ? 'Activo' : 'Finalizado' },
    { name: 'actualizado', align: 'center', label: 'Actualizado', field: row => row.updated_at },
]

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
                <q-btn type="submit" color="green-13" text-color="white" label="Crear Torneo" />
                <q-btn type="reset" color="red-13" text-color="white" label="Limpiar Campos" />
            </q-form>
        </div>

        <!-- Formulario de Edicion de Torneo -->
        <div class="col-5">
            <h5 class="text-uppercase q-mt-none">Editar Torneo</h5>
            <q-form id="editTorneoForm" method="POST" enctype="multipart/form-data" @submit.prevent="editarTorneo"
                @reset="onReset" class="q-gutter-md">

                <div class="form-group">
                    <q-input disable="disable" filled dense name="idTorneo" v-model="idTorneo" label="ID Torneo"
                        hint="No modificable" />

                </div>
                <div class="form-group">
                    <q-select filled dense disable="disable" name="plataforma" v-model="editPlataforma"
                        :options="useApi.plataformas" emit-value hint="No modificable" label="Plataforma" />

                </div>
                <div class="form-group">
                    <q-input filled dense name="nombre" v-model="editNombre" label="Nombre de Torneo"
                        hint="Texto y numeros" />

                </div>

                <div class="form-group">
                    <q-input filled dense name="puntosClasifica" v-model="editPuntosClasifica" label="Puntos de Qualy"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense name="puntosCarreraCorta" v-model="editPuntosCarreraCorta"
                        label="Puntos de Series/Carrera Corta" hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense name="puntosCarrera" v-model="editPuntosCarrera" label="Puntos de Carrera/Final"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense name="status" v-model="editStatus" label="Status"
                        hint="0 Finalizado - 1 Activo" />
                </div>

                <q-btn type="button" @click="cargarTorneo" color="black" text-color="white" label="Cargar Torneo" />
                <q-btn type="submit" color="green-13" text-color="white" label="Editar Torneo" />

            </q-form>
        </div>
    </div>

    <div class="row">
        <div class="col-12 q-pa-md tabla-torneos">
            <q-dialog v-model="confirm" persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="warning" color="primary" text-color="white" />
                        <span class="q-ml-sm">Vas a eliminar el torneo seleccionado. Continuar?</span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup />
                        <q-btn type="button" @click="deleteTorneo" flat label="Si, eliminarlo!" color="primary"
                            v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <q-btn class="btn-del" type="button" @click="confirm = true" color="red-13" text-color="white" label="Eliminar Torneo" />
            <q-table title="TORNEOS" :rows="useApi.torneos" v-model:selected="selected" selection="single"
                :columns="columns" :loading="useApi.torneos.length == 0 ? true : false" row-key="id" />
        </div>
    </div>
</template>


<style lang="scss" scoped>
.tabla-torneos{
    position: relative;

    .btn-del{
        position: absolute;
        top: 5%;
        right: 5%;
        z-index: 20;
    }
}
</style>