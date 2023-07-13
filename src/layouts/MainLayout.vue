<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header__nav">
      <q-toolbar>
        <q-btn class="text-red-13" flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="las la-bars" />

        <q-toolbar-title class="text-red-13 flex column items-center row-sm justify-sm-between">
          <h4 class="q-my-none"><span>RPM</span>RacingLeague</h4>
          <div class="btn-entrada q-my-xs">
            <p class="inline-block q-mr-sm q-mb-none text-caption text-grey-13">{{ userStore.userData }}</p>
            <q-btn class="q-mr-sm" size="sm" outline style="color: lightgrey" label="Login" />
            <q-btn class="q-mr-sm" outline size="sm" style="color: lightgrey" label="Registrate" />
            <q-btn class="q-mr-sm logout" outline size="sm" label="Salir" />
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay show-if-above elevated class="drawer__menu">
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable to="/" class="text-white" active-class="menu__link" exact>
          <q-item-section avatar>
            <q-icon name="las la-home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption class="text-grey-8">Ir al inicio de la web</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/nosotros" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-users" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nosotros</q-item-label>
            <q-item-label caption class="text-grey-8">Acerca de RPM Racing League</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable href="#campeonatos" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-trophy" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Campeonatos</q-item-label>
            <q-item-label caption class="text-grey-8">Nuestras competiciones aquí</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/multimedia" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-photo-video" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Multimedia</q-item-label>
            <q-item-label caption class="text-grey-8">YouTube - Imagenes</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" href="https://www.youtube.com/@rpmracingleague7342"
          active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="lab la-youtube" />
          </q-item-section>
          <q-item-section>
            <q-item-label>YouTube</q-item-label>
            <q-item-label caption class="text-grey-8">@rpmracingleague7342</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/contacto" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-envelope" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Contacto</q-item-label>
            <q-item-label caption class="text-grey-8">Escribenos por cualquier inquietud</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container id="main__container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.q-toolbar__title{

  span{
    font-weight: 900;

  }
}
.btn-entrada{

  .logout{
    color: $red-13;
  }
}
#main__container {
  padding-top: 0 !important;
}

 .header__nav {
   background-color: $blue-grey-10;
 }

.drawer__menu {
  background-color: rgba($color: #000000, $alpha: 0.98);
}

.q-list a {
  color: white;

}

.menu__link {
  color: red;
  background-color: $grey-10;
}
</style>


