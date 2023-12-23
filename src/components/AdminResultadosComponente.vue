<script setup>
import { onMounted, ref } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar, QSpinnerGears } from 'quasar'
const useApi = useApiStore()
const $q = useQuasar()

let selTorneo = ref('')
const fecha = ref('')
const tipoCarrera = ref()
const archivo = ref([])
let ordenFecha = ref(null)
let idSelTorneo = ref(null)
let idToCalendar = ref(null)
const sesiones = ref([])

onMounted(async () => {
    torneosApi()
    await useApi.loginApi()
    await racesTypes()
})

const racesTypes = async () => {
    const tiposDeCarrera = await useApi.getTipoCarrera(JSON.parse(localStorage.getItem('token')))

    const options = [];

    tiposDeCarrera.forEach(item => {

        options.push({ label: `${item}`.toUpperCase(), value: `${item}` })


    })

    sesiones.value = options
}

///////////////////////////////////////////////////////////////

//METODOS
const torneosApi = async () => {
    const token = await useApi.loginApi()
    const torneos = await useApi.getTorneosApi(JSON.parse(localStorage.getItem('token')));

    let idTorneo = []

    useApi.torneoOpt = []

    torneos.forEach(torneo => {
        if (torneo.status === 1) {
            useApi.torneoOpt.push(torneo.name)
            idTorneo.push(torneo.id)
        }
    })

}

const newSelTorneo = async () => {

    const torneos = await useApi.getTorneosApi(JSON.parse(localStorage.getItem('token')))
    // console.log(fechas);
    const elem = torneos.filter(item => item.name == selTorneo.value)

    elem.forEach(item => {
        idToCalendar = item.id
        selTorneo = item.name
        idSelTorneo = item.id
    })

    const getCalendar = await useApi.getCalendarioApi(JSON.parse(localStorage.getItem('token')), idToCalendar)

    useApi.calendarOpt = []
    useApi.fechasOpt = []
    useApi.calendar.forEach(fecha => {

        useApi.calendarOpt.push(`Fecha ${fecha.order} - ${fecha.circuit} (${fecha.date})`)

        useApi.fechasOpt.push(fecha.order)
    });
}

const subirResultado = async () => {
    let timer;

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-10',
        message: 'Cargando información...',
        messageColor: 'black'
    })

    const formData = new FormData(uploadForm)

    useApi.uploadResult(useApi.tokenApi, formData)

    // hiding in 1s
    timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
    }, 250)
}

const onReset = () => {
    fecha.value = null;
    tipoCarrera.value = null;
    archivo.value = null;
    circuito.value = null;
};

const columns = [
    { name: 'orden', required: true, label: 'Orden', align: 'center', field: row => row.order, format: val => `${val}`, sortable: true },
    { name: 'circuito', align: 'center', label: 'Circuito', field: row => row.circuit },
    { name: 'fecha', align: 'center', label: 'Fecha', field: row => row.date },
    { name: 'resultados', align: 'center', label: 'Resultados' },
    { name: 'accion', align: 'center', label: 'Accion' }
]

</script>

<template>
    <h4 class="text-uppercase text-center q-mt-xl q-mb-lg">Administrar Resultados</h4>

    <div class="row flex justify-around q-mb-xl">

        <!-- Formulario de Creacion de Torneo -->
        <div class="col-6">
            <h5 class="text-uppercase q-mt-none text-center">Subir Resultados</h5>
            <q-form id="uploadForm" method="POST" @submit.prevent="subirResultado" @reset="onReset" class="q-gutter-md">

                <div class="row flex justify-evenly">
                    <div class="col-12">
                        <div class="form-group q-mb-md">
                            <q-select @update:model-value="newSelTorneo" options-cover filled dense name="selTorneo"
                                v-model="selTorneo" :options="useApi.torneoOpt" label="Torneo" color="red-13"
                                label-color="red-13" item-aligned />
                            <input type="hidden" name="torneo" v-model="idSelTorneo">
                        </div>

                        <div class="form-group q-mb-md">
                            <q-select filled dense name="numeroFecha" options-cover v-model="fecha" color="red-13"
                                label-color="red-13" item-aligned :options="useApi.fechasOpt"
                                :hint="useApi.calendarOpt[fecha - 1]" label="Fecha" />
                        </div>

                        <div class="form-group q-mb-md">
                            <q-select filled dense name="tipoCarrera" options-cover emit-value v-model="tipoCarrera"
                                color="red-13" label-color="red-13" item-aligned :options="sesiones"
                                label="Tipo de Carrera" />

                        </div>

                        <div class="form-group q-mb-md">
                            <q-file filled dense bottom-slots name="archivo" v-model="archivo" label="Archivo de Carrera"
                                counter>
                                <template v-slot:before>
                                    <q-icon name="attachment" />
                                </template>

                                <template v-slot:append>
                                    <q-icon v-if="archivo !== null" name="close" @click.stop.prevent="archivo = null"
                                        class="cursor-pointer" />
                                    <q-icon name="search" @click.stop.prevent />
                                </template>

                                <template v-slot:hint>
                                    Formatos: .xml .json
                                </template>
                            </q-file>
                        </div>

                        <!-- <div class="form-group q-mb-md">
                            <q-file filled dense bottom-slots name="replay" v-model="replay" label="Replay de Sesión"
                                counter>
                                <template v-slot:before>
                                    <q-icon name="attachment" />
                                </template>

                                <template v-slot:append>
                                    <q-icon v-if="replay !== null" name="close" @click.stop.prevent="replay = null"
                                        class="cursor-pointer" />
                                    <q-icon name="search" @click.stop.prevent />
                                </template>

                                <template v-slot:hint>
                                    Formatos: .vcr
                                </template>
                            </q-file>
                        </div> -->
                    </div>
                </div>

                <div class="row q-mt-xl">
                    <div class="col-12 text-center">
                        <q-btn class="q-mr-lg" type="submit" color="teal-14" text-color="white" label="Subir Resultado" />
                        <q-btn class="q-ml-lg" type="reset" color="red-13" text-color="white" label="Limpiar Campos" />
                    </div>
                </div>
            </q-form>
        </div>
    </div>
</template>

