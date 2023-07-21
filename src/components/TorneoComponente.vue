<script setup>
import { useApiStore } from 'src/stores/api';
import { onMounted } from 'vue';
const apiStore = useApiStore();

//Generador de token y comprobacion de usuario
const loginUserApi = async() => {
    await apiStore.loginApi();
    await apiStore.getUser(apiStore.tokenApi);
}

//Traer calendario de la API
const getCalendar = async() => {
    await loginUserApi();
    const calendario = await apiStore.getCalendarioApi(apiStore.tokenApi);

    apiStore.calendar = calendario;
}

//Traer torneos y sus datos de la API
const getTorneos = async() => {
    await loginUserApi();
    const torneos = await apiStore.getTorneosApi(apiStore.tokenApi);

    apiStore.torneos = torneos;
}

onMounted(() => {
    getCalendar();
    getTorneos();
})
</script>

<template>
    <section id="torneo">
        <div class="hero__champ">
            <div class="row">
                <div class="col-12">
                    <!-- <pre>{{ apiStore.torneos }}</pre> -->
                    <h2>Nombre Torneo</h2>
                </div>
            </div>
        </div>

        <div class="calendario">
            <div class="row flex justify-center">
                <div class="col-12 col-md-6">
                    <!-- Tabla Resumen Campeonato -->
                    <div>
                        <h5 class="text-h6 text-weight-light text-grey-13 text-center q-my-none">Calendario</h5>
                        <q-markup-table dense>
                            <thead>
                                <tr>
                                    <th class="text-center">Fecha</th>
                                    <th class="text-center">Dia</th>
                                    <th class="text-center">Circuito</th>
                                    <th class="text-center">Resultados</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="fecha in apiStore.calendar" :key="fecha.id">
                                    <td class="text-center">{{ fecha.order }}</td>
                                    <td class="text-center">{{ fecha.date }}</td>
                                    <td class="text-center">{{ fecha.circuit }}</td>
                                    <td class="text-center"><a href="#">Resultados</a></td>
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" scoped></style>