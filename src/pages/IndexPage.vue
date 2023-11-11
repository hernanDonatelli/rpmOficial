<script setup>
import { ref } from 'vue';
import CounterComponent from '../components/CounterComponent.vue'
import CampeonatoComponente from '../components/CampeonatoComponente.vue'

const slide = ref(1)
const slideSponsor = ref(1)
const autoplay = ref(true)
const autoplaySponsor = ref(true)

</script>

<template>
  <q-page>
    <!-- HERO CON MENU -->
    <div id="hero" class="hero">
      <video class="hero__video" playsinline autoplay muted loop poster='/hero.jpg'>
        <source src="/rpmintro.mp4" type='video/mp4'>
      </video>

      <div class="hero__capa"></div>

      <div class="hero__countdown">
        <p class="text-grey-13 text-center q-my-none text-weight-light ">Proximo Evento</p>
        <h1 class="text-h3 text-uppercase montserratExtraBold text-center text-red-13 q-my-none">Termas de Rio Hondo</h1>

        <CounterComponent :year="2023" :month="11" :date="27" :hour="22" :minutes="0" :seconds="0" />
      </div>
    </div>

    <!-- INTRO USUARIOS -->
    <section id="intro">
      <div class="row intro__row">
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h4 class="text-h4 q-my-none text-center text-white text-uppercase"><span class="text-h2 text-white">1.</span>
            Registrate</h4>
          <p class="text-center text-body2 q-px-xl text-grey-7">Registrate en RPM Racing League para poder acceder al
            contenido y
            empezar a competir en la Liga.</p>
        </div>
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h4 class="text-h4 q-my-none text-center text-white text-uppercase"><span class="text-h2 text-white">2.</span>
            Inscribite</h4>
          <p class="text-center text-body2 q-px-xl text-grey-7">Una vez registrado, elegí un torneo, abonas la inscripción
            y ya estas
            listo para correr.</p>
        </div>
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h4 class="text-h4 q-my-none text-center text-white text-uppercase"><span class="text-h2 text-white">3.</span> A
            Correr!</h4>
          <p class="text-center text-body2 q-px-xl text-grey-7">Ya estas habilitado para poder comenzar a disfrutar de los
            torneos en
            RPM Racing League.</p>
        </div>
      </div>
    </section>

    <!-- GALERIA -->
    <section id="novedades">
      <h1
        class="gallery-title text-h2 text-uppercase montserratExtraBold text-weight-bold text-center text-white q-my-none q-py-xl">
        Novedades</h1>

      <div class="overlay"></div>

      <div class="gallery">
        <q-carousel swipeable animated v-model="slide" :autoplay="autoplay" @mouseenter="autoplay = false"
          @mouseleave="autoplay = true" thumbnails infinite>

          <q-carousel-slide :name="1" img-src="https://www.rpmracingleague.net/images/galeria_Indy%20Cars%20Clausura%202023.png">
            <div class="absolute-bottom custom-caption">
              <div class="text-h4 text-white text-uppercase text-bold">First stop</div>
              <div class="text-caption">
                <span class="text-white">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and
                  scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                </span>
              </div>
            </div>
          </q-carousel-slide>

          <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg">
            <div class="absolute-bottom custom-caption">
              <div class="text-h4 text-white text-uppercase text-bold">Second stop</div>
              <div class="text-caption">
                <span class="text-white">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                </span>
              </div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
          <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
          <q-carousel-slide :name="5" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
          <q-carousel-slide :name="6" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
          <q-carousel-slide :name="7" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
          <q-carousel-slide :name="8" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

        </q-carousel>
      </div>
    </section>

    <!-- SPONSORS -->
    <section id="sponsors">
      <h1 class="text-h2 text-uppercase montserratExtraBold text-weight-bold text-center text-black q-my-none q-py-xl">
        Sponsors</h1>

      <div class="q-pa-md">
        <q-carousel v-model="slideSponsor" transition-prev="slide-right" transition-next="slide-left" infinite
          :autoplay="autoplaySponsor" swipeable animated height="300px">

          <q-carousel-slide :name="1" class="column no-wrap">
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/mountains.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/cat.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/quasar.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/parallax1.jpg" />
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="2" class="column no-wrap">
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/parallax2.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/quasar.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/cat.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/linux-avatar.png" />
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="3" class="column no-wrap">
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/mountains.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/quasar.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/parallax1.jpg" />
              <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/linux-avatar.png" />
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </section>

    <!-- CAMPEONATOS -->
    <section id="campeonatos">
      <CampeonatoComponente />
    </section>

    <section id="youTube">
      <h1 class="text-h2 text-uppercase montserratExtraBold text-weight-bold text-center text-white q-my-none q-py-xl">
        YouTube</h1>
      <div class="row flex justify-center youtubeContainer">
        <div class="col-12">
          <div class="q-pa-md">
            <q-video :ratio="16 / 9" src="https://www.youtube.com/embed/xJi7K8IzOfc" />
          </div>
        </div>
      </div>
    </section>


    <!-- FOOTER -->
    <section id="footer" class="q-py-lg">
      <div class="q-px-lg">
        <div class="row">
          <div class="col-12 flex justify-between items-center">

            <div class="col-2 logo-img">
              <img src="../assets/logo_rpm_png.png" alt="RPM RacingLeague">
            </div>

            <div class="col-8 rrss">
              <h6 class="text-h6 text-uppercase montserratExtraBold text-center text-white q-my-none">
                Nuestras redes</h6>
              <div class="row flex justify-between">
                <a href="https://www.facebook.com/RPMRacingLeague" target="_blanck">
                  <q-icon color="red-13" name="lab la-facebook" />
                </a>
                <a href="https://www.instagram.com/rpm.racing.league/" target="_blank">
                  <q-icon color="red-13" name="lab la-instagram" />
                </a>
                <a href="https://www.youtube.com/@rpmracingleague7342" target="_blank">
                  <q-icon color="red-13" name="lab la-youtube" />
                </a>
                <q-icon color="red-13" name="lab la-discord" />
                <q-icon color="red-13" name="lab la-teamspeak" />
              </div>
              <div class="row">
                <p class="text-caption text-center text-white q-mb-none q-mt-sm">Copyright 2023 - Desarrolló
                  Studioatlantic</p>
              </div>
            </div>

            <div class="col-2 fiscal">
              <a href="http://qr.afip.gob.ar/?qr=RhTCFLYM06YNGdo6rMjBhA,," target="_F960AFIPInfo">
                <img src="http://www.afip.gob.ar/images/f960/DATAWEB.jpg" alt="fiscal">
              </a>
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

