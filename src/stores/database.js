import { query, collection, getDocs, where } from 'firebase/firestore/lite';
import { db } from '../firebaseConfig'
import { auth } from 'src/firebaseConfig';
import { defineStore } from 'pinia'


export const userDatabaseStore = defineStore('database', {
  state: () => ({
    documents: []
  }),
  actions: {

    async getUsers() {

      if(this.documents.length !== 0){
        return
      }

      try {
        const q = query(collection(db, "usuarios"), where("userID", "==", auth.currentUser.uid))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          this.documents.push({
            id: doc.id,
            ...doc.data()
          });

        })
      } catch (error) {
        console.log(error);
      } finally {

      }
    }
  }
})
