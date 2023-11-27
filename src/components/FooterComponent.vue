<template>
    <section id="footer" class="q-py-lg">
        <div class="q-px-lg">
            <div class="row">
                <div class="col-12 flex justify-between items-center">

                    <div class="col-2 logo-img">
                        <img src="../assets/logo_rpm_png.png" alt="RPM RacingLeague">
                    </div>

                    <div class="col-8 rrss">
                        <h6 class="text-h6 text-uppercase montserratExtraBold text-center text-white q-my-none">
                            Nuestras redes</h6>
                        <div class="row flex justify-between">
                            <a href="https://www.facebook.com/RPMRacingLeague" target="_blanck">
                                <q-icon color="red-13" name="lab la-facebook" />
                            </a>
                            <a href="https://www.instagram.com/rpm.racing.league/" target="_blank">
                                <q-icon color="red-13" name="lab la-instagram" />
                            </a>
                            <a href="https://www.youtube.com/@rpmracingleague7342" target="_blank">
                                <q-icon color="red-13" name="lab la-youtube" />
                            </a>
                            <q-icon color="red-13" name="lab la-discord" />
                            <q-icon color="red-13" name="lab la-teamspeak" />
                        </div>
                        <div class="row">
                            <p class="text-caption text-center text-white q-mb-none q-mt-sm">Copyright 2023 - Studioatlantic
                            </p>
                        </div>
                    </div>

                    <div class="col-2 fiscal">
                        <a href="http://qr.afip.gob.ar/?qr=RhTCFLYM06YNGdo6rMjBhA,," target="_F960AFIPInfo">
                            <img src="http://www.afip.gob.ar/images/f960/DATAWEB.jpg" alt="fiscal">
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<style lang="scss" scoped>
#footer {
    padding-top: 3rem;
    background-color: #000000;

    .logo-img img {
        width: 150px;
        height: auto;
    }

    .fiscal img {
        width: 90px;
        height: auto;
    }

    .rrss .q-icon {
        font-size: 2rem;
    }
}
</style>