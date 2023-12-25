<script setup>
import { ref } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar, QSpinnerGears } from 'quasar';
const useApi = useApiStore()
const $q = useQuasar()

defineProps(['idTorneo', 'orden', 'torneo', 'circuit', 'fecha'])

const dialog = ref(false)
const maximizedToggle = ref(true)
const bonus = ref(null)
let sanciones = ref([])
let timer;

const getResultsFecha = async (idTorneo, orden) => {

    $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-10',
        message: 'Cargando información...',
        messageColor: 'black'
    })

    await useApi.getResultsApi(useApi.tokenApi, idTorneo, orden)

    if (useApi.sesiones.length == 0) {
        // hiding in 1s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 100)

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
        // hiding in 1s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 250)

        dialog.value = true

    }
}

const aplicarSancion = async (idDriver, key) => {
    let timer;

    $q.dialog({
        title: 'Recargo',
        message: `Agregar los segundos de recargo al piloto ${key} (id: ${idDriver})`,
        prompt: {
            model: '', //model=tiempo
            type: 'text' // optional
        },
        cancel: true,
        persistent: true
    }).onOk(async (tiempo) => {
        $q.loading.show({
            spinner: QSpinnerGears,
            spinnerColor: 'red-13',
            spinnerSize: 140,
            backgroundColor: 'bg-grey-10',
            message: 'Cargando información...',
            messageColor: 'black'
        })

        await useApi.aplicarSancionApi(useApi.tokenApi, idDriver, tiempo)

        //hiding in 1s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 250)

    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {

    })
}

const dqSanction = async (idDriver, key) => {
    let timer;

    $q.dialog({
        title: 'Descalificación',
        message: `Vas a Descalificar al piloto ${key} (id: ${idDriver})`,
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

        await useApi.aplicarDQApi(useApi.tokenApi, idDriver)

        //hiding in 1s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 250)

    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {

    })
}

const aplicarBonusSesion = async (objeto, bonus) => {

    try {
        let sesion = null
        for (const [key, value] of Object.entries(objeto)) {
            const valor = JSON.parse(value)

            sesion = valor.idSessionInfo
        }

        $q.dialog({
            title: 'Aplicar Bonus a Sesión',
            message: `Vas a otorgar un bonus del ${bonus}% de los puntos para esta Sesión. Continuar?`,
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

            await useApi.aplicarBonusSesionApi(useApi.tokenApi, sesion, bonus)

            // hiding in 1s
            timer = setTimeout(() => {
                $q.loading.hide()
                timer = void 0
            }, 250)

            $q.notify({
                color: "teal-6",
                textColor: "white",
                icon: "done",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>Hecho! Has aplicado un bonus del ${bonus}% en los puntajes para esta Sesión.</span>`,
                timeout: 2000
            });

        }).onCancel(() => {
            $q.notify({
                color: "red-6",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>Has cancelado la operación.</span>`,
                timeout: 2000
            });
        }).onDismiss(() => {

        })
    } catch (error) {
        console.log(error);
    }
}

const quitarBonusSesion = async (objeto) => {

    try {
        let sesion = null
        for (const [key, value] of Object.entries(objeto)) {
            const valor = JSON.parse(value)

            sesion = valor.idSessionInfo
        }

        $q.dialog({
            title: 'Quitar Bonus de Sesión',
            message: `Vas a eliminar el bonus dados para esta Sesión. Continuar?`,
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

            await useApi.quitarBonusSesionApi(useApi.tokenApi, sesion)

            // hiding in 1s
            timer = setTimeout(() => {
                $q.loading.hide()
                timer = void 0
            }, 250)

            $q.notify({
                color: "teal-6",
                textColor: "white",
                icon: "done",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>Hecho! Has quitado el bonus que habias aplicado para esta Sesión.</span>`,
                timeout: 2000
            });

        }).onCancel(() => {
            $q.notify({
                color: "red-6",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>Has cancelado la operación.</span>`,
                timeout: 2000
            });
        }).onDismiss(() => {

        })
    } catch (error) {
        console.log(error);
    }
}

const aplicarBonusPiloto = async (idDriver, nombrePiloto) => {

    try {

        $q.dialog({
            title: `Sumar Puntos al Piloto ${nombrePiloto}`,
            message: `Vas a sumar puntos en concepto de bonus para el Piloto ${nombrePiloto}. Continuar?`,
            prompt: {
                model: '',
                isValid: val => val.length > 0,
            },
            cancel: true,
            persistent: true

        }).onOk(async (puntos) => {
            $q.loading.show({
                spinner: QSpinnerGears,
                spinnerColor: 'red-13',
                spinnerSize: 140,
                backgroundColor: 'bg-grey-10',
                message: 'Cargando información...',
                messageColor: 'black'
            })

            await useApi.aplicarBonusPilotoApi(useApi.tokenApi, idDriver, puntos)

            //hiding in 1s
            timer = setTimeout(() => {
                $q.loading.hide()
                timer = void 0
            }, 250)

            $q.notify({
                color: "teal-6",
                textColor: "white",
                icon: "done",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>Hecho! Has aplicado un bonus de ${puntos} puntos a ${nombrePiloto}.</span>`,
                timeout: 2000
            });

        }).onCancel(() => {
            $q.notify({
                color: "red-6",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>Has cancelado la operación.</span>`,
                timeout: 2000
            });
        }).onDismiss(() => {

        })
    } catch (error) {
        console.log(error);
    }
}

const quitarBonusPiloto = async (idDriver, nombrePiloto) => {

    try {

        $q.dialog({
            title: `Quitar Bonus al Piloto ${nombrePiloto}`,
            message: `Vas a quitarle el bonus al Piloto ${nombrePiloto}. Continuar?`,
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

            await useApi.quitarBonusPilotoApi(useApi.tokenApi, idDriver)

            //hiding in 1s
            timer = setTimeout(() => {
                $q.loading.hide()
                timer = void 0
            }, 250)

            $q.notify({
                color: "teal-6",
                textColor: "white",
                icon: "done",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>Hecho! Le haz quitado el bonus a ${nombrePiloto}.</span>`,
                timeout: 2000
            });

        }).onCancel(() => {
            $q.notify({
                color: "red-6",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>Has cancelado la operación.</span>`,
                timeout: 2000
            });
        }).onDismiss(() => {

        })
    } catch (error) {
        console.log(error);
    }
}

</script>

<template>
    <q-btn size="sm" @click="getResultsFecha(idTorneo, orden)" flat color="red-13" label="Resultados" />
    <template>
        <div class="q-pa-md q-gutter-sm">
            <q-btn label="Maximized" color="primary" @click="dialog = true" />

            <q-dialog v-model="dialog" :maximized="maximizedToggle" transition-show="scale" transition-hide="scale"
                transition-duration="500">

                <q-card style="max-width: 95vw; max-height: 95vh;" class="bg-blue-grey-1 text-white">
                    <q-bar>
                        <q-space />

                        <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
                        </q-btn>
                        <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
                        </q-btn>
                        <q-btn dense flat icon="close" v-close-popup>
                            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                        </q-btn>
                    </q-bar>

                    <div class="row flex column">
                        <h6 class="text-grey-8 text-center q-my-none">Sesiones cargadas</h6>
                        <ul class="q-my-none q-px-none">
                            <li v-for="sesion in useApi.tituloSesiones" :key="sesion.id"
                                class="sesiones text-overline text-grey-8 text-center q-my-none q-mx-md">
                                {{ sesion }}
                            </li>
                        </ul>
                    </div>

                    <div class="row flex justify-between align-center">
                        <p
                            class="fecha text-blue-grey-10 text-overline text-uppercase text-weight-bolder q-mb-none q-px-lg q-pt-lg">
                            Fecha {{ orden }} - {{ circuit }} ({{ fecha }})
                        </p>
                        <h4 class="text-blue-grey-12 text-uppercase text-weight-bolder q-px-lg q-pt-lg q-my-none">{{
                            torneo[0] }}</h4>
                    </div>

                    <q-card-section class="q-pt-none">
                        <div v-for="(infoSesion, index) in useApi.sesiones" :key="index.id" class="q-pa-md">
                            <div class="flex items-center">
                                <h5 class="text-black text-uppercase text-weight-bold q-mr-xl">
                                    {{ useApi.tituloSesiones[index] }}
                                </h5>
                                <q-input style="width: 255px;" type="number" v-model="bonus" label="Bonus"
                                    hint="Ej: 100% duplica los puntos otorgados por Sesión" dense />
                                <q-btn class="q-ml-md" @click="aplicarBonusSesion(infoSesion, bonus)" type="submit"
                                    size="sm" color="teal-6" text-color="white" label="Aplicar Bonus" />
                                <q-btn class="q-ml-md" @click="quitarBonusSesion(infoSesion)" type="submit" size="sm"
                                    color="red-6" text-color="white" label="Quitar Bonus" />
                            </div>
                            <q-markup-table flat dense class="bg-blue-grey-1">
                                <thead class="bg-grey-13">
                                    <tr>
                                        <th class="text-center fontCustomTitle text-uppercase">Posición</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Piloto</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vehiculo</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vueltas</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Gap</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Status</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vuelta Rapida</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Puntos</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Acción</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Sanción</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Bonus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(value, key, index) in infoSesion" :key="index.id">
                                        <tr v-if="JSON.parse(value).posicion >= 1">
                                            <td class="text-center">{{ JSON.parse(value).posicion }}</td>
                                            <td class="text-center">{{ key }}</td>
                                            <td class="text-center">{{ JSON.parse(value).vehiculo }}</td>
                                            <td class="text-center">{{ JSON.parse(value).vueltas }}</td>
                                            <td :class="JSON.parse(value).sancion == '0:00.000' ? 'bg-blue-grey-1' : 'text-red-13 text-weight-bolder'"
                                                class="text-center">{{ JSON.parse(value).posicion == 1 ?
                                                JSON.parse(value).tiempoCarrera : `${JSON.parse(value).gap}` }}</td>
                                            <td :class="JSON.parse(value).status === 'DQ' ? 'bg-red-13 text-white' : ''"
                                                class="text-center">{{ JSON.parse(value).status }}</td>
                                            <td class="text-center">{{ JSON.parse(value).vueltaRapida }}</td>
                                            <td :class="`${JSON.parse(value).puntos}` > 0 ? 'text-bold' : 'text-light'"
                                                class="text-center">
                                                {{ JSON.parse(value).puntos }}
                                            </td>

                                            <td class="text-center">
                                                <div class="flex justify-around q-mb-xs">
                                                    <q-btn @click="aplicarBonusPiloto(JSON.parse(value).idDriverInfo, key)"
                                                        size="sm" color="teal-6" text-color="white" label="+ Bonus" />
                                                    <q-btn @click="quitarBonusPiloto(JSON.parse(value).idDriverInfo, key)"
                                                        size="sm" color="brown-6" text-color="white" label="- Bonus" />
                                                    <q-btn @click="aplicarSancion(JSON.parse(value).idDriverInfo, key)"
                                                        size="sm" color="warning" text-color="black" label="Sancion" />
                                                    <q-btn class="q-mt-xs"
                                                        @click="dqSanction(JSON.parse(value).idDriverInfo, key)" size="sm"
                                                        color="red-13" text-color="white" label="DQ" />
                                                </div>
                                            </td>
                                            <td :class="JSON.parse(value).sancion == '0:00.000' ? 'bg-blue-grey-1' : 'bg-red-13 text-white'"
                                                class="text-center">+{{ JSON.parse(value).sancion }}s</td>
                                            <td :class="`${JSON.parse(value).bonus}` != 0 ? 'bg-teal-14 text-white' : 'text-blue-grey-3'"
                                                class="text-center">
                                                {{ JSON.parse(value).bonus }}
                                            </td>
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
p.fecha {
    font-size: 1rem;
    line-height: 2.5rem;
}

ul {
    text-align: center;
}

li.sesiones {
    font-size: .85rem;
    list-style: none;
    display: inline-block;

}
</style>