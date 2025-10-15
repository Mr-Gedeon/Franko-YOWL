<template>
  <header class="fixed w-full h-[70px] flex justify-between items-center p-4 bg-[#a54c03] shadow-md">
    <!-- Logo / Retour au site -->
    <div class="flex flex-col items-center">
      <!-- <img src="../../../public/logo_franko.svg" alt="Logo" class="h-10 w-10 rounded-full" /> -->
       <h1 class="font-semibold text-white">FRANKO DASHBOARD</h1>
      <router-link to="/" class="text-md font-bold text-gray-800 hover:text-gray-700">
        Retour au site
      </router-link>
    </div>

    <!-- Menu utilisateur / Admin -->
    <div class="relative" @click.stop="open = false">
      <button @click.stop="open = !open" class="flex items-center space-x-2 focus:outline-none cursor-pointer">
        <img :src="user.picture || '/default-avatar.png'" alt="Avatar" class="h-10 w-10 rounded-full" />
        <span class="font-medium text-gray-900">{{ user.username }}</span>
        <svg class="h-4 w-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown -->
      <div v-if="open" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
        <router-link v-if="user.is_admin" to="/admin" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
          Tableau Admin
        </router-link>
        <button @click="logout" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()

const open = ref(false)
const router = useRouter()

// Remplace par ton store ou ton API
const user = ref({
  username: authStore.user.username,
  picture: null,
  is_admin: true,
})

// Fonction de logout
const logout = async () => {
  try {
    authStore.Logout()
    router.push('/')
  } catch (error) {
    console.error('Erreur lors de la déconnexion', error)
  }
}
</script>

<style scoped>
/* Optionnel : ajouter transition dropdown */
</style>


<!-- <template>
  <header class="bg-white shadow p-4 flex justify-between items-center">
    <h1 class="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
    <button @click="logout" class="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore';
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};
</script> -->
