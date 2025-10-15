<script setup>
import Sidebar from '@/components/Admin/AdminSidebar.vue'
// import DashboardHome from '@/components/Admin/DashboardHome.vue'
import Header from '@/components/Admin/AdminHeader.vue';
</script>

<template>
  <Header></Header>
  <div class="flex min-h-screen bg-gray-100 text-gray-900">
    <Sidebar></Sidebar>
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- <DashboardHome /> -->
      <slot></slot>
    </div>
  </div>
</template>