#intro {
  padding: 7% 0;
  background-color: #000000;

  .intro__row {
    max-width: 1280px;
    margin: 0 auto;
  }
}

#youTube {
  background-color: black;

  .youtubeContainer {
    max-width: 1100px;
    margin: 0 auto;
  }
}

#novedades {
  position: relative;
  height: 100vh;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: 0.75;
    z-index: 20;
  }

  .gallery {
    height: 100vh;
    position: relative;
    margin: 0 auto;

    .absolute-bottom.custom-caption {
      position: absolute;
      bottom: 13%;
      left: 50%;
      transform: translate(-50%, 0);
      text-align: center;
      width: 80%;
      z-index: 30;
    }

    .q-carousel {
      height: 100vh;

    }

    .q-carousel__control.q-carousel__navigation.no-wrap.absolute.flex.q-carousel__navigation--thumbnails.q-carousel__navigation--bottom {
      z-index: 30;
    }
  }

  .gallery-title {
    position: absolute;
    margin: 0;
    top: 3%;
    z-index: 10;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 30;
  }
}

#footer {
  padding-top: 3rem;
  background-color: #000000;

  .logo-img img {
    width: 150px;
    height: auto;
  }

  .fiscal img {
    width: 90px;
    height: auto;
  }

  .rrss .q-icon {
    font-size: 2rem;
  }
}

@media screen and (min-width: 767.98px) {}

@media screen and (min-width: 1279.98px) {}

@media screen and (min-width: 1365.98px) {
  #novedades {

    .gallery {

      .absolute-bottom.custom-caption {
        width: 65%;
      }
    }

  }
}

@media screen and (min-width: 1599.98px) {
  #novedades {

    .gallery {

      .absolute-bottom.custom-caption {
        width: 50%;
      }
    }

  }
}

@media screen and (min-width: 1919.98px) {}
</style>
