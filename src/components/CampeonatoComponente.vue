<script setup>
import CounterComponent from '../components/CounterComponent.vue'
import { useApiStore } from 'src/stores/api';
import { onBeforeMount, onMounted, onUpdated } from 'vue';
const apiStore = useApiStore();

onBeforeMount(() => {
  console.log('Antes de Montar');
})

onMounted(() => {
  console.log('Mounted');
})

onUpdated(() => {
  // console.log('Updated');
  // console.log(apiStore.torneos);
  apiStore.torneos.forEach(async el => {

    el.posiciones = await apiStore.createTablasPosicionesApi(apiStore.tokenApi, el.id)

  })
})



</script>

<template>
  <div v-for="torneo in apiStore.torneos" :key="torneo.id" class="torneo" :style="{
    backgroundImage: `repeating-linear-gradient(#00000005, rgba(0, 0, 0, 0)),url(https://rpmracingleague.net/images/laravel-torneos/${torneo.image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }">
    <div class="torneo-container">
      <div class="overlay"></div>

      <!-- Cabecera de torneo -->
      <div class="torneo__header flex justify-between items-center row-md">
        <div
          class="titleLogo column justify-center items-center justify-sm-center col-12 col-sm-6 column-md justify-md-start">
          <h3 class="text-h3 text-center text-uppercase text-weight-bold text-white q-my-none q-pl-md">{{ torneo.name }}
          </h3>
          <p class="text-h5 text-grey-8 q-mb-none text-center">({{ torneo.simulator }})</p>
        </div>
        <div class="buttons flex row justify-around items-center q-mt-md col-sm-6 col-md-6 justify-md-end">
          <q-btn class="q-mx-lg q-my-xs btn-links col-8 col-sm-6 col-md-3" icon="lab la-wpforms" outline
            style="color: lightgrey;" label="Inscripción" />
          <q-btn :to="`torneo/${torneo.id}`" class="q-mx-lg q-my-xs btn-links col-8 col-sm-6 col-md-3"
            icon="las la-trophy" outline style="color: lightgrey;" label="Campeonato" />
          <q-btn class="q-mx-lg q-my-xs btn-links col-8 col-sm-6 col-md-3" icon="las la-external-link-alt" outline
            style="color: lightgrey;" label="Foro" />
        </div>
      </div>

      <!-- Footer de torneo -->
      <div class="footer row justify-between items-center">
        <!-- Proxima fecha -->
        <div class="next">
          <p class="text-grey-13 text-center q-my-none text-weight-light ">Proximo Evento</p>
          <h4 class="text-h4 text-uppercase text-weight-bold text-center text-red-13 q-my-none">Zandvoort GP</h4>
          <CounterComponent :year="2023" :month="8" :date="30" :hour="22" :minutes="0" :seconds="0" />
        </div>

        <!-- Tabla Resumen Campeonato -->
        <div class="tablePos row flex-column justify-center align-center q-pa-md">
          <h5 class="text-h6 text-weight-light text-grey-13 text-center q-my-none">Posiciones</h5>
          <q-markup-table dense>
            <thead>
              <tr>
                <th class="text-center">Posicion</th>
                <th class="text-center">Piloto</th>
                <th class="text-center">Puntos</th>
              </tr>
            </thead>
            <tbody v-for="(value, key, index) in torneo.posiciones" :key="index">
              <tr v-if="index >= 0 && index < 5">
                  <td class="text-center">{{ JSON.parse(value).posicion }}</td>
                  <td class="text-center">{{ key }}</td>
                  <td class="text-center">{{ JSON.parse(value).puntos }}</td>

              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#campeonatos {
  position: relative;

  .torneo {
    position: relative;
    height: 100vh;
    padding-top: 72px;

    .torneo-container {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &__header {
      position: relative;
      z-index: 10;
      padding-top: 3%;

      .titleLogo {
        width: 100%;
      }

      .buttons {
        width: 100%;

        .btn-links:hover {
          background-color: red;
          color: green;
        }
      }

    }

    .tablePos {
      position: relative;
      z-index: 20;
      width: 100%;
      margin: 2rem 0;

      h5 {
        width: 100%;
      }

      .q-table th,
      .q-table td {
        border-bottom: 1px solid $grey-10;
      }

      .q-table__card {
        background-color: transparent;
        color: $grey-13;
        box-shadow: none;
        width: 100%;
      }
    }

    .next {
      width: 100%;
      position: relative;
      z-index: 20;
      margin-top: 2rem;

      p {
        letter-spacing: .75rem;
      }
    }

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
  }
}

@media screen and (min-width: 767.98px) {
  #campeonatos .torneo .tablePos {
    width: 50%;

    .q-table__container {
      width: 100%;
    }
  }

  #campeonatos .torneo .next {
    width: 50%;
  }

  .buttons {
    width: 80%;
  }

}

@media screen and (min-width: 991.98px) {
  #campeonatos .torneo .tablePos {
    width: 40%;

    .q-table__container {
      width: 100%;
    }
  }

  #campeonatos .torneo__header .buttons {
    width: 60%;
  }

  #campeonatos .torneo__header .titleLogo {
    width: 40%;
  }

  .torneo-container {
    max-width: 992px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

@media screen and (min-width: 1279.98px) {
  #campeonatos .torneo .tablePos {
    width: 35%;

  }

  #campeonatos .torneo .next {
    width: 33%;
  }

  #campeonatos .torneo__header .titleLogo {
    width: 33%;
  }

  .buttons {
    width: 33%;
  }

  .torneo-container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

  }
}

@media screen and (min-width: 1599.98px) {
  #campeonatos .torneo .tablePos {
    width: 40%;
  }
}
</style>
