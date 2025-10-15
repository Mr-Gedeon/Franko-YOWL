<script setup>
import { onMounted } from "vue";
import { useAdminStore } from "@/stores/AdminStore";

const adminStore = useAdminStore();
// const userName = ref("")
onMounted(() => {
  adminStore.fetchUsers();
  adminStore.fetchComments();

  // userName.value = adminStore.users.filter(user => user.id === comment.user_id)
})
</script>
<template>
<div class="ml-[200px] mt-[70px] p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Comments List</h2>
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="bg-gray-100 border-b">
                <th class="p-3">ID</th>
                <th class="p-3">AUTHORS</th>
                <th class="p-3">Content</th>
                <th class="p-3">URL</th>
                <th class="p-3 text-center">Warnings</th>
                <th class="p-3">Likes</th>
                <!-- <th class="p-3">Dislikes</th> -->
                <th class="p-3 text-center">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="comment in adminStore.comments"
                :key="comment.id"
                class="border-b hover:bg-gray-50">
                <td class="p-3">{{ comment.id }}</td>
                <td class="p-3">{{ adminStore.users.filter(user => user.id === comment.user_id)[0].username }}</td>
                <td class="p-3">{{ comment.content }}</td>
                <td class="p-3">{{ comment.url }}</td>
                <td class="p-3">{{ comment.warnings }}</td>
                <td class="p-3">{{ comment.likes }}</td>
                <!-- <td class="p-3">{{ comment.dislikes }}</td> -->
                <td class="p-3 text-center">
                    <button @click="adminStore.deleteComment(comment.id)" class="text-red-500 hover:underline cursor-pointer"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>
