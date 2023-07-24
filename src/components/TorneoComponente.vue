<script setup>
import { useApiStore } from 'src/stores/api';
import { onMounted } from 'vue';
const apiStore = useApiStore();
import { useRoute } from 'vue-router';
const route = useRoute();

//Generador de token y comprobacion de usuario
const loginUserApi = async() => {
    await apiStore.loginApi();
    await apiStore.getUser(apiStore.tokenApi);
}

//Traer calendario de la API
const getCalendar = async() => {
    apiStore.loadingSession = true;

    await loginUserApi();


    const idURL = route.params.id;

    const calendarios = await apiStore.getCalendarioApi(apiStore.tokenApi, idURL);

    const nombreTorneo = apiStore.torneos.forEach(torneo => {
        if(torneo.id == idURL){
            apiStore.torneo = torneo;

            apiStore.loadingSession = false;
        }
    });

}

//Traer torneos y sus datos de la API
const getTorneos = async() => {
    apiStore.loadingSession = true;

    await loginUserApi();
    const torneos = await apiStore.getTorneosApi(apiStore.tokenApi);

    apiStore.torneos = torneos;

    apiStore.loadingSession = false;
}

onMounted(() => {
    getCalendar();
    getTorneos();
})
</script>

<template>
    <q-spinner-gears v-if="apiStore.loadingSession"
      color="primary"
      size="6em"
    />
    <section id="torneo">
        <div class="hero__champ">
            <div class="row">
                <div class="col-12">
                    <h3 class="text-uppercase text-center text-weight-bold fontCustomTitle text-blue-grey-8 q-mb-none">
                        {{ apiStore.torneo.name }}
                    </h3>
                </div>
            </div>
        </div>

        <div class="calendario">
            <div class="row flex justify-center">
                <div class="col-12 col-md-6">
                    <!-- Tabla Resumen Campeonato -->
                    <div>
                        <h5 class="text-uppercase text-weight-light text-blue-grey-8 text-center q-mt-lg q-mb-sm">Calendario</h5>
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


<style lang="scss" scoped>
.q-spinner{
    height: 100vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(0, -50%);
    z-index: 100;
}
.hero__champ{

    h3{
        margin-top: 4rem;
    }
}
</style>