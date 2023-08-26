<script setup>
import { useApiStore } from 'src/stores/api'
import { onMounted, onBeforeUnmount } from 'vue'
import { useQuasar, QSpinnerGears } from 'quasar'
import TorneoResultComponent from './TorneoResultComponent.vue'

const apiStore = useApiStore();
import { useRoute } from 'vue-router';
const route = useRoute();

const $q = useQuasar()
let timer;
let torneoName;

//Generador de token y comprobacion de usuario
const loginUserApi = async () => {
    await apiStore.loginApi();
    await apiStore.getUser(apiStore.tokenApi);
}

//Traer calendario de la API
const getCalendar = async () => {
    apiStore.loadingSession = true;

    await loginUserApi();


    const idURL = route.params.id;

    const calendarios = await apiStore.getCalendarioApi(apiStore.tokenApi, idURL);

    const nombreTorneo = apiStore.torneos.forEach(torneo => {
        if (torneo.id == idURL) {
            apiStore.torneo = torneo;

            apiStore.loadingSession = false;
        }
    });

}

//Traer torneos y sus datos de la API
const getTorneos = async () => {
    apiStore.loadingSession = true;

    await loginUserApi();
    const torneos = await apiStore.getTorneosApi(apiStore.tokenApi);

    apiStore.torneos = torneos;

    apiStore.loadingSession = false;
}

const getPosiciones = async () => {

    apiStore.tablaPosiciones = []

    const idURL = route.params.id;

    apiStore.getPosicionesApi(JSON.parse(localStorage.getItem('token')), idURL)

}

onMounted(() => {
    showLoading()
})
onBeforeUnmount(() => {
    if (timer !== void 0) {
        clearTimeout(timer)
        $q.loading.hide()
    }
})

const showLoading = async () => {

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-10',
        message: 'Cargando información...',
        messageColor: 'black'
    })

    await getTorneos()
    await getCalendar()
    await getPosiciones()

    // hiding in 1s
    timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
    }, 1000)
}

const columns = [
    { name: 'fecha', required: true, label: 'Fecha', align: 'center', field: row => row.order, format: val => `${val}` },
    { name: 'dia', align: 'center', label: 'Día', field: row => row.date },
    { name: 'circuito', align: 'center', label: 'Circuito', field: row => row.circuit },
    { name: 'resultados', align: 'center', label: 'Resultados' }
]

</script>

<template>
    <!-- <q-spinner-gears v-if="apiStore.loadingSession" color="primary" size="6em" /> -->
    <section id="torneo">
        <div class="hero__champ" :style="{
            backgroundImage: `repeating-linear-gradient(#00000005, rgba(0, 0, 0, 0)),url(https://rpmracingleague.net/images/laravel-torneos/${apiStore.torneo.image})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center left'
        }">
            <div class="overlay"></div>
            <div class="row">
                <div class="col-12">
                    <h3 class="text-uppercase text-center text-weight-bold fontCustomTitle text-red-13 q-mb-none">
                        {{ apiStore.torneo.name }}
                    </h3>
                </div>
            </div>
        </div>

        <div class="calendario">
            <div class="row flex justify-center">
                <div class="col-12 col-md-8">
                    <!-- Calendario -->
                    <div>
                        <h4 class="titles text-uppercase text-weight-bolder text-blue-grey-8 text-center q-mt-lg q-mb-md">Calendario
                        </h4>
                        <q-table
                        :table-header-style="{ fontFamily: 'Roboto Condensed Italic', textTransform: 'uppercase' }"
                        flat dense :rows="apiStore.calendar" :columns="columns"
                            :loading="apiStore.calendar.length == 0 ? true : false" row-key="name"
                            :rows-per-page-options="[10, 15]">

                            <template v-slot:body="props">
                                <q-tr v-if="apiStore.calendar.length != 0" :props="props">
                                    <q-td key="fecha" :props="props" class="text-center">
                                        {{ props.row.order }}
                                    </q-td>
                                    <q-td key="fecha" :props="props">
                                        {{ props.row.date }}
                                    </q-td>
                                    <q-td key="circuito" :props="props">
                                        {{ props.row.circuit }}
                                    </q-td>
                                    <q-td class="cursor-pointer text-center" key="resultados">
                                        <TorneoResultComponent :fecha="props.row.date" :torneo="torneoName"
                                            :circuit="props.row.circuit" :orden="props.row.order"
                                            :idTorneo="props.row.league_info_id" />
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </div>
                </div>
            </div>

            <div class="row flex justify-center">
                <div class="col-12 col-md-8">
                    <!-- tabla de Posiciones -->
                    <div>
                        <h4 class="text-uppercase text-weight-bolder text-blue-grey-8 text-center q-mt-lg q-mb-md">
                            Campeonato </h4>
                        <q-markup-table flat dense>
                            <thead>
                                <tr>
                                    <th class="text-center fontCustomTitle text-uppercase">Posición</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Piloto</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Carreras</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Victorias</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Puntos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, key) in apiStore.tablaPosiciones[0]" :key="item.id">
                                    <td class="text-center">{{ JSON.parse(item).posicion }}</td>
                                    <td class="text-center">{{ key }}</td>
                                    <td class="text-center">{{ JSON.parse(item).carreras }}</td>
                                    <td class="text-center">{{ JSON.parse(item).victorias }}</td>
                                    <td class="text-center">{{ JSON.parse(item).puntos }}</td>
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: .9;
    z-index: 10;
}

.q-spinner {
    height: 100vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(0, -50%);
    z-index: 100;
}

.hero__champ {
    position: relative;
    height: 100vh;
    margin-bottom: 2rem;


    h3 {
        margin-top: 4rem;
        position: relative;
        z-index: 20;
    }
}


</style>