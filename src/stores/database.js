import { query, collection, getDocs, where, addDoc, doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../firebaseConfig'
import { auth } from 'src/firebaseConfig';
import { defineStore } from 'pinia'
import { useUserStore } from './user';

export const userDatabaseStore = defineStore('database', {
  state: () => ({
    documents: [],
    admin: []
  }),
  actions: {
    async getAdmin(){
      try {
        const q = query(collection(db, "usuarios"), where("isAdmin", "==", true))
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          if (this.admin.length == 0) {
            this.admin.push({
              id: doc.id,
              isAdmin: doc.isAdmin,
              ...doc.data()
            });
          }
        })
      } catch (error) {
        console.log(error);
      }
    },

    async getUsers() {
      const userStore = useUserStore()
      userStore.loadingSession = true;

      if (this.documents.length !== 0) {
        return
      }

      try {
        const q = query(collection(db, "usuarios"), where("uid", "==", auth.currentUser.uid))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (this.documents.length == 0) {
            this.documents.push({
              id: doc.id,
              ...doc.data()
            });
          }

          userStore.loadingSession = false;
        })
      } catch (error) {
        console.log(error);
      } finally {

      }
    },

    async addUser(objetoDoc) {
      try {

        const docRef = await addDoc(collection(db, "usuarios"), objetoDoc)
        // console.log(docRef);
      } catch (error) {
        console.log(error);
      } finally {

      }
    },

    async updateUser(userObj) {
      let usuario;

      this.documents.forEach(user => {
        usuario = user.id
      })

      const userDB = doc(db, "usuarios", usuario);
      await updateDoc(userDB, userObj);

    }
  }
})
