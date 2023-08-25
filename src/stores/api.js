import { defineStore } from "pinia";
import { Notify, Dialog } from "quasar";

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
    noTabla: '',
    url: 'https://rpm.studioatlantic.com.ar/pezls/public/api/v1'
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

      const fetchLogin = await fetch(`${this.url}/login`, optionsLogin);
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
        const fetchGetUser = await fetch(`${this.url}/get-user`, optionsGetUser);
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

      await fetch(`${this.url}/getCalendario`, optionsCalendario)
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

    async getTorneosApi(token) {
      const optionsTorneos = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      };
      const traerTorneos = await fetch(`https://rpm.studioatlantic.com.ar/pezls/public/api/v1/mostrarTorneos`, optionsTorneos);
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

      const fetchGetPlataforma = await fetch('https://rpm.studioatlantic.com.ar/pezls/public/api/v1/getPlataformas', optionsGetPlataforma);
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

      await fetch('https://rpm.studioatlantic.com.ar/pezls/public/api/v1/consumirTorneo', optionsCreateTorneo)
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

        await fetch('https://rpm.studioatlantic.com.ar/pezls/public/api/v1/editarTorneo', optionsEditChamp)
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

      await fetch('https://rpm.studioatlantic.com.ar/pezls/public/api/v1/eliminarTorneo', optionsDeleteTorneo)
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

        await fetch('https://rpm.studioatlantic.com.ar/pezls/public/api/v1/crearCalendario', optionsCreateCalendar)
          .then((res) => res.json())
          .then(data => {

            const idTorneo = data.data[0].league_info_id

            if (data.success) {
              Notify.create({
                color: "teal-14",
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

      await fetch(`https://rpm.studioatlantic.com.ar/pezls/public/api/v1/eliminarFecha`, optionsDeleteFecha)
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

      fetch(`https://rpm.studioatlantic.com.ar/pezls/public/api/v1/consumirResultado`, optionsUploadResult)
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

      await fetch("https://rpm.studioatlantic.com.ar/pezls/public/api/v1/getResultadosFecha", optionsGetResult)
        .then(res => res.json())
        .then(info => {

          this.sesiones = []
          this.tituloSesiones = []

          const objSesiones = info.data[0]

          for (let sesion in objSesiones) {

            this.sesiones.push(objSesiones[sesion])

            if (sesion == 'qualify') {
              sesion = 'Clasificacion'
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

      await fetch("https://rpm.studioatlantic.com.ar/pezls/public/api/v1/aplicarSancion", optionsAplicarSancion)
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

      await fetch("https://rpm.studioatlantic.com.ar/pezls/public/api/v1/finalizarTorneo", optionsFinalizarTorneo)
        .then(res => res.json())
        .then(response => response)

    },

    async getPosicionesApi(token, idTorneo)  {
      const optionsPosiciones = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `{"idTorneo": "${idTorneo}"}`
      }

      await fetch('https://rpm.studioatlantic.com.ar/pezls/public/api/v1/posicionesTorneo', optionsPosiciones)
      .then(res => res.json())
      .then(response => {

        if(response.data[0].length == 0){
          this.noTabla = 'La Tabla no ha sido generada aún.'
        }else{
          this.tablaPosiciones.push(response.data[0])

        }
      })
    }
  }
})