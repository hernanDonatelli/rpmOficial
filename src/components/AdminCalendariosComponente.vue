<script setup>
import { onMounted, ref } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar, Notify, QSpinnerGears } from 'quasar'

const useApi = useApiStore()
const $q = useQuasar()
let timer;

const createTorneo = ref(null)
const torneo = ref('')
const fecha = ref(null)
const circuito = ref(null)
const orden = ref(null)
let torneoName;

onMounted(async () => {
    torneosApi()
    await useApi.loginApi()
})

///////////////////////////////////////////////////////////////

//METODOS
const torneosApi = async () => {
    const token = await useApi.loginApi()
    const torneos = await useApi.getTorneosApi(JSON.parse(localStorage.getItem('token')));

    let idTorneo = [];
    useApi.torneoOpt = []

    torneos.forEach(torneo => {

        useApi.torneoOpt.push(torneo.name)
        idTorneo.push(torneo.id)

    });
}

const createCalendar = () => {
    const match = useApi.torneos.filter(item => item.name == createTorneo.value)

    match.forEach(item => {

        const datosFecha = {
            torneo: item.id,
            fecha: fecha.value,
            circuito: circuito.value,
            orden: orden.value
        }

        useApi.createCalendarApi(JSON.parse(localStorage.getItem('token')), datosFecha, item.name)
    })

}

const buscarCalendario = () => {

    const match = useApi.torneos.filter(item => item.name == torneo.value)

    match.forEach(item => {
        const idTorneo = item.id

        const getCalendario = useApi.getCalendarioApi(JSON.parse(localStorage.getItem('token')), idTorneo)

        if (getCalendario != 0) {
            torneoName = useApi.torneoOpt.filter(item => item == torneo.value)
        }
    })
}

const eliminarFecha = (id, order, circuit) => {
    $q.dialog({
        title: `Eliminar Fecha ${order} (${circuit})?`,
        message: `La fecha se eliminará de la base de datos.`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        useApi.deleteFechaApi(useApi.tokenApi, id, order)
    }).onCancel(() => {
        Notify.create({
            color: "red-13",
            textColor: "white",
            icon: "cloud_done",
            html: true,
            position: "center",
            message: `<span style='text-align: center;'>${data.message}</span>`,
            timeout: 1000
        });

    })

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
    { name: 'orden', required: true, label: 'Orden', align: 'center', field: row => row.order, format: val => `${val}`, sortable: true },
    { name: 'circuito', align: 'center', label: 'Circuito', field: row => row.circuit },
    { name: 'fecha', align: 'center', label: 'Fecha', field: row => row.date },
    { name: 'resultados', align: 'center', label: 'Resultados' },
    { name: 'accion', align: 'center', label: 'Accion' }
]

</script>

<template>
    <h4 class="text-uppercase text-center q-mt-xl q-mb-lg">Administrar Calendarios</h4>

    <div class="row flex justify-around q-mb-xl">

        <!-- Formulario de Creacion de Torneo -->
        <div class="col-4">
            <h5 class="text-uppercase q-mt-none text-center">Crear Fechas</h5>
            <q-form method="POST" @submit.prevent="createCalendar" @reset="onReset" class="q-gutter-md">

                <div class="row flex justify-evenly">
                    <div class="col-12">
                        <div class="form-group q-mb-md">
                            <q-select filled dense name="createTorneo" v-model="createTorneo" :options="useApi.torneoOpt"
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
                        <q-btn class="q-ml-lg" type="reset" color="red-13" text-color="white" label="Limpiar Campos" />
                    </div>
                </div>
            </q-form>
        </div>

        <div class="col-7 text-center">
            <h5 class="text-uppercase q-mt-none text-center">Mostrar Calendarios</h5>
            <div class="row justify-center">
                <div class="col-6">
                    <q-form @submit.prevent="buscarCalendario" class="q-gutter-md">
                        <div>
                            <div class="form-group q-mb-md">
                                <q-select color="red-13" label-color="red-13" item-aligned filled dense name="torneo" v-model="torneo" :options="useApi.torneoOpt"
                                    hint="Seleccionar un Torneo" label="Torneo" />
                            </div>
                        </div>
                        <q-btn type="submit" class="q-mr-lg" color="teal-14" text-color="white"
                            label="Mostrar Calendario" />
                    </q-form>

                </div>

            </div>

            <div class="col-12 q-pa-md tabla-torneos">
                <q-table v-if="useApi.calendar.length != 0" :title="`Calendario ${torneoName}`" :rows="useApi.calendar"
                    :columns="columns" :loading="useApi.calendar.length == 0 ? true : false" row-key="name">

                    <template v-slot:body="props">
                        <q-tr v-if="useApi.calendar.length != 0" :props="props">
                            <q-td key="orden" :props="props" class="text-center">
                                {{ props.row.order }}
                            </q-td>
                            <q-td class="cursor-pointer" key="circuito" :props="props">
                                {{ props.row.circuit }}
                                <q-popup-edit v-model="props.row.circuit" title="Editar Circuito" buttons label-set="Ok"
                                    label-cancel="Cancelar" v-slot="scope" auto-save>
                                    <q-input type="text" :model-value="scope.value" v-model="scope.value" dense autofocus
                                        @keyup.enter="scope.set" />
                                </q-popup-edit>
                            </q-td>
                            <q-td key="fecha" :props="props">
                                {{ props.row.date }}
                                <q-popup-edit v-model="props.row.date" v-slot="scope" />
                            </q-td>
                            <q-td class="cursor-pointer" key="resultados" :props="props">

                            </q-td>

                            <q-td class="flex justify-around align-center">
                                <q-btn size="sm"
                                    @click="eliminarFecha(props.row.league_info_id, props.row.order, props.row.circuit)"
                                    color="red-13" text-color="white" label="Eliminar" />
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </div>
        </div>
    </div>
</template>

