<template>
    <div
        class="flex justify-center w-full h-full pt-[120px] px-[15px] mx-auto overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">

        <div
            class="relative w-full max-w-[640px] p-6 border-2 border-gray-700 bg-gray-900 text-white rounded-lg shadow">

            <div class="p-8">
                <h3>Ajouter un commentaire</h3>

                <form @submit.prevent="handleAdd">

                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-[25px] sm:grid-cols-6">

                        <div class="relative z-0 w-full group">
                            <input v-model="newComment.url" maxlength="120" type="url" name="floating_url"
                                id="floating_url"
                                class="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 appearance-none text-gray-300 border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                                placeholder=" " required />
                            <label for="floating_url"
                                class="peer-focus:font-medium absolute text-lg text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Url</label>
                        </div>

                        <div class="relative z-0 w-full group">
                            <textarea v-model="newComment.content" maxlength="120" type="text"
                                name="floating_content" id="floating_content"
                                class="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 appearance-none text-gray-300 border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                                placeholder=" " required></textarea>
                            <label for="floating_content"
                                class="peer-focus:font-medium absolute text-lg text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Content</label>
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-end">
                        <router-link to="/" class="px-3 py-1 bg-gray-600 text-white rounded">Cancel</router-link>
                        <button v-if="newComment.content.trim() !== '' & newComment.url.trim() !== ''"
                            type="submit" class="px-3 py-1 ml-6 bg-[#a54c03] text-white rounded">
                            {{ commentStore.loading ? "Post..." : "Post" }}
                        </button>
                        <button v-else class="px-3 py-1 ml-6 bg-[#8a572e7e] text-white rounded">
                            {{ commentStore.loading ? "Post..." : "Post" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCommentStore } from '@/stores/CommentStore';

const commentStore = useCommentStore();
const router = useRouter();
const user = JSON.parse(sessionStorage.getItem('user'))
const newComment = ref({
    user_id: user.id,
    url: '',
    content: '',
    parent:0

})

const handleAdd = async () => {
    if (!newComment.value.content.trim())
        return
    await
        commentStore.addComment(newComment.value)
    router.push('/')
    console.log("commentaire crée")
}

</script>