<script setup>
import EditProfil from "@/components/Profile/EditProfil.vue";
import ChangePass from "@/components/Profile/ChangePass.vue";
import DésactivationCompt from "@/components/Profile/DesactivationCompt.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { useAuthStore } from "@/stores/AuthStore";
import { useRouter } from "vue-router";

const router = useRouter()

// Stores et variables
const editModal = ref(false);
const passModal = ref(false);
const deleteModal = ref(false);

const userStore = useUserStore();
const authStore = useAuthStore();

// Charger les infos utilisateur
onMounted(async () => {
  await userStore.fetchUserById(authStore.user.id);
});

defineProps({
  id: [String, Number]
})

const retour = () => {
  router.go(-1)
}
</script>

<template>
  <div class="w-full h-full px-[10px] flex justify-center overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">

    <div class="relative w-full max-w-[650px] mx-auto mt-[100px] border-2 border-gray-700 bg-[#1a1f27] shadow-md rounded-lg p-6">
      <button
          class="absolute top-[-40px] left-[0px] text-gray-400 p-2 bg-transparent rounded-lg text-sm w-fit h-fit inline-flex justify-center items-center hover:bg-gray-700 hover:text-white"
          @click="retour">
          Go back
      </button>
      <h1 class="text-2xl font-bold text-center mb-4 text-white">Paramètres du compte</h1>
      <p class="text-gray-600 text-center mb-8">
        Gérer les informations, le mot de passe et la désactivation de votre compte.
      </p>
  
      <div class="flex flex-col gap-4 items-center">
        <!-- Modifier le profil -->
        <button
          v-if="authStore.user?.id === userStore.selecteduser?.id"
          @click="editModal = true"
          class="text-white px-6 py-2 rounded w-64 border-0 border-b-2 rounded-none border-b-gray-700 hover:border-[#8a572e] hover:text-[#8a572e]"
        >
          Editer mon profil
        </button>
  
        <!-- Changer le mot de passe -->
        <button
          @click="passModal = true"
          class="text-white px-6 py-2 rounded w-64 border-0 border-b-2 rounded-none border-b-gray-700 hover:border-[#8a572e] hover:text-[#8a572e]"
        >
          Changer mon mot de passe
        </button>
  
        <!-- Désactiver le compte -->
        <button
          @click="deleteModal = true"
          class="text-white px-6 py-2 rounded w-64 border-0 border-b-2 rounded-none border-b-gray-700 hover:border-[#8a572e] hover:text-[#8a572e]"
        >
          Désactiver mon compte
        </button>
      </div>
    </div>
  </div>

  <!-- Modales -->
  <EditProfil v-if="editModal" @close="editModal = false" />
  <ChangePass v-if="passModal" @close="passModal = false" />
  <DésactivationCompt v-if="deleteModal" @close="deleteModal = false" />
</template>
