<script setup>
import { ref } from 'vue';

const nombre = ref(null)
const plataforma = ref(null)
const puntosClasifica = ref(null)
const puntosCarreraCorta = ref(null)
const puntosCarrera = ref(null)
const imagen = ref(null)
const options = ['rFactor', 'rFactor2', 'SimuladorTC', 'Assetto Corsa']
</script>

<template>
    <h4 class="text-uppercase text-center q-mt-xl q-mb-lg">Administrar Torneos</h4>

    <div class="row flex justify-around q-mb-xl">

        <!-- Formulario de Creacion de Torneo -->
        <div class="col-4">
            <h5 class="text-uppercase q-mt-none">Crear Torneo</h5>
            <q-form method="POST" enctype="multipart/form-data" @submit.prevent="crearTorneo" @reset="onReset"
                class="q-gutter-md">

                <div class="form-group">
                    <q-select filled dense v-model="plataforma" :options="options" hint="Seleccionar una opción"
                        label="Plataforma" />

                </div>
                <div class="form-group">
                    <q-input filled dense v-model="nombre" label="Nombre de Torneo" hint="Texto y numeros" />

                </div>

                <div class="form-group">
                    <q-input filled dense v-model="puntosClasifica" label="Puntos de Qualy"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense v-model="puntosCarreraCorta" label="Puntos de Series/Carrera Corta"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense v-model="puntosCarrera" label="Puntos de Carrera/Final"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-file filled dense bottom-slots v-model="imagen" label="Buscar imagen" counter max-files="1">
                        <template v-slot:before>
                            <q-icon name="attachment" />
                        </template>

                        <template v-slot:append>
                            <q-icon v-if="imagen !== null" name="close" @click.stop.prevent="imagen = null"
                                class="cursor-pointer" />
                            <q-icon name="search" @click.stop.prevent />
                        </template>

                        <template v-slot:hint>
                            Formatos: .jpg .png
                        </template>
                    </q-file>
                </div>
                <q-btn color="green-13" text-color="black" label="Crear Torneo" />
            </q-form>
        </div>

        <!-- Formulario de Edicion de Torneo -->
        <div class="col-4">
            <h5 class="text-uppercase q-mt-none">Editar Torneo</h5>
            <q-form method="POST" enctype="multipart/form-data" @submit.prevent="editarTorneo" @reset="onReset"
                class="q-gutter-md">
                <div class="form-group">
                    <q-select filled dense v-model="plataforma" :options="options" hint="Seleccionar una opción"
                        label="Plataforma" />

                </div>
                <div class="form-group">
                    <q-input filled dense v-model="nombre" label="Nombre de Torneo" hint="Texto y numeros" />

                </div>

                <div class="form-group">
                    <q-input filled dense v-model="puntosClasifica" label="Puntos de Qualy"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense v-model="puntosCarreraCorta" label="Puntos de Series/Carrera Corta"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-input filled dense v-model="puntosCarrera" label="Puntos de Carrera/Final"
                        hint="Numeros (separados por coma)" />
                </div>

                <div class="form-group">
                    <q-file filled dense bottom-slots v-model="imagen" label="Buscar imagen" counter max-files="1">
                        <template v-slot:before>
                            <q-icon name="attachment" />
                        </template>

                        <template v-slot:append>
                            <q-icon v-if="imagen !== null" name="close" @click.stop.prevent="imagen = null"
                                class="cursor-pointer" />
                            <q-icon name="search" @click.stop.prevent />
                        </template>

                        <template v-slot:hint>
                            Formatos: .jpg .png
                        </template>
                    </q-file>
                </div>
                <q-btn color="grey-13" text-color="black" label="Cargar datos" />
                <q-btn color="green-13" text-color="black" label="Editar Torneo" />
            </q-form>
        </div>
    </div>
</template>


<style lang="scss" scoped></style>