<template>
  <div class="cursor-pointer" @click="handleDelete">
    <i class="fa-solid fa-trash"></i>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { useCommentStore } from '@/stores/CommentStore'
import router from '@/router'
// import router from '@/router'

const props = defineProps({
  commentId: {
    type: Number,
    required: true
  }
})

const commentStore = ref(null)

onMounted(() => {
  commentStore.value = useCommentStore()
})

const handleDelete = async () => {
  if (confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
    try {
      await commentStore.value.deleteComment(props.commentId)
      await commentStore.value.fetchComments()
      // router.go(-1)
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
