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

const drawer = ref(false)
const link = ref('')
const fechaTop = ref('')

const menu = (seccion) => {
  link.value = seccion
  drawer.value = !drawer

}

onMounted(async () => {
  userStore.currentUserLog();
  getTorneos();
  fechaHeader()
})

//Funcion para mostrar fecha en header
const fechaHeader = () => {
  // Creamos array con los meses del año
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Creamos array con los días de la semana
  const dias_semana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Creamos el objeto fecha instanciándolo con la clase Date
  const date = new Date();

  // Construimos el formato de salida
  fechaTop.value = `${dias_semana[date.getDay()]}, ${date.getDate()} de ${meses[date.getMonth()]} de ${date.getUTCFullYear()}`;
}

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

const posicion = ref(0)

const onScroll = (params) => {

  posicion.value = params.position.top
}

</script>

<template>
  <q-layout id="home" view="hHh LpR fFf">
    <q-scroll-observer @scroll="onScroll" />
    <!-- Button -->
    <q-btn to="#home" @click="link = 'home'" :active="link === 'home'"
      :class="`${posicion > 300 ? 'upToVisible' : 'upTo'}`" round color="red-13" icon="las la-angle-up" />

    <q-header elevated class="header__nav">
      <q-toolbar>
        <q-btn class="text-red-13" flat dense round @click="drawer = !drawer" aria-label="Menu" icon="las la-bars" />

        <q-toolbar-title class="text-red-13 flex column items-center row-sm justify-sm-between q-py-sm">
          <h4 class="q-my-none text-h5 text-weight-light"><router-link to="/" @click="link = 'home'"
              :active="link === 'home'">
              <span>RPM</span>RacingLeague</router-link>
          </h4>

          <div v-if="!userStore.loadingSession" class="btn-entrada q-my-xs">

            <p v-for="user of databaseStore.documents" :key="user.id"
              class="inline-block q-mr-sm q-mb-none text-body2 text-blue-grey-2">
              Hola, <strong>{{ user.nickname }}</strong>
            </p>

            <login-modal-component v-if="databaseStore.documents == ''" />

            <register-form-component v-if="databaseStore.documents == ''" />

            <q-btn v-if="databaseStore.documents != ''" @click="logout" class="q-mr-sm logout" color="red-13" size="sm"
              label="Salir" icon="las la-sign-out-alt" />

            <p class="text-blue-grey-5 text-caption q-mb-none text-center date">{{ fechaTop }}</p>
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

    <q-drawer v-model="drawer" side="left" elevated class="drawer__menu q-pb-xl">
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable to="/#home" v-ripple @click="menu('home')" :active="link === 'home'"
          active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption :class="`${link == 'home' ? 'text-black' : 'text-grey-6'}`">Ir al inicio de la
              web</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/#novedades" v-ripple @click="menu('novedades')" :active="link === 'novedades'"
          active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-users" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Novedades</q-item-label>
            <q-item-label caption :class="`${link == 'novedades' ? 'text-black' : 'text-grey-6'}`">Noticias en RPM Racing
              League</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/#campeonatos" v-ripple @click="menu('campeonatos')" :active="link === 'campeonatos'"
          active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-trophy" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Campeonatos</q-item-label>
            <q-item-label caption :class="`${link == 'campeonatos' ? 'text-black' : 'text-grey-6'}`">Nuestras
              competiciones aquí</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/#youTube" v-ripple @click="menu('youtube')" :active="link === 'youtube'"
          active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-photo-video" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Multimedia</q-item-label>
            <q-item-label caption class="text-grey-6">YouTube - Imagenes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/torneos-finalizados" v-ripple @click="menu('finalizados')" :active="link === 'finalizados'"
          active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-medal" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Finalizados</q-item-label>
            <q-item-label caption :class="`${link == 'finalizados' ? 'text-black' : 'text-grey-6'}`">Torneos finalizados
              de RPM</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/soporte" v-ripple @click="menu('soporte')"
          :active="link === 'soporte'" active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-headset" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Soporte</q-item-label>
            <q-item-label caption :class="`${link == 'soporte' ? 'text-black' : 'text-grey-6'}`">Guía para instalar
              TeamSpeak3</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="userStore.userData" clickable to="/contacto" v-ripple @click="menu('contacto')"
          :active="link === 'contacto'" active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-envelope" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Contacto</q-item-label>
            <q-item-label caption :class="`${link == 'contacto' ? 'text-black' : 'text-grey-6'}`">Escribenos por cualquier
              inquietud</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="userStore.userData" clickable to="/denuncias" v-ripple @click="menu('denuncias')"
          :active="link === 'denuncias'" active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-exclamation-triangle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Denuncias</q-item-label>
            <q-item-label caption :class="`${link == 'denuncias' ? 'text-black' : 'text-grey-6'}`">Tuviste un incidente?
              Denuncialo.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="userStore.userData" clickable to="/mi-cuenta" v-ripple @click="menu('micuenta')"
          :active="link === 'micuenta'" active-class="bg-lime-11 text-black text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-user-circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Mi Cuenta</q-item-label>
            <q-item-label caption :class="`${link == 'micuenta' ? 'text-black' : 'text-grey-6'}`">Modifica tus datos
              aquí</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>



      <q-list v-for="item in databaseStore.documents" :key="item.id">
        <!-- Seccion Administrador -->
        <h6 v-if="item.isAdmin" class="text-h6 text-orange-6 text-uppercase text-weight-bold q-mb-none q-mt-lg q-pl-md">
          Administración
        </h6>

        <q-item v-if="item.isAdmin" clickable to="/administrar-torneos" v-ripple @click="menu('adminTorneos')"
          :active="link === 'adminTorneos'" active-class="text-black bg-amber-13 text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-trophy" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Torneos</q-item-label>
            <q-item-label caption :class="`${link == 'adminTorneos' ? 'text-black' : 'text-grey-6'}`">Administración de
              Torneos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="item.isAdmin" clickable to="/administrar-calendarios" v-ripple @click="menu('adminCalendar')"
          :active="link === 'adminCalendar'" active-class="text-black bg-amber-13 text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-calendar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendarios</q-item-label>
            <q-item-label caption :class="`${link == 'adminCalendar' ? 'text-black' : 'text-grey-6'}`">Administración de
              Calendarios</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="item.isAdmin" clickable to="/administrar-resultados" v-ripple @click="menu('adminResults')"
          :active="link === 'adminResults'" active-class="text-black bg-amber-13 text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-poll" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Resultados</q-item-label>
            <q-item-label caption :class="`${link == 'adminResults' ? 'text-black' : 'text-grey-6'}`">Administración de
              Resultados</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="item.isAdmin" clickable to="/administrar-posiciones" v-ripple @click="menu('adminPosiciones')"
          :active="link === 'adminPosiciones'" active-class="text-black bg-amber-13 text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-tachometer-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Posiciones</q-item-label>
            <q-item-label caption :class="`${link == 'adminPosiciones' ? 'text-black' : 'text-grey-6'}`">Visualizar Tablas
              de Posiciones</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="item.isAdmin" clickable to="/administrar-noticias" v-ripple @click="menu('adminNews')"
          :active="link === 'adminNews'" active-class="text-black bg-amber-13 text-weight-bold">
          <q-item-section avatar>
            <q-icon name="las la-info-circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Noticias</q-item-label>
            <q-item-label caption :class="`${link == 'adminNews' ? 'text-black' : 'text-grey-6'}`">Cargar nuevas Noticias
              o Eventos</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container id="main__container">
      <img class="logoRPM" src="../assets/logo_rpm_png_light.png" alt="RPM Racing League">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<style lang="scss">
