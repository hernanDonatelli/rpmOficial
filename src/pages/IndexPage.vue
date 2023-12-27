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
const slideVideo = ref('first')
const slideSponsor = ref(1)
const autoplay = ref(5000)
const autoplayVideo = ref(5000)
const autoplaySponsor = ref(true)
const videos = ref([
  {
    name: "first",
    src: "https://www.youtube.com/embed/xlxIRlQBOmQ?si=f-4km82z7wTpGwJF"
  },
  {
    name: "second",
    src: "https://www.youtube.com/embed/DUWWsXNl4C4?si=hwBaai-0Sbq1Pjas"
  }
])

const proximaFechaGlobal = async () => {
  let resultObj = {}

  //Obtengo la proxima fecha y el ID del torneo
  const fecha = await useApi.proximaFechaGlobalApi(JSON.parse(localStorage.getItem('token')))
  const torneo = fecha.league_info_id;

  //Obtengo el Nombre del Torneo
  const torneosApi = await useApi.getTorneosApi(JSON.parse((localStorage.getItem('token'))))
  const match = torneosApi.find(item => item.id == torneo)

  //Obtengo el Date de la proxima fecha global
  const arrFecha = fecha.date.split('-');

  //Obtengo el circuito
  const circuito = fecha.circuit

  resultObj = {
    name: match.name,
    year: parseInt(arrFecha[0]),
    month: parseInt(arrFecha[1]),
    day: parseInt(arrFecha[2]),
    circuit: circuito,
    simulator: match.simulator
  }

  useApi.proximaFechaGlobal = resultObj

}

const colorCounter = (simulador) => {

  if (simulador == 'Assetto Corsa') return 'counter-Assetto'
  if (simulador == 'rFactor2') return 'counter-rFactor2'
  if (simulador == 'Simulador TC') return 'counter-simuladorTC'
  if (simulador == 'rFactor') return 'counter-rFactor'

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
          <div class="infoFecha flex column justify-center items-center">
            <div class="flex column">
              <p class="text-h6 text-white text-uppercase text-center q-my-none montserratExtraBold">
                {{ useApi.proximaFechaGlobal.name }}</p>
              <p class="text-body1 text-white text-center q-my-none">
                ({{ useApi.proximaFechaGlobal.simulator }})</p>
              <h1 class="text-h4 text-lime-11 montserratExtraBold text-center q-my-none">{{
                useApi.proximaFechaGlobal.circuit }}</h1>
            </div>

            <CounterComponent :year="useApi.proximaFechaGlobal.year" :month="useApi.proximaFechaGlobal.month - 1"
              :date="useApi.proximaFechaGlobal.day" :hour="22" :minutes="0" :seconds="0" />
          </div>

        </template>
      </div>
    </div>

    <!-- INTRO USUARIOS -->
    <section id="intro">
      <h3 class="introTitle text-h4 text-center text-grey-6 montserratRegular q-my-none q-py-md">
        <span>Bienvenido a</span> <span class="montserratExtraBold text-uppercase">RPM</span>Racingleague
      </h3>
      <div class="row intro__row q-mt-md">
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h3 class="text-h5 q-my-none text-center text-black text-uppercase"><span class="text-h4 text-black">1.</span>
            Registrate</h3>
          <p class="text-center text-body2 q-px-xl text-grey-8">Registrate en RPM Racing League para poder acceder al
            contenido y empezar a competir en la Liga.</p>
        </div>
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h3 class="text-h5 q-my-none text-center text-black text-uppercase"><span class="text-h4 text-black">2.</span>
            Inscribite</h3>
          <p class="text-center text-body2 q-px-xl text-grey-8">Una vez registrado, elegí un torneo, abonas la inscripción
            y ya estas
            listo para correr.</p>
        </div>
        <div class="intro__blumb col-10 q-mx-auto col-md-4 q-py-lg">
          <h3 class="text-h5 q-my-none text-center text-black text-uppercase"><span class="text-h4 text-black">3.</span> A
            Correr!</h3>
          <p class="text-center text-body2 q-px-xl text-grey-8">Ya estas habilitado para poder comenzar a disfrutar de los
            torneos en
            RPM Racing League.</p>
        </div>
      </div>
    </section>

    <!-- GALERIA -->
    <section id="novedades">
      <h3
        class="gallery-title text-h3 text-uppercase montserratExtraBold text-weight-bold text-center text-white q-my-none q-py-md">
        Novedades</h3>

      <div class="overlay"></div>

      <div class="gallery">
        <q-carousel swipeable animated v-model="slide" :autoplay="autoplay" @mouseover="autoplay = false"
          @mouseleave="autoplay = true" thumbnails vertical infinite transition-next="slide-right"
          transition-prev="slide-left">


          <q-carousel-slide v-for="(noticia, index) in useApi.noticias" :key="index" :name="index"
            :img-src="`https://rpm.studioatlantic.com.ar/pezls/storage/app/public/images/galery/${noticia.image}`">
            <div class="absolute-bottom custom-caption">
              <div class="text-h5 text-white text-uppercase text-bold">{{ noticia.title }}</div>
              <div class="text-body2">
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
      <h3
        class="gallery-title text-h3 text-uppercase montserratExtraBold text-weight-bold text-center text-blue-grey-10 q-my-lg q-pt-xl">
        Sponsors</h3>
      <div class="row flex items-center">

        <div class="col-12">
          <div>
            <q-carousel v-model="slideSponsor" transition-prev="slide-right" transition-next="slide-left" infinite
              :autoplay="autoplaySponsor" swipeable animated height="300px">

              <q-carousel-slide :name="1" class="column no-wrap">
                <div class="row fit justify-center items-center q-gutter-xs q-col-gutter no-wrap">
                  <q-img class="rounded-borders col-12 full-height" src="../assets/ferrari.png" />
                </div>
              </q-carousel-slide>
              <q-carousel-slide :name="2" class="column no-wrap">
                <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                  <q-img class="rounded-borders col-12 full-height" src="../assets/audi.png" />
                </div>
              </q-carousel-slide>
              <q-carousel-slide :name="3" class="column no-wrap">
                <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                  <q-img class="rounded-borders col-12 full-height" src="../assets/at.png" />
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>

        </div>

      </div>

    </section>

    <!-- CAMPEONATOS -->
    <section id="campeonatos" class="bg-blue-grey-10">
      <CampeonatoComponente />
    </section>

    <section id="youTube">
      <h3
        class="text-h3 text-uppercase montserratExtraBold text-weight-bold text-center text-blue-grey-10 q-my-none q-py-xl">
        Multimedia</h3>

      <q-carousel class="repVideo" v-model="slideVideo" swipeable animated control-color="white" navigation arrows transition-next="slide-right" transition-prev="slide-left" transition-duration="250">

        <q-carousel-slide v-for="video in videos" :key="video.name" :name="video.name">
          <q-video :src="video.src" :ratio="16 / 9" />

        </q-carousel-slide>

      </q-carousel>
    </section>


    <!-- FOOTER -->
    <FooterComponent />
  </q-page>
</template>

<style lang="scss">
.repVideo {
  height: 250px;
}

.q-carousel__control.q-carousel__arrow.q-carousel__prev-arrow.q-carousel__prev-arrow--horizontal.absolute.flex.flex-center {
  left: 3%;
}

.q-carousel__control.q-carousel__arrow.q-carousel__next-arrow.q-carousel__next-arrow--horizontal.absolute.flex.flex-center {
  right: 3%;
}

.hero {
  min-height: 100vh;
  position: relative;
  clip-path: polygon(0 0, 100% 0%, 100% 100%, 0% 95%);

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
    opacity: 0.5;
  }

  &__countdown {
    position: relative;
    display: flex;
    min-height: 100vh;
    justify-content: center;
    align-items: flex-end;
    width: 100%;

    .infoFecha {
      width: 100%;
      padding: 1rem 0 3rem;
      background-color: rgba(0, 0, 0, .7);
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
  padding: 5% 0;

  .intro__row {
    max-width: 1280px;
    margin: 0 auto;
  }
}

#youTube {
  padding-top: 2.5rem;

  .youtubeContainer {
    max-width: 1100px;
    margin: 0 auto;
  }
}

#novedades {
  position: relative;
  height: 85vh;
  clip-path: polygon(0 0, 100% 5%, 100% 100%, 0 95%);

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: 0.60;
    z-index: 20;
  }

  .gallery {
    position: relative;
    position: relative;
    margin: 0 auto;
    z-index: 40;

    .q-carousel__control.q-carousel__navigation.no-wrap.absolute.flex.q-carousel__navigation--thumbnails.q-carousel__navigation--right {
      z-index: 100;
    }

    .absolute-bottom.custom-caption {
      position: absolute;
      bottom: 8%;
      left: 50%;
      transform: translate(-50%, 0);
      text-align: center;
      width: 90%;
      z-index: 30;
    }

    .q-carousel {
      height: 85vh;

    }

  }

  .gallery-title {
    position: absolute;
    margin: 0;
    top: 13%;
    z-index: 10;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 50;
  }
}

