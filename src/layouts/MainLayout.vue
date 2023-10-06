<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import LoginModalComponent from '../components/LoginModalComponent.vue'
import RegisterFormComponent from '../components/RegisterModalComponent.vue'
import { useRouter } from 'vue-router'
import { userDatabaseStore } from '../stores/database'
import { useApiStore } from 'src/stores/api';

const apiStore = useApiStore();
const router = useRouter()
const userStore = useUserStore()
const databaseStore = userDatabaseStore()

const leftDrawerOpen = ref(false)

const getTorneosStore = ref([])


//Menu lateral
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(async () => {
  userStore.currentUserLog();
  getTorneos();
  // databaseStore.getAdmin();
})

//Salir de la sesion
const logout = async () => {
  await userStore.logoutUser()

  setTimeout(() => {
    router.push('/')
  }, 1000);
}

//////////////////////////////Torneos//////////////////////////

//Generador de token y comprobacion de usuario
const loginUserApi = async () => {
  await apiStore.loginApi();
  await apiStore.getUser(apiStore.tokenApi);
}

//Traer torneos y sus datos de la API
const getTorneos = async () => {
  await loginUserApi();
  const torneos = await apiStore.getTorneosApi(apiStore.tokenApi);

  apiStore.torneos = torneos

}


</script>

<template>
  <q-layout id="home" view="hHh lpR fFf">
    <q-header class="header__nav">
      <q-toolbar>
        <q-btn class="text-red-13" flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="las la-bars" />

        <q-toolbar-title class="text-red-13 flex column items-center row-sm justify-sm-between">
          <h4 class="q-my-none text-h5 text-weight-light"><span>RPM</span>RacingLeague</h4>
          <div v-if="!userStore.loadingSession" class="btn-entrada q-my-xs">
            <p v-for="user of databaseStore.documents" :key="user.id"
              class="inline-block q-mr-sm q-mb-none text-caption text-grey-13">
              {{ user.nombre }} {{ user.apellido }}
            </p>

            <login-modal-component v-if="databaseStore.documents == ''" />

            <register-form-component v-if="databaseStore.documents == ''" />

            <q-btn v-if="databaseStore.documents != ''" @click="logout" class="q-mr-sm logout" outline size="sm"
              label="Salir" />
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
        <q-item clickable to="#campeonatos">
          <q-item-section avatar>
            <q-icon name="las la-trophy" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Campeonatos</q-item-label>
            <q-item-label caption class="text-grey-8">Nuestras competiciones aquí</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="#youTube">
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
        <q-item v-if="userStore.userData" clickable to="/contacto" active-class="menu__link">
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


      <q-list v-for="item in databaseStore.documents" :key="item.id">
        <!-- Seccion Administrador -->
        <h6 v-if="item.isAdmin" class="text-h6 text-orange-6 text-weight-light q-mb-none q-mt-sm q-pl-md">Administración</h6>

        <q-item v-if="item.isAdmin" clickable to="/administrar-torneos" class="text-orange-6" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-trophy" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Torneos</q-item-label>
            <q-item-label caption class="text-grey-8">Administración de Torneos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="item.isAdmin" clickable to="/administrar-calendarios" class="text-orange-6" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-calendar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendarios</q-item-label>
            <q-item-label caption class="text-grey-8">Administración de Calendarios</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="item.isAdmin" clickable to="/administrar-resultados" class="text-orange-6" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-poll" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Resultados</q-item-label>
            <q-item-label caption class="text-grey-8">Administración de Resultados</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="item.isAdmin" clickable to="/administrar-posiciones" class="text-orange-6" active-class="menu__link">
          <q-item-section avatar>
            <q-icon name="las la-tachometer-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Posiciones</q-item-label>
            <q-item-label caption class="text-grey-8">Visualizar Tablas de Posiciones</q-item-label>
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
.q-item.q-router-link--active,
.q-item--active {
  color: white;
}

.q-item__label .q-item__label--caption .text-caption {
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

#main__container.q-page-container {
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


