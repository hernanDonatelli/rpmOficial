<script setup>
import { useApiStore } from 'src/stores/api'
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar()
const useApi = useApiStore()

const torneo = ref('')
const noTorneo = ref('')

onMounted(() => {
    torneosApi()
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

const getPosiciones = async () => {

    useApi.tablaPosiciones = []

    const match = useApi.torneos.filter(item => item.name == torneo.value)

    match.forEach(item => {
        const idTorneo = item.id

        useApi.getPosicionesApi(JSON.parse(localStorage.getItem('token')), idTorneo)

    })


}

</script>

<template>
    <h4 class="text-uppercase text-center titleSection montserratExtraBold">Tablas de Posiciones</h4>

    <div class="row flex justify-center">
        <div class="col-4">
            <q-form @submit.prevent="getPosiciones" class="q-gutter-md">
                <div>
                    <div class="form-group q-mb-md">
                        <q-select color="red-13" label-color="red-13" item-aligned filled dense name="torneo"
                            v-model="torneo" :options="useApi.torneoOpt" hint="Seleccionar un Torneo" label="Torneo" />
                    </div>
                </div>
                <div class="row q-mt-xl">
                    <q-btn type="submit" class="q-mx-auto text-center" color="teal-14" text-color="white"
                        label="Buscar Tabla de Posiciones" />
                </div>
            </q-form>
        </div>
    </div>

    <div class="row flex justify-around q-mb-xl">
        <div class="col-8">
            <h5>Posiciones {{ torneo }}</h5>
            <q-markup-table flat dense class="bg-blue-grey-1">
                <thead class="bg-grey-13">
                    <tr>
                        <th class="text-center fontCustomTitle text-uppercase">Posición</th>
                        <th class="text-center fontCustomTitle text-uppercase">Piloto</th>
                        <th class="text-center fontCustomTitle text-uppercase">Carreras</th>
                        <th class="text-center fontCustomTitle text-uppercase">Victorias</th>
                        <th class="text-center fontCustomTitle text-uppercase">Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="typeof useApi.tablaPosiciones[0] != 'object'">
                        <tr>
                            <td colspan="5">
                                <p class="q-mb-none text-center colapse">{{ useApi.noTabla }}</p>
                            </td>
                        </tr>
                    </template>
                    <tr v-else v-for="(item, key) in useApi.tablaPosiciones[0]" :key="item.id">
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
</template>


<style lang="scss" scoped>
h4.titleSection{
    padding-top: 5rem;
}
</style>