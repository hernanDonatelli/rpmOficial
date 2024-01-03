<script setup>
import CounterComponent from '../components/CounterComponent.vue'
import { useApiStore } from 'src/stores/api';
import { useUserStore } from 'src/stores/user'
import { userDatabaseStore } from 'src/stores/database'
import { onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';

const apiStore = useApiStore();
const userStore = useUserStore();
const useDatabase = userDatabaseStore();
const $q = useQuasar()

onMounted(async () => {
  await fechaCountdown()
})
onUnmounted(() => {
  apiStore.arrayFechasCounter = []
})

const fechaCountdown = async () => {
  let resultObj = {}

  const torneos = await apiStore.getTorneosApi(JSON.parse(localStorage.getItem('token')))

  try {

    torneos.forEach(async torneo => {

      const fecha = await apiStore.proximaFechaApi(JSON.parse(localStorage.getItem('token')), torneo.id)

      if (fecha) {

        const arrFecha = fecha.date.split('-');
        const circuito = fecha.circuit

        //console.log(arrFecha);
        resultObj = {
          id: torneo.id,
          year: arrFecha[0],
          month: arrFecha[1],
          day: arrFecha[2],
          circuit: circuito
        }

        apiStore.arrayFechasCounter.push((resultObj))
      } else {
        return
      }


    });

  } catch (error) {
    console.log(error);
  }


}

const borderTorneo = (torneo) => {

  if (torneo == 'Assetto Corsa') return 'borde-Assetto'
  if (torneo == 'rFactor2') return 'borde-rFactor2'
  if (torneo == 'Simulador TC') return 'borde-simuladorTC'
  if (torneo == 'rFactor') return 'borde-rFactor'

}

const colorCounter = (torneo) => {

  if (torneo == 'Assetto Corsa') return 'counter-Assetto'
  if (torneo == 'rFactor2') return 'counter-rFactor2'
  if (torneo == 'Simulador TC') return 'counter-simuladorTC'
  if (torneo == 'rFactor') return 'counter-rFactor'

}

const colorBtn = (simulador) => {

  if (simulador == 'Assetto Corsa') return 'btn-Assetto'
  if (simulador == 'rFactor2') return 'btn-rFactor2'
  if (simulador == 'Simulador TC') return 'btn-simuladorTC'
  if (simulador == 'rFactor') return 'btn-rFactor'

}

const inscripcionTorneo = async (precio, torneo, simulador, nombre, apellido, nickname, email, movil) => {

  $q.dialog({
    title: `<h5 class="text-center text-h5 text-uppercase q-my-none montserratExtraBold font-weight-bold">Inscripción Torneo ${torneo}</h5><hr class="separador"/>`,
    message: `<p>Hola <strong>${nombre} ${apellido} (${nickname})</strong>, vas a comenzar tu pre-inscripción al <strong>Torneo         ${torneo} (${simulador})</strong> por un valor de <strong>$${Number(precio)}</strong>.</p>
            <p>Clickeando en <strong>Ok</strong> se enviará un email a la Administración y dentro de las próximas 48hs se contactarán contigo para confirmar y finalizar la inscripción.</p>
            <p>De lo contrario haz click en <strong>Cancelar</strong> para anular la inscripción.</p>`,
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      push: true,
      color: 'teal-6'
    },
    cancel: {
      push: true,
      color: 'red-6',
      label: 'Cancelar'
    }
  }).onOk(async () => {
    const inscripcion = {
      tipoComunicacion: 'inscripcion',
      torneo: torneo,
      emailDestinatario: 'hernandonatelli@gmail.com',
      emailRemitente: email,
      nombre: nombre,
      apellido: apellido,
      user: nickname,
      movil: movil,
      simulador: simulador,
      precio: precio
    }

    await apiStore.enviarComunicacionAPI(apiStore.tokenApi, inscripcion)

  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

</script>

<template>
  <h3 class="text-uppercase montserratExtraBold text-weight-bold text-center text-grey-5 q-mb-none q-pb-xl">
    Campeonatos</h3>
  <template v-for="(torneo, index) in apiStore.torneos" :key="index">
    <div v-if="torneo.status == 1" class="torneo" :style="{ backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 1) 85%),url(https://rpm.studioatlantic.com.ar/pezls/storage/app/public/images/tournament/${torneo.image})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'right'
    }">
      <div class="champ-container q-mb-lg">
        <div :class="borderTorneo(torneo.simulator)" class="torneo-container">
          <p class="simulador fontCustomTitle text-h5 text-white q-mb-none text-center text-uppercase text-weight-bold">{{
            torneo.simulator }}</p>

          <div class="overlay"></div>

          <!-- Cabecera de torneo -->
          <div class="torneo__header flex justify-between items-center row-md">
            <div
              class="titleLogo column justify-center items-center justify-sm-center col-12 col-sm-6 column-md justify-md-start">
              <h3 class="text-center text-uppercase montserratExtraBold text-white q-my-md q-pl-none">{{
                torneo.name
              }}
              </h3>
            </div>

            <!-- Botones -->
            <div class="buttons flex row justify-evenly items-center justify-md-end col-sm-6 col-md-12">
              <q-btn
                @click="inscripcionTorneo(torneo.price, torneo.name, torneo.simulator, useDatabase.documents[0].nombre, useDatabase.documents[0].apellido, useDatabase.documents[0].nickname, useDatabase.documents[0].email, useDatabase.documents[0].movil)"
                v-if="userStore.userData != null" :class="colorBtn(torneo.simulator)"
                class="text-white q-mx-sm q-my-xs col-8 col-md-3" icon="lab la-wpforms" style="font-weight: bold;"
                label="Inscripción">
                <q-tooltip class="text-caption bg-blue-grey-11 text-black" transition-show="flip-right"
                  transition-hide="flip-left">
                  Pre-inscribite al Torneo {{ torneo.name }}
                </q-tooltip>
              </q-btn>
              <q-btn :href="`torneo/${torneo.id}`" class="q-mx-sm q-my-xs col-8 col-md-3" icon="las la-trophy"
                style="background: #ffffff; color: #212121; font-weight: bold;" label="Campeonato">
                <q-tooltip class="text-caption bg-blue-grey-11 text-black" transition-show="flip-right"
                  transition-hide="flip-left">
                  Fechas, resultados y estadísticas.
                </q-tooltip>
              </q-btn>
              <q-btn :href="torneo.forumURL" target="_blank" class="q-mx-sm q-my-xs col-8 col-md-3"
                icon="las la-external-link-alt" style="background: #ffffff; color: #212121; font-weight: bold;"
                label="Foro">
                <q-tooltip class="text-caption bg-blue-grey-11 text-black" transition-show="flip-right"
                  transition-hide="flip-left">
                  Foro exclusivo del Torneo
                </q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Footer de torneo -->
          <div class="footer row justify-between items-end justify-md-end items-md-center q-pt-md-xl q-pb-lg q-pb-md-md">
            <!-- Precio -->
            <div class="price">
              <h4 class="fontCustomTitle text-h3 text-center text-white text-weight-bold q-mb-none q-mt-md-none">${{
                Number(torneo.price) }}</h4>
              <div class="pagos flex no-wrap items-center justify-center justify-md-start">
                <img src="~assets/mp2_rpm.png" />
                <img src="~assets/transfer2_rpm.png" style="width: 32px; height: 35px; margin-left: .7rem;" />
              </div>
              <!-- <p class="fontCustomTitle text-white text-uppercase text-h6 q-mb-xs">Valor</p> -->
            </div>

            <!-- Proxima fecha -->
            <div class="next">
              <!-- Contador Regresivo -->
              <template v-for="counter in apiStore.arrayFechasCounter" :key="index">

                <p v-if="torneo.id == counter.id"
                  class="text-white text-uppercase text-center q-my-none text-weight-light">
                  Proximo Evento: <span :class="colorCounter(torneo.simulator)" class="text-weight-bold">{{ counter.day
                  }}-{{ counter.month }}-{{ counter.year }}</span>
                </p>
                <h5 v-if="torneo.id == counter.id" :class="colorCounter(torneo.simulator)"
                  class="fontCustomTitle text-h5 text-uppercase text-center q-my-none">{{ counter.circuit }}</h5>

                <CounterComponent v-if="torneo.id == counter.id" :year="counter.year" :month="counter.month - 1"
                  :date="counter.day" :hour="22" :minutes="0" :seconds="0" />
              </template>

            </div>
          </div>
        </div>

      </div>

    </div>


  </template>
  <!-- <div class="flex justify-center finalizados">
    <h6 class="text-h6 q-my-md montserratExtraBold text-uppercase">
      <q-btn :href="`torneos-finalizados`" class="col-md-3" :disable="torneo.status != 2" icon="las la-trophy"
        style="font-weight: bold;" color="primary" label="Torneos Finalizados" :ripple="{ color: 'red' }">
        <q-tooltip v-if="torneo.status == 1" style="background-color: transparent;"
          class="text-caption text-regular text-white" transition-show="scale" transition-hide="scale">
          Aún no hay Torneos Finalizados!
        </q-tooltip>
      </q-btn>
    </h6>
  </div> -->
</template>

<style lang="scss">
.q-dialog__inner--minimized>div {
  background-image: repeating-linear-gradient(rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.95)),
    url(../assets/background.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  max-width: 750px !important;
  width: 80%;
  max-height: 80vh;
  padding: 2%;

  .q-card__section.q-card__section--vert.q-dialog__title {
    padding-top: 0;
  }

  button {
    padding: 0 30px;
  }
}

.separador {
  width: 15%;
  height: 3px;
  background-color: #000000;
  margin-bottom: 0;
}

#campeonatos {

  h3 {
    font-size: 2.5rem;
  }

  .positionList {
    position: relative;
    list-style-type: none;
    z-index: 50;
    display: flex;
    justify-content: space-around;
  }

  .finalizados a {
    text-decoration: none;
    color: $grey-10;

    &:hover {
      color: $red-6;
      transition: all .2s ease-in-out;
    }
  }

  .torneo {
    position: relative;
    max-width: 85%;
    margin: 0 auto;
    box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.75);

    .borde-rFactor.torneo-container {
      border-top: 45px solid $deep-orange-13;
      border-bottom: 2px solid $deep-orange-13;
    }

    .borde-rFactor2.torneo-container {
      border-top: 45px solid $lime-6;
      border-bottom: 2px solid $lime-6;
    }

    .borde-Assetto.torneo-container {
      border-top: 45px solid $purple-14;
      border-bottom: 2px solid $purple-14;
    }

    .borde-simuladorTC.torneo-container {
      border-top: 45px solid $light-blue-13;
      border-bottom: 2px solid $light-blue-13;
    }

    .counter-Assetto {
      color: $purple-14;
    }

    .counter-rFactor {
      color: $deep-orange-13;
    }

    .counter-rFactor2 {
      color: $lime-6;
    }

    .counter-simuladorTC {
      color: $light-blue-13;
    }

    .btn-Assetto {
      background-color: $purple-14;
    }

    .btn-rFactor {
      background-color: $deep-orange-13;
    }

    .btn-rFactor2 {
      background-color: $lime-6;
    }

    .btn-simuladorTC {
      background-color: $light-blue-13;
    }

    .torneo-container {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 20;

      .simulador {
        position: absolute;
        width: 100%;
        height: 100%;
        top: -8%;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }

    &__header {
      position: relative;
      z-index: 10;

      .titleLogo {
        width: 100%;
        position: relative;

        h3 {
          font-size: 2.5rem;
          line-height: 2rem;
        }
      }

      .buttons {
        width: 100%;
        position: relative;
        z-index: 500;

        .btn-links:hover {
          background-color: red;
          color: green;
        }
      }

    }

    .price {
      position: relative;
      z-index: 50;
      // left: 8%;
      width: 100%;

      .pagos img {
        width: 65px;
        height: auto;
      }
    }

    .next {
      width: 100%;
      position: relative;
      z-index: 20;
      margin: 2rem auto -1rem;

    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: .5;
      z-index: 10;
    }
  }
}

@media screen and (min-width: 599.98px) {

  #campeonatos {
    .torneo {
      .borde-rFactor.torneo-container {
        border-left: 45px solid $deep-orange-13;
        border-right: 3px solid $deep-orange-13;
        border-top: unset;
        border-bottom: unset;
      }

      .borde-rFactor2.torneo-container {
        border-left: 45px solid $lime-6;
        border-right: 3px solid $lime-6;
        border-top: unset;
        border-bottom: unset;
      }

      .borde-Assetto.torneo-container {
        border-left: 45px solid $purple-14;
        border-right: 3px solid $purple-14;
        border-top: unset;
        border-bottom: unset;
      }

      .borde-simuladorTC.torneo-container {
        border-left: 45px solid $light-blue-13;
        border-right: 3px solid $light-blue-13;
        border-top: unset;
        border-bottom: unset;
      }

      .torneo-container {

        .torneo__header {

          .titleLogo {
            width: 100%;
          }

          .buttons {
            width: 100%;
          }
        }

        .simulador {
          position: absolute;
          height: 100%;
          top: 0;
          left: -101%;
          z-index: 20;
          writing-mode: vertical-lr;
          transform: rotate(180deg);
        }
      }

      .next {
        width: 100%;
      }

      .tablePos {
        width: 50%;

        .q-table__container {
          width: 100%;
        }
      }

    }
  }

}

