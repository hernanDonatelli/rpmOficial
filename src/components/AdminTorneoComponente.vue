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

const nombre = ref(null)
const plataforma = ref(null)
const puntosClasifica = ref(null)
const puntosCarreraCorta = ref(null)
const puntosCarrera = ref(null)
const imagen = ref(null)
const precio = ref(null)
const URLForo = ref(null)

///////////////////////////////////////////////////////////////

//METODOS

const api_url = () => {
    return process.env.API_URL
}

const showLoading = async (token, torneo) => {
    useApi.torneos = []

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'green-13',
        spinnerSize: 140,
        backgroundColor: 'black',
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

const editarTorneo = async (id, name, simulator, qualyPoints, shortRacePoints, racePoints, status, price, forumURL) => {

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'green-13',
        spinnerSize: 140,
        backgroundColor: 'black',
        message: 'Editando Torneo...',
        messageColor: 'white'
    })

    useApi.torneos = []

    const torneoEditado = {
        idTorneo: id,
        nombre: name,
        plataforma: simulator,
        puntosCarrera: racePoints,
        puntosClasifica: qualyPoints,
        puntosCarreraCorta: shortRacePoints,
        status: status,
        precio: Number(price),
        URLForo: forumURL
    }

    //console.log(torneoEditado.price);
    await useApi.editTorneoApi(useApi.tokenApi, torneoEditado)

    // hiding in 1s
    timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
    }, 0)

    useApi.torneos = await useApi.getTorneosApi(useApi.tokenApi)
}

const deleteConfirm = async (nombre, id) => {

    $q.dialog({
        title: `Eliminar Torneo ${nombre}`,
        message: `Esta acción no tiene vuelta atrás y borrará toda información de la base de datos`,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        $q.loading.show({
            spinner: QSpinnerGears,
            spinnerColor: 'green-13',
            spinnerSize: 140,
            backgroundColor: 'black',
            message: 'Eliminando Torneo...',
            messageColor: 'white'
        })

        await useApi.deleteTorneoApi(useApi.tokenApi, id)

        useApi.torneos = []

        const torneosApi = await useApi.getTorneosApi(useApi.tokenApi)

        torneosApi.forEach(el => {
            useApi.torneos.push(el)

        });

        // hiding in 1s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 0)

    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })
}

