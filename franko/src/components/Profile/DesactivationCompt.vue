<script setup>
import axios from "axios";
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
// const emit = defineEmits(["close"]);

const message = ref("");
const loading = ref(false);

const confirmDelete = async () => {
  loading.value = true;
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}users/${authStore.user.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    message.value = "Compte désactivé avec succès. Redirection...";
    setTimeout(() => {
      authStore.user = null;
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem('user')
      window.location.href = "/";
    }, 1500);
  } catch (error) {
    console.log(error)
    message.value = "Erreur lors de la désactivation du compte.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 px-[10px] backdrop-blur-[10px] bg-gray-900/60 flex justify-center items-center">
    <div class="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 shadow-lg w-96 text-center text-white">
      <h2 class="text-xl font-bold mb-4 text-red-600">Désactiver le compte</h2>
      <p class="mb-4">Êtes-vous sûr de vouloir désactiver votre compte ?</p>
      <p class="text-sm text-gray-600 mb-3">{{ message }}</p>

      <div class="flex justify-between">
        <button
          @click="confirmDelete"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          :disabled="loading"
        >
          {{ loading ? "Suppression..." : "Oui, désactiver" }}
        </button>
        <button
          @click="$emit('close')"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>
