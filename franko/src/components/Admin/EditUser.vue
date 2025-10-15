<script setup>
import { ref, watch } from "vue";
import { useAdminStore } from "@/stores/AdminStore";
import { useEditUserModalStore } from "@/stores/EditUserModalStore";

const adminStore = useAdminStore();
const EditUsermodalStore = useEditUserModalStore();

// Champs du formulaire
const username = ref("");
const email = ref("");
const birthdate = ref("");
const loading = ref(false);
const message = ref("");

// les infos du user à éditer
watch(
  () => EditUsermodalStore.selectedUser,
  (user) => {
    if (user) {
      username.value = user.username || "";
      email.value = user.email || "";
      birthdate.value = user.birthdate || "";
    }
  },
  { immediate: true }
);

// pour mettre à jour
const updateUser = async () => {
  if (!EditUsermodalStore.selectedUser) return;

  loading.value = true;
  const id = EditUsermodalStore.selectedUser.id;
  const payload = {
    username: username.value,
    email: email.value,
    birthdate: birthdate.value,
  };

  try {
    await adminStore.updateUser(id, payload);
    message.value = "Utilisateur mis à jour avec succès !";
    EditUsermodalStore.closeEditUserModal();
  } catch (err) {
    console.error(err);
    message.value = "Erreur lors de la mise à jour.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="EditUsermodalStore.isEditUserModalVisible" class="fixed px-[10px] inset-0 backdrop-blur-[10px] bg-gray-900/60 text-white flex justify-center items-center z-50">
    <div class="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 shadow-lg w-96 relative">
      <h2 class="text-xl font-bold mb-4 text-center">Modifier l’utilisateur</h2>


      <div class="relative z-0 w-full group mb-[40px]">
        <input v-model="username" maxlength="20" type="test" name="floating_text" id="floating_text"
          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
          placeholder=" " required />
        <label for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username
        </label>
      </div>

      <div class="relative z-0 w-full group mb-[40px]">
        <input v-model="email" maxlength="120" type="email" name="floating_email" id="floating_email"
          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
          placeholder=" " required />
        <label for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email
          address</label>
      </div>

      <div>
        <input v-model="birthdate" type="date" name="date" id="date" value="02-25-2008"
          class="border mb-[40px] text-sm rounded-lg focus:ring-[#8a572e7e] focus:border-blue-500 block w-full p-2.5 bg-[#ac602217] border-gray-500 placeholder-gray-400 text-white"
          required />
      </div>

      <!-- <label class="block mb-2 font-medium text-gray-700">Photo de profil</label>
      <input type="file" @change="handleFileChange" class="w-full mb-3 p-2 border rounded" /> -->

      <p class="text-sm mb-3 text-center text-green-400">{{ message }}</p>


      <div class="flex justify-end gap-[30px]">
        <button @click="EditUsermodalStore.closeEditUserModal()" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">
          Fermer
        </button>y
        <button
          @click="updateUser"
          v-if="(username.trim() !== '') && (email.trim() !== '') && (birthdate.trim() !== '')"
          type="submit"
          class="w-full text-white bg-[#a54c03] hover:bg-[#966a46] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Mettre à jour
        </button>
        <button
  v-else
  class="w-full text-white bg-[#8a572e7e] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
  Mettre à jour
</button>
      </div>
    </div>
  </div>
</template>
