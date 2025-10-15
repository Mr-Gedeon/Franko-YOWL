<script setup>
import { ref } from 'vue'
import { useLikeStore } from '@/stores/LikeStore'
import { useModalStore } from '@/stores/ModalSignInStore'
import { useCommentStore } from '@/stores/CommentStore'

const likeStore = useLikeStore()
const commentStore = useCommentStore()

const props = defineProps({
  commentId: {
    type: Number,
    required: true
  },
  isLiked: {
    type: Boolean,
    required: false,
    default: false
  },
  nbrLikes: {
    type : Number,
    required: true
  }
})

const liked = ref(props.isLiked)
const likesCount = ref(props.nbrLikes)


/* onMounted(async () => {
  await likeStore.fetchCommentLikers(props.commentId)
  const likes = likeStore.likers
  likesCount.value = likes.likes_count
  liked.value = likes.liked
}) */

const action = async () => {
  const user = JSON.parse(sessionStorage.getItem('user'))

  if (user == null){

    const signIn = useModalStore();
    signIn.openLoginModal()
  }else{
    liked.value = !liked.value
    await likeStore.react(props.commentId, liked.value)


    likesCount.value += liked.value ? 1 : -1
  }
  await commentStore.fetchComments()
}

</script>

<template>
  <button
    class="hover:text-red-500"
    @click="action">
    <span v-if="liked">
      {{ likesCount }} ❤️
    </span>
    <span v-else>
      {{ likesCount }} <i class="fa-solid fa-heart"></i>
    </span>
  </button>
</template>
