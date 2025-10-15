import { defineStore } from 'pinia'

export const useAddUserModalStore = defineStore('ModalAddUserStore', {
 state: ()=> ({
  isAddUserModalVisible: false,
 }),

 actions: {
  openAddUserModal () {
    this.isAddUserModalVisible = true;
  },

  closeAddUserModal () {
    this.isAddUserModalVisible = false;
  },
 }
})
