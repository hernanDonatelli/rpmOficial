<template>
  <q-layout view="hHr lpR fFf">

    <q-header elevated class="header text-white" height-hint="98">
       <q-toolbar class="toolbarMenu">
        <q-toolbar-title>
          <div class="row">
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            <h4 class="q-my-none q-ml-md"><a class="rpm text-white" href="/">RPMRacingLeague</a></h4>

          </div>
        </q-toolbar-title>

        <q-btn dense flat round icon="las la-bars" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Home" />
        <q-route-tab to="/torneos" label="Torneos" />
        <q-route-tab to="/nosotros" label="Nosotros" />
        <q-route-tab to="/multimedia" label="Multimedia" />
        <q-route-tab to="/contacto" label="Contacto" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" behavior="mobile" elevated>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container id="main-container">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const rightDrawerOpen = ref(false)

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

</script>

<style lang="scss">
.header{
  background-color: $dark-page;
}
#main-container{
  padding-top: 0 !important;
}
.rpm {
  text-decoration: none;
}
</style>
