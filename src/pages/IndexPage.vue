<script setup>
import { onMounted } from 'vue';
import CounterComponent from '../components/CounterComponent.vue'

onMounted(() => {
  liveRacers()
})

//Metodos
const liveRacers = () => {
  window._lr = {
    url: 'https://liveracers.com',
    domains: ['rpmracingleague'] //or multiple domains: ['domain1', 'domain2']
  };
  (function () {
    var lr = document.createElement('script'); lr.type = 'text/javascript'; lr.async = true;
    lr.src = window._lr.url + '/Scripts/api.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lr, s);
  })();
}
</script>

<template>
  <q-page>
    <!-- HERO CON MENU -->
    <div class="hero">
      <video class="hero__video" playsinline autoplay muted loop poster='../assets/hero.jpg'>
        <source :src="`src/assets/videos/rpmintro.mp4`" type='video/mp4'>
      </video>

      <div class="hero__capa"></div>

      <div class="hero__countdown">
        <p class="text-grey-13 text-center q-my-none text-weight-light ">Proximo Evento</p>
        <h1 class="text-h3 text-uppercase text-weight-bold text-center text-red-13 q-my-none">Miami GP</h1>

        <CounterComponent :year="2023" :month="6" :date="20" :hour="22" :minutes="0" :seconds="0" />
      </div>
    </div>

    <!-- INTRO USUARIOS -->
    <section id="intro">
      <div class="row intro__row">
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h4 class="text-h4 q-my-none text-center"><span class="text-h2 text-white">1.</span> Registrate</h4>
          <p class="text-center text-body2 q-px-xl">Registrate en RPM Racing League para poder acceder al contenido y
            empezar a competir en la Liga.</p>
        </div>
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h4 class="text-h4 q-my-none text-center"><span class="text-h2 text-white">2.</span> Inscribite</h4>
          <p class="text-center text-body2 q-px-xl">Una vez registrado, elegí un torneo, abonas la inscripción y ya estas
            listo para correr.</p>
        </div>
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h4 class="text-h4 q-my-none text-center"><span class="text-h2 text-white">3.</span> A Correr!</h4>
          <p class="text-center text-body2 q-px-xl">Ya estas habilitado para poder comenzar a disfrutar de los torneos en
            RPM Racing League.</p>
        </div>
      </div>
    </section>

    <!-- LIVERACERS -->
    <section id="liveracers">
      <h1 class="text-h2 text-uppercase fontCustomTitle text-weight-bold text-center text-grey-10 q-my-none q-py-xl">
        Servidores Online</h1>
      <div id="lr-servers" class="rpmdark horizontal" orientation="horizontal"></div>
    </section>

    <!-- CAMPEONATOS -->
    <section id="campeonatos">
      <div class="torneo-1">
        <div class="torneo-container">
          <div class="overlay"></div>

          <!-- Cabecera de torneo -->
          <div class="torneo-1__header column row-md justify-between items-center">
            <div class="titleLogo">
              <h3 class="text-h3 text-center text-uppercase text-weight-bold text-white q-my-none q-pl-md">Formula 1</h3>
              <p class="text-h5 text-grey-8 q-mb-none text-center">(rfactor 2)</p>
            </div>
            <div class="buttons flex justify-around items-center q-mt-md">
              <q-btn class="q-mx-lg btn-links" icon="lab la-wpforms" outline style="color: lightgrey;"
                label="Inscripción" />
              <q-btn class="q-mx-lg btn-links" icon="las la-trophy" outline style="color: lightgrey;"
                label="Campeonato" />
              <q-btn class="q-mx-lg btn-links" icon="las la-external-link-alt" outline style="color: lightgrey;"
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

  </q-page>
</template>

<style lang="scss">
.hero {
  min-height: 100vh;
  position: relative;

  &__video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover !important;
  }

  &__capa {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.85;
  }

  &__countdown {
    position: absolute;
    bottom: 0;
    padding: 1%;
    width: 100%;
    height: auto;
    align-items: stretch;
    background-color: rgba($color: #000000, $alpha: .6);

    &__regresiveCero {
      font-family: 'Roboto';
      font-size: 2rem;
      font-weight: lighter;
      background-color: red;
    }

    p {
      letter-spacing: .75rem;
    }
  }
}

#liveracers {
  width: 100%;
  background-color: #F2F3F4;
  padding: 1% 0 3% 0;

  #lr-servers {

    .lr-servers-header {
      display: none !important;
    }

    .lr-servers-content {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin: 0 auto;
    }

    &.horizontal {
      // max-width: 1200px;
      padding: 0% 5% 5%;
      margin: 0 auto;
    }

  }
}

#intro {
  padding: 7% 0;
  background-color: #2DC241;

  .intro__row {
    max-width: 1280px;
    margin: 0 auto;
  }
}

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
        width: 70%;
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

  .lr-servers-content {
    display: block;
    width: 70%;
    margin: 0 auto;
  }

  #lr-servers.rpmdark .gameInfo {
    width: 100% !important;
    display: block;
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

@media screen and (min-width: 1365.98px) {

  .lr-servers-content {
    max-width: 1280px;
    padding: 2% 0%;
  }
}

@media screen and (min-width: 1599.98px) {
  #campeonatos .torneo-1 .tablePos{
    width: 40%;
  }
  .lr-servers-content {
    max-width: 1280px;
    padding: 2% 5%;
  }
}

@media screen and (min-width: 1919.98px) {

  .lr-servers-content {
    width: 100%;
    padding: 0;
  }
}</style>
