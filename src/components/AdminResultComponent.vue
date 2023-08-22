<script setup>
import { ref } from 'vue';
import { useApiStore } from 'src/stores/api';
import { useQuasar } from 'quasar';
const useApi = useApiStore()
const $q = useQuasar()

defineProps(['idTorneo', 'orden', 'torneo', 'circuit', 'fecha'])

const dialog = ref(false)
const maximizedToggle = ref(true)
let sanciones = ref([])

const getResultsFecha = async (idTorneo, orden) => {

    await useApi.getResultsApi(useApi.tokenApi, idTorneo, orden)

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

const aplicarSancion = async (idDriver, key, idTorneo, orden) => {
    $q.dialog({
        title: 'Recargo',
        message: `Agregar los segundos de recargo al piloto ${key} (id: ${idDriver})`,
        prompt: {
            model: '',
            type: 'text' // optional
        },
        cancel: true,
        persistent: true
    }).onOk(tiempo => {
        const respuesta = `El piloto ${key} ha sido sancionado con ${tiempo}seg`

        useApi.aplicarSancionApi(useApi.tokenApi, idDriver, tiempo)

    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {

    })
}


</script>

<template>
    <q-btn size="sm" @click="getResultsFecha(idTorneo, orden)" flat color="red-13" label="Resultados" />
    <template>
        <div class="q-pa-md q-gutter-sm">
            <q-btn label="Maximized" color="primary" @click="dialog = true" />

            <q-dialog v-model="dialog" persistent :maximized="maximizedToggle" transition-show="scale"
                transition-hide="scale">

                <q-card class="bg-blue-grey-1 text-white">
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

                    <div class="row flex justify-between align-center">
                        <p class="fecha text-blue-grey-10 text-overline text-uppercase text-weight-bolder q-mb-none q-px-lg q-pt-lg">Fecha {{ orden }} - {{ circuit }} ({{ fecha }})
                        </p>
                        <h4 class="text-blue-grey-12 text-uppercase text-weight-bolder q-px-lg q-pt-lg q-my-none">{{ torneo[0] }}</h4>
                    </div>

                    <div class="text-black">
                        <p class="q-mb-none" v-for="sancion in sanciones" :key="sancion.id">
                            {{ sancion }}
                        </p>
                    </div>

                    <q-card-section class="q-pt-none">
                        <div v-for="(infoSesion, index) in useApi.sesiones" :key="index.id" class="q-pa-md">
                            <h5 class="text-black text-uppercase text-weight-bold q-my-sm">
                                {{ useApi.tituloSesiones[index] }}
                            </h5>
                            <q-markup-table flat dense class="bg-blue-grey-1">
                                <thead class="bg-grey-13">
                                    <tr>
                                        <th class="text-center fontCustomTitle text-uppercase">Posición</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Piloto</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vehiculo</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vueltas</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Tiempo Carrera</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Status</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Vuelta Rapida</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Puntos</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Acción</th>
                                        <th class="text-center fontCustomTitle text-uppercase">Sanción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(value, key, index) in infoSesion" :key="index.id">
                                        <tr v-if="JSON.parse(value).posicion >= 1">
                                            <td class="text-center">{{ JSON.parse(value).posicion }}</td>
                                            <td class="text-center">{{ key }}</td>
                                            <td class="text-center">{{ JSON.parse(value).vehiculo }}</td>
                                            <td class="text-center">{{ JSON.parse(value).vueltas }}</td>
                                            <td class="text-center">{{ JSON.parse(value).posicion == 1 ?
                                                JSON.parse(value).tiempoCarrera : `${JSON.parse(value).gap}` }}</td>
                                            <td class="text-center">{{ JSON.parse(value).status }}</td>
                                            <td class="text-center">{{ JSON.parse(value).vueltaRapida }}</td>
                                            <td class="text-center">{{ JSON.parse(value).puntos }}</td>
                                            <td class="text-center">
                                                <q-btn @click="aplicarSancion(JSON.parse(value).idDriverInfo, key)" size="sm"
                                                    color="red-13" text-color="white" label="Sancionar" />
                                            </td>
                                            <td class="text-center">+{{ JSON.parse(value).sancion }}s</td>
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
p.fecha{
    font-size: 1rem;
    line-height: 2.5rem;
}
</style>