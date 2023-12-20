import { query, collection, getDocs, where, setDoc, doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../firebaseConfig'
import { auth } from 'src/firebaseConfig';
import { defineStore } from 'pinia'
import { useUserStore } from './user';
import { Notify, QSpinnerGears, Loading } from 'quasar';

export const userDatabaseStore = defineStore('database', {
  state: () => ({
    documents: [],
    admin: []
  }),
  actions: {
    async getAdmin(){
      try {
        const q = query(collection(db, "usersRPM"), where("isAdmin", "==", true))
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
        const q = query(collection(db, "usersRegistered"), where("email", "==", auth.currentUser.email))
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

    async addUser(objetoDoc, id) {
      try {
        await setDoc(doc(db, "usersRegistered", id), objetoDoc);
        // const docRef = await addDoc(collection(db, "usuarios"), objetoDoc)
        // console.log(docRef);
      } catch (error) {
        console.log(error);
      } finally {

      }
    },

    async updateUser(userObj) {
      let timer;

      Loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red-13',
        spinnerSize: 140,
        backgroundColor: 'bg-grey-11',
        message: 'Cargando información...',
        messageColor: 'red-13'
      })

      let usuario;

      this.documents.forEach(user => {
        usuario = user.id
      })

      const userDB = doc(db, "usersRegistered", usuario);
      await updateDoc(userDB, userObj);

      // hiding in 1s
      timer = setTimeout(() => {
        Loading.hide()
        timer = void 0
      }, 250)

      Notify.create({
        color: "teal-6",
        textColor: "white",
        position: "center",
        icon: "cloud_done",
        message: "El Usuario ha sido editado exitosamente!",
        timeout: 1000
      });

      setTimeout(() => {
        window.location.reload()
      }, 2500);

    }
  }
})
