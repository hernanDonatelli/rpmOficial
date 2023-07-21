import { defineStore } from "pinia";

export const useApiStore = defineStore('useApiStore', {
  state: () => ({
    tokenApi: null,
    calendar: null,
    torneos: null
  }),
  actions: {
    async loginApi() {
      const optionsCalendar = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: '{"email":"organizacionrpm@gmail.com","password":"Mr*Charles-2023"}',
      };

      const fetchCalendar = await fetch(
        "https://rpm.studioatlantic.com.ar/pezls/public/api/v1/login",
        optionsCalendar
      );
      const response = await fetchCalendar.json();
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

      const fetchGetUser = await fetch(
        "https://rpm.studioatlantic.com.ar/pezls/public/api/v1/get-user",
        optionsGetUser
      );
      const response = await fetchGetUser.json();
      const respuesta = response.status;
      // console.log(respuesta);
      return respuesta;
    },

    async getCalendarioApi(token) {
      const optionsCrearTablasCalendario = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: `{"idTorneo": "2"}`,
      };

      const fetchGetCalendario = await fetch(
        "https://rpm.studioatlantic.com.ar/pezls/public/api/v1/getCalendario",
        optionsCrearTablasCalendario
      );
      const response = await fetchGetCalendario.json();

      const calendarioTorneos = response.data;
      calendarioTorneos.sort((a, b) => a.order - b.order);

      return calendarioTorneos;
    },

    async getTorneosApi(token) {
      const optionsMostrarTorneos = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      };
      const traerTorneos = await fetch('https://rpm.studioatlantic.com.ar/pezls/public/api/v1/mostrarTorneos', optionsMostrarTorneos);
      const respuesta = await traerTorneos.json();

      return respuesta;
    },
  }
})