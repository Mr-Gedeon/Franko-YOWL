import { defineStore } from 'pinia'

export const useModalStore = defineStore('ModalStore', {
 state: ()=> ({
  isLoginModalVisible: false,
 }),

 actions: {
  openLoginModal () {
    this.isLoginModalVisible = true;
  },

  closeLoginModal () {
    this.isLoginModalVisible = false;
  },
 }
})
