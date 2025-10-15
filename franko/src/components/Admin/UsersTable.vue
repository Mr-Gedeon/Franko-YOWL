<script setup>
import { onMounted } from "vue";
import { useAdminStore } from "@/stores/AdminStore";
import { useEditUserModalStore } from '@/stores/EditUserModalStore';
// import { useRouter } from "vue-router";
import EditUser from "./EditUser.vue";

const EditUsermodalStore = useEditUserModalStore();
// const router = useRouter()

const editUser = (user) => {
  EditUsermodalStore.openEditUserModal(user);
};
const adminStore = useAdminStore();
onMounted(adminStore.fetchUsers);
</script>

<template>

  <EditUser />
  <div class="ml-[200px] mt-[70px] p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Users List</h2>
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-100 border-b">
          <th class="p-3">ID</th>
          <th class="p-3">Username</th>
          <th class="p-3">Email</th>
          <th class="p-3">Admin</th>
          <th class="p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in adminStore.users"
          :key="user.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="p-3">{{ user.id }}</td>
          <td class="p-3">{{ user.username }}</td>
          <td class="p-3">{{ user.email }}</td>
          <td class="p-3 text-center">
            {{ user.is_admin ? "✅" : "❌" }}
          </td>
          <td class="p-3 text-center">
            <button
              @click="adminStore.deleteUser(user.id)"
              class="text-red-500 hover:underline cursor-pointer"
            >
            <i class="fa-solid fa-trash"></i>
            </button>
            <button
              v-if="!user.is_admin"
              @click="adminStore.promoteToAdmin(user.id)"
              class="text-blue-500 ml-3 hover:underline cursor-pointer"
            >
              Promote
            </button>

            <button
              v-if="user.is_admin"
              @click="adminStore.depromoteToAdmin(user.id)"
              class="text-blue-500 ml-3 hover:underline cursor-pointer"
            >
              Unpromote
            </button>
            <button
               @click="editUser(user)"
              class="text-blue-500 ml-3 hover:underline cursor-pointer"
            >
            <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
