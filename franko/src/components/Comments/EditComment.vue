<template>

  <div
    class="flex justify-center w-full h-full pt-[120px] px-[15px] mx-auto overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
    <div class="relative w-full max-w-[640px] p-6 bg-gray-900 border-2 border-gray-700 text-white rounded-lg shadow">

      <h3 class="font-bol mb-4 text-lg">Modifier le commentaire</h3>
      <form @submit.prevent="handleUpdate">

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-[25px] sm:grid-cols-6">

          <div v-if="editedComment.url !== ''" class="relative z-0 w-full group">
            <input v-model="editedComment.url" maxlength="120" type="text" name="floating_text" id="floating_text"
              class="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 appearance-none text-gray-300 border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
              placeholder=" " required />
            <label for="floating_text"
              class="peer-focus:font-medium absolute text-lg text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Url</label>
          </div>

          <div class="relative z-0 w-full group">
            <textarea v-model="editedComment.content" maxlength="120" type="text" name="floating_content" id="floating_content"
              class="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 appearance-none text-gray-300 border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
              placeholder=" " required ></textarea>
            <label for="floating_content"
              class="peer-focus:font-medium absolute text-lg text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Content</label>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end">
          <router-link to="/" class="px-3 py-1 bg-gray-600 text-white rounded">Cancel</router-link>

          <div v-if="editedComment.url !== ''">

            
                        <button v-if="editedComment.content.trim() !== '' && editedComment.url.trim() !==''" type="submit" class="px-3 py-1 ml-6 bg-[#a54c03] text-white rounded">
                          {{ commentStore.loading ? "Update..." : "Update" }}
                        </button>
                        <button v-else class="px-3 py-1 ml-6 bg-[#8a572e7e] text-white rounded">
                          {{ commentStore.loading ? "Update..." : "Update" }}
                        </button>

          </div>
          <div v-else>
            <button v-if="editedComment.content.trim() !== ''" type="submit" class="px-3 py-1 ml-6 bg-[#a54c03] text-white rounded">
              {{ commentStore.loading ? "Update..." : "Update" }}
            </button>
            <button v-else class="px-3 py-1 ml-6 bg-[#8a572e7e] text-white rounded">
              {{ commentStore.loading ? "Update..." : "Update" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommentStore } from '@/stores/CommentStore'

const commentStore = useCommentStore()
const route = useRoute()
const router = useRouter()


const editedComment = ref({
  id: null,
  user_id: "",
  content: "",
  url: ""
})


onMounted(async () => {
  if (commentStore.comments.length === 0) {
    await commentStore.fetchComments()
  }

  const id = Number(route.params.id)
  const comment = commentStore.comments.find(c => c.id === id)

  if (comment) {
    editedComment.value = { ...comment }
  }
})

const handleUpdate = async () => {
  try {
    await commentStore.updateComment(editedComment.value.id, editedComment.value)
    router.push('/')
  } catch (error) {
    console.error(error)
  }
}
</script>
