<script setup>

import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { useAuthStore } from "@/stores/AuthStore";
import { useCommentStore } from "@/stores/CommentStore";
import { useRouter, useRoute } from "vue-router";
import ComMent from "@/components/Comments/ComMent.vue";

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const commentsStore = useCommentStore()
const comments = ref([]);
const userComments = ref([])
const fileInput = ref(null);
const route = useRoute();
const selectedUser = ref(null);

// computed : est-ce le profil de l'utilisateur connecté ?
const isCurrentUser = computed(() => {
  return authStore.user && selectedUser.value && authStore.user.id === selectedUser.value.id;
});

if (sessionStorage.getItem('access_token') === null || sessionStorage.getItem('user') === null) {
  router.push('/')
}

console.log(authStore.user)
console.log("f")

onMounted(async () => {
  await authStore.fetchUser()
  await userStore.fetchUser()
  await commentsStore.fetchComments()

  // l’ID du profil dans l’URL, sinon celui du user connecté
  const userId = route.params.id || authStore.user?.id;
  await userStore.fetchUserById(userId)
  selectedUser.value = userStore.selecteduser;

  setInterval(() => {
  if (authStore.user?.id != userStore.selecteduser?.id) {
    router.push('/')
  }
  }, 10000)

  try {
    comments.value = commentsStore.comments;
    userComments.value = comments.value.filter(comment => comment.user_id == authStore.user.id);
  } catch (err) {
    console.error("Erreur fetchComments:", err);
  }
})

const triggerFileSelect = () => {
  if (isCurrentUser.value && fileInput.value) {
    fileInput.value.click();
  }
};

// Upload de la nouvelle photo
const handleFileChange = async (event) => {
  const file = event.target.files?.[0];
 if (!file) {
    return;}

  const formData = new FormData();
  formData.append("picture", file);

  try {
    await authStore.updateUser(authStore.user.id, formData);

    //les infos côté client (authStore et userStore)
    await authStore.fetchUser();
    await userStore.fetchUserById(authStore.user.id);
    selectedUser.value = userStore.selecteduser;
    // mettre à jour la liste des commentaires si tu montres la photo aussi sur commentaires

    await commentsStore.fetchComments();
    comments.value = commentsStore.comments || [];
    userComments.value = comments.value.filter((c) => c.user_id === selectedUser.value?.id);

    alert("✅ Photo de profil mise à jour !");
  } catch (err) {
    console.error("Erreur upload picture:", err);
    alert("❌ Erreur lors de l'upload de la photo.");
  }
};


</script>

<template>

  <div
    class="flex justify-center w-full h-full pt-[140px] px-[15px] mx-auto overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">

    <div class="relative w-full max-w-[640px] p-6 mb-[70px] border-2 border-gray-700 bg-gray-900 text-white rounded-lg shadow">

      <router-link to="/Settings/">
        <button v-if="isCurrentUser"
        class=" absolute top-[-50px] right-0 rounded-full flex items-center bg-white text-center p-2 pl-5 pr-5 text-md font-semibold text-black shadow-xs cursor-pointer">
          <i class="fa-solid fa-pen-to-square"></i>
          edit profile
        </button>
      </router-link>
 <div class="relative w-fit mb-4">
        <img
          v-if="selectedUser"
          :src="selectedUser.picture || 'https://api.dicebear.com/9.x/initials/svg?seed=' + selectedUser.username"
          alt="Photo de profil"
          class="w-24 h-24 rounded-full object-cover border border-gray-700 shadow cursor-pointer"
          @click="triggerFileSelect"
        />
        <p v-else class="text-gray-400">Chargement du profil...</p>

        <!-- icône appareil photo pour le propriétaire -->
        <i
          v-if="authStore.user"
          class="fa-solid fa-camera absolute bottom-0 right-2 bg-black/70 text-white p-2 rounded-full text-xs cursor-pointer"
          @click="triggerFileSelect"
        />

        <!-- input caché -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
      </div>

      <div
        class="flex flex-col border rounded-lg shadow-sm md:flex-row md:max-w-xl bg-gray-700">

        <div class="flex flex-col justify-between p-4 leading-normal">
          <h5 class="text-2xl font-bold tracking-tight text-white">{{
            selectedUser?.username }}
          </h5>
          <p v-if="isCurrentUser"
            class="mb-3 font-normal text-gray-500">
            {{ selectedUser?.email }}
          </p>
          <p v-if="isCurrentUser"
            class="mt-3 font-normal text-gray-500">
            Né le {{ selectedUser?.birthdate }}
          </p>
        </div>

      </div>
      <div class="flex flex-col justify-center">
        <h2 class="mt-8">
          Vos commentaires
        </h2>

        <div v-for="comment in userComments" :key="comment.id">

          <ComMent :comment="comment"></ComMent>
        </div>

        <p class="text-gray-500" v-if="userComments.length === 0">Aucun commentaire pour le moment.</p>
      </div>
    </div>
  </div>

</template>

<style scoped>
@media screen and (max-width: 1100px) {

  .img {
    top: -30px;
    left: -10px;
  }
}
</style>
