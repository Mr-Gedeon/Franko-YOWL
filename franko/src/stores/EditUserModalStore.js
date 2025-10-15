import { defineStore } from "pinia";

export const useEditUserModalStore = defineStore("EditUserModalStore", {
  state: () => ({
    isEditUserModalVisible: false,
    selectedUser: null,
  }),

  actions: {
    openEditUserModal(user) {
      this.selectedUser = user;
      this.isEditUserModalVisible = true;
    },
    closeEditUserModal() {
      this.isEditUserModalVisible = false;
      this.selectedUser = null;
    },
  },
});
