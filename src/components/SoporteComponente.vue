<script setup>
import { ref } from 'vue';
import FooterComponent from './FooterComponent.vue';

const posicion = ref(0)

const onScroll = (params) => {
    posicion.value = params.position.top
}
</script>

<template>
    <q-scroll-observer @scroll="onScroll" />
    <!-- Button -->
    <q-btn to="#soporte" :class="`${posicion > 300 ? 'upToVisible' : 'upTo'}`" round color="red-13"
        icon="las la-angle-up" />

    <section id="soporte">
        <div class="row">
            <div class="col-12 col-md-8 col-xl-6 q-mx-auto">
                <h4 class="text-h4 text-center text-uppercase montserratExtraBold q-mb-none titleSection">Soporte</h4>
                <hr>
                <p class="text-center text-body2 q-mt-md sub-denuncia">
                    Para ponerse en contacto con nosotros por cualquier inconveniente con el simulador referido a nuestra
                    liga
                    recomendamos descargar el TeamSpeak 3. Este es un programa VOZ-IP ( similar al Skype ), donde podremos
                    mantener una conversación fluida.
                </p>
            </div>
        </div>
        <div class="row q-mt-xl">
            <div class="col-10 col-md-8 col-lg-6 col-xl-4 q-mx-auto">
                <q-timeline color="secondary">

                    <q-timeline-entry title="Descargar TeamSpeak 3" icon="download">
                        <div>
                            <p><a href="https://www.teamspeak.com/es/downloads/" target="_blank">Descargar TeamSpeak3</a>
                                desde su página oficial en español (enlace externo a la web oficial).
                            </p>
                        </div>
                    </q-timeline-entry>

                    <q-timeline-entry title="Instalalo en tu Computadora" icon="settings">
                        <div>
                            <p>
                                Una vez descargado el programa, instalalo en tu computadora. La instalación es bastante
                                intuitiva, pero si tenes dudas, contactate con nosotros por escrito en la
                                sección <a href="/contacto">Contacto</a> (debes estar Registrado para ello).
                            </p>
                        </div>
                    </q-timeline-entry>

                    <q-timeline-entry title="Micrófono y auriculares" icon="headset_mic">
                        <div>
                            <p>
                                Una vez instalado TeamSpeak3 y previo a ejecutarlo, conectá el micrófono y auriculares.
                            </p>
                        </div>
                    </q-timeline-entry>

                    <q-timeline-entry title="Conectate" icon="sensors">
                        <div>
                            <p>
                                Abrir el Teamspeak3 e ir a la solapa de arriba que dice "Connection", y luego a "Connect".
                            </p>
                        </div>
                    </q-timeline-entry>

                    <q-timeline-entry title="Completar Info" color="teal-6" icon="done_all">
                        <div>
                            <p>
                                Deberá aparecer una ventana con la siguiente información para completar:
                            </p>
                            <p>
                            <ul class="q-pl-sm">
                                <li><em><b>IP Address</b></em> : 190.183.221.107</li>
                                <li><em><b>Port</b></em> : 9987</li>
                                <li><em><b>Nickname</b></em> : (nombre de usuario que vas a usar)</li>
                                <li><em><b>Server Password</b></em> : rpmrpm</li>
                            </ul>

                            </p>
                        </div>
                    </q-timeline-entry>

                    <q-timeline-entry title="Si algo falló..." color="red-13" icon="error_outline">
                        <div>
                            <p>Si tuviste algún inconveniente con la descarga y/o instalación del TeamSpeak3, contactanos a
                                través de esta web mediante el formulario que encontrarás en la sección de <a
                                    href="/contacto">Contacto</a> (debes estar Registrado para ello). Te responderemos a la
                                brevedad.</p>
                        </div>
                    </q-timeline-entry>


                </q-timeline>
            </div>
        </div>
    </section>

    <FooterComponent />
</template>


<style lang="scss">
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

#soporte {

    h4.titleSection {
        padding-top: 5rem;
    }

    hr {
        width: 10%;
        border: 2.5px solid black;
        margin-top: 1%;
    }

    a {
        text-decoration: none;
        color: $red-13;
        font-weight: bold;
    }
}</style>