@media screen and (min-width: 991.98px) {
  #campeonatos {

    .torneo {

      .torneo-container {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .torneo__header {

          .buttons {
            width: 100%;
          }
        }

        .simulador {
          left: -100.5%;
        }

        .price {
          width: 50%;
          left: 12%;

          h4 {
            text-align: left;
          }

        }

        .next {
          width: 50%;
        }
      }

      .tablePos {
        width: 40%;

        .q-table__container {
          width: 100%;
        }
      }
    }
  }

}

@media screen and (min-width: 1279.98px) {
  #campeonatos {

    .torneo {

      .tablePos {
        width: 35%;
      }

      .torneo-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .footer {
          margin-right: 3rem;

          .price {
            width: unset;
            left: unset;
            margin-right: 3rem;

            h4 {
              text-align: left;
            }
          }

          .next {
            width: unset;
            margin: unset;
          }
        }

        .simulador {
          left: -100.5%;
        }

        .torneo__header {

          .titleLogo {
            width: 33%;

            h3 {
              font-size: 2rem;
            }
          }

          .buttons {
            width: 66%;
          }
        }


      }
    }
  }

}

@media screen and (min-width: 1599.98px) {
  #campeonatos {

    .torneo {

      .torneo-container {

        .torneo__header {

          .titleLogo {
            width: 33%;

          }

          .buttons {
            width: 66%;
          }
        }


      }
    }
  }

}
</style>
