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
        <h1 class="text-h3 text-uppercase text-weight-bold text-center text-grey-8 q-my-sm">Miami GP</h1>

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
          <p class="text-center text-body2 q-px-xl">Una vez registrado, elegí un torneo, abonas la inscripción y ya estas listo para correr.</p>
        </div>
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h4 class="text-h4 q-my-none text-center"><span class="text-h2 text-white">3.</span> A Correr!</h4>
          <p class="text-center text-body2 q-px-xl">Ya estas habilitado para poder comenzar a disfrutar de los torneos en RPM Racing League.</p>
        </div>
      </div>
    </section>

    <!-- LIVERACERS -->
    <section id="liveracers">
      <h1 class="text-h2 text-uppercase fontCustomTitle text-weight-bold text-center text-grey-10 q-my-none q-py-xl">
        Servidores Online</h1>
      <div id="lr-servers" class="rpmdark horizontal" orientation="horizontal"></div>
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
    padding: 1.5%;
    width: 100%;
    height: auto;
    background-color: rgba($color: #000000, $alpha: .6);

    &__regresiveCero {
      font-family: 'Roboto';
      font-size: 2rem;
      font-weight: lighter;
      background-color: red;
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

    .lr-servers-content{
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

  .intro__row{
    max-width: 1280px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 767.98px) {
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

@media screen and (min-width: 1599.98px) {
  .lr-servers-content {
    max-width: 1280px;
    padding: 2% 10%;
  }
}

@media screen and (min-width: 1919.98px) {
  .lr-servers-content {
    width: 100%;
    padding: 0;
  }
}
</style>
