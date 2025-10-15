<script setup>
import { ref } from 'vue';

const searchResult = ref('')
</script>

<template>

    <div @click.self="$emit('hideSearch')" class="fixed inset-0 z-500 px-[10px] flex justify-center backdrop-blur-[10px] bg-gray-900/60 pt-[80px]">

        <div class="relative w-full h-[50px] z-100">

            <form @submit.prevent="" class="max-w-md mx-auto">
                <label for="default-search" class="mb-2 text-sm font-medium sr-only text-white">Search</label>
                <div class="relative">

                    <input v-model="searchResult" maxlength="120" type="text" name="floating_search" id="floating_search"
                        class="block py-2.5 px-0 w-[80%] h-[50px] text-[18px] bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                        placeholder=" "/>
                    <label for="floating_search"
                        class="peer-focus:font-medium absolute text-[18px] text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Search...</label>

                    <button v-if="searchResult.trim() !== ''" type="submit" @click.stop="$emit('searchInput', searchResult.trim()),$emit('hideSearch')"
                        class="absolute h-[50px] end-2.5 bottom-0 right-[-3px] bg-[#a54c03] text-white px-3 py-1 rounded-xl">
                        Reply
                    </button>
                    <button v-else
                        class="absolute h-[50px] end-2.5 bottom-0 right-[-3px] bg-[#a54c0391] text-white px-3 py-1 rounded-xl">
                        Reply
                    </button>
                </div>
            </form>

        </div>
    </div>


</template>

<style scoped></style>
