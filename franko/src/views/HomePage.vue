<script setup>

import CommentSection from '@/components/Comments/CommentSection.vue';
// import SigninModal from '@/components/Auth/SigninModal.vue';
// import SignupModal from '@/components/Auth/SignupModal.vue';
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
userStore.fetchUser()
</script>

<template>

  <div class="homeWrapper">
  
    <div class="mainContent w-full h-full max-w-[650px] bg-[#1a1f27] border-r-2 border-l-2 border-gray-700 overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
      <CommentSection/>
    </div>
    
  </div>
  
  <!-- <SigninModal/>
  <SignupModal/> -->

  <!-- <div class="flex gap-6">
    <div class="w-1/3">
    </div>
    <div class="flex-1">
    </div>
  </div> -->
</template>

<style scoped>

.homeWrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.mainContent {
  position: relative;
  justify-self: center;
  margin: 0 auto;
}

@media screen and (max-width: 1050px) {
  .mainContent {
    top: 60px;
    max-height: 88%;

}
@media screen and (min-height: 810px) {
  .mainContent {
    max-height: 92%;

}
}
}


/* @media screen and (max-height:700px) {

  .mainContent {
    max-height: 79%;
  }
} */
</style>
