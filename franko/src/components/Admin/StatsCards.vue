<template>
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-white shadow rounded-lg p-4">
      <h3 class="text-gray-600 text-sm">Total Users</h3>
      <p class="text-2xl font-bold">{{ stats.total_users }}</p>
    </div>
    <div class="bg-white shadow rounded-lg p-4">
      <h3 class="text-gray-600 text-sm">Total Comments</h3>
      <p class="text-2xl font-bold">{{ stats.total_comments }}</p>
    </div>
    <div class="bg-white shadow rounded-lg p-4">
      <h3 class="text-gray-600 text-sm">Total Likes</h3>
      <p class="text-2xl font-bold">{{ stats.total_likes }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({ total_users: 0, total_comments: 0, total_likes: 0 });

onMounted(async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}admin/stats`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` }
  });
  stats.value = res.data;
});
</script>
