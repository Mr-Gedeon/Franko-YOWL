<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";
import Swal from "sweetalert2";
import { useAddUserModalStore } from '@/stores/ModalAddUserStore';
import AddUserModal from "../Auth/AddUserModal.vue";
// import { useAuthStore } from '@/stores/AuthStore';

const AddUsermodalStore = useAddUserModalStore();
// const AuthStore = useAuthStore()

const apiUrl = import.meta.env.VITE_API_URL;
const token = sessionStorage.getItem("access_token");

const stats = ref({
  total_users: 0,
  total_comments: 0,
  total_like: 0,
  admins: 0,
  users_week: 0,
  avg_comments_per_user: 0,
  avg_likes_per_comment: 0,
});

onMounted(async () => {
  try {
    const res = await axios.get(`${apiUrl}admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    stats.value = res.data;

    // Moyennes calculées
    stats.value.avg_comments_per_user =
      stats.value.total_users > 0
        ? (stats.value.total_comments / stats.value.total_users).toFixed(2)
        : 0;

    stats.value.avg_likes_per_comment =
      stats.value.total_comments > 0
        ? (stats.value.total_like / stats.value.total_comments).toFixed(2)
        : 0;

    // Données simulées
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const newUsersPerDay = [5, 8, 6, 10, 4, 7, 9];
    const avgCommentsTrend = [1.2, 1.5, 1.3, 1.4, 1.6, 1.8, 2.0];
    const avgLikesTrend = [1, 1.25, 1.6, 1.4, 1.6, 1.8, 1.9];

    // === Charts ===
    new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels: ["Users", "Comments", "Likes", "Admins"],
        datasets: [
          {
            label: "General Stats",
            data: [
              stats.value.total_users,
              stats.value.total_comments,
              stats.value.total_like,
              stats.value.admins,
            ],
            backgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#ef4444"],
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    new Chart(document.getElementById("doughnutChart"), {
      type: "doughnut",
      data: {
        labels: ["Admins", "Normal Users"],
        datasets: [
          {
            label: "User Roles",
            data: [
              stats.value.admins,
              stats.value.total_users - stats.value.admins,
            ],
            backgroundColor: ["#3b82f6", "#f59e0b"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "right", labels: { color: "#374151" } },
        },
      },
    });

    new Chart(document.getElementById("lineUsersChart"), {
      type: "line",
      data: {
        labels: days,
        datasets: [
          {
            label: "New Users (per day)",
            data: newUsersPerDay,
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96, 165, 250, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });

    new Chart(document.getElementById("lineCommentsChart"), {
      type: "line",
      data: {
        labels: days,
        datasets: [
          {
            label: "Avg Comments/User",
            data: avgCommentsTrend,
            borderColor: "#34d399",
            backgroundColor: "rgba(52, 211, 153, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });

    new Chart(document.getElementById("lineLikesChart"), {
      type: "line",
      data: {
        labels: days,
        datasets: [
          {
            label: "Avg Likes/Comment",
            data: avgLikesTrend,
            borderColor: "#36c300",
            backgroundColor: "rgba(50, 200, 100, 0.3)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });
  } catch (err) {
    Swal.fire("Erreur", "Impossible de charger les statistiques", err);
  }
});
</script>

<template>
  <div class="ml-[200px] mt-[70px] p-6 md:p-10 bg-gray-100 min-h-screen">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
        📊 Dashboard Admin
      </h1>
      <button
        @click="AddUsermodalStore.openAddUserModal"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"
      >
        ➕ Ajouter un utilisateur
      </button>
    </div>

    <!-- KPI Section -->
    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
      <div
        v-for="(value, key) in [
          { title: 'Total Users', color: 'text-blue-500', val: stats.total_users },
          { title: 'Comments', color: 'text-green-500', val: stats.total_comments },
          { title: 'Likes', color: 'text-yellow-500', val: stats.total_like },
          { title: 'Admins', color: 'text-red-500', val: stats.admins },
          { title: 'New Users (This Week)', color: 'text-indigo-500', val: 7 },
          { title: 'Avg Comments/User', color: 'text-emerald-500', val: stats.avg_comments_per_user },
          { title: 'Avg Likes/Comment', color: 'text-emerald-400', val: stats.avg_likes_per_comment }
        ]"
        :key="key"
        class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center"
      >
        <h3 class="text-gray-600 text-sm font-medium mb-1">{{ value.title }}</h3>
        <p :class="['text-2xl font-bold', value.color]">{{ value.val }}</p>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid md:grid-cols-2 gap-8 mb-10">
      <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          📈 Global Overview
        </h2>
        <canvas id="barChart" class="w-full h-64"></canvas>
      </div>

      <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🧑‍💼 User Roles
        </h2>
        <canvas id="doughnutChart" class="w-full h-64"></canvas>
      </div>
    </div>

    <!-- Tendances -->
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          💬 Avg Comments per User
        </h2>
        <canvas id="lineCommentsChart" class="w-full h-64"></canvas>
      </div>

      <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          ❤️ Avg Likes per Comment
        </h2>
        <canvas id="lineLikesChart" class="w-full h-64"></canvas>
      </div>
    </div>

    <div class="mt-8 bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        📅 New Users This Week
      </h2>
      <canvas id="lineUsersChart" class="w-full h-64"></canvas>
    </div>

    <AddUserModal v-if="AddUsermodalStore.isOpen" />
  </div>
</template>
