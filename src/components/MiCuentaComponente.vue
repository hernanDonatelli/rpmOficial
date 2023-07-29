<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { userDatabaseStore } from '../stores/database';
import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();
const databaseStore = userDatabaseStore();

const $q = useQuasar()

const nombre = ref('')
const apellido = ref('')
const email = ref('')
const movil = ref('')

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
        movil.value = user.movil
    });

}
// getInfoUser()
const onSubmitEdit = async () => {
    if (!nombre.value || !apellido.value || !email.value || !movil.value) {
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
        }
        // console.log(editUser);
        await databaseStore.updateUser(editUser);

        await msgEditOk();

    }

};

const onResetEdit = () => {
    nombre.value = null;
    apellido.value = null;
    movil.value = null;
};

const msgEditOk = async() => {
    setTimeout(() => {
        $q.notify({
            color: "green-4",
            textColor: "white",
            position: "center",
            icon: "cloud_done",
            message: "El Usuario ha sido editado exitosamente!",
            timeout: 1000
        });

    }, 1000);


}
</script>

<template>
    <div class="q-mt-xl">
        <div class="flex column">
            <h2 class="text-uppercase text-h4 text-center q-mb-none">Mi Cuenta</h2>
            <!-- Tabla de datos actuales -->
            <div class="col-12 col-sm-6 q-pa-md">
                <ul class="q-pl-none flex justify-center" style="list-style: none;">
                    <li v-for="usuario in databaseStore.documents" :key="usuario.id" class="w-100 flex justify-center">
                        <span>
                            <q-icon color="red-13" name="las la-file-signature" />
                            Nombre: <strong>{{ usuario.nombre }}</strong>
                        </span>
                        <span>
                            <q-icon color="red-13" name="las la-signature" />
                            Apellido: <strong>{{ usuario.apellido }}</strong>
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
        </div>

        <!-- Formulario de edicion -->
        <div class="col-12 col-sm-6 col-md-5 q-pa-md">

            <h5 class="text-h5 text-center text-uppercase text-weight-light">Editar Cuenta</h5>

            <q-form @reset="onResetEdit" class="q-gutter-md">
                <div>
                    <div class="row flex justify-center q-mb-lg">
                        <div class="col-12 col-sm-3">
                            <q-input class="q-mx-sm" filled dense color="red-10" label="nombre" v-model="nombre" hint="Hasta 20 caracteres"
                                lazy-rules />
                        </div>
                        <div class="col-12 col-sm-3">
                            <q-input class="q-mx-sm" filled dense color="red-10" label="apellido" v-model="apellido"
                                hint="Hasta 20 caracteres" lazy-rules />
                        </div>
                    </div>

                    <div class="row flex justify-center q-mb-lg">
                        <div class="col-12 col-sm-3">
                            <q-input class="q-mx-sm" disable filled dense color="red-10" type="email" label="email" v-model="email" />
                        </div>
                        <div class="col-12 col-sm-3">
                            <q-input class="q-mx-sm" filled dense type="number" color="red-10" label="movil" v-model="movil"
                                hint="Con codigo de area, sin el 15" />
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <div class="col-12 col-sm-6 q-mt-xl">
                    <q-btn @click.prevent="getInfoUser" label="Cargar Datos" type="submit" color="dark" />
                    <q-btn @click.prevent="onSubmitEdit" :disable="!userStore.loadingUser" class="q-mx-xl" label="Editar Usuario" type="submit" color="green-10" />
                    <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
                </div>
            </q-form>

        </div>
    </div>
</template>


<style lang="scss" scoped>
ul li {
    width: 100%;

    span{
        display: inline-block;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
    .q-icon {
        font-size: 2rem;
    }
}

@media screen and (min-width: 1365.98px) {
    ul li {
        text-align: center;
    }
}
</style>