<script setup>
import { useAddUserModalStore } from '@/stores/ModalAddUserStore';
import { useAdminStore } from '@/stores/AdminStore';
import { ref } from "vue";
import { useSweetAlertStore } from '@/stores/SweetAlert';

const SweetAlertStore = useSweetAlertStore();

const AddUsermodalStore = useAddUserModalStore();
const adminStore = useAdminStore()

const username = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const date = ref("");

const handleAddUser = async () => {
  const birthDate = new Date(date.value);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }

  if (age < 13 || age > 35) {
    SweetAlertStore.error("You must be between 13 and 35 years old to register.");
    return;
  }

  const response = await adminStore.addUser({
      username: username.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
      birthdate: date.value
  });

  if (response.success) {
    SweetAlertStore.success("Account created successfully!", "Welcome!");
    AddUsermodalStore.closeAddUserModal();
    username.value = '';
    email.value = '';
    password.value = '';
    password_confirmation.value = '';
    date.value = '';
  } else {
    const errors = response.errors?.errors;
    if (errors) {
      const firstError = Object.values(errors)[0][0];
      SweetAlertStore.error(firstError, "AddUser failed");
    } else {
      SweetAlertStore.error(response.errors?.message || "An error occurred during AddUser.");
    }
  }
};


</script>

<template>
    <div v-if="AddUsermodalStore.isAddUserModalVisible"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[10px] bg-gray-900/60">

        <div class="relative p-4 w-full max-w-md max-h-full">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5">
                <div class="flex-col justify-center items-center">
                    <h3 class="text-center text-xl font-semibold text-white mb-[10px]">
                        Add User
                    </h3>
                    <p class="text-center text-gray-400">Inscrivez-Votre utilisateur pour qu'il puisse postez son premier avis Franko!</p>
                </div>
                <button @click="AddUsermodalStore.closeAddUserModal()" type="button"
                class="absolute left-[20px] top-[35px] end-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center hover:bg-gray-600 hover:text-white">
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
                    <form @submit.prevent="handleAddUser" class="space-y-6 flex flex-col gap-[5px]">
                        <div>
                            <div class="relative z-0 w-full group">
                                <input v-model="username" maxlength="20" type="test" name="floating_text"
                                    id="floating_text"
                                    class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                                    placeholder=" " required />
                                <label for="floating_email"
                                    class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username
                                </label>
                            </div>
                        </div>
                        <div>
                            <div class="relative z-0 w-full group">
                                <input v-model="email" maxlength="120" type="email" name="floating_email"
                                    id="floating_email"
                                    class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                                    placeholder=" " required />
                                <label for="floating_email"
                                    class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email
                                    address</label>
                            </div>
                        </div>
                        <div>
                            <div class="relative z-0 w-full group">
                                <input v-model="password" minlength="6" maxlength="254" type="password" name="floating_password"
                                    id="floating_password"
                                    class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                                    placeholder=" " required />
                                <label for="floating_email"
                                    class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                            </div>
                        </div>
                        <div>
                            <div class="relative z-0 w-full group">

                                <input v-model="password_confirmation" minlength="6" maxlength="254" type="password" name="floating_password_confirmation"
                                    id="floating_password_confirmation"
                                    class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
                                    placeholder=" " required />
                                <label for="floating_email"
                                    class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password confirmation</label>
                            </div>
                        </div>
                        <div>
                            <input v-model="date" type="date" name="date" id="date" value="02-25-2008"
                                class="border text-sm rounded-lg focus:ring-[#8a572e7e] focus:border-blue-500 block w-full p-2.5 bg-[#ac602217] border-gray-500 placeholder-gray-400 text-white"
                                required />
                        </div>
                        <button v-if="(username.trim() !== '') && (email.trim() !== '') && (password.trim() !== '') && (password_confirmation.trim() !== '') && (date.trim() !== '')" type="submit"
                        class="w-full text-white bg-[#a54c03] hover:bg-[#966a46] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add
                        </button>
                        <button v-else
                            class="w-full text-white bg-[#8a572e7e] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add
                        </button>
                    </form>

                </div>
            </div>
        </div>
    </div>

</template>
