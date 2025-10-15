<template>
  <div class="p-4 mb-3 mt-3 rounded-r-[10px] bg-gray-900 border-l-2 border-l-gray-600 w-full min-w-[200px]">
    <!--Affichage principal de la réponse -->
    <div v-if="!editReply">
      <h3 class="text-white">
        {{ userStore.users.filter(user => user.id === reply.user_id)[0]?.username }}
      </h3>
      <p class="ml-2 my-2 text-gray-400 text-sm border-l-2 border-l-gray-500 p-2">{{ reply.content }}</p>

      <div class="flex gap-[15px] text-gray-300">
        <button class="hover:text-red-500">
          <Like :commentId="reply?.id" :isLiked="reply?.liked" :nbrLikes="reply?.likes_count"/>
        </button>
        <button class="hover:text-blue-500" @click="ReplyForm">
          <i class="fa-solid fa-comment"></i>
        </button>
        <button @click="editReply = true" v-if="reply.user_id === authStore.user.id" >
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <DeleteComment :commentId="reply?.id" v-if="reply.user_id === authStore.user.id" />
      </div>
    </div>

    <!-- Formulaire d’édition -->
    <div v-else>
      <p class="text-white">
        {{ userStore.users.filter(user => user.id === reply.user_id)[0]?.username }}
      </p>

      <form @submit.prevent="handleUpdate" class="flex flex-col gap-[10px]">
        <textarea type="text" name="replycontent" rows-4 v-model="actualReplyContent" class="px-2 py-1 rounded bg-transparent border-b-gray-400 outline-0 mr-[10px]">
        </textarea>

        <div class="">
          <button @click.stop="editReply = false" class="px-3 py-1 bg-gray-600 text-white rounded" >
            Cancel
          </button>
          <button v-if="actualReplyContent.trim() !== ''" type="submit" class="px-3 py-1 ml-5 bg-[#a54c03] text-white rounded" >
            {{ commentStore.loading ? "Update..." : "Update" }}
          </button>
          <div v-else class="px-3 py-1 ml-6 bg-[#8a572e7e] text-white rounded" >
            {{ commentStore.loading ? "Update..." : "Update" }}
          </div>
        </div>
      </form>
    </div>

    <!--Formulaire de réponse à cette réponse -->
    <div v-if="showReplyForm" class="mt-2 ml-4">
      <form @submit.prevent="handleReply">
        <input v-model="newReplyContent" placeholder="Répondre..." maxlength="120" class="px-2 py-1 rounded w-full border-b-2 border-b-gray-400 outline-0" />
        <div class="mt-2 flex gap-2">
          <button type="button" @click="showReplyForm = false" class="bg-gray-500 text-white px-3 py-1 rounded" >
            Annuler
          </button>
          <button v-if="newReplyContent.trim() !== ''" type="submit" class="bg-[#a54c03] text-white px-3 py-1 rounded" >
            Envoyer
          </button>
          <button v-else class="bg-[#a54c0391] text-white px-3 py-1 rounded" >
            Envoyer
          </button>
        </div>
      </form>
    </div>

    <!-- Récursion : affichage des sous-réponses -->
    <div v-if="childReplies.length" class="ml-6 mt-2 overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
      <div v-if="showResponses == false" @click="showResponses = true" class="flex items-center text-[12px] text-gray-300 p-2 bg-gray-600 w-fit rounded-xl cursor-pointer">
        ({{ childReplies.length }}) réponses<i class="fa-solid fa-caret-down"></i>
      </div>
      <div
      v-else
      class="">
      <div @click="showResponses = false" class="flex items-center text-[12px] text-gray-300 p-2 bg-gray-600 w-fit rounded-xl cursor-pointer">
        Cacher<i class="fa-solid fa-caret-up"></i>
      </div>
      <ResponseComment
        v-for="child in childReplies"
        :key="child.id"
        :reply="child"
      />
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCommentStore } from "@/stores/CommentStore";
import { useUserStore } from "@/stores/UserStore";
import { useAuthStore } from "@/stores/AuthStore";

import Like from "@/components/Like/LikeComponent.vue";
import DeleteComment from "@/components/Comments/DeleteComment.vue";
import ResponseComment from "@/components/Comments/ResponseComment.vue"; 

const props = defineProps({
  reply: Object,
});

const editReply = ref(false);
const actualReplyContent = ref(props.reply.content)
const newReplyContent = ref("");
const showReplyForm = ref(false);
const showResponses = ref(false)

const commentStore = useCommentStore();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(() => {
  commentStore.fetchComments();
  userStore.fetchUser();
});


const childReplies = computed(() =>
  commentStore.comments.filter((c) => c.parent === props.reply.id)
);


const ReplyForm = () => {
  showReplyForm.value = !showReplyForm.value;
};


const handleReply = async () => {
  try {
    const newReply = {
      // url: "children",
      content: newReplyContent.value,
      parent: props.reply.id,
      user_id: authStore.user.id,
    };

    await commentStore.addComment(newReply);
    newReplyContent.value = "";
    showReplyForm.value = false;
  } catch (error) {
    console.error(error);
  }
};


const handleUpdate = async () => {
  try {
    const replyComment = {
      // url: "children",
      content: actualReplyContent.value,
      parent: props.reply.id,
      user_id: authStore.user.id,
    };
    await commentStore.updateComment(props.reply.id, replyComment);
    router.push(`/responsecommentsection/${route.params.id}`);
    editReply.value = false;
    console.log("modifié avec succès");
  } catch (error) {
    console.error(error);
  }
};
</script>
