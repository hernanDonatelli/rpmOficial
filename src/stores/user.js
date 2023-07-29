import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { defineStore } from 'pinia'
import { auth } from 'src/firebaseConfig';
import { userDatabaseStore } from './database';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false
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

                userDatabase.addUser(userToRegister)
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

      try {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {
            const user = userCredentials.user;

            if (user.emailVerified) {
              this.userData = { email: user.email, uid: user.uid, emailVerified: user.emailVerified }

              databaseStore.getUsers()

            } else {
              alert("debes validar tu correo electronico para ingresar")
            }
          })


      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false
      }
    },

    async logoutUser() {
      const databaseStore = userDatabaseStore()

      try {
        await signOut(auth)
        this.userData = null;

        databaseStore.$reset()

      } catch (error) {
        console.log();
      }
    },

    currentUserLog() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(auth, user => {
          const databaseStore = userDatabaseStore();

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
