<template>
  <div v-if="commentStore.filteredComments.length === 0" class="overflow-x-hidden pb-[50px]">
    <Comment
      v-for="comment in parentComments"
      :comment="comment"
      :key="comment.id"
      @show-detail="showDetail"
    />
  </div>
  <div v-else class="overflow-x-hidden pb-[50px]">
    <Comment
      v-for="comment in filteredParentComments"
      :comment="comment"
      :key="comment.id"
      @show-detail="showDetail"
    />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Comment from '@/components/Comments/ComMent.vue'
import { useCommentStore } from '@/stores/CommentStore'

const commentStore = useCommentStore()
const router = useRouter()

onMounted(() => {
  commentStore.fetchComments()
})


const parentComments = computed(() =>
  commentStore.comments.filter(c => c.parent === 0)
)

const filteredParentComments = computed(() =>
  commentStore.filteredComments.filter(c => c.parent === 0)
)

const showDetail = (id) => {
  router.push(`/comment/${id}`)
}
</script>
