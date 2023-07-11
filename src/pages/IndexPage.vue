<script setup>

</script>

<template>
  <q-page>
    <div class="hero">
      <video class="hero__video" playsinline autoplay muted loop poster='../assets/hero.jpg'>
        <source :src="`src/assets/videos/rpmintro.mp4`" type='video/mp4'>
      </video>
      <div class="capa"></div>
    </div>

    <div class="countdown">

    </div>
  </q-page>
</template>

<style lang="scss">
.hero{
  min-height: 100vh;
  position: relative;

  &__video{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover !important;
  }

  .capa{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.85;
  }
}

</style>
