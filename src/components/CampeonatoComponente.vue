<script setup>
import CounterComponent from '../components/CounterComponent.vue'
</script>

<template>
  <section id="campeonatos">
    <div class="torneo-1">
      <div class="torneo-container">
        <div class="overlay"></div>

        <!-- Cabecera de torneo -->
        <div class="torneo-1__header flex justify-between items-center row-md">
          <div class="titleLogo column justify-center items-center justify-sm-center col-12 col-sm-6 column-md justify-md-start">
            <h3 class="text-h3 text-center text-uppercase text-weight-bold text-white q-my-none q-pl-md">Formula 1</h3>
            <p class="text-h5 text-grey-8 q-mb-none text-center">(rfactor 2)</p>
          </div>
          <div class="buttons flex row justify-around items-center q-mt-md col-sm-6 col-md-6 justify-md-end">
            <q-btn class="q-mx-lg q-my-xs btn-links col-8 col-sm-6 col-md-3" icon="lab la-wpforms" outline style="color: lightgrey;"
              label="Inscripción" />
            <q-btn class="q-mx-lg q-my-xs btn-links col-8 col-sm-6 col-md-3" icon="las la-trophy" outline style="color: lightgrey;" label="Campeonato" />
            <q-btn class="q-mx-lg q-my-xs btn-links col-8 col-sm-6 col-md-3" icon="las la-external-link-alt" outline style="color: lightgrey;"
              label="Foro" />
          </div>
        </div>

        <!-- Footer de torneo -->
        <div class="footer row justify-between items-center">
          <!-- Proxima fecha -->
          <div class="next">
            <p class="text-grey-13 text-center q-my-none text-weight-light ">Proximo Evento</p>
            <h4 class="text-h4 text-uppercase text-weight-bold text-center text-red-13 q-my-none">Zandvoort GP</h4>
            <CounterComponent :year="2023" :month="7" :date="20" :hour="22" :minutes="0" :seconds="0" />
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
              <tbody>
                <tr>
                  <td class="text-center">1</td>
                  <td class="text-center">Charly Ramos</td>
                  <td class="text-center">159</td>
                </tr>
                <tr>
                  <td class="text-center">2</td>
                  <td class="text-center">Massi Kaillera</td>
                  <td class="text-center">150</td>
                </tr>
                <tr>
                  <td class="text-center">3</td>
                  <td class="text-center">Sebastian Campagnolo</td>
                  <td class="text-center">136</td>
                </tr>
                <tr>
                  <td class="text-center">4</td>
                  <td class="text-center">Matias Machuca</td>
                  <td class="text-center">110</td>
                </tr>
                <tr>
                  <td class="text-center">5</td>
                  <td class="text-center">Pez Donux</td>
                  <td class="text-center">90</td>
                </tr>

              </tbody>
            </q-markup-table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
#campeonatos {
  position: relative;

  .torneo-1 {
    position: relative;
    height: 100vh;
    background-image: url('../assets/hero.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
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

      .titleLogo{
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
  #campeonatos .torneo-1 .tablePos{
    width: 50%;

    .q-table__container{
      width: 100%;
    }
  }
  #campeonatos .torneo-1 .next{
    width: 50%;
  }
  .buttons{
    width: 80%;
  }

}

@media screen and (min-width: 991.98px){
  #campeonatos .torneo-1 .tablePos{
    width: 40%;

    .q-table__container{
      width: 100%;
    }
  }
  #campeonatos .torneo-1__header .buttons{
    width: 60%;
  }

  #campeonatos .torneo-1__header .titleLogo{
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

@media screen and (min-width: 1279.98px){
  #campeonatos .torneo-1 .tablePos{
    width: 35%;

  }

  #campeonatos .torneo-1 .next{
    width: 33%;
  }

  #campeonatos .torneo-1__header .titleLogo{
    width: 33%;
  }
  .buttons{
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
  #campeonatos .torneo-1 .tablePos{
    width: 40%;
  }
}

</style>