const finalizarTorneo = async (token, id, name) => {
    $q.dialog({
        title: `Finalizar el Torneo ${name}`,
        message: `Esta acción no tiene vuelta atrás y finalizará el Torneo de manera inmediata.`,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        $q.loading.show({
            spinner: QSpinnerGears,
            spinnerColor: 'green-13',
            spinnerSize: 140,
            backgroundColor: 'black',
            message: 'Finalizando Torneo...',
            messageColor: 'white'
        })

        await useApi.finalizarTorneoApi(token, id)

        // hiding in 1s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 0)

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
    precio.value = null;
    URLForo.value = null;
};

const columns = [
    // { name: 'id', required: true, label: 'ID', align: 'center', field: row => row.id, format: val => `${val}`, sortable: true },
    { name: 'nombre', align: 'center', label: 'Nombre', field: row => row.name },
    { name: 'plataforma', align: 'center', label: 'Plataforma', field: row => row.simulator },
    { name: 'puntosQualy', align: 'center', label: 'Ptos. Qualy', field: row => row.qualyPoints },
    { name: 'puntosCarreraCorta', align: 'center', label: 'Ptos. Serie/ShortRace', field: row => row.shortRacePoints },
    { name: 'puntosCarrera', align: 'center', label: 'Ptos. Carrera', field: row => row.racePoints },
    { name: 'status', align: 'center', label: 'Status', field: row => row.status ? 'Activo' : 'Finalizado' },
    { name: 'precio', align: 'center', label: 'Precio', field: row => row.price },
    { name: 'forumURL', align: 'center', label: 'URL Foro', field: row => row.forumURL },
    { name: 'acciones', align: 'center', label: 'Acciones' }
]


</script>

<template>
    <h4 class="titleSection text-uppercase text-center montserratExtraBold">Administrar Torneos</h4>

    <div class="row flex justify-around q-mb-xl">

        <!-- Formulario de Creacion de Torneo -->
        <div class="col-12 col-md-10 col-lg-8">
            <h5 class="text-uppercase q-mt-none text-center montserratRegular">Crear Torneo</h5>
            <q-form id="formulario" method="POST" enctype="multipart/form-data" @submit.prevent="crearTorneo"
                @reset="onReset" class="q-gutter-md">

                <div class="row flex justify-evenly">
                    <div class="col-10 col-md-5">
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
                        <div class="form-group q-mb-md">
                            <q-input filled dense name="precio" v-model="precio" label="Precio de Torneo"
                                hint="Ingresar el precio del torneo" />
                        </div>
                    </div>

                    <div class="col-10 col-md-5">
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
                        <div class="form-group q-mb-md">
                            <q-input filled dense name="URLForo" v-model="URLForo" label="URL Foro"
                                hint="Ingrese la URL del foro del torneo" />
                        </div>
                    </div>
                </div>

                <div class="row q-mt-xl">
                    <div class="col-12 text-center">
                        <q-btn class="q-mr-lg" type="submit" color="teal-14" text-color="white" label="Crear Torneo" />
                        <q-btn class="q-ml-lg" type="reset" color="red-13" text-color="white" label="Limpiar" />
                    </div>
                </div>
            </q-form>
        </div>

    </div>

    <div class="row">
        <div class="col-12 q-pa-md tabla-torneos">

            <!-- Torneos Activos -->
            <q-table class="q-mb-xl" style="width: 100%;" title="Torneos Activos" :rows="useApi.torneos" :columns="columns"
                :loading="useApi.torneos.length == 0 ? true : false" row-key="id" :rows-per-page-options="[5, 10]">

                <template v-slot:body="props">
                    <q-tr v-if="props.row.status == 1" :props="props">
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
                            <p>{{ props.row.racePoints }}</p>
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
                        <q-td class="cursor-pointer" key="precio" :props="props" id="editedPrice">
                            <p>{{ props.row.price }}</p>
                            <q-popup-edit v-model.trim="props.row.price" title="Precio" buttons label-set="Ok"
                                label-cancel="Cancelar" v-slot="scope">
                                <q-input type="text" v-model.trim="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                        <q-td class="cursor-pointer" key="forumURL" :props="props" id="editedForum">
                            <p>{{ props.row.forumURL }}</p>
                            <q-popup-edit v-model.trim="props.row.forumURL" title="URL Foro" buttons label-set="Ok"
                                label-cancel="Cancelar" v-slot="scope">
                                <q-input type="text" v-model.trim="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                        <q-td class="flex column">
                            <q-btn
                                @click="editarTorneo(props.row.id, props.row.name, props.row.simulator, props.row.qualyPoints, props.row.shortRacePoints, props.row.racePoints, props.row.status, props.row.price, props.row.forumURL)"
                                type="submit" size="sm" color="yellow-13" text-color="black" label="Editar" />
                            <q-btn class="q-my-sm" size="sm"
                                @click="finalizarTorneo(useApi.tokenApi, props.row.id, props.row.name)" color="blue-grey-13"
                                text-color="white" label="Finalizar" />
                            <q-btn size="sm" @click="deleteConfirm(props.row.name, props.row.id)" color="red-13"
                                text-color="white" label="Eliminar" />

                        </q-td>
                    </q-tr>
                </template>
            </q-table>

            <!-- Torneos Finalizados -->
            <q-table style="width: 100%;" title="Torneos Finalizados" :rows="useApi.torneos" :columns="columns"
                :loading="useApi.torneos.length == 0 ? true : false" row-key="id" :rows-per-page-options="[5, 10]">

                <template v-slot:body="props">

                    <q-tr v-if="props.row.status == 2" :props="props">
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
                            <p>{{ props.row.racePoints }}</p>
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
                        <q-td class="cursor-pointer" key="precio" :props="props" id="editedPrice">
                            <p>{{ props.row.price }}</p>
                            <q-popup-edit v-model.trim="props.row.price" title="Precio" buttons label-set="Ok"
                                label-cancel="Cancelar" v-slot="scope">
                                <q-input type="text" v-model.trim="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                        <q-td class="cursor-pointer" key="forumURL" :props="props" id="editedForum">
                            <p>{{ props.row.forumURL }}</p>
                            <q-popup-edit v-model.trim="props.row.forumURL" title="URL Foro" buttons label-set="Ok"
                                label-cancel="Cancelar" v-slot="scope">
                                <q-input type="text" v-model.trim="scope.value" dense autofocus />
                            </q-popup-edit>
                        </q-td>
                        <q-td class="flex column">
                            <q-btn
                                @click="editarTorneo(props.row.id, props.row.name, props.row.simulator, props.row.qualyPoints, props.row.shortRacePoints, props.row.racePoints, props.row.status, props.row.price, props.row.forumURL)"
                                type="submit" size="sm" color="yellow-13" text-color="black" label="Editar" />
                            <q-btn class="q-my-sm" size="sm"
                                @click="finalizarTorneo(useApi.tokenApi, props.row.id, props.row.name)" color="blue-grey-13"
                                text-color="white" label="Finalizar" />
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
.titleSection{
    padding-top: 5rem;
}
.q-table tbody td,
.q-table th {
    height: 110px;
    width: 15%
}
</style>

