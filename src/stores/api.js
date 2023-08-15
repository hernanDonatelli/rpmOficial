import { defineStore } from "pinia";
import { Notify } from "quasar";

export const useApiStore = defineStore('useApiStore', {
  state: () => ({
    tokenApi: null,
    calendar: [],
    torneos: [],
    torneo: [],
    torneoOpt: [],
    plataformas: [],
    loadingSession: false,
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
          this.calendar = []

          if(response.data.length == 0){
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>No hay fechas programadas.</span>`,
              timeout: 1000
            });
          }else{
            const calendarioTorneos = response.data;
            calendarioTorneos.sort((a, b) => a.order - b.order);

            this.calendar = calendarioTorneos;

            Notify.create({
              color: "teal-14",
              textColor: "white",
              icon: "done",
              html: true,
              position: "center",
              message: `<span style='text-align: center;'>El Calendario ha sido cargado.</span>`,
              timeout: 500
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
      const traerTorneos = await fetch(`${this.url}/mostrarTorneos`, optionsTorneos);
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

    async createTorneoApi(token, datos){
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
      .then(data => {
        if(data.success){
          Notify.create({
            color: "green-13",
            textColor: "white",
            icon: "cloud_done",
            html: true,
            position: "center",
            message: `<p style='text-align: center;'>${data.message}</p>`,
            timeout: 3000
          });
        }else{
          Notify.create({
            color: "red-13",
            textColor: "white",
            icon: "warning",
            html: true,
            position: "center",
            message: `<p style='text-align: center;'>${data.message}</p>`,
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
              color: "green-13",
              textColor: "white",
              icon: "cloud_done",
              html: true,
              position: "center",
              message: `<p style='text-align: center;'>${data.message}</p>`,
              timeout: 3000
            });
          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "center",
              message: `<p style='text-align: center;'>${data.message}</p>`,
              timeout: 3000
            });
          }
        })


      } catch (error) {
        console.log(error);
      }

    },

    async deleteTorneoApi (token, idTorneo)  {
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
            color: "green-13",
            textColor: "white",
            icon: "cloud_done",
            html: true,
            position: "center",
            message: `<p style='text-align: center;'>${data.message}</p>`,
            timeout: 3000
          });
        } else {
          Notify.create({
            color: "red-13",
            textColor: "white",
            icon: "warning",
            html: true,
            position: "center",
            message: `<p style='text-align: center;'>${data.message}</p>`,
            timeout: 3000
          });
        }
      })

      setTimeout(() => {
        window.location.reload()
      }, 3000);

    },

    async createCalendarApi (token, fecha, nombre){
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
            } else {
              Notify.create({
                color: "red-13",
                textColor: "white",
                icon: "warning",
                html: true,
                position: "center",
                message: `<p style='text-align: center;'>${data.message}</p>`,
                timeout: 3000
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
              icon: "cloud_done",
              html: true,
              position: "center",
              message: `<p style='text-align: center;'>${data.message}</p>`,
              timeout: 500
            });
          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              html: true,
              position: "center",
              message: `<p style='text-align: center;'>${data.message}</p>`,
              timeout: 3000
            });
          }
        })
    },
  }
})