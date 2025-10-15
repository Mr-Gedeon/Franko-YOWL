<template>
  <div class="w-full p-6 border-0 border-b-2 bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800"
    @click.stop="$emit('show-detail', comment.id)">
    <div class="flow-root">
      <ul role="list" class="flex justify-between">
        <li class="pb-3 sm:pb-4">
          <div class="flex items-center">

            <div class="relative flex items-center left-[-10px]">
              <div class="shrink-0">
                <img
                  v-if="userConcerned"
                  :src="userConcerned.picture ||
                    'https://api.dicebear.com/9.x/initials/svg?seed=' + userConcerned.username"
                  alt="Photo de profil"
                  class="w-10 h-10 rounded-full object-cover mb-5"
                />
              </div>
              <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium truncate text-white">
                  {{ userConcerned?.username }}
                </p>
              </div>
            </div>
          </div>
        </li>

        <button @click.stop="" id="dropdownCommentButton" data-dropdown-toggle="dropdownComment"
          class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center hover:bg-gray-700 hover:text-white">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
      </ul>

      <!-- Dropdown menu -->
      <div id="dropdownComment"
        class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
            <a href="#"
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">signal</a>
          </li>
        </ul>
      </div>

      <div class="pl-[20px] border-0 border-l-3 border-gray-700">
        <p class="text-sm text-gray-400 mb-[5px] wrap-break-word">
          {{ comment.content }}
        </p>
        <p v-if="comment.url"
          class="m-3 text-sm p-3 w-fit min-w-1/2 wrap-break-word rounded underline cursor-pointer bg-[#ff730041] text-white">
          <a :href="comment.url" @click.stop>
            {{ comment.url }}
          </a>
        </p>

        <div class="flex justify-between space-x-4 mt-3 text-gray-400 text-sm" @click.stop>
          <div class="flex gap-[15px]">
            <button class="hover:text-red-500">
              <Like :commentId="comment?.id" :isLiked="comment?.liked" :nbrLikes="comment?.likes_count" />
            </button>
            <router-link :to="`/responsecommentsection/${comment?.id}`">
              <i class="fa-solid fa-comment"></i> {{ replies.length }}
            </router-link>
            <router-link class="text-blue-400 hover:text-blue-600 transition-colors" :to="`/editcomment/${comment.id}`"
              v-if="comment.user_id === authStore.user?.id">
              <i class="fa-solid fa-pen-to-square"></i>
            </router-link>
            <DeleteComment :commentId="comment?.id" v-if="comment.user_id === authStore.user?.id" />
          </div>

          <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <!-- <p class="text-gray-400 text-sm wrap-break-word">#à modifier</p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import { useCommentStore } from '@/stores/CommentStore'
import { useAuthStore } from '@/stores/AuthStore'

import DeleteComment from '@/components/Comments/DeleteComment.vue'
import Like from '@/components/Like/LikeComponent.vue'

const props = defineProps({
  comment: Object,
  // eslint-disable-next-line vue/require-prop-type-constructor
  required: true
})


const userStore = useUserStore()
const authStore = useAuthStore()
const commentStore = useCommentStore()

let userConcerned = ref(null)

/** A MODIFIER POUR APPELER LE STORE OU L'API*/
onMounted(() => {
  userConcerned.value = userStore.users.find(u => u.id === props.comment.user_id)
})


const replies = computed(() => {
  if (!commentStore.comments) return []
  return commentStore.comments.filter(c => c.parent === props.comment.id)
})

defineEmits(['show-detail'])

</script>
