import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore/lite';
import { defineStore } from 'pinia'
import { auth, db } from 'src/firebaseConfig';
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

        const { user } = await createUserWithEmailAndPassword(auth, email, password)

        this.userData = {
          email: user.email,
          uid: user.uid,
          nombre: data.nombre,
          apellido: data.apellido,
          movil: data.movil,
          isAdmin: data.isAdmin
        }


        await userDatabase.addUser(this.userData)


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
        const { user } = await signInWithEmailAndPassword(auth, email, password)

        this.userData = { email: user.email, uid: user.uid }
        databaseStore.getUsers()

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
          if (user) {
            // console.log(user);
            this.userData = { email: user.email, uid: user.uid };

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
    // async updateUser(displayName){
    //   try {
    //     await updateProfile(auth.currentUser, {
    //       displayName
    //     })
    //   } catch (error) {
    //     console.log(error);
    //     return error.code;
    //   }
    // }

  }
})