#campeonatos {
  position: relative;
  clip-path: polygon(0 0, 100% 3%, 100% 95%, 0 100%);
  z-index: 600;
  padding: 4rem 0 3rem;
}

#sponsors {
  padding: 1rem 0 6rem;

  .q-carousel {
    background-color: unset;

    .q-carousel__slide {
      padding: 0;
      overflow-x: hidden;

      .q-img.q-img--menu.rounded-borders img {
        object-fit: none !important;
      }
    }
  }

}


@media screen and (min-width: 599.98px) {
  .repVideo {
    width: 426px;
    height: 240px;
    margin: 0 auto;
  }
}

@media screen and (min-width: 767.98px) {

  .repVideo {
    width: 640px;
    height: 460px;
  }


  #intro {

    .introTitle.text-h4 {
      font-size: 2.5rem;
    }
  }
}

@media screen and (min-width: 1023.98px) {
  .repVideo {
    width: 854px;
    height: 480px;
    margin: 0 auto;
  }

  #intro {

    .introTitle.text-h4 {
      font-size: 3rem;
    }

    .intro__row h3 {
      font-size: 2rem;
    }
  }

  #novedades {

    .gallery {

      .absolute-bottom.custom-caption {
        width: 65%;
      }
    }
  }
}

@media screen and (min-width: 1279.98px) {

  .repVideo {
    max-width: 854px;
    height: 480px;
  }
}

@media screen and (min-width: 1365.98px) {

  #novedades {

    .gallery {

      .absolute-bottom.custom-caption {
        width: 50%;
      }

    }

  }
}

@media screen and (min-width: 1599.98px) {
  .repVideo {
    max-width: 1280px;
    height: 720px;
  }

  #novedades {

    .gallery {

      .absolute-bottom.custom-caption {
        width: 50%;
      }
    }

  }
}

@media screen and (min-width: 1919.98px) {
  .repVideo {
    max-width: 1920px;
    height: 1080px;
    margin: 0 auto;
  }
}
</style>
