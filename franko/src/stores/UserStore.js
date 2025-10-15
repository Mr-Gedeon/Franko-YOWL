
import { defineStore } from 'pinia'

import axios from 'axios'

const url = import.meta.env.VITE_API_URL;

function axiosGenerator() {

  if (sessionStorage.getItem('access_token') !== null) {
  
    const token = sessionStorage.getItem('access_token');
  
    const authAxios = axios.create({
  
      baseURL: url,
      headers: {
  
        Authorization: `Bearer ${token}`
      }
    })

    return authAxios
  } else {
    const authAxios = axios.create({
  
      baseURL: url,
    })

    return authAxios
  }
}

console.log(axiosGenerator())

// const authAxios = axiosGenerator()


export const useUserStore = defineStore('UserStore', {
  //état
  state: () => ({
    users: [],
    selecteduser: null,
  }),

  actions: {


    async fetchUser() {
      try{

        const res = await axiosGenerator().get(`users`)
        this.users = res.data
        return true;
      } catch(err) {
        console.log("Erreur fetchUser :", err);
        return false;
      }

    },

   async addUser(payload) {
    console.log(payload)
      try {
        const res = await axiosGenerator().post(`users`, payload);
        this.users.unshift(res.data);
        return true
      } catch (err) {
        console.error("Erreur addUser :", err);
        return false
      }
    },

    async deleteUser(id) {
      try {
        await axiosGenerator().delete(`users/${id}`);
        this.users = this.users.filter((user) => user.id !== id);
      } catch (err) {
        console.error("Erreur deleteUser :", err);
      }
    },

    async fetchUserById(id) {
      try {
        const res = await axiosGenerator().get(`users/${id}`);
        this.selecteduser = res.data;
      } catch (err) {
        console.error("Erreur fetchUserById :", err);
      }
    },

    async updateUser(id, updatedData) {
      try {
        const res = await axiosGenerator().put(`users/${id}`, updatedData);
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1){
            this.users[index] = res.data;
            // sessionStorage.setItem('user', JSON.stringify(this.users[index]))
        }

      } catch (err) {
        console.error("Erreur updateUser :", err);
      }
    },
  },

  // persist: {
  //   enabled: true, // active le stockage automatique
  //   strategies: [
  //     {
  //       storage: localStorage, // ou sessionStorage
  //       paths: ['users', 'selectedUser'], // ce que je veux garder
  //     },
  //   ],
  // },

})
