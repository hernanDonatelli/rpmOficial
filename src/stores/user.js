import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { defineStore } from 'pinia'
import { auth } from 'src/firebaseConfig';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null
  }),
  actions: {
    async registerUser(email, password) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)

        this.userData = {
          email: user.email,
          id: user.uid
        }

      } catch (error) {
        console.log(error);
      }
    },

    async loginUser(email, password) {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)

        this.userData = {
          email: user.email,
          id: user.uid
        }

      } catch (error) {
        console.log(error);
      }
    },

    async logoutUser() {
      try {
        await signOut(auth)
        this.userData = null

      } catch (error) {
        console.log();
      }
    }
  }
})
