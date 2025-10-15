<template>

  <div v-if="connected_user" class="flex flex-col justify-center w-full h-full pt-[120px] px-[15px] mx-auto">

    <div
      class="z-0 relative w-full max-w-[640px] m-auto p-6 border-2 border-gray-700 bg-gray-900 text-white rounded-lg shadow">

      <div class=" p-8 relative">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg lg:text-2xl font-bold text-white">Type something</h2>
        </div>
      </div>

      <div>
        <form @submit.prevent="handleAdd">
          <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-[25px] sm:grid-cols-6">
            <div class="relative z-0 w-full group">
              <textarea v-model="newComment.content" maxlength="120" type="text" name="floating_content"
                id="floating_content"
                class="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                placeholder=" " required></textarea>
              <label for="floating_content"
                class="peer-focus:font-medium absolute text-lg text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[-10px] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Your
                content</label>
            </div>

            <div class="relative mt-6 flex items-center justify-end">
              <router-link to="/"
                class="absolute top-[-270px] left-[-15px] px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded">X</router-link>
              <button v-if="newComment.content.trim() !== ''" type="submit"
                class="px-3 py-1 ml-6 bg-[#a54c03] text-white rounded">
                {{ commentStore.loading ? "Post..." : "Post" }}
              </button>
              <div v-else class="px-3 py-1 ml-6 bg-[#8a572e7e] text-white rounded">
                {{ commentStore.loading ? "Post..." : "Post" }}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="z-0 relative w-full max-w-[640px] mx-auto mt-6 p-6 text-white rounded-lg shadow">

      <h2 class="text-lg lg:text-2xl font-bold text-white mb-6">
        Answers ({{ replies.length }})
      </h2>
      <div
        class="pb-[50px] overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
        <ResponseComment v-for="reply in replies" :reply="reply" :key="reply.id" />
      </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommentStore } from '@/stores/CommentStore'
import { useAuthStore } from '@/stores/AuthStore'

import ResponseComment from '@/components/Comments/ResponseComment.vue'

const route = useRoute()
const authStore = useAuthStore()
const connected_user = authStore.user ? authStore.user.id : null


const newComment = ref({
  user_id: connected_user,
  parent: Number(route.params.id),
  // url: 'children',
  content: ''
})


const commentStore = useCommentStore()
const router = useRouter()

const retour = () => {
  router.push('/')
}

onMounted(() => {
  commentStore.fetchComments()
})

const replies = computed(() => commentStore.comments.filter(c => c.parent === Number(route.params.id)))

const handleAdd = async () => {
  if (!newComment.value.content.trim()) {

    return
  }
  const response = await commentStore.addComment(newComment.value)

  if (response) {
    console.log(response)
    console.log("commentaire crée")
    replies.value = commentStore.comments.filter(c => c.parent === Number(route.params.id))
    router.go(0)
  } else {
    console.log("erreur de creation commentaire")
  }

}

</script>