.logoRPM {
  display: none;
  position: fixed;
  top: 1%;
  left: 50%;
  z-index: 2000;
  transform: translate(-50%, 0);
}

.upTo {
  position: fixed;
  bottom: 7%;
  right: 2%;
  z-index: 9999;
  opacity: 0;
  transition: all .2s ease-in;
}

.upToVisible {
  position: fixed;
  bottom: 7%;
  right: 2%;
  z-index: 9999;
  opacity: 1;
  transition: all .2s ease-in;
}

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


#main__container.q-page-container {
  padding-top: 0 !important;
  padding-left: 0 !important;
  background-image: repeating-linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9)),
    url(../assets/background.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: auto;
}

.header__nav {
  background-color: $blue-grey-10;

  h4 a {
    text-decoration: none;
    color: $red-13;
  }

  .date {
    position: relative;
    // right: 7%;
  }
}

.drawer__menu {
  background-color: rgba($color: #000000, $alpha: 0.98);
}

.q-list a {
  color: white;

}

@media screen and (min-width: 767.98px) {
  .logoRPM {
    display: block;
    max-width: 175px;
  }
}

@media screen and (min-width: 1023.98px) {
  .logoRPM {
    max-width: 200px;
  }
}

@media screen and (min-width: 1279.98px) {
  .logoRPM {
    max-width: 215px;
  }
}
</style>


