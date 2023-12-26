<script setup>
import CounterComponent from '../components/CounterComponent.vue'
import { useApiStore } from 'src/stores/api'
import { onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { useQuasar, QSpinnerGears } from 'quasar'
import TorneoResultComponent from './TorneoResultComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

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

onMounted(async () => {
    showLoading()
    await fechaCountdown()
})
onBeforeUnmount(() => {
    if (timer !== void 0) {
        clearTimeout(timer)
        $q.loading.hide()
    }
})
onUnmounted(() => {
    apiStore.arrayFechasCounter = []
})

const showLoading = async () => {

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'black',
        message: 'Cargando información...',
        messageColor: 'white'
    })

    await getTorneos()
    await getCalendar()
    await getPosiciones()

    // hiding in 1s
    timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
    }, 250)
}

const columns = [
    { name: 'fecha', required: true, label: 'Fecha', align: 'center', field: row => row.order, format: val => `${val}` },
    { name: 'dia', align: 'center', label: 'Día', field: row => row.date },
    { name: 'circuito', align: 'center', label: 'Circuito', field: row => row.circuit },
    { name: 'resultados', align: 'center', label: 'Resultados' }
]

const fechaCountdown = async () => {
    let resultObj = {}

    try {
        const fecha = await apiStore.proximaFechaApi(JSON.parse(localStorage.getItem('token')), route.params.id)

        const arrFecha = fecha.date.split('-');
        const circuito = fecha.circuit

        //console.log(arrFecha);
        resultObj = {
            id: route.params.id,
            year: arrFecha[0],
            month: arrFecha[1],
            day: arrFecha[2],
            circuit: circuito
        }

        apiStore.arrayFechasCounter.push((resultObj))

    } catch (error) {
        console.log(error);
    }


}

</script>

<template>
    <section id="torneo">
        <div class="hero__champ" :style="{
            backgroundImage: `repeating-linear-gradient(#00000005, rgba(0, 0, 0, 0)),url(https://rpm.studioatlantic.com.ar/pezls/storage/app/public/images/tournament/${apiStore.torneo.image})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }">
            <div class="overlay"></div>
            <div class="row">
                <div class="container-champ col-12 flex column-xs justify-center row-md items-md-center justify-md-evenly">
                    <h3
                        class="q-mt-xl text-uppercase text-center text-weight-bold montserratExtraBold text-white q-mb-none">
                        {{ apiStore.torneo.name }}
                    </h3>

                    <div class="templateClock" v-for="counter in apiStore.arrayFechasCounter" :key="counter.id">

                        <p v-if="route.params.id == counter.id"
                            class="text-white text-uppercase text-center q-my-none text-weight-light">
                            Proximo Evento: <span class="text-weight-bold">{{ counter.day }}-{{ counter.month
                            }}-{{ counter.year }}</span>
                        </p>
                        <h4 v-if="route.params.id == counter.id"
                            class="fontCustomTitle text-lime-11 text-h4 text-uppercase text-center q-my-none">
                            {{ counter.circuit }}
                        </h4>

                        <CounterComponent v-if="route.params.id == counter.id" :year="counter.year"
                            :month="counter.month - 1" :date="counter.day" :hour="22" :minutes="0" :seconds="0" />
                    </div>
                </div>
            </div>
        </div>

        <div class="calendario">
            <div class="row flex justify-center">
                <div class="col-12 col-md-10">
                    <!-- Calendario -->
                    <div>
                        <h4
                            class="titles text-uppercase text-weight-bolder text-blue-grey-8 text-center q-mt-none q-mb-md montserratExtraBold">
                            Calendario
                        </h4>
                        <q-table :table-header-style="{ fontFamily: 'Roboto Condensed Italic', textTransform: 'uppercase' }"
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
                <div class="col-12 col-md-10">
                    <!-- tabla de Posiciones -->
                    <div>
                        <h4
                            class="text-uppercase text-weight-bolder text-blue-grey-8 text-center q-mt-lg q-mb-md montserratExtraBold">
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

    <FooterComponent />
</template>


<style lang="scss" scoped>
#torneo {
    padding-bottom: 3rem;
    background-image: repeating-linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7)),
        url(../assets/background.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    .calendario {
        width: 90%;
        margin: -3.5rem auto 0;
        background-color: rgba(255, 255, 255, 1);
        position: relative;
        z-index: 110;
        border-radius: 15px;
        padding: 3rem 1rem;
        box-shadow: 3px 3px 10px -1px rgba(0, 0, 0, 0.25);
        -webkit-box-shadow: 3px 3px 10px -1px rgba(0, 0, 0, 0.25);
        -moz-box-shadow: 3px 3px 10px -1px rgba(0, 0, 0, 0.25);
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
        min-height: 350px;

        .container-champ {
            height: 350px;

            h3 {
                margin-top: 2rem;
                margin-bottom: 1.5rem;
                position: relative;
                z-index: 20;
            }

            .templateClock {
                position: relative;
                z-index: 120;
            }
        }


        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000000;
            opacity: .7;
            z-index: 10;
        }

    }
}

#footer {
    position: relative;
    z-index: 110;
}

@media screen and (min-width: 1023.98px) {

    #torneo {

        .hero__champ {

            .container-champ {

                h3 {
                    margin-top: 0;
                }
            }
        }

        .calendario {
            width: 75%;
            margin-top: -5.5rem;
        }
    }
}

@media screen and (min-width: 1279.98px) {

    #torneo {

        .calendario {
            width: 75%;
        }
    }
}

@media screen and (min-width: 1599.98px) {

    #torneo {

        .calendario {
            width: 70%;
        }
    }
}
</style>