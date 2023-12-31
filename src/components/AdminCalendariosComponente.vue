<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar, QSpinnerGears } from 'quasar'
import AdminResultComponent from './AdminResultComponent.vue';

const useApi = useApiStore()
const $q = useQuasar()
let timer;

const createFecha = ref(null)
const torneo = ref('')
const fecha = ref(null)
const circuito = ref(null)
const orden = ref(null)
let torneoName;

onMounted(async () => {
    torneosApi()
    await useApi.loginApi()
})

onUnmounted(() => {
    useApi.calendar = []
})

///////////////////////////////////////////////////////////////

//METODOS
const torneosApi = async () => {
    const token = await useApi.loginApi()
    const torneos = await useApi.getTorneosApi(JSON.parse(localStorage.getItem('token')));

    let idTorneo = [];
    useApi.torneoOpt = []

    torneos.forEach(torneo => {
        if (torneo.status === 1) {
            useApi.torneoOpt.push(torneo.name)
            idTorneo.push(torneo.id)
        }

    });
}

const createCalendar = async () => {
    let timer;
    const match = useApi.torneos.filter(item => item.name == createFecha.value)

    match.forEach(item => {

        const datosFecha = {
            torneo: item.id,
            fecha: fecha.value,
            circuito: circuito.value,
            orden: orden.value
        }

        $q.loading.show({
            spinner: QSpinnerGears,
            spinnerColor: 'red-13',
            spinnerSize: 140,
            backgroundColor: 'bg-grey-10',
            message: 'Cargando información...',
            messageColor: 'black'
        })

        useApi.createCalendarApi(JSON.parse(localStorage.getItem('token')), datosFecha, item.name)

        // hiding in 1s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 1000)
    })

}

const buscarCalendario = () => {
    let timer;
    const match = useApi.torneos.filter(item => item.name == torneo.value)

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-10',
        message: 'Cargando información...',
        messageColor: 'black'
    })

    match.forEach(item => {
        const idTorneo = item.id

        const getCalendario = useApi.getCalendarioApi(JSON.parse(localStorage.getItem('token')), idTorneo)

        if (getCalendario != 0) {
            torneoName = useApi.torneoOpt.filter(item => item == torneo.value)
        }
    })

    // hiding in 1s
    timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
    }, 1250)
}

const eliminarFecha = (id, order, circuit) => {
    let timer;

    $q.dialog({
        title: `Eliminar Fecha ${order} (${circuit})?`,
        message: `La fecha se eliminará de la base de datos.`,
        cancel: true,
        persistent: true

    }).onOk(async () => {
        $q.loading.show({
            spinner: QSpinnerGears,
            spinnerColor: 'red-13',
            spinnerSize: 140,
            backgroundColor: 'bg-grey-10',
            message: 'Cargando información...',
            messageColor: 'black'
        })

        await useApi.deleteFechaApi(useApi.tokenApi, id, order)

        // hiding in 1s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 250)

    }).onCancel(() => {


    })
}


const onReset = () => {
    createFecha.value = null;
    orden.value = null;
    fecha.value = null;
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
    <h4 class="titleSection text-uppercase text-center montserratExtraBold">Administrar Calendarios</h4>

    <div class="row flex justify-around q-mb-xl">

        <!-- Formulario de Creacion de Calendario -->
        <div class="col-10 col-md-6">
            <h5 class="text-uppercase q-mt-none text-center montserratRegular">Crear Fechas</h5>
            <q-form method="POST" @submit.prevent="createCalendar" @reset="onReset" class="q-gutter-md">

                <div class="row flex justify-evenly">
                    <div class="col-12 col-md-10 col-xl-8">
                        <div class="form-group q-mb-md">
                            <q-select filled dense name="createTorneo" v-model="createFecha" :options="useApi.torneoOpt"
                                hint="Seleccionar una opción" label="Torneo" />
                        </div>

                        <div class="form-group q-mb-md">
                            <q-input filled dense name="orden" v-model="orden" label="Fecha Nro..." hint="Solo numeros" />
                        </div>

                        <div class="form-group q-mb-md">
                            <q-input type="date" filled dense name="fecha" v-model="fecha" label="Fecha"
                                hint="Fecha del Evento" />
                        </div>

                        <div class="form-group q-mb-md">
                            <q-input filled dense name="circuito" v-model="circuito" label="Nombre del Circuito"
                                hint="Texto y numeros" />
                        </div>
                    </div>
                </div>

                <div class="row q-mt-xl">
                    <div class="col-12 text-center">
                        <q-btn class="q-mr-lg" type="submit" color="teal-14" text-color="white" label="Crear Fecha" />
                        <q-btn class="q-ml-lg" type="reset" color="red-13" text-color="white" label="Limpiar" />
                    </div>
                </div>
            </q-form>
        </div>

        <!-- Mostrar Calendarios -->
        <div class="col-10 col-md-9 col-xl-7 text-center">
            <h5 class="text-uppercase q-mt-xl q-mb-sm text-center montserratRegular">Mostrar Calendarios</h5>
            <div class="row justify-center">
                <div class="col-12 col-md-9 col-lg-6">
                    <q-form @submit.prevent="buscarCalendario" class="q-gutter-md">
                        <div>
                            <div class="form-group q-mb-md">
                                <q-select color="red-13" label-color="red-13" item-aligned filled dense name="torneo"
                                    v-model="torneo" :options="useApi.torneoOpt" hint="Seleccionar un Torneo"
                                    label="Torneo" />
                            </div>
                        </div>
                        <q-btn type="submit" class="q-mr-lg" color="teal-14" text-color="white" label="Buscar Calendario" />
                    </q-form>

                </div>

            </div>

            <div class="q-pa-md tabla-torneos q-mt-lg">
                <q-table v-if="useApi.calendar.length != 0" :title="`Calendario ${torneoName}`" :rows="useApi.calendar"
                    :columns="columns" :loading="useApi.calendar.length == 0 ? true : false" row-key="name"
                    :rows-per-page-options="[10, 15]">

                    <template v-slot:body="props">
                        <q-tr v-if="useApi.calendar.length != 0" :props="props">
                            <q-td key="orden" :props="props" class="text-center">
                                {{ props.row.order }}
                            </q-td>
                            <q-td key="circuito" :props="props">
                                {{ props.row.circuit }}
                            </q-td>
                            <q-td key="fecha" :props="props">
                                {{ props.row.date }}
                            </q-td>
                            <q-td class="cursor-pointer" key="resultados">
                                <AdminResultComponent :fecha="props.row.date" :torneo="torneoName"
                                    :circuit="props.row.circuit" :orden="props.row.order"
                                    :idTorneo="props.row.league_info_id" />
                            </q-td>

                            <q-td>
                                <q-btn size="sm"
                                    @click="eliminarFecha(props.row.league_info_id, props.row.order, props.row.circuit)"
                                    color="red-13" text-color="white" label="Eliminar" />
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
                <q-table v-else :title="`Calendario`" :rows="useApi.calendar" :columns="columns" row-key="name">

                </q-table>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
h4.titleSection{
    padding-top: 5rem;
}
</style>

