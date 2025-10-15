<script>

export default {

  name: "PageNotFound",

}

</script>

<template>

  <div class=" w-screen h-screen flex flex-col justify-center items-center text-xl text-white text-center">

    <div class="fixed top-[50px] left-[50px] text-[48px]">
      Franko
    </div>

    <div class=" w-fit border-2 rounded-xl bg-gray-900 border-gray-700 p-[50px]">

      <h1 class="text-[32px] mb-[10px]"><span class="text-[#a54c03]">Oops! <br></span>you seems to be lost...</h1>
      <p class="mb-[10px] text-gray-500">If you're here by error, try going back, or else,</p>
      <router-link to="/" class="underline text-[#a54c03]">click this link</router-link>
    </div>

  </div>


</template>
