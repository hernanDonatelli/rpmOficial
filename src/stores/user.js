import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { defineStore } from 'pinia'
import { auth } from 'src/firebaseConfig';
import { userDatabaseStore } from './database';
import { Notify, Loading, QSpinnerGears } from 'quasar';
import { query, collection, where, getDocs } from 'firebase/firestore/lite';
import { db } from 'src/firebaseConfig';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
    userLoged: false
  }),
  actions: {

    async cambiarPassword(email) {
      let timer;

      Loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-black',
        message: 'Cargando información...',
        messageColor: 'red-13'
      })

      sendPasswordResetEmail(auth, email)
        .then(() => {
          // hiding in 1s
          timer = setTimeout(() => {
            Loading.hide()
            timer = void 0
          }, 250)

          Notify.create({
            color: "teal-6",
            textColor: "white",
            icon: "cloud_done",
            multiline: true,
            html: true,
            position: "top",
            message: "<span style='text-align: center;'>Se ha enviado un email para modificar la Contraseña.</span>",
            timeout: 2000
          });

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          Notify.create({
            color: "red-13",
            textColor: "white",
            icon: "error",
            multiline: true,
            html: true,
            position: "top",
            message: `<span style='text-align: center;'>El email no es válido o no está registrado.</span>`,
            timeout: 3000
          });
        });
    },

    async registerUser(email, password, nombre, apellido, movil, nickname) {
      const userDatabase = userDatabaseStore()
      this.loadingUser = true
      let timer;
      const errorCodes = {
        'auth/email-already-in-use': 'El email ingresado ya está en uso.'
      }

      try {
        Loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red-13',
          spinnerSize: 140,
          backgroundColor: 'bg-grey-11',
          message: 'Cargando información...',
          messageColor: 'red-13'
        })

        const data = {
          nombre: nombre,
          apellido: apellido,
          nickname: nickname,
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
                  emailVerified: user.emailVerified,
                  nombre: data.nombre,
                  apellido: data.apellido,
                  nickname: data.nickname,
                  movil: data.movil,
                  isAdmin: data.isAdmin,
                  // id: user.id
                }

                userDatabase.addUser(userToRegister, user.uid);

                // hiding in 1s
                timer = setTimeout(() => {
                  Loading.hide()
                  timer = void 0
                }, 250)


                Notify.create({
                  color: "teal-6",
                  textColor: "white",
                  icon: "cloud_done",
                  multiline: true,
                  html: true,
                  position: "center",
                  message: "<p style='text-align: center;'>El Registro del usuario fue exitoso!<br> Se ha enviado un email de verificación para validar la cuenta.</p>",
                  timeout: 3000
                });
              })
              .catch(error => {
                console.log(error);
              })
          })
          .catch(error => {
            console.log(error);
            // hiding in 1s
            timer = setTimeout(() => {
              Loading.hide()
              timer = void 0
            }, 1000)

            Notify.create({
              color: "red-13",
              textColor: "white",
              icon: "warning",
              position: "top",
              message: errorCodes['auth/email-already-in-use'],
              timeout: 2000
            });

            this.loadingUser = false
          })

      } catch (error) {
        console.log(error);
      }
    },

    async loginUser(email, password) {
      const databaseStore = userDatabaseStore()
      this.loadingUser = true
      let timer;

      Loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-11',
        message: 'Cargando información...',
        messageColor: 'red-13'
      })

      const errorCodes = {
        'auth/user-not-found': 'El usuario no existe. Registrate para ingresar.',
        'auth/wrong-password': 'La Contraseña es incorrecta, intente nuevamente.'
      }

      try {
        //Comprueba si el usuario existe o no
        const q = query(collection(db, "usersRegistered"), where("email", "==", email))

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) { //NO EXISTE el usuario

          Notify.create({
            color: "red-13",
            textColor: "white",
            icon: "warning",
            position: "top",
            message: errorCodes['auth/user-not-found'],
            timeout: 2000
          });

          setTimeout(() => {
            window.location.href('/login')
          }, 1750);

        } else { //EXISTE el usuario

          signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {

              const user = userCredentials.user;

              if (user.emailVerified) {
                this.userData = { email: user.email, uid: user.uid, emailVerified: user.emailVerified }

                databaseStore.getUsers()

                // hiding in 1s
                timer = setTimeout(() => {
                  Loading.hide()
                  timer = void 0
                }, 250)

                Notify.create({
                  color: "teal-6",
                  textColor: "white",
                  icon: "cloud_done",
                  position: "top",
                  message: "Haz iniciado sesión de manera exitosa!",
                  timeout: 2000
                });

              } else {
                Notify.create({
                  color: "red-13",
                  textColor: "white",
                  icon: "warning",
                  position: "top",
                  message: "Debes validar tu correo electrónico para ingresar",
                  timeout: 1500
                });

                this.userData = null

                // setTimeout(() => {
                //   window.location.reload()
                // }, 2500);
              }
            })
            .catch(error => {
              console.log(error);
              Notify.create({
                color: "red-13",
                textColor: "white",
                icon: "warning",
                position: "center",
                message: errorCodes['auth/wrong-password'],
                timeout: 2000
              });

              setTimeout(() => {
                window.location.reload()
              }, 2500);

            })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async logoutUser() {
      const databaseStore = userDatabaseStore()

      try {
        await signOut(auth)
        this.userData = null;

        Notify.create({
          color: "teal-6",
          textColor: "white",
          icon: "cloud_done",
          position: "top",
          message: "Has cerrado la sesión exitosamente!",
          timeout: 2000
        });

        databaseStore.$reset()

      } catch (error) {
        console.log();
      } finally {
        this.userLoged = false
        this.loadingUser = false
      }
    },

    currentUserLog() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(auth, user => {
          const databaseStore = userDatabaseStore();
          // console.log(user);
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
