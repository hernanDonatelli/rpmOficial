<script setup>
import CounterComponent from '../components/CounterComponent.vue'
import { useApiStore } from 'src/stores/api';
import { useUserStore } from 'src/stores/user'
import { onBeforeUpdate, ref } from 'vue';
const apiStore = useApiStore();
const userStore = useUserStore();

const yearCounter = ref(2023)
const monthCounter = ref(8)
const dayCounter = ref(25)
const fechasDay = ref([])

onBeforeUpdate(async () => {
  apiStore.torneos.forEach(async el => {

    el.posiciones = await apiStore.createTablasPosicionesApi(apiStore.tokenApi, el.id)

    // el.fechas = await fechaCountdown(el.id)
    await fechaCountdown(el.id)

  })


})


const fechaCountdown = async (id) => {
  let arrFecha = []
  let arrObjFecha = []
  let newObj = {}

  let calendario = await apiStore.getCalendarioHomeApi(apiStore.tokenApi, id)
  // console.log(calendario);

  calendario.forEach(item => {
    arrFecha.push(item.date)
  })

  arrFecha.forEach(el => {
    const fecha = el.split('-')

    newObj = {
      year: fecha[0],
      month: fecha[1],
      day: fecha[2]
    }

    arrObjFecha.push(newObj)

  })
  console.log(arrObjFecha);
  return arrObjFecha

}



</script>

<template>
  <div v-for="(torneo, index) in apiStore.torneos" :key="index" class="torneo" :style="{
    backgroundImage: `repeating-linear-gradient(#00000005, rgba(0, 0, 0, 0)),url(https://rpm.studioatlantic.com.ar/pezls/storage/app/public/images/tournament/${torneo.image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }">
    <div class="champ-container q-mb-lg">
      <div class="torneo-container q-pb-lg">
        <div class="overlay"></div>

        <!-- Cabecera de torneo -->
        <div class="torneo__header flex justify-between items-start row-md">
          <div
            class="titleLogo column justify-center items-center justify-sm-center col-12 col-sm-6 column-md justify-md-start">
            <h3 class="text-center text-uppercase montserratExtraBold text-white q-my-none q-pl-md">{{ torneo.name
            }}
            </h3>
            <p class="text-h5 text-white q-mb-none text-center">{{ torneo.simulator }}</p>
          </div>
          <div class="buttons flex row justify-around items-center col-sm-6 col-md-6 justify-md-end">
            <q-btn v-if="userStore.userData != null" class="q-mx-lg q-my-xs col-8 col-sm-6 col-md-3" icon="lab la-wpforms"
              style="background: #00bfa5; color: #212121; font-weight: bold;" label="Inscripción" />
            <q-btn :to="`torneo/${torneo.id}`" class="q-mx-lg q-my-xs col-8 col-sm-6 col-md-3" icon="las la-trophy"
              style="background: #ffffff; color: #212121; font-weight: bold;" label="Campeonato" />
            <q-btn class="q-mx-lg q-my-xs col-8 col-sm-6 col-md-3" icon="las la-external-link-alt"
              style="background: #ffffff; color: #212121; font-weight: bold;" label="Foro" />
          </div>
        </div>

        <!-- Footer de torneo -->
        <div class="footer row justify-end items-center">
          <!-- Proxima fecha -->
          <div class="next">
            <p class="text-white text-uppercase text-center q-my-none text-weight-light">Proximo Evento</p>
            <h4 class="edgarBold text-h5 text-uppercase text-center text-teal-13 q-my-none">Hungaroring</h4>

            <CounterComponent :year="2023" :month="11" :date="30" :hour="22" :minutes="0" :seconds="0" />
          </div>

          <!-- Tabla Resumen Campeonato -->



          <!-- <div class="tablePos row flex-column justify-center align-center q-pa-md">
            <h5 class="text-h6 text-weight-bold text-grey-13 text-center q-my-none">Top 5 Posiciones</h5>
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
                  <td class="text-center q-pt-none">{{ JSON.parse(value).posicion }}</td>
                  <td class="text-center">{{ key }}</td>
                  <td class="text-center">{{ JSON.parse(value).puntos }}</td>

                </tr>
              </tbody>
            </q-markup-table>
          </div> -->
        </div>
      </div>

    </div>

  </div>
</template>

<style lang="scss">
#campeonatos {
  position: relative;
  background-color: #000000;

  .positionList {
    position: relative;
    list-style-type: none;
    z-index: 50;
    display: flex;
    justify-content: space-around;
  }

  .torneo {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;


    .torneo-container {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 10px solid #6f6f6f;
      z-index: 20;
    }

    &__header {
      position: relative;
      z-index: 10;
      padding-top: 3%;

      .titleLogo {
        width: 100%;

        h3 {
          font-size: 2rem;
        }
      }

      .buttons {
        width: 100%;

        .btn-links:hover {
          background-color: red;
          color: green;
        }
      }

    }

    .next {
      width: 100%;
      position: relative;
      z-index: 20;
      margin-top: 2rem;

    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: .75;
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
    width: 62%;
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
