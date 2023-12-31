<script setup>
import { ref } from 'vue'
import { useApiStore } from 'src/stores/api';
import { useQuasar, QSpinnerGears } from 'quasar'
const useApi = useApiStore()
const $q = useQuasar()

defineProps(['id', 'sesion', 'driver', 'piloto', 'orden', 'tituloSesion', 'posicion', 'vehiculo'])

const dialogLaps = ref(false)
const maximizar = ref(true)
let timer;

const getVueltasDriver = async (id, sesion, driver) => {

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-10',
        message: 'Cargando información...',
        messageColor: 'black'
    })

    await useApi.getVueltasDriverApi(useApi.tokenApi, id, sesion, driver)

    // hiding in 1s
    timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
    }, 250)

    if (useApi.vueltasDriver == 0) {
        dialogLaps.value = false

        $q.notify({
            color: "red-13",
            textColor: "white",
            icon: "warning",
            html: true,
            position: "top",
            message: `<span style='text-align: center;'>No hay información para este piloto.</span>`,
            timeout: 2000
        });

    } else {
        dialogLaps.value = true

    }
}
</script>

<template>
    <q-btn icon="las la-info-circle" size="sm" @click="getVueltasDriver(id, sesion, driver, piloto)" flat color="lime-11" />
    <template>
        <div class="q-pa-md q-gutter-sm">
            <q-btn label="Maximized" color="primary" @click="dialogLaps = true" />

            <q-dialog id="lapsDriver" v-model="dialogLaps" :maximized="maximizar" transition-show="scale"
                transition-hide="scale" transition-duration="750">

                <q-card id="cardVR" class="text-white bg-blue-grey-10">
                    <q-bar class="bg-blue-grey-9">
                        <q-space />

                        <q-btn dense flat icon="minimize" @click="maximizar = false" :disable="!maximizar">
                            <q-tooltip v-if="maximizar" class="bg-white text-primary">Minimizar</q-tooltip>
                        </q-btn>
                        <q-btn dense flat icon="crop_square" @click="maximizar = true" :disable="maximizar">
                            <q-tooltip v-if="!maximizar" class="bg-white text-primary">Maximizar</q-tooltip>
                        </q-btn>
                        <q-btn dense flat icon="close" v-close-popup>
                            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
                        </q-btn>
                    </q-bar>

                    <div class="row flex column row-md justify-between items-center q-mb-md q-pt-sm">
                        <div class="flex items-end justify-center">
                            <h4
                                class="title-header text-blue-grey-11 text-uppercase q-px-lg q-my-none text-center montserratRegular">
                                <span class="text-lime-11 text-h3">{{ posicion }}.</span><span class="montserratExtraBold">{{
                                    piloto }}</span>
                            </h4>
                            <span class="fontCustomTitle text-blue-grey-5 text-h6 block q-mb-xs q-pl-xs">{{ vehiculo }}</span>
                        </div>
                        <h6
                            class="text-h6 title-header text-blue-grey-12 text-uppercase text-weight-bolder q-pt-none q-px-lg  q-my-none text-center montserratExtraBold">
                            <span class="text-lime-11">{{ tituloSesion }}</span>
                        </h6>
                    </div>

                    <q-card-section class="q-pt-none">
                        <q-markup-table flat dense class="q-pb-md text-blue-grey-11 bg-blue-grey-10">
                            <thead>
                                <tr>
                                    <th class="text-center fontCustomTitle text-uppercase">Vuelta</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Sector 1</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Sector 2</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Sector 3</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Sector 4</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Neumático</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Cortes</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Tiempo Vuelta</th>
                                    <th class="text-center fontCustomTitle text-uppercase">Posición</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vuelta in useApi.vueltasDriver[0]" class="sesiones q-pa-md">
                                    <td class="text-center">{{ vuelta.lapNumber }}</td>
                                    <td class="text-center">{{ vuelta.s1 }}</td>
                                    <td class="text-center">{{ vuelta.s2 }}</td>
                                    <td class="text-center">{{ vuelta.s3 }}</td>
                                    <td class="text-center">{{ vuelta.s4 }}</td>
                                    <td class="text-center">{{ vuelta.tyre === '' ? 'No especificado' : vuelta.tyre }}</td>
                                    <td class="text-center">{{ vuelta.cuts }}</td>
                                    <td class="text-center">{{ vuelta.lapTime }}</td>
                                    <td class="text-center">{{ vuelta.position }}</td>
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </q-card-section>
                </q-card>
            </q-dialog>
        </div>
    </template>
</template>


<style lang="scss" scoped>
#lapsDriver {

    #cardVR {
        max-width: 85vw;
    }

    .q-dialog__inner--maximized>div {
        height: auto;
    }

    .q-table--horizontal-separator thead th {
        border-bottom-color: rgba($blue-grey-2, .2);
    }

    .q-table--horizontal-separator tbody tr:not(:last-child)>td {
        border-bottom-color: rgba($blue-grey-2, .2);
    }
}

@media screen and (min-width: 1365.98px) {
    #lapsDriver {

        #cardVR {
            max-width: 75vw;
        }
    }
}

@media screen and (min-width: 1599.98px) {
    #lapsDriver {

        #cardVR {
            max-width: 65vw;
        }
    }
}
</style>