import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { defineStore } from 'pinia'
import { auth } from 'src/firebaseConfig';
import { userDatabaseStore } from './database';
import { Notify } from 'quasar';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
    userLoged: false
  }),
  actions: {
    async registerUser(email, password, nombre, apellido, movil) {
      const userDatabase = userDatabaseStore()
      this.loadingUser = true

      try {
        const data = {
          nombre: nombre,
          apellido: apellido,
          movil: movil,
          isAdmin: false
        }

        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {

            sendEmailVerification(auth.currentUser)
              .then(() => {

                const user = userCredentials.user

                const userToRegister = {
                  email: user.email,
                  uid: user.uid,
                  emailVerified: user.emailVerified,
                  nombre: data.nombre,
                  apellido: data.apellido,
                  movil: data.movil,
                  isAdmin: data.isAdmin
                }

                userDatabase.addUser(userToRegister);

                Notify.create({
                  color: "green-4",
                  textColor: "white",
                  icon: "cloud_done",
                  multiline: true,
                  html: true,
                  position: "center",
                  message: "<p style='text-align: center;'>El Registro del usuario fue exitoso!<br> Se ha enviado un email de verificación para validar la cuenta.</p>",
                  timeout: 3000
                });

              });


          })

      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false
      }
    },

    async loginUser(email, password) {
      const databaseStore = userDatabaseStore()
      this.loadingUser = true
      // this.userLoged = true

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;

          if (user.emailVerified) {

            this.userData = { email: user.email, uid: user.uid, emailVerified: user.emailVerified }

            databaseStore.getUsers()

            Notify.create({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              position: "center",
              message: "Inicio de sesión exitoso!",
              timeout: 1500
            });

          } else {
            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              position: "center",
              message: "Debes validar tu correo electrónico para ingresar",
              timeout: 1500
            });
          }
        })


    },

    async logoutUser() {
      const databaseStore = userDatabaseStore()

      try {
        await signOut(auth)
        this.userData = null;

        databaseStore.$reset()

      } catch (error) {
        console.log();
      } finally {
        this.userLoged = false
      }
    },

    currentUserLog() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(auth, user => {
          const databaseStore = userDatabaseStore();
          console.log(user);
          if (user.emailVerified) {
            // console.log(user);
            this.userData = { email: user.email, uid: user.uid, emailVerified: user.emailVerified };

            databaseStore.getUsers();

          } else {
            this.userData = null;
            const databaseStore = userDatabaseStore()
            databaseStore.$reset()
          }
          resolve(user);

        }, e => reject(e));

        unsuscribe();

      })
    },

  }
})
