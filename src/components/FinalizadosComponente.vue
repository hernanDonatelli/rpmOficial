<script setup>
import FooterComponent from "./FooterComponent.vue";
import { useQuasar } from "quasar";
import { useApiStore } from "src/stores/api";
const $q = useQuasar();
const useApi = useApiStore()





</script>

<template>
  <section id="finalizados">
    <div class="row">
      <div class="col-12 q-pa-md q-mt-lg q-mt-md-none">
        <h4 class="text-h4 text-center text-uppercase montserratExtraBold q-mb-none">Torneos Finalizados</h4>
        <hr>
        <p class="sub-contacto text-center text-body2 q-mt-md">
          Aqui encontrarás los Torneos Históricos de RPM Racing League.
        </p>
      </div>

      <div class="row row-cards">
        <template v-for="torneo in useApi.torneos">
          <div v-if="torneo.status != 1" class="col-12 col-md-4 q-pa-md">
            <q-card class="my-card">
              <q-img :src="`https://rpm.studioatlantic.com.ar/pezls/storage/app/public/images/tournament/${torneo.image}`">
                <div class="absolute-bottom text-h6 text-center">
                  {{ torneo.name }}
                </div>
              </q-img>

              <q-card-section class="text-center">
                <q-btn :to="`torneo/${torneo.id}`" color="teal-6" label="Ver Torneo" />
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
    </div>
  </section>

  <FooterComponent />
</template>


<style lang="scss">
#finalizados {
  padding-bottom: 3rem;
  background-image: repeating-linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7)),
    url(../assets/background.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 1rem;

  .row-cards {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;

    .my-card {
      width: 100%;
      max-width: 300px;

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
