import axios from "axios";
import {defineStore} from "pinia";

const apiUrl = import.meta.env.VITE_API_URL

function axiosGenerator() {

  if (sessionStorage.getItem('access_token') !== null) {

    const token = sessionStorage.getItem('access_token');

    const authAxios = axios.create({

      baseURL: apiUrl+"auth/",
      headers: {

        Authorization: `Bearer ${token}`
      }
    })

    return authAxios
  } else {
    const authAxios = axios.create({

      baseURL: apiUrl+"auth/",
    })

    return authAxios
  }
}

const authAxios = axiosGenerator()

export const useAuthStore = defineStore('authStore', {
    state: () => ({
      user: JSON.parse(sessionStorage.getItem('user')),
      token: sessionStorage.getItem("access_token"),
}),


    actions: {

        async SignUp(data) {

            try {
                const res = await authAxios.post('register', data)

                const responseToken = res.data.access_token

                const responseUser = res.data.user


                sessionStorage.setItem('access_token', responseToken)
                sessionStorage.setItem('user', JSON.stringify(responseUser))
                this.user = JSON.parse(sessionStorage.getItem('user'))
                this.token = sessionStorage.getItem('access_token')

        return { success: true, responseUser };

      } catch (error) {

        console.error("Signup error:", error);

        return {
          success: false,
          message: error.response?.data?.message || "Signup failed",
          errors: error.response?.data?.errors || null,
        };
        };
      },

        async SignIn(data) {

            try {

                const res = await authAxios.post('login', data)

                const token = res.data.access_token
                const responseUser = res.data.user

                sessionStorage.setItem('access_token', token)
                sessionStorage.setItem('user', JSON.stringify(responseUser))
                this.user = JSON.parse(sessionStorage.getItem('user'))
                this.token = sessionStorage.getItem('access_token')

              return { success: true, responseUser };

      } catch (error) {
        console.error("Login error:", error);

        return {
          success: false,
          message: error.response?.data?.message || "Invalid credentials",
          errors: error.response?.data?.errors || null,
        };
        };
      },

        async fetchUser() {
          if (!this.token) {

              return null;

          }

          try {
            const res = await axios.get(apiUrl + "me", {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            });
            const responseUser = res.data

            sessionStorage.setItem('user', JSON.stringify(responseUser))
            this.user = JSON.parse(sessionStorage.getItem('user'))

            return this.user;
          } catch (error) {
            console.error("Fetch user error:", error);
            return null;
          }
        },

        async updateUser(id, payload) {
          try {
            const token = sessionStorage.getItem("access_token");

            const res = await axios.post(`${apiUrl}auth/users/${id}?_method=PUT`, payload, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });

            const newUser = res.data.user || res.data;
            
            sessionStorage.setItem("user", JSON.stringify(newUser));
            this.user = newUser;

            return true;
          } catch (err) {
            console.error("Erreur updateUser :", err.response?.data || err);
            return false;
          }
        },

        async Logout() {
          this.user = null;
          this.token = null;
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem('user')
        },
    },

  //   persist: {

  //   enabled: true,
  //   strategies: [
  //     {
  //       storage: localStorage,
  //       paths: ["user", "token"],
  //     },
  //   ],
  // },
})
