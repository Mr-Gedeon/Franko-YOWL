import { defineStore } from 'pinia'

export const useSignupModalStore = defineStore('ModalSignupStore', {
 state: ()=> ({
  isSignupModalVisible: false,
 }),

 actions: {
  openSignupModal () {
    this.isSignupModalVisible = true;
  },

  closeSignupModal () {
    this.isSignupModalVisible = false;
  },
 }
})
