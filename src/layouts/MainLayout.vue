<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import LoginModalComponent from '../components/LoginModalComponent.vue'
import RegisterFormComponent from '../components/RegisterModalComponent.vue'
import { useRouter } from 'vue-router'
import { userDatabaseStore } from '../stores/database'

const router = useRouter()
const userStore = useUserStore()
const databaseStore = userDatabaseStore()

const leftDrawerOpen = ref(false)


//Menu lateral
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  userStore.currentUserLog();
  getTorneos();
})

const checkUser = async () => {
  const userStore = useUserStore();
  userStore.loadingSession = true;

  userStore.user = await userStore.currentUserLog()

  await databaseStore.getUsers();

  userStore.loadingSession = false;
}
checkUser()

//Salir de la sesion
const logout = async () => {
  await userStore.logoutUser()

  setTimeout(() => {
    router.push('/')
  }, 1000);
}

//////////////////////////////Torneos//////////////////////////
import { useApiStore } from 'src/stores/api';
const apiStore = useApiStore();

//Generador de token y comprobacion de usuario
const loginUserApi = async() => {
    await apiStore.loginApi();
    await apiStore.getUser(apiStore.tokenApi);
}

//Traer torneos y sus datos de la API
const getTorneos = async() => {
    await loginUserApi();
    const torneos = await apiStore.getTorneosApi(apiStore.tokenApi);

    apiStore.torneos = torneos;
}


</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header__nav">
      <q-toolbar>
        <q-btn class="text-red-13" flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="las la-bars" />

        <q-toolbar-title class="text-red-13 flex column items-center row-sm justify-sm-between">
          <h4 class="q-my-none text-h5 text-weight-light"><span>RPM</span>RacingLeague</h4>
          <div v-if="!userStore.loadingSession" class="btn-entrada q-my-xs">
            <p v-for="user of databaseStore.documents" :key="user.id"
              class="inline-block q-mr-sm q-mb-none text-caption text-grey-13">{{ user.nombre }} {{ user.apellido }}</p>

            <login-modal-component v-if="!userStore.userData" />
            <register-form-component v-if="!userStore.userData" />
            <q-btn v-if="userStore.userData" @click="logout" class="q-mr-sm logout" outline size="sm" label="Salir" />
          </div>
          <div v-else>
            <p class="text-caption text-white text-weight-normal text-grey-13 q-mb-none">
            <div>
              Validando Usuario...
              <q-spinner-gears color="grey-6" size="2em" />
            </div>
            </p>
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
        <q-item v-if="userStore.userData" clickable to="/denuncias" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-exclamation-triangle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Denuncias</q-item-label>
            <q-item-label caption class="text-grey-8">Tuviste un incidente? Denuncialo.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="userStore.userData" clickable to="/mi-cuenta" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-user-circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Mi Cuenta</q-item-label>
            <q-item-label caption class="text-grey-8">Modifica tus datos aquí</q-item-label>
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
.q-item__label .q-item__label--caption .text-caption{
  color: $grey-8 !important;
}
.q-toolbar__title {

  span {
    font-weight: 900;

  }
}

.btn-entrada {

  .logout {
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


