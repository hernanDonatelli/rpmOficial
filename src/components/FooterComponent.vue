<template>
    <section id="footer" class="q-pb-lg q-pt-md">
        <div>
            <div class="row footer__rs">
                <div class="col-xs-10 col-md-4 rrss">
                    <h6 class="text-h6 text-uppercase montserratExtraBold text-center text-blue-grey-10 q-my-sm">
                        Nuestras redes</h6>
                    <div class="row flex justify-evenly links">
                        <a href="https://www.facebook.com/RPMRacingLeague" target="_blanck">
                            <q-icon name="lab la-facebook" />
                        </a>
                        <a href="https://www.instagram.com/rpm.racing.league/" target="_blank">
                            <q-icon name="lab la-instagram" />
                        </a>
                        <a href="https://www.youtube.com/@rpmracingleague7342" target="_blank">
                            <q-icon name="lab la-youtube" />
                        </a>
                        <a href="#" target="_blank">
                            <q-icon name="lab la-discord" />
                        </a>
                        <a href="#" target="_blank">
                            <q-icon name="lab la-teamspeak" />
                        </a>
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
                <p class="copy col-md-12 text-caption text-center text-blue-grey-10 q-mb-none q-mt-sm">Copyright 2023 -
                    Studioatlantic
                </p>
            </div>

        </div>
    </section>
</template>

<style lang="scss" scoped>
#footer {

    .footer__rs {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        .rrss {

            .links a {
                color: #263238;
                transition: all .2s ease-in-out;
            }

            .links a:hover {
                color: $red-13;
            }

            .q-icon {
                font-size: 1.5rem;
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

            .copy {
                order: 4;
            }
        }
    }

}
</style>