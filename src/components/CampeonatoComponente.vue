<script setup>
import CounterComponent from '../components/CounterComponent.vue'
import { useApiStore } from 'src/stores/api';
import { useUserStore } from 'src/stores/user'
import { userDatabaseStore } from 'src/stores/database'
import { onMounted, onUnmounted, reactive } from 'vue';
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

const inscripcion = reactive({
  tipoComunicacion: 'Inscripcion',
  torneo: '',
  emailDestinatario: 'hernandonatelli@gmail.com',
  emailRemitente: '',
  nombre: '',
  apellido: '',
  user: '',
  movil: '',
  simulador: '',
  precio: ''
})

const fechaCountdown = async () => {
  let resultObj = {}

  const torneos = await apiStore.getTorneosApi(JSON.parse(localStorage.getItem('token')))

  torneos.forEach(async torneo => {

    const fecha = await apiStore.proximaFechaApi(JSON.parse(localStorage.getItem('token')), torneo.id)

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

  });

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

const inscripcionTorneo = async (precio, torneo, simulador, nombre, apellido) => {

  $q.dialog({
    title: `<h5 class="text-center text-h5 text-uppercase q-my-none fontCustomTitle font-weight-bold">Inscripción Torneo ${torneo}</h5><hr class="separador"/>`,
    message: `<p>Hola <strong>${nombre} ${apellido}</strong>, vas a comenzar tu pre-inscripción al <strong>Torneo ${torneo} (${simulador})</strong> por un valor de <strong>$${Number(precio)}</strong>.</p>
        <p>Clickeando en <strong>Ok</strong> se enviará un email a la Administración y dentro de las próximas 48hs se contactarán contigo. De lo contrario haz click en <strong>Cancelar</strong> para anular la inscripción.</p>`,
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
    console.log('Inscripcion enviada!', inscripcion);

  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
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
      <div :class="borderTorneo(torneo.simulator)" class="torneo-container q-pb-lg">
        <p class="simulador fontCustomTitle text-h5 text-white q-mb-none text-center text-uppercase text-weight-bold">{{
          torneo.simulator }}</p>

        <div class="overlay"></div>

        <!-- Cabecera de torneo -->
        <div class="torneo__header flex justify-between items-center row-md">
          <div
            class="titleLogo column justify-center items-center justify-sm-center col-12 col-sm-6 column-md justify-md-start">
            <h3 class="text-center text-uppercase montserratExtraBold text-white q-mb-xs-sm q-my-none q-pl-none">{{
              torneo.name
            }}
            </h3>
          </div>
          <div class="buttons flex row justify-around items-center col-sm-6 col-md-6 justify-md-end">
            <q-btn
              @click="inscripcionTorneo(torneo.price, torneo.name, torneo.simulator, useDatabase.documents[0].nombre, useDatabase.documents[0].apellido)"
              v-if="userStore.userData != null" :class="colorBtn(torneo.simulator)"
              class="text-white q-mx-lg q-my-xs col-8 col-md-3" icon="lab la-wpforms" style="font-weight: bold;"
              label="Inscripción" />
            <q-btn :to="`torneo/${torneo.id}`" class="q-mx-lg q-my-xs col-8 col-md-3" icon="las la-trophy"
              style="background: #ffffff; color: #212121; font-weight: bold;" label="Campeonato" />
            <q-btn href="https://www.rpmracingleague.net/foro/" target="_blank" class="q-mx-lg q-my-xs col-8 col-md-3"
              icon="las la-external-link-alt" style="background: #ffffff; color: #212121; font-weight: bold;"
              label="Foro" />
          </div>
        </div>

        <!-- Footer de torneo -->
        <div class="footer row justify-between items-end">
          <!-- Precio -->
          <div class="price">
            <h4 class="fontCustomTitle text-center text-white text-weight-bold q-mb-none q-mt-md-none">${{
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

              <p v-if="torneo.id == counter.id" class="text-white text-uppercase text-center q-my-none text-weight-light">
                Proximo Evento: <span :class="colorCounter(torneo.simulator)" class="text-weight-bold">{{ counter.day
                }}-{{ counter.month }}-{{
  counter.year }}</span>
              </p>
              <h4 v-if="torneo.id == counter.id" :class="colorCounter(torneo.simulator)"
                class="fontCustomTitle text-h4 text-uppercase text-center q-my-none">{{ counter.circuit }}</h4>

              <CounterComponent v-if="torneo.id == counter.id" :year="counter.year" :month="counter.month - 1"
                :date="counter.day" :hour="22" :minutes="0" :seconds="0" />
            </template>

          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style lang="scss">
.q-card.q-dialog-plugin {
  width: 800px;
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
    max-width: 85%;
    margin: 0 auto;

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
        height: 100%;
        top: -8%;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 20;
      }
    }

    &__header {
      position: relative;
      z-index: 10;
      padding-top: 3%;

      .titleLogo {
        width: 100%;
        position: relative;

        h3 {
          font-size: 2.5rem;
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
          left: -8%;
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
          left: -5%;
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

      .next {
        width: 33%;
      }

      .torneo-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .simulador {
          left: -3.5%;
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

        .price {
          left: 8%;

          h4 {
            text-align: left;
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

        .simulador {
          left: -3%;
        }
      }
    }
  }
}

@media screen and (min-width: 1919.98px) {
  #campeonatos {

    .torneo {

      .torneo-container {

        .simulador {
          left: -2.35%;
        }
      }
    }
  }
}
</style>
