<script setup>
import { onMounted, ref } from 'vue';
import CounterComponent from '../components/CounterComponent.vue'
import CampeonatoComponente from '../components/CampeonatoComponente.vue'
import FooterComponent from '../components/FooterComponent.vue';
import { useApiStore } from 'src/stores/api'

const useApi = useApiStore()

onMounted(async () => {
  await proximaFechaGlobal()
  await useApi.getNoticiasApi(JSON.parse(localStorage.getItem('token')))
})

const slide = ref(1)
const slideSponsor = ref(1)
const autoplay = ref(true)
const autoplaySponsor = ref(true)

const proximaFechaGlobal = async () => {
  let resultObj = {}

  const torneos = await useApi.getTorneosApi(JSON.parse(localStorage.getItem('token')))

  torneos.forEach(async torneo => {

    const fecha = await useApi.proximaFechaGlobalApi(JSON.parse(localStorage.getItem('token')))

    const arrFecha = fecha.date.split('-');
    const circuito = fecha.circuit

    resultObj = {
      id: torneo.id,
      name: torneo.name,
      year: parseInt(arrFecha[0]),
      month: parseInt(arrFecha[1]),
      day: parseInt(arrFecha[2]),
      circuit: circuito
    }

    useApi.proximaFechaGlobal = resultObj

  });

}

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
        <template v-if="useApi.proximaFechaGlobal">
          <p class="text-h6 text-white text-uppercase text-center q-my-none text-weight-bold text-white">
            {{ useApi.proximaFechaGlobal.name }}</p>
          <h1 class="text-h4 text-uppercase montserratExtraBold text-center text-teal-13 q-my-none">{{ useApi.proximaFechaGlobal.circuit }}</h1>

          <CounterComponent :year="useApi.proximaFechaGlobal.year" :month="useApi.proximaFechaGlobal.month-1" :date="useApi.proximaFechaGlobal.day" :hour="22" :minutes="0" :seconds="0" />

        </template>
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


            <q-carousel-slide v-for="(noticia, index) in useApi.noticias" :key="index" :name="index" :img-src="`https://rpm.studioatlantic.com.ar/pezls/storage/app/public/images/galery/${noticia.image}`">
              <div class="absolute-bottom custom-caption">
                <div class="text-h4 text-white text-uppercase text-bold">{{ noticia.title }}</div>
                <div class="text-caption">
                  <span class="text-white">
                    {{ noticia.text }}
                  </span>
                </div>
              </div>
            </q-carousel-slide>

        </q-carousel>
      </div>
    </section>

    <!-- SPONSORS -->
    <section id="sponsors">
      <div class="row flex items-center q-py-xl">

        <div class="col-12">
          <div class="q-pa-md">
            <q-carousel class="bg-black" v-model="slideSponsor" transition-prev="slide-right" transition-next="slide-left" infinite
              :autoplay="autoplaySponsor" swipeable animated height="200px">

              <q-carousel-slide :name="1" class="column no-wrap">
                <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/mountains.jpg" />
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/cat.jpg" />
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/quasar.jpg" />
                </div>
              </q-carousel-slide>
              <q-carousel-slide :name="2" class="column no-wrap">
                <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/parallax2.jpg" />
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/quasar.jpg" />
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/cat.jpg" />
                </div>
              </q-carousel-slide>
              <q-carousel-slide :name="3" class="column no-wrap">
                <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/mountains.jpg" />
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/quasar.jpg" />
                  <q-img class="rounded-borders col-4 full-height" src="https://cdn.quasar.dev/img/parallax1.jpg" />
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>

        </div>

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
    <FooterComponent />
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
    opacity: 0.3;
  }

  &__countdown {
    position: absolute;
    bottom: 0;
    padding: 1%;
    width: 100%;
    height: auto;
    align-items: stretch;
    background-color: rgba($color: #000000, $alpha: .8);

    &__regresiveCero {
      font-family: 'Roboto';
      font-size: 2rem;
      background-color: red;
    }

    p {
      letter-spacing: .25rem;
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
  margin-top: -2rem;
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

#sponsors{
  background-color: #000000;
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
