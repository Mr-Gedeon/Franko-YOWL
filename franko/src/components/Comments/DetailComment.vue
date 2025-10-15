<template>

  <div v-if="connected_user">

    <div v-if="commentStore.selectedComment"
      class="flex justify-center w-full h-full pt-[120px] px-[15px] mx-auto overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">

      <div class="relative w-full max-w-[640px] p-6 border-2 border-gray-700 bg-gray-900 text-white rounded-lg shadow">

        <button
          class="absolute top-[-40px] left-[0px] text-gray-400 p-2 bg-transparent rounded-lg text-sm w-fit h-fit inline-flex justify-center items-center hover:bg-gray-700 hover:text-white"
          @click="retour">
          Go back
        </button>
        <div class="border-b-2 border-gray-700 pb-4 mb-10">
          <div class="flex justify-start gap-[10px] items-center">
            <div class="shrink-0 relative bottom-[-10px]">
              <img
                class="w-10 h-10 rounded-full"
                :src="userConcerned?.picture ||
                  'https://api.dicebear.com/9.x/initials/svg?seed=' + userConcerned?.username"
              />
            </div>
            <h2 class="text-xl font-bold wrap-break-word">
              {{ userConcerned?.username }}
            </h2>
          </div>
          <p class=" ml-[45px] text-sm w-fit text-gray-500 wrap-break-word">{{ userConcerned?.email }}</p>
        </div>

        <p class="text-gray-400 mb-4 wrap-break-word">
          {{ commentStore.selectedComment?.content }}
        </p>

        <p class="m-3 text-sm p-3 w-fit min-w-1/2 rounded underline cursor-pointer bg-[#ff730041] text-white">
          <a :href="commentStore.selectedComment.url" @click.stop>
            {{ commentStore.selectedComment?.url }}
          </a>
        </p>


        <div class="flex mt-[30px] gap-[15px]">
          <!-- <button class="cursor-pointer text-gray-400 hover:text-red-500"><i class="fa-solid fa-heart"></i></button> -->
          <button class="hover:text-red-500"><Like :commentId="commentStore.selectedComment?.id" :isLiked="commentStore.selectedComment?.liked" :nbrLikes="commentStore.selectedComment?.likes_count"/></button>
          <router-link :to="`/responsecommentsection/${commentStore.selectedComment.id}`">
                <i class="fa-solid fa-comment"></i> {{ replies.length }}
              </router-link>
          <router-link class="cursor-pointer text-blue-400 hover:text-blue-600 transition-colors"
            :to="`/editcomment/${commentStore.selectedComment?.id}`" v-if="commentStore.selectedComment?.user_id === authStore.user.id">
            <i class="fa-solid fa-pen-to-square"></i>
          </router-link>
          <DeleteComment :commentId="commentStore.selectedComment?.id"  class="cursor-pointer" v-if="commentStore.selectedComment?.user_id === authStore.user.id"/>
        </div>
      </div>
      <p>

        {{ commentStore.selectedComment?.like }}
      </p>
    </div>
    <div v-else class="text-gray-500 text-sm">
      Chargement du commentaire...
    </div>
  </div>

  <div v-else
    class="flex justify-center items-center w-full h-full pt-[120px] px-[15px] mx-auto overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">

    <div
      class="relative flex justify-center items-center w-full max-w-[640px] p-6 border-2 border-gray-700 bg-gray-900 text-white rounded-lg shadow">
      <button
          class="absolute top-[-40px] left-[0px] text-gray-400 p-2 bg-transparent rounded-lg text-sm w-fit h-fit inline-flex justify-center items-center hover:bg-gray-700 hover:text-white"
          @click="retour">
          Go back
      </button>
        <p>Connectez vous pour pouvoir profiter de Franko!</p>
    </div>
  </div>

</template>

<script setup>
import { onMounted, ref ,computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommentStore } from '@/stores/CommentStore'
import { useUserStore } from '@/stores/UserStore'
import { useAuthStore } from '@/stores/AuthStore'

import DeleteComment from '@/components/Comments/DeleteComment.vue'
import Like from '@/components/Like/LikeComponent.vue'

const commentStore = useCommentStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const authStore= useAuthStore()

const connected_user = authStore.user ? authStore.user.id : null

let userConcerned = ref(null)

onMounted(async () => {
  await userStore.fetchUser()
  await commentStore.fetchCommentById(route.params.id)
  userConcerned.value = userStore.users.filter(theUser => theUser.id == commentStore.selectedComment.user_id)[0]
 console.log(commentStore.selectedComment)
})

/** A MODIFIER POUR APPELER LE STORE OU L'API*/
onMounted(() => {
})

const retour = () => {
  router.push('/')
}
const replies = computed(() => {
  return commentStore.comments.filter(c => c.parent === commentStore.selectedComment.id)

})

</script>

<style scoped>
.bro {
  justify-self: center;
}
</style>
