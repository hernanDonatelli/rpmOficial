<script setup>
import FooterComponent from './FooterComponent.vue';
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { userDatabaseStore } from '../stores/database';
import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();
const databaseStore = userDatabaseStore();

const $q = useQuasar()

const nombre = ref('')
const apellido = ref('')
const nickname = ref('')
const movil = ref('')
const email = ref('')

//Validaciones
const nombreRules = [,
    (v) =>
        (v && v.length <= 20) || "El nombre debe contener menos de 20 caracteres",
];
const apellidoRules = [
    (v) =>
        (v && v.length <= 20) || "El apellido debe contener menos de 20 caracteres",
];
const mobileRules = [
    (v) =>
        (v && v.length >= 1 && v.length <= 10) ||
        "El movil debe ser de 10 caracteres",
];


//Metodos
const getInfoUser = () => {
    userStore.loadingUser = true;

    databaseStore.documents.forEach(user => {
        nombre.value = user.nombre;
        apellido.value = user.apellido;
        email.value = user.email;
        movil.value = user.movil;
        nickname.value = user.nickname
    });

}
// getInfoUser()
const onSubmitEdit = async () => {
    if (!nombre.value || !apellido.value || !movil.value || !nickname.value) {
        $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            position: "center",
            message: "Debe completar todos los campos",
            timeout: 1500
        });
    } else {
        const editUser = {
            nombre: nombre.value,
            apellido: apellido.value,
            movil: movil.value,
            nickname: nickname.value
        }
        // console.log(editUser);
        await databaseStore.updateUser(editUser);

        // await databaseStore.getUsers()

    }

};

const onResetEdit = () => {
    nombre.value = null;
    apellido.value = null;
    movil.value = null;
};

// const resetPage = async () => {
//     setTimeout(() => {
//         window.location.reload()
//     }, 3500);
// }
</script>

<template>
    <section id="mi-cuenta">
        <div class="row items-center mi-cuenta-container">
            <div class="col-12">

                <h4 class="title-mi-cuenta text-h4 text-center text-uppercase montserratExtraBold q-mb-none">Mi Cuenta</h4>
                <hr>
                <!-- Tabla de datos actuales -->

                <ul class="q-pl-none flex justify-center" style="list-style: none;">
                    <li v-for="usuario in databaseStore.documents" :key="usuario.id"
                        class="w-100 flex column justify-center items-center row-md">
                        <span>
                            <q-icon color="red-13" name="las la-file-signature" />
                            Nombre: <strong>{{ usuario.nombre }}</strong>
                        </span>

                        <span>
                            <q-icon color="red-13" name="las la-signature" />
                            Apellido: <strong>{{ usuario.apellido }}</strong>
                        </span>

                        <span>
                            <q-icon color="red-13" name="las la-user-astronaut" />
                            Nickname: <strong>{{ usuario.nickname }}</strong>
                        </span>

                        <span>
                            <q-icon color="red-13" name="las la-envelope" />
                            Email: <strong>{{ usuario.email }}</strong>
                        </span>

                        <span>
                            <q-icon color="red-13" name="las la-mobile-alt" />
                            Movil: <strong>{{ usuario.movil }}</strong>
                        </span>
                    </li>
                </ul>
            </div>

            <!-- Formulario de edicion -->
            <div class="col-12 col-sm-12 q-mt-md-lg">

                <h5 class="text-h5 text-center text-uppercase montserratRegular text-weight-light q-mt-none">Editar Cuenta
                </h5>

                <q-form @reset="onResetEdit" class="q-gutter-md">
                    <div>
                        <div class="row flex justify-center q-mb-lg">
                            <div class="col-12 col-md-4 col-lg-3">
                                <q-input class="q-mx-sm" filled dense color="red-13" label="nombre" v-model="nombre"
                                    hint="Hasta 20 caracteres" lazy-rules />
                            </div>
                            <div class="col-12 col-md-4 col-lg-3">
                                <q-input class="q-mx-sm" filled dense color="red-13" label="apellido" v-model="apellido"
                                    hint="Hasta 20 caracteres" lazy-rules />
                            </div>
                        </div>

                        <div class="row flex justify-center q-mb-lg">
                            <div class="col-12 col-md-4 col-lg-3">
                                <q-input class="q-mx-sm" filled dense color="red-13" type="text" label="nickname"
                                    v-model="nickname" hint="Tu nickname dentro del juego." />
                            </div>
                            <div class="col-12 col-md-4 col-lg-3">
                                <q-input class="q-mx-sm" filled dense type="number" color="red-13" label="movil"
                                    v-model="movil" hint="Con codigo de area, sin el 15" />
                            </div>
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="col-12 col-sm-6 q-mt-xl">
                            <q-btn @click.prevent="getInfoUser" label="Cargar Datos" type="submit" color="dark" dense
                                class="q-px-md q-mb-xs-md" />
                            <q-btn @click.prevent="onSubmitEdit" :disable="!userStore.loadingUser"
                                class="q-mb-xs-md q-mx-md q-px-md" label="Editar Usuario" type="submit" color="teal-6"
                                dense />
                            <q-btn label="Limpiar Campos" type="reset" color="red-13" dense class="q-mb-xs-md q-px-md" />
                        </div>
                    </div>
                </q-form>

            </div>
        </div>
    </section>

    <FooterComponent />
</template>


<style lang="scss" scoped>
#mi-cuenta {
    height: auto;
    background: repeating-linear-gradient(#ffffffe9, rgba(255, 255, 255, 0.789)), url(../assets/wall_4.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center left;
    margin-bottom: 2rem;

    .mi-cuenta-container {
        max-width: 95%;
        margin: 0 auto;
        height: 100vh;

        .title-mi-cuenta {
            margin-top: 5rem;
        }
    }

    .wraper {
        padding-top: 5.5rem;
    }

    hr {
        width: 10%;
        border: 2.5px solid black;
        margin-top: 1%;
    }
}

ul li {
    width: 100%;

    span {
        display: inline-block;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }

    .q-icon {
        font-size: 2rem;
    }
}

@media screen and (min-width: 991.98px) {
    #mi-cuenta {

        .mi-cuenta-container {
            height: unset;
        }
    }
}

@media screen and (min-width: 1365.98px) {
    ul li {
        text-align: center;
    }
}
</style>