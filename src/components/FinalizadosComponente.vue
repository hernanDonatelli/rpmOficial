<script setup>
import { ref } from 'vue'
import FooterComponent from "./FooterComponent.vue";
import { useQuasar } from "quasar";
import { useApiStore } from "src/stores/api";
const $q = useQuasar();
const useApi = useApiStore()

const posicion = ref(0)

const onScroll = (params) => {
  posicion.value = params.position.top
}


</script>

<template>
  <q-scroll-observer @scroll="onScroll" />
  <!-- Button -->
  <q-btn to="#finalizados" :class="`${posicion > 300 ? 'upToVisible' : 'upTo'}`" round color="red-13"
    icon="las la-angle-up" />

  <div class="wraper">
    <section id="finalizados">
      <div class="row">
        <div class="col-12 q-pa-md q-mt-lg q-mt-md-none">
          <h4 class="text-h4 text-center text-uppercase montserratExtraBold q-mb-none">Torneos Finalizados</h4>
          <hr>
          <p class="sub-contacto text-center text-body2 q-mt-md">
            Aqui encontrarás los Torneos Históricos de RPM Racing League.
          </p>
        </div>
      </div>

      <div class="row row-cards">
        <template v-for="torneo in useApi.torneos">
          <div v-if="torneo.status == 2" class="col-10 q-mx-auto col-md-4 q-pa-md">
            <q-card class="my-card">
              <q-img
                :src="`https://rpm.studioatlantic.com.ar/pezls/storage/app/public/images/tournament/${torneo.image}`">
                <div class="absolute-bottom text-h6 fontCustomTitle text-center">
                  {{ torneo.name }}
                </div>
              </q-img>

              <q-card-section class="text-center">
                <q-btn :href="`torneo/${torneo.id}`" color="teal-6" label="Ver Torneo" />
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
    </section>

    <FooterComponent />
  </div>
</template>


<style lang="scss">
.upTo {
  position: fixed;
  bottom: 7%;
  right: 2%;
  z-index: 9999;
  opacity: 0;
  transition: all .2s ease-in;
}

.upToVisible {
  position: fixed;
  bottom: 7%;
  right: 2%;
  z-index: 9999;
  opacity: 1;
  transition: all .2s ease-in;
}

#main__container {

  .wraper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    #finalizados {
      min-height: 70vh;
      margin-top: 1rem;

      h4 {
        margin-top: 5rem;
      }

      .row-cards {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;

        .my-card {
          width: 100%;
          // max-width: 300px;

        }
      }
    }
  }


  hr {
    width: 10%;
    border: 2.5px solid black;
    margin-top: 1%;
  }
}

@media screen and (min-width: 1919.98px) {

  #finalizados {

    .sub-contacto {
      padding: 0 8rem;
    }
  }
}
</style>
