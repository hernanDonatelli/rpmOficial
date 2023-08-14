<script setup>
import { onMounted, ref } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar, Notify, QSpinnerGears } from 'quasar'

const useApi = useApiStore()
const $q = useQuasar()
let timer;
// const nombre = ref(null)
const torneo = ref('')
const createTorneo = ref(null)
const orden = ref(null)
const fecha = ref(null)
const circuito = ref(null)

onMounted(async () => {
    torneosApi()
    await useApi.loginApi()
})


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

const buscarCalendario = () => {

    const match = useApi.torneos.filter(item => item.name == torneo.value)

    match.forEach(item => {
        const idTorneo = item.id
        useApi.getCalendarioApi(JSON.parse(localStorage.getItem('token')), idTorneo)
    })

}

///////////////////////////////////////////////////////////////

//METODOS
const showLoading = async (token, torneo) => {

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'green-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-10',
        message: 'Creando Torneo...',
        messageColor: 'white'
    })

    await useApi.createTorneoApi(token, torneo)

    // hiding in 1s
    timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
    }, 0)
}


const crearTorneo = () => {

    const formData = new FormData(formulario)

    showLoading(useApi.tokenApi, formData)

}

const editarTorneo = (id, name, simulator, qualyPoints, shortRacePoints, racePoints, status) => {

    const torneoEditado = {
        idTorneo: id,
        nombre: name,
        plataforma: simulator,
        puntosCarrera: racePoints,
        puntosClasifica: qualyPoints,
        puntosCarreraCorta: shortRacePoints,
        status: status
    }

    useApi.editTorneoApi(useApi.tokenApi, torneoEditado)

}

const deleteConfirm = (nombre, id) => {
    $q.dialog({
        title: `Eliminar Torneo ${nombre}`,
        message: `Esta acción no tiene vuelta atrás y borrará toda información de la base de datos`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        useApi.deleteTorneoApi(useApi.tokenApi, id)
    }).onOk(() => {
        Notify.create({
            color: "green-13",
            textColor: "white",
            icon: "cloud_done",
            html: true,
            position: "center",
            message: `<p style='text-align: center;'>${data.message}</p>`,
            timeout: 3000
        });
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
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
    { name: 'resultados', align: 'center', label: 'Resultados'},
    { name: 'accion', align: 'center', label: 'Accion' }
]

</script>

<template>
    <h4 class="text-uppercase text-center q-mt-xl q-mb-lg">Administrar Calendarios</h4>

    <div class="row flex justify-around q-mb-xl">

        <!-- Formulario de Creacion de Torneo -->
        <div class="col-10">
            <h5 class="text-uppercase q-mt-none text-center">Crear Calendario</h5>
            <q-form id="formulario" method="POST" enctype="multipart/form-data" @submit.prevent="" @reset="onReset"
                class="q-gutter-md">

                <div class="row flex justify-evenly">
                    <div class="col-6">
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
                        <q-btn class="q-mr-lg" type="submit" color="teal-14" text-color="white" label="Crear Torneo" />
                        <q-btn class="q-ml-lg" type="reset" color="red-13" text-color="white" label="Limpiar Campos" />
                    </div>
                </div>
            </q-form>
        </div>
    </div>

    <div class="row flex justify-center">
        <div class="col-4 text-center">
            <h5 class="text-uppercase q-mt-none text-center">Mostrar Calendario</h5>

            <q-form @submit.prevent="buscarCalendario" class="q-gutter-md">
                <div>
                    <div class="form-group q-mb-md">
                        <q-select filled dense name="torneo" v-model="torneo" :options="useApi.torneoOpt"
                            hint="Seleccionar un Torneo" label="Torneo" />
                    </div>
                </div>
                <q-btn type="submit" class="q-mr-lg" color="teal-14" text-color="white" label="Mostrar Calendario" />
            </q-form>
        </div>
    </div>

    <div class="row">
        <div class="col-12 q-pa-md tabla-torneos">
            <q-table v-if="useApi.calendar.length != 0" :title="`CALENDARIO ${torneo}`" :rows="useApi.calendar" :columns="columns"
                :loading="useApi.calendar.length == 0 ? true : false" row-key="name">

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
                            <q-btn
                                @click="editarTorneo(props.row.id, props.row.name, props.row.simulator, props.row.qualyPoints, props.row.shortRacePoints, props.row.racePoints, props.row.status)"
                                type="submit" size="sm" color="yellow-13" text-color="black" label="Editar" />
                            <q-btn size="sm" @click="deleteConfirm(props.row.name, props.row.id)" color="red-13"
                                text-color="white" label="Eliminar" />
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </div>
</template>

