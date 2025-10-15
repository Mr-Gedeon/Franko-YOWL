<script setup>
import axios from "axios";
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useUserStore } from "@/stores/UserStore";

const authStore = useAuthStore();
const userStore = useUserStore();

// Champs du formulaire
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const message = ref("");
const show = ref(true); // affiche ou ferme la modal

// Fonction de changement de mot de passe
const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    message.value = "⚠️ Les deux mots de passe ne correspondent pas.";
    return;
  }

  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}auth/change-password`, // route Laravel
      {
        current_password: currentPassword.value,
        new_password: newPassword.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`, // token du user
        },
      }
    );

    message.value = "✅ Mot de passe changé avec succès !";
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    setTimeout(()=> {show.value = false}, 2000)
  } catch (error) {
    if (error.response?.status === 400) {
      message.value = "❌ Mot de passe actuel incorrect.";
    } else {
      message.value = "⚠️ Erreur lors du changement de mot de passe.";
    }
    await userStore.fetchUserById(authStore.user.id);
  }
};
</script>

<template>
  <!-- Arrière-plan flou et sombre -->
  <div v-if="show" class="fixed inset-0 px-[10px] backdrop-blur-[10px] bg-gray-900/60 flex justify-center items-center">
    <div class="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 shadow-lg w-96 relative text-white">
      <h2 class="text-xl font-bold mb-4 text-center">Changer le mot de passe</h2>

      <div class="relative z-0 w-full group mb-[40px]">
        <input v-model="currentPassword" minlength="6" maxlength="254" type="password" name="floating_password"
          id="floating_password"
          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
          placeholder=" " required />
        <label for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Actual Password</label>
      </div>

      <div class="relative z-0 w-full group mb-[40px]">
        <input v-model="newPassword" minlength="6" maxlength="254" type="password" name="floating_newPassword"
          id="floating_newPassword"
          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
          placeholder=" " required />
        <label for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">New Password</label>
      </div>

      <div class="relative z-0 w-full group mb-[40px]">
        <input v-model="confirmPassword" minlength="6" maxlength="254" type="password" name="floating_confPassword"
          id="floating_confPassword"
          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
          placeholder=" " required />
        <label for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm Password</label>
      </div>

      <p class="text-sm text-gray-600 mb-3 text-center">{{ message }}</p>

      <div class="flex justify-end gap-[30px]">
        <button @click="show = false" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">
          Fermer
        </button>
        <!-- <button @click="updateProfile" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          :disabled="loading">
          {{ loading ? "Chargement..." : "Mettre à jour" }}
        </button> -->
        <button
          @click="changePassword"
          v-if="(currentPassword.trim() !== '') && (newPassword.trim() !== '') && (confirmPassword.trim() !== '')"
          type="submit"
          class="w-full text-white bg-[#a54c03] hover:bg-[#966a46] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Mettre à jour
        </button>
        <button v-else
          class="w-full text-white bg-[#8a572e7e] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Mettre à jour
        </button>
      </div>
    </div>
  </div>
</template>
