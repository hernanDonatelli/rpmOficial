<script setup>
import CounterComponent from '../components/CounterComponent.vue'
</script>

<template>
  <q-page>
    <div class="hero">
      <video class="hero__video" playsinline autoplay muted loop poster='../assets/hero.jpg'>
        <source :src="`src/assets/videos/rpmintro.mp4`" type='video/mp4'>
      </video>

      <div class="hero__capa"></div>

      <div class="hero__countdown">
        <h1 class="text-h3 text-uppercase text-weight-bold text-center text-grey-8 q-my-sm">Miami GP</h1>

        <CounterComponent
        :year="2023"
        :month="6"
        :date="20"
        :hour="22"
        :minutes="0"
        :seconds="0"
        />
      </div>
    </div>

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
</style>
