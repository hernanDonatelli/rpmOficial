import { defineStore } from "pinia";
import { Notify } from "quasar";

export const useApiStore = defineStore('useApiStore', {
  state: () => ({
    tokenApi: null,
    calendar: [],
    torneos: [],
    torneo: [],
    torneoOpt: [],
    calendarOpt: [],
    fechasOpt: [],
    plataformas: [],
    loadingSession: false,
    tituloSesiones: [],
    sesiones: [],
    infoTabla: [],
    tablaPosiciones: [],
    tablasHome: [],
    posicionesTorneos: [],
    noTabla: '',
    noticias: [],
    arrayFechasCounter: [],
    proximaFechaGlobal: null,
    sesionesVR: {},
    vueltasDriver: [],
    sesionesVD: []
  }),
  actions: {
    async loginApi() {
      const optionsLogin = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: '{"email":"organizacionrpm@gmail.com","password":"Mr*Charles-2023"}',
      };

      const fetchLogin = await fetch(`${process.env.API_URL}/login`, optionsLogin);
      const response = await fetchLogin.json();
      const token = response.token;

      //Guardado de token en localStorage
      localStorage.setItem("token", JSON.stringify(token));
      const tokenStorage = JSON.parse(localStorage.getItem("token"));

      this.tokenApi = tokenStorage;
    },

    async getUser(token) {
      const optionsGetUser = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"token": "${token}"}`,
      };

      try {
        const fetchGetUser = await fetch(`${process.env.API_URL}/get-user`, optionsGetUser);
        const response = await fetchGetUser.json();

        return response;

      } catch (error) {
        console.log(error);
      }
    },

    async getCalendarioApi(token, idTorneo) {
      const optionsCalendario = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idTorneo": "${idTorneo}"}`,
      };

      await fetch(`${process.env.API_URL}/getCalendario`, optionsCalendario)
        .then((res) => res.json())
        .then(response => {

          const calendarioTorneos = response.data;
          calendarioTorneos.sort((a, b) => a.order - b.order);

          this.calendar = calendarioTorneos;

          if (this.calendar.length == 0) {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "bottom",
              message: `<span style='text-align: center;'>No hay fechas programadas.</span>`,
              timeout: 1000
            });
          }

        })
    },

    async getCalendarioHomeApi(token, idTorneo) {
      const optionsCalendario = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idTorneo": "${idTorneo}"}`,
      };

      const getCalendar = await fetch(`${process.env.API_URL}/getCalendario`, optionsCalendario)
      const respuesta = await getCalendar.json()

      respuesta.data.sort((a, b) => a.order - b.order);

      return respuesta.data

    },

    async getTorneosApi(token) {
      const optionsTorneos = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      };
      const traerTorneos = await fetch(`${process.env.API_URL}/mostrarTorneos`, optionsTorneos);
      const respuesta = await traerTorneos.json();

      return respuesta;
    },

    async getPlataformas(token) {
      const optionsGetPlataforma = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: ''
      }

      const fetchGetPlataforma = await fetch(`${process.env.API_URL}/getPlataformas`, optionsGetPlataforma);
      const response = await fetchGetPlataforma.json();
      const plataformas = response.data;

      this.plataformas = Object.keys(plataformas);

    },

    async createTorneoApi(token, datos) {
      const optionsCreateTorneo = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${token}`
        },
        body: datos
      };

      await fetch(`${process.env.API_URL}/consumirTorneo`, optionsCreateTorneo)
        .then((res) => res.json())
        .then(response => {

          if (response.success) {
            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "done",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>${response.message}</span>`,
              timeout: 3000
            });

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>${response.message}</span>`,
              timeout: 3000
            });
          }
        })

    },

    async editTorneoApi(token, torneoEditado) {

      const optionsEditChamp = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(torneoEditado)
      };

      try {

        await fetch(`${process.env.API_URL}/editarTorneo`, optionsEditChamp)
          .then((res) => res.json())
          .then(data => {

            if (data.success) {
              Notify.create({
                color: "teal-14",
                textColor: "white",
                icon: "cloud_done",
                html: true,
                position: "center",
                message: `<span style='text-align: center;'>${data.message}</span>`,
                timeout: 3000
              });


            } else {
              Notify.create({
                color: "red-13",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "center",
                message: `<span style='text-align: center;'>${data.message}</span>`,
                timeout: 3000
              });
            }
          })


      } catch (error) {
        console.log(error);
      }

    },

    async deleteTorneoApi(token, idTorneo) {
      const optionsDeleteTorneo = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `{"idTorneo": "${idTorneo}"}`
      };

      await fetch(`${process.env.API_URL}/eliminarTorneo`, optionsDeleteTorneo)
        .then((res) => res.json())
        .then(data => {
          if (data.success) {

            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "cloud_done",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 3000
            });

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 3000
            });
          }
        })
    },

    async createCalendarApi(token, fecha, nombre) {
      const optionsCreateCalendar = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fecha),
      }

      try {

        await fetch(`${process.env.API_URL}/crearCalendario`, optionsCreateCalendar)
          .then((res) => res.json())
          .then(data => {

            const idTorneo = data.data[0].league_info_id

            if (data.success) {
              Notify.create({
                color: "teal-6",
                textColor: "white",
                icon: "cloud_done",
                html: true,
                position: "center",
                message: `<span style='text-align: center;'>${data.message}</span>`,
                timeout: 1000
              });

              this.getCalendarioApi(token, idTorneo)

            } else {
              Notify.create({
                color: "red-13",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "center",
                message: `<span style='text-align: center;'>${data.message}</span>`,
                timeout: 2000
              });
            }
          })


      } catch (error) {
        console.log(error);
      }


    },

    async deleteFechaApi(token, idTorneo, fecha) {
      const optionsDeleteFecha = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `{"idTorneo":"${idTorneo}","order":"${fecha}"}`
      };

      await fetch(`${process.env.API_URL}/eliminarFecha`, optionsDeleteFecha)
        .then((res) => res.json())
        .then(data => {
          if (data.success) {
            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "done",
              html: true,
              position: "bottom",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 500
            });

            this.getCalendarioApi(token, idTorneo)

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 3000
            });
          }
        })
    },

    async uploadResult(token, resultados) {
      const optionsUploadResult = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json'
        },
        body: resultados
      }

      fetch(`${process.env.API_URL}/consumirResultado`, optionsUploadResult)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "done",
              html: true,
              position: "top",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 500
            });

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "top",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 3000
            });
          }
        })
    },

    async getResultsApi(token, idTorneo, order) {

      const optionsGetResult = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idTorneo": "${idTorneo}","orden": "${order}"}`,
      };

      await fetch(`${process.env.API_URL}/getResultadosFecha`, optionsGetResult)
        .then(res => res.json())
        .then(info => {
          this.sesiones = []
          this.tituloSesiones = []

          const objSesiones = info.data[0]

          for (let sesion in objSesiones) {

            this.sesiones.push(objSesiones[sesion])

            if (sesion == 'qualify') {
              sesion = 'Qualy 1'
            }
            if (sesion == 'qualify2') {
              sesion = 'Qualy 2'
            }
            if (sesion == 'serie1') {
              sesion = 'Serie 1'
            }
            if (sesion == 'serie2') {
              sesion = 'Serie 2'
            }
            if (sesion == 'serie3') {
              sesion = 'Serie 3'
            }
            if (sesion == 'carreraCorta1') {
              sesion = 'Carrera 1'
            }
            if (sesion == 'carreraCorta2') {
              sesion = 'Carrera 2'
            }
            if (sesion == 'race') {
              sesion = 'Carrera'
            }
            if (sesion == 'qualify_general') {
              sesion = 'Qualy General'
            }

            this.tituloSesiones.push(sesion)
          }
        })

    },

    async aplicarSancionApi(token, idDriver, time) {
      const optionsAplicarSancion = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idDriverInfo": "${idDriver}","sancion": "${time}"}`,
      }

      await fetch(`${process.env.API_URL}/aplicarSancion`, optionsAplicarSancion)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "done",
              html: true,
              position: "top",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 1500
            });

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "top",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 3000
            });
          }
        })
    },

    async finalizarTorneoApi(token, idTorneo) {
      const optionsFinalizarTorneo = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idTorneo": "${idTorneo}"}`,
      }

      await fetch(`${process.env.API_URL}/finalizarTorneo`, optionsFinalizarTorneo)
        .then(res => res.json())
        .then(response => response)

    },

    async getPosicionesApi(token, idTorneo) {
      const optionsPosiciones = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `{"idTorneo": "${idTorneo}"}`
      }

      await fetch(`${process.env.API_URL}/posicionesTorneo`, optionsPosiciones)
        .then(res => res.json())
        .then(response => {

          this.tablaPosiciones.push(response.data[0])
        })
    },

    async createTablasPosicionesApi(token, idTorneo) {
      const optionsPosiciones = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `{"idTorneo": "${idTorneo}"}`
      }

      const traerPosiciones = await fetch(`${process.env.API_URL}/posicionesTorneo`, optionsPosiciones);
      const respuesta = await traerPosiciones.json();

      // this.posicionesTorneos.push(respuesta.data[0])

      return respuesta.data[0]

    },

    async getTipoCarrera(token) {
      const optionsTipoCarrera = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }

      const getTipoCarrera = await fetch(`${process.env.API_URL}/tiposDeCarrera`, optionsTipoCarrera);
      const respuesta = await getTipoCarrera.json();

      return respuesta;

    },

    async getNoticiasApi(token) {
      const optionsNoticias = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }

      const getNoticias = await fetch(`${process.env.API_URL}/novedades`, optionsNoticias);
      const respuesta = await getNoticias.json();

      this.noticias = respuesta

    },

    async createNoticiasApi(token, data) {
      const optionsCreateNoticia = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${token}`
        },
        body: data
      };

      await fetch(`${process.env.API_URL}/novedades`, optionsCreateNoticia)
        .then((res) => res.json())
        .then(response => {

          if (response.success) {
            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "done",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>${response.message}</span>`,
              timeout: 3000
            });

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>${response.message}</span>`,
              timeout: 3000
            });
          }
        })

    },

    async editNoticiaApi(token, id, noticiaEditada) {

      const optionsEditNews = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(noticiaEditada)
      };

      try {

        await fetch(`${process.env.API_URL}/novedades/${id}`, optionsEditNews)
          .then((res) => res.json())
          .then(data => {

            if (data.success) {
              Notify.create({
                color: "teal-14",
                textColor: "white",
                icon: "cloud_done",
                html: true,
                position: "center",
                message: `<span style='text-align: center;'>${data.message}</span>`,
                timeout: 3000
              });


            } else {
              Notify.create({
                color: "red-13",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "center",
                message: `<span style='text-align: center;'>${data.message}</span>`,
                timeout: 3000
              });
            }
          })


      } catch (error) {
        console.log(error);
      }

    },

    async deleteNoticiaApi(token, id) {
      const optionsDeleteNoticia = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        // body: `{"id": "${id}"}`
      };

      await fetch(`${process.env.API_URL}/novedades/${id}`, optionsDeleteNoticia)
        .then((res) => res.json())
        .then(data => {

          if (data === 1) {

            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "cloud_done",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>Noticia eliminada exitosamente</span>`,
              timeout: 3000
            });

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>Ha ocurrido un error. La noticia no pudo ser eliminada.</span>`,
              timeout: 3000
            });
          }
        })
    },

    async aplicarDQApi(token, idDriver, time) {
      const optionsAplicarDQ = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idDriverInfo": "${idDriver}"}`,
      }

      await fetch(`${process.env.API_URL}/aplicarDQ`, optionsAplicarDQ)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "done",
              html: true,
              position: "top",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 1500
            });

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "top",
              message: `<span style='text-align: center;'>${data.message}</span>`,
              timeout: 3000
            });
          }
        })
    },

    async proximaFechaApi(token, idTorneo) {
      const optionsproximaFecha = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }

      const getProximaFecha = await fetch(`${process.env.API_URL}/proximaFecha/${idTorneo}`, optionsproximaFecha);
      const respuesta = await getProximaFecha.json();

      return respuesta.data[0]


    },

    async proximaFechaGlobalApi(token) {
      const optionsproximaFecha = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }

      const getProximaFecha = await fetch(`${process.env.API_URL}/proximaFecha`, optionsproximaFecha);
      const respuesta = await getProximaFecha.json();

      return respuesta.data[0]


    },

    async enviarComunicacionAPI(token, comunicacion) {

      const optionsSubirComunicacion = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(comunicacion)
      };

      try {

        await fetch(`${process.env.API_URL}/enviarComunicacion`, optionsSubirComunicacion)
          .then((res) => res.json())
          .then(data => {

            if (data.success) {
              Notify.create({
                color: "teal-6",
                textColor: "white",
                icon: "done",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>${data.message}</span>`,
                timeout: 3000
              });

            } else {
              Notify.create({
                color: "red-13",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "top",
                message: `<span style='text-align: center;'>${data.message}</span>`,
                timeout: 3000
              });
            }
          });


      } catch (error) {
        console.log(error);
      }

    },

    async getVueltasRapidasApi(token, idTorneo, order) {

      const optionsGetVR = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idTorneo": "${idTorneo}","orden": "${order}"}`,
      };

      await fetch(`${process.env.API_URL}/getVueltasRapidas`, optionsGetVR)
        .then(res => res.json())
        .then(info => { this.sesionesVR = info.data })

    },

    async getVueltasDriverApi(token, idTorneo, sesion, driver) {

      const optionsGetVD = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idTorneo": ${idTorneo},"idSessionInfo": ${sesion},"idDriverInfo": ${driver}}`,
      };

      await fetch(`${process.env.API_URL}/getVueltasDriverSesion`, optionsGetVD)
        .then(res => res.json())
        .then(info => {
          this.vueltasDriver = info.data
        })

    },

    async getResultSessionApi(token, idTorneo, order) {

      const optionsGetSession = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idTorneo": "${idTorneo}","orden": "${order}"}`,
      };

      await fetch(`${process.env.API_URL}/getResultadosFecha`, optionsGetSession)
        .then(res => res.json())
        .then(info => {
          this.sesionesVD = info.data[0]
        })
    },

    async aplicarBonusSesionApi(token, idSesion, bonus) {

      const optionsAplicarBonusSesion = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idSessionInfo": "${idSesion}","bonus": "${bonus}"}`,
      };

      await fetch(`${process.env.API_URL}/aplicarBonusSesion`, optionsAplicarBonusSesion)
        .then(res => res.json())
        .then(info => info)

    },

    async quitarBonusSesionApi(token, idSesion) {

      const optionsQuitarBonusSesion = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idSessionInfo": "${idSesion}" }`,
      };

      await fetch(`${process.env.API_URL}/quitarBonusSesion`, optionsQuitarBonusSesion)
        .then(res => res.json())
        .then(info => info)

    },

    async aplicarBonusPilotoApi(token, idDriver, bonus) {

      const optionsAplicarBonusPiloto = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idDriverInfo": "${idDriver}","bonus": "${bonus}"}`,
      };

      await fetch(`${process.env.API_URL}/aplicarBonusPiloto`, optionsAplicarBonusPiloto)
        .then(res => res.json())
        .then(info => info)

    },

    async quitarBonusPilotoApi(token, idDriver) {

      const optionsQuitarBonusPiloto = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idDriverInfo": "${idDriver}"}`,
      };

      await fetch(`${process.env.API_URL}/quitarBonusPiloto`, optionsQuitarBonusPiloto)
        .then(res => res.json())
        .then(info => info)

    },

  }
})