<template>

   <AddUserModal />

  <div class="fixed top-[70px] w-52 bg-[#1a1f27] text-white h-screen flex flex-col p-4">
    <h2 class="text-xl font-bold mb-6">Admin Panel</h2>
    <ul class="space-y-3">
      <li><router-link class="hover:text-[#c58b5a]" to="/admin">🏠 Dashboard</router-link></li>
      <li><router-link class="hover:text-[#c58b5a]" to="/admin/users">👥 Users</router-link></li>
      <li><router-link class="hover:text-[#c58b5a]" to="/admin/comments">💬 comments</router-link></li>
      <li @click="AddUsermodalStore.openAddUserModal()" class="cursor-pointer hover:text-[#c58b5a]">👤 Add User</li>
    </ul>
  </div>

</template>
<script setup>

import { useAddUserModalStore } from '@/stores/ModalAddUserStore';
import AddUserModal from "../Auth/AddUserModal.vue";

const AddUsermodalStore = useAddUserModalStore();

</script>
