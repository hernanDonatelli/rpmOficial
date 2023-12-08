<template>
    <section id="footer" class="q-pb-lg q-pt-md">
        <div class="q-px-lg">
            <div class="row footer__rs">
                <div class="col-xs-10 col-md-4 rrss">
                    <h6 class="text-h6 text-uppercase montserratExtraBold text-center text-white q-my-sm">
                        Nuestras redes</h6>
                    <div class="row flex justify-evenly">
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
                </div>

                <div class="col-xs-6 col-md-4 logo-img">
                    <img src="../assets/logo_rpm_png.png" alt="RPM RacingLeague">
                </div>

                <div class="col-xs-6 col-md-4 fiscal">
                    <a href="http://qr.afip.gob.ar/?qr=RhTCFLYM06YNGdo6rMjBhA,," target="_F960AFIPInfo">
                        <img src="http://www.afip.gob.ar/images/f960/DATAWEB.jpg" alt="fiscal">
                    </a>
                </div>
                    <p class="copy col-md-12 text-caption text-center text-white q-mb-none q-mt-sm">Copyright 2023 -
                        Studioatlantic
                    </p>
            </div>

        </div>
    </section>
</template>

<style lang="scss" scoped>
#footer {
    background-color: #000000;

    .footer__rs {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        .rrss {


            .q-icon {
                font-size: 2rem;
            }
        }

        .logo-img {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 1rem;

            img {
                width: 150px;
                height: auto;
                display: block;
            }
        }

        .fiscal {
            display: block;
            text-align: center;
            margin-top: 1rem;

            img {
                width: 80px;
                height: auto;
            }
        }

    }

}

@media screen and (min-width: 991.98px) {
    #footer {

        .footer__rs {
            align-items: center;

            .logo-img {
                order: 1
            }

            .rrss {
                order: 2
            }

            .fiscal {
                order: 3
            }

            .copy{
                order: 4;
            }
        }
    }

}
</style>