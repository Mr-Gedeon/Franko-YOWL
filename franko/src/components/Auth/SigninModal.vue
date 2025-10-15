<script setup>
import { useModalStore } from '@/stores/ModalSignInStore';
import { useSignupModalStore } from '@/stores/ModalSignupStore';
import { useAuthStore } from '@/stores/AuthStore';
import { useSweetAlertStore } from '@/stores/SweetAlert';
import { ref } from "vue";
import router from '@/router';

const SweetAlertStore = useSweetAlertStore();

const modalStore = useModalStore();
const signupmodalStore = useSignupModalStore();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const errorMessage = ref("");

const handleLogin = async () => {

    console.log("Tentative de connexion :", {
        email: email.value,
        password: password.value
    });

    //plus tard, on feras l'appel API avec axios
    const response = await authStore.SignIn({
        email: email.value,
        password: password.value
    })

    if (response.success) {
        if(authStore.user.is_admin === 1) {
            router.push('/admin')
        }
        SweetAlertStore.success("Welcome back!", "Login successful");
        modalStore.closeLoginModal();
    } else {
        // erreur Laravel ou une erreur générale
        if (response.errors) {
            const firstError = Object.values(response.errors)[0][0];
            SweetAlertStore.error(firstError, "Login failed");
        } else {
            SweetAlertStore.error(response.message || "Unable to login", "Login failed");
        }
    }
}

</script>

<template>

    <!-- Modal toggle -->
    <!-- <button @click="modalStore.openLoginModal()"
        class="block text-white bg-yellow-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button">
        Sign in
    </button> -->

    <!-- Main modal -->
    <div v-if="modalStore.isLoginModalVisible"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[10px] bg-gray-900/60">

        <div class="relative p-4 w-full max-w-md max-h-full">

            <!-- Modal header -->
            <div class="flex items-center justify-center p-4 md:p-5">
                <div class="flex-col justify-center items-center">
                    <h3 class="text-center text-xl font-semibold text-white">
                        Sign in
                    </h3>
                    <p class="text-center text-gray-400">To post a Franko review...</p>
                </div>
                <button @click="modalStore.closeLoginModal()" type="button"
                    class="absolute left-[20px] end-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center hover:bg-gray-600 hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>

            <!-- Modal content -->
            <div class="relative rounded-lg shadow-sm bg-[#1a1f27] border-2 border-gray-700 p-2">

                <!-- Modal body -->
                <div class="p-4 md:p-5">
                    <form @submit.prevent="handleLogin" class="space-y-6 flex flex-col gap-[10px]">
                        <div>

                            <div class="relative z-0 w-full mb-5 group">

                                <input v-model="email" maxlength="120" type="email" name="floating_email"
                                    id="floating_email"
                                    class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                                    placeholder=" " required />
                                <label for="floating_email"
                                    class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email
                                    address</label>
                            </div>
                            <p v-if="errorMessage" class="text-red-500 text-sm text-center">
                                {{ errorMessage }}
                            </p>
                        </div>
                        <div>

                            <div class="relative z-0 w-full mb-5 group">

                                <input v-model="password" maxlength="254" type="password" name="floating_password"
                                    id="floating_password"
                                    class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                                    placeholder=" " required />
                                <label for="floating_email"
                                    class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                            </div>
                            <p v-if="errorMessage" class="text-red-500 text-sm text-center">
                                {{ errorMessage }}
                            </p>
                        </div>

                        <button v-if="(email.trim() !== '') && (password.trim() !== '')" type="submit"
                            class="w-full text-white bg-[#a54c03] hover:bg-[#966a46] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login
                        </button>
                        <button v-else
                            class="w-full text-white bg-[#8a572e7e] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login
                        </button>
                    </form>

                    <div class="text-sm mt-[10px] font-medium flex justify-center gap-[5px] text-gray-500">
                        <span>Not registered?</span>
                        <button @click="signupmodalStore.openSignupModal(); modalStore.closeLoginModal()"
                            class="text-[#a56028] hover:underline">Create account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
