<script setup>
import { onMounted, ref, onUpdated } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar, QSpinnerGears } from 'quasar'

const useApi = useApiStore()
const $q = useQuasar()
let timer;

onMounted(async () => {
    await useApi.getPlataformas(JSON.parse(localStorage.getItem('token')))

})

onUpdated(() => {
  // console.log('Updated');
  // console.log(apiStore.torneos);
  useApi.torneos.forEach(async el => {

    el.posiciones = await useApi.createTablasPosicionesApi(useApi.tokenApi, el.id)

  })
})

const nombre = ref(null)
const plataforma = ref(null)
const puntosClasifica = ref(null)
const puntosCarreraCorta = ref(null)
const puntosCarrera = ref(null)
const imagen = ref([])

///////////////////////////////////////////////////////////////

//METODOS
const showLoading = async (token, torneo) => {
    useApi.torneos = []

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'green-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-10',
        message: 'Creando Torneo...',
        messageColor: 'white'
    })

    await useApi.createTorneoApi(token, torneo)

    const torneosApi = await useApi.getTorneosApi(token)

    torneosApi.forEach(el => {
        useApi.torneos.push(el)

    });

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

const deleteConfirm = async (nombre, id) => {

    $q.dialog({
        title: `Eliminar Torneo ${nombre}`,
        message: `Esta acción no tiene vuelta atrás y borrará toda información de la base de datos`,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        await useApi.deleteTorneoApi(useApi.tokenApi, id)

        useApi.torneos = []

        const torneosApi = await useApi.getTorneosApi(useApi.tokenApi)

        torneosApi.forEach(el => {
            useApi.torneos.push(el)

        });

    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })
}

