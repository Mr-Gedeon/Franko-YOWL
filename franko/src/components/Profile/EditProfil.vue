<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useUserStore } from "@/stores/UserStore";
import { useSweetAlertStore } from "@/stores/SweetAlert";

const authStore = useAuthStore();
const userStore = useUserStore();
const SweetAlertStore = useSweetAlertStore()

// Champs du formulaire
const username = ref("");
const email = ref("");
const birthdate = ref("");
const picture = ref(null);
const message = ref("");
const loading = ref(false);


// Charger les infos actuelles du user
onMounted( async () => {
  if (authStore.user) {
    username.value = authStore.user.username;
    email.value = authStore.user.email;
    birthdate.value = authStore.user.birthdate;
  }
});

// fichier image
const handleFileChange = (event) => {
  picture.value = event.target.files[0];
};

// Envoi vers l’API
const updateProfile = async () => {
  loading.value = true;
  message.value = "";

  try {
    const formData = new FormData();
    formData.append("username", username.value);
    formData.append("email", email.value);
    formData.append("birthdate", birthdate.value);

    if (picture.value) {
      formData.append("picture", picture.value);
    };

    //calc age
    const birthDate = new Date(birthdate.value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birth month and day haven't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }


  if (age < 13 || age > 35) {
    SweetAlertStore.error("You must be between 13 and 35 years old to register.");
    return;
  }

    const success = await authStore.updateUser(authStore.user.id, formData);

    if (success) {
      message.value = "Profil mis à jour avec succès !";
    }
    window.location.href = "/profil/";
  } catch (error) {
    console.error(error);
    message.value = " Email non conforme ";
    await userStore.fetchUserById(authStore.user.id);
  }
};

</script>

<template>
  <div class="fixed px-[10px] inset-0 backdrop-blur-[10px] bg-gray-900/60 text-white flex justify-center items-center z-50">
    <div class="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 shadow-lg w-96 relative">
      <h2 class="text-xl font-bold mb-4 text-center">Editer mon profil</h2>

      <div v-if="picture" class="mb-4">
        <img :src="URL.createObjectURL(picture)" class="w-24 h-24 rounded-full object-cover" />
      </div>
      <div class="relative z-0 w-full group mb-[40px]">
        <input v-model="username" maxlength="20" type="test" name="floating_text" id="floating_text"
          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
          placeholder=" " required />
        <label for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username
        </label>
      </div>

      <div class="relative z-0 w-full group mb-[40px]">
        <input v-model="email" maxlength="120" type="email" name="floating_email" id="floating_email"
          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-[#8a572e] focus:outline-none focus:ring-0 peer"
          placeholder=" " required />
        <label for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8a572e] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email
          address</label>
      </div>
      <input
        type="file"
        @change="handleFileChange"
        accept="image/png, image/jpeg"
        class="border mb-4 text-sm rounded-lg block w-full p-2.5 bg-gray-800 border-gray-600 text-white"
      />
      <div>
        <input v-model="birthdate" type="date" name="date" id="date" value="02-25-2008"
          class="border mb-[40px] text-sm rounded-lg focus:ring-[#8a572e7e] focus:border-blue-500 block w-full p-2.5 bg-[#ac602217] border-gray-500 placeholder-gray-400 text-white"
          required />
      </div>

      <!-- <label class="block mb-2 font-medium text-gray-700">Photo de profil</label>
      <input type="file" @change="handleFileChange" class="w-full mb-3 p-2 border rounded" /> -->

      <p class="text-sm text-gray-600 mb-3 text-center">{{ message }}</p>

      <div class="flex justify-end gap-[30px]">
        <button @click="$emit('close')" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">
          Fermer
        </button>
        <!-- <button @click="updateProfile" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          :disabled="loading">
          {{ loading ? "Chargement..." : "Mettre à jour" }}
        </button> -->
        <button
          @click="updateProfile"
          v-if="(username.trim() !== '') && (email.trim() !== '') && (birthdate.trim() !== '')"
          type="submit"
          class="w-full text-white bg-[#a54c03] hover:bg-[#966a46] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Mettre à jour
        </button>
        <button v-else
          class="w-full text-white bg-[#8a572e7e] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Mettre à jour
        </button>
      </div>
    </div>
  </div>
</template>
