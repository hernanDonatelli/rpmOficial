<script setup>
import { ref } from 'vue';
import LapsInfoComponent from './LapsInfoComponent.vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar, QSpinnerGears } from 'quasar'
const useApi = useApiStore()
const $q = useQuasar()

defineProps(['idTorneo', 'orden', 'torneo', 'circuit', 'fecha'])

const dialog = ref(false)
const maximizedToggle = ref(true)
let timer;



const sesionesFront = (key) => {
    if (key == 'qualify') return key = 'Qualy 1'
    if (key == 'qualify2') return key = 'Qualy 2'
    if (key == 'serie1') return key = 'Serie 1'
    if (key == 'serie2') return key = 'Serie 2'
    if (key == 'serie3') return key = 'Serie 3'
    if (key == 'carreraCorta1') return key = 'Carrera Corta 1'
    if (key == 'carreraCorta2') return key = 'Carrera Corta 2'
    if (key == 'race') return key = 'Carrera'

}

const getResultsFecha = async (idTorneo, orden) => {

    await useApi.getVueltasRapidasApi(useApi.tokenApi, idTorneo, orden)

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-10',
        message: 'Cargando información...',
        messageColor: 'black'
    })

    await useApi.getResultsApi(useApi.tokenApi, idTorneo, orden)

    // hiding in 1s
    timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
    }, 250)

    if (useApi.sesiones.length == 0) {
        dialog.value = false

        $q.notify({
            color: "red-13",
            textColor: "white",
            icon: "warning",
            html: true,
            position: "bottom",
            message: `<span style='text-align: center;'>No hay resultados cargados para esta fecha.</span>`,
            timeout: 2000
        });

    } else {
        dialog.value = true

    }
}


</script>

<template>
    <q-btn size="sm" @click="getResultsFecha(idTorneo, orden)" flat color="red-13" label="Resultados" />
    <template>
        <div class="q-pa-md q-gutter-sm">
            <q-btn label="Maximized" color="primary" @click="dialog = true" />

            <q-dialog v-model="dialog" :maximized="maximizedToggle" transition-show="scale" transition-hide="scale"
                transition-duration="750">

                <q-card style="max-width: 90vw;" class="bg-blue-grey-1 text-white">
                    <q-bar>
                        <q-space />

                        <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimizar</q-tooltip>
                        </q-btn>
                        <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximizar</q-tooltip>
                        </q-btn>
                        <q-btn dense flat icon="close" v-close-popup>
                            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
                        </q-btn>
                    </q-bar>

                    <div class="row flex justify-between items-center q-mb-md">
                        <h4
                            class="title-header text-blue-grey-12 text-uppercase text-weight-bolder q-px-lg q-pt-lg q-my-none text-center montserratExtraBold">
                            {{
                                useApi.torneo.name }}</h4>
                        <p
                            class="fecha fontCustomTitle text-center text-blue-grey-10 text-uppercase text-weight-bolder q-mb-none q-pt-lg">
                            Fecha {{ orden }} - {{ circuit }} ({{ fecha }})
                        </p>
                    </div>

                    <h6 class="q-ma-none text-blue-grey-10 text-body2 text-center"><strong>Vueltas Rapidas</strong></h6>
                    <div class="flex column items-center row-md justify-md-center">
                        <template v-for="(value, key) in useApi.sesionesVR">
                            <p class="q-px-md-md text-blue-grey-8 q-ma-none text-caption">
                                <strong>{{ sesionesFront(key) }}:</strong> <em>{{ value.tiempoConvertido }} ({{ value.piloto }})</em>
                            </p>
                        </template>
                    </div>

                    <q-card-section class="q-pt-none">
                        <div v-for="(infoSesion, index) in useApi.sesiones" :key="index.id" class="sesiones q-pa-md">
                            <div class="flex items-center justify-start">
                                <h5 class="text-black text-uppercase text-weight-bold q-my-none">
                                    {{ useApi.tituloSesiones[index] }}
                                </h5>
                                <q-item class="replayLink q-ml-lg" clickable :href="`https://rpmracingleague.net`">
                                    <q-item-section class="downloadIcon" avatar>
                                        <q-icon name="las la-cloud-download-alt" />
                                        <q-item-label class="q-pt-xs q-ml-sm">Replay {{ useApi.tituloSesiones[index]
                                        }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    </q-item-section>
                                </q-item>
                            </div>
                            <!-- <hr class="separadorSessions"> -->
                            <!-- <q-btn push color="white" text-color="primary" label="Push" /> -->
                            <q-markup-table flat dense class="bg-blue-grey-1">
                                <thead>
                                    <tr>
                                        <th class="text-center fontCustomTitle text-uppercase">Posición</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Piloto</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vehiculo</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vueltas</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Tiempo Carrera</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Status</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vuelta Rapida</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Puntos</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Sanción</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Sesion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(value, key, index) in infoSesion" :key="index.id">
                                        <tr v-if="JSON.parse(value).posicion >= 1">
                                            <td class="text-center">{{ JSON.parse(value).posicion }}</td>
                                            <td class="text-center flex justify-between">
                                                <span>{{ key }}</span>
                                                <LapsInfoComponent :id="idTorneo" :driver="JSON.parse(value).idDriverInfo" :sesion="JSON.parse(value).idSessionInfo" :piloto="key" :orden="orden"/>
                                            </td>
                                            <td class="text-center">{{ JSON.parse(value).vehiculo }}</td>
                                            <td class="text-center">{{ JSON.parse(value).vueltas }}</td>
                                            <td class="text-center">{{ JSON.parse(value).posicion == 1 ?
                                                JSON.parse(value).tiempoCarrera : `${JSON.parse(value).gap}` }}</td>
                                            <td class="text-center">{{ JSON.parse(value).status }}</td>
                                            <td class="text-center">{{ JSON.parse(value).vueltaRapida }}</td>
                                            <td class="text-center">{{ JSON.parse(value).puntos }}</td>
                                            <td :class="JSON.parse(value).sancion != 0.000 ? 'bg-red-13 text-white' : ''"
                                            class="text-center">+{{ JSON.parse(value).sancion }}s</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </q-markup-table>
                        </div>
                    </q-card-section>
                </q-card>
            </q-dialog>
        </div>
    </template>
</template>


<style lang="scss" scoped>
.title-header,
.fecha {
    width: 100%;
}

.sesiones {
    position: relative;

    .replayLink {
        color: $red-6;
        padding: 0 1rem;
    }

    .downloadIcon {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-right: 0;
    }

    .separadorSessions {
        width: 40%;
        margin-left: 0;
        margin-bottom: 1rem;
    }
}

p.fecha {
    font-size: 1rem;
    line-height: 1.2rem;
}

@media screen and (min-width: 1022.98px) {
    .title-header {
        width: 50%;
        text-align: left;
    }

    .fecha {
        width: 50%;
        text-align: right;
        padding-right: 24px;
    }
}
</style>