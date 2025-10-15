import { defineStore } from "pinia";
import axios from "axios";
import Swal from "sweetalert2";
import { useEditUserModalStore } from "@/stores/EditUserModalStore";

const apiUrl = import.meta.env.VITE_API_URL;

export const useAdminStore = defineStore("adminStore", {
  state: () => ({
    stats: {},
    users: [],
    comments: [],
    loading: false,
  }),

  actions: {
    // pour récupérer le token à chaque requête
    getAuthHeader() {
      const token =
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("access_token");
      return { Authorization: `Bearer ${token}` };
    },

    // les statistiques du dashboard
    async fetchStats() {
      this.loading = true;
      try {
        const res = await axios.get(`${apiUrl}admin/stats`, {
          headers: this.getAuthHeader(),
        });
        this.stats = res.data;
      } catch (err) {
        Swal.fire("Erreur", "Impossible de charger les statistiques", "error");
      } finally {
        this.loading = false;
      }
    },

    //tous les utilisateurs
    async fetchUsers() {
      try {
        const res = await axios.get(`${apiUrl}admin/users`, {
          headers: this.getAuthHeader(),
        });
        this.users = res.data;
      } catch (err) {
        Swal.fire("Erreur", "Impossible de charger les utilisateurs", "error");
      }
    },

    // supprimer un utilisateur
    async deleteUser(id) {
      const confirm = await Swal.fire({
        title: "Supprimer cet utilisateur ?",
        text: "Cette action est irréversible !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, supprimer !",
      });

      if (confirm.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}admin/users/${id}`, {
            headers: this.getAuthHeader(),
          });
          this.users = this.users.filter((user) => user.id !== id);
          Swal.fire("Supprimé !", "L'utilisateur a été supprimé.", "success");
        } catch (err) {
          Swal.fire("Erreur", "Suppression impossible", "error");
        }
      }
    },

    //  promouvoir un utilisateur en admin
    async promoteToAdmin(id) {
      try {
        await axios.patch(`${apiUrl}admin/users/${id}/promote`, {}, {
          headers: this.getAuthHeader(),
        });
        Swal.fire("Succès", "Utilisateur promu administrateur", "success");
        await this.fetchUsers();
      } catch (err) {
        Swal.fire("Erreur", "Impossible de promouvoir cet utilisateur", "error");
      }
    },

    async depromoteToAdmin(id) {
      try {
        await axios.patch(`${apiUrl}admin/users/${id}/depromote`, {}, {
          headers: this.getAuthHeader(),
        });
        Swal.fire("Succès", "Utilisateur degrader des administrateur", "success");
        await this.fetchUsers();
      } catch (err) {
        Swal.fire("Erreur", "Impossible de degrader cet utilisateur", "error");
      }
    },

    //récupérer tous les commentaires
    async fetchComments() {
      try {
        const res = await axios.get(`${apiUrl}admin/comments`, {
          headers: this.getAuthHeader(),
        });
        this.comments = res.data;
      } catch (err) {
        Swal.fire("Erreur", "Impossible de charger les commentaires", "error");
      }
    },

    // supprimer un commentaire
    async deleteComment(id) {
      const confirm = await Swal.fire({
        title: "Supprimer ce commentaire ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, supprimer !",
      });

      if (confirm.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}admin/comment/${id}`, {
            headers: this.getAuthHeader(),
          });
          this.comments = this.comments.filter((c) => c.id !== id);
          Swal.fire("Supprimé !", "Commentaire supprimé.", "success");
        } catch (err) {
          Swal.fire("Erreur", "Suppression impossible", "error");
        }
      }
    },

   async addUser(payload) {
  try {
    const res = await axios.post(`${apiUrl}admin`, payload, {
      headers: this.getAuthHeader(),
    });
    // le nouvel utilisateur à la liste
    this.users.unshift(res.data.user || res.data);
    Swal.fire("Succès", "Utilisateur créé", "success");
    await this.fetchUsers(); // recharge les users
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Erreur addUser :", err.response?.data || err);
    return { success: false, errors: err.response?.data };
  }
},

        async updateUser(id, updatedData) {
  const EditUsermodalStore = useEditUserModalStore();

  try {
    const res = await axios.put(`${apiUrl}admin/users/${id}`, updatedData, {
      headers: this.getAuthHeader(),
    });

    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = res.data.user || res.data;
    }

    Swal.fire("Succès", "Utilisateur mis à jour", "success");
    EditUsermodalStore.closeEditUserModal(); // ✅ fonctionne maintenant
    await this.fetchUsers();
  } catch (err) {
    console.error("Erreur updateUser :", err.response?.data || err);
    Swal.fire("Erreur", "Impossible de mettre à jour l'utilisateur", "error");
  }
}




  },
});