const finalizarTorneo = async (token, id, name) => {
    $q.dialog({
        title: `Finalizar el Torneo ${name}`,
        message: `Esta acción no tiene vuelta atrás y finalizará el Torneo sin vuelta atrás.`,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        await useApi.finalizarTorneoApi(token, id)

        $q.notify({
            color: "teal-14",
            textColor: "white",
            icon: "done",
            html: true,
            position: "top",
            message: `<span style='text-align: center;'>El Torneo ${name} ha sido Finalizado</span>`,
            timeout: 1500
        });

        useApi.torneos = []

        const torneosApi = await useApi.getTorneosApi(useApi.tokenApi)

        torneosApi.forEach(el => {
            useApi.torneos.push(el)

        });

    }).onCancel(() => {
        $q.notify({
            color: "red-13",
            textColor: "white",
            icon: "warning",
            html: true,
            position: "top",
            message: `<span style='text-align: center;'>Acción cancelada. El Torneo ${name} no fue Finalizado</span>`,
            timeout: 3000
        });
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
    { name: 'id', required: true, label: 'ID', align: 'center', field: row => row.id, format: val => `${val}`, sortable: true },
    { name: 'nombre', align: 'center', label: 'Nombre', field: row => row.name },
    { name: 'plataforma', align: 'center', label: 'Plataforma', field: row => row.simulator },
    { name: 'puntosQualy', align: 'center', label: 'Ptos. Qualy', field: row => row.qualyPoints },
    { name: 'puntosCarreraCorta', align: 'center', label: 'Ptos. Serie/ShortRace', field: row => row.shortRacePoints },
    { name: 'puntosCarrera', align: 'center', label: 'Ptos. Carrera', field: row => row.racePoints },
    { name: 'status', align: 'center', label: 'Status', field: row => row.status ? 'Activo' : 'Finalizado' },
    { name: 'actualizado', align: 'center', label: 'Actualizado', field: row => row.updated_at },
    { name: 'acciones', align: 'center', label: 'Acciones' }
]

</script>

<template>
    <h4 class="text-uppercase text-center q-mt-xl q-mb-lg">Administrar Torneos</h4>

    <div class="row flex justify-around q-mb-xl">

        <!-- Formulario de Creacion de Torneo -->
        <div class="col-10">
            <h5 class="text-uppercase q-mt-none text-center">Crear Torneo</h5>
            <q-form id="formulario" method="POST" enctype="multipart/form-data" @submit.prevent="crearTorneo"
                @reset="onReset" class="q-gutter-md">

                <div class="row flex justify-evenly">
                    <div class="col-4">
                        <div class="form-group q-mb-md">
                            <q-select filled dense name="plataforma" v-model="plataforma" :options="useApi.plataformas"
                                hint="Seleccionar una opción" label="Plataforma" />
                        </div>
                        <div class="form-group q-mb-md">
                            <q-input filled dense name="nombre" v-model="nombre" label="Nombre de Torneo"
                                hint="Texto y numeros" />
                        </div>
                        <div class="form-group q-mb-md">
                            <q-input filled dense name="puntosClasifica" v-model="puntosClasifica" label="Puntos de Qualy"
                                hint="Numeros (separados por coma)" />
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="form-group q-mb-md">
                            <q-input filled dense name="puntosCarreraCorta" v-model="puntosCarreraCorta"
                                label="Puntos de Series/Carrera Corta" hint="Numeros (separados por coma)" />
                        </div>
                        <div class="form-group q-mb-md">
                            <q-input filled dense name="puntosCarrera" v-model.trim="puntosCarrera"
                                label="Puntos de Carrera/Final" hint="Numeros (separados por coma)" />
                        </div>
                        <div class="form-group q-mb-md">
                            <q-file filled dense bottom-slots name="imagen" v-model="imagen" label="Buscar imagen" counter
                                max-files="1" accept=".jpg,.png,.jpeg">
                                <template v-slot:before>
                                    <q-icon name="attachment" />
                                </template>

                                <template v-slot:append>
                                    <q-icon v-if="imagen !== null" name="close" @click.stop.prevent="imagen = null"
                                        class="cursor-pointer" />
                                    <q-icon name="search" @click.stop.prevent />
                                </template>

                                <template v-slot:hint>
                                    Formatos: .jpg .png .jpeg
                                </template>
                            </q-file>
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

    <div class="row">
        <div class="col-12 q-pa-md tabla-torneos">

            <q-table title="TORNEOS" :rows="useApi.torneos" :columns="columns"
                :loading="useApi.torneos.length == 0 ? true : false" row-key="id">

                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="id" :props="props" class="text-center" id="editedId">
                            {{ props.row.id }}
                        </q-td>
                        <q-td class="cursor-pointer" key="nombre" :props="props" id="editedName">
                            {{ props.row.name }}
                            <q-popup-edit v-model="props.row.name" title="Editar Nombre" buttons label-set="Ok"
                                label-cancel="Cancelar" v-slot="scope" auto-save>
                                <q-input type="text" :model-value="scope.value" v-model="scope.value" dense autofocus
                                    @keyup.enter="scope.set" />
                            </q-popup-edit>
                        </q-td>
                        <q-td key="plataforma" :props="props" id="editedSimulator">
                            {{ props.row.simulator }}
                            <q-popup-edit v-model="props.row.simulator" v-slot="scope" disable />
                        </q-td>
                        <q-td class="cursor-pointer" key="puntosQualy" :props="props" id="editedQualyPoints">
                            {{ props.row.qualyPoints }}
                            <q-popup-edit v-model="props.row.qualyPoints" title="Puntos de Qualy" buttons label-set="Ok"
                                label-cancel="Cancelar" v-slot="scope">
                                <q-input type="text" v-model="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                        <q-td class="cursor-pointer" key="puntosCarreraCorta" :props="props" id="editedShortRacePoints">
                            {{ props.row.shortRacePoints }}
                            <q-popup-edit v-model="props.row.shortRacePoints" title="Puntos de Serie/Short Race" buttons
                                label-set="Ok" label-cancel="Cancelar" v-slot="scope">
                                <q-input type="text" v-model="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                        <q-td class="cursor-pointer" key="puntosCarrera" :props="props" id="editedRacePoints">
                            {{ props.row.racePoints }}
                            <q-popup-edit v-model.trim="props.row.racePoints" title="Puntos de Carrera" buttons
                                label-set="Ok" label-cancel="Cancelar" v-slot="scope">
                                <q-input type="text" v-model.trim="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                        <q-td key="status" :props="props" id="editedStatus">
                            <q-badge :color="props.row.status == 1 ? 'teal-14' : 'red-13'" text-color="white"
                                class="q-py-xs q-px-sm">
                                {{ props.row.status == 1 ? 'Activo' : 'Finalizado' }}
                            </q-badge>
                        </q-td>
                        <q-td key="actualizado" :props="props">
                            {{ props.row.updated }}
                        </q-td>
                        <q-td class="flex column">
                            <q-btn
                                @click="editarTorneo(props.row.id, props.row.name, props.row.simulator, props.row.qualyPoints, props.row.shortRacePoints, props.row.racePoints, props.row.status)"
                                type="submit" size="sm" color="yellow-13" text-color="black" label="Editar" />
                            <q-btn class="q-my-sm" size="sm"
                                @click="finalizarTorneo(useApi.tokenApi, props.row.id, props.row.name)"
                                color="blue-grey-13" text-color="white" label="Finalizar" />
                            <q-btn size="sm" @click="deleteConfirm(props.row.name, props.row.id)" color="red-13"
                                text-color="white" label="Eliminar" />

                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.q-table tbody td {
    min-height: 110px
}
</style>

