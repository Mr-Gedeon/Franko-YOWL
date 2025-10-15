import AddComment from '@/components/Comments/AddComment.vue'
import EditComment from '@/components/Comments/EditComment.vue'
import DetailComment from '@/components/Comments/DetailComment.vue'
import HomePage from '@/views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Profil from '@/views/UserProfil.vue'
import Settings from '@/views/UserSettings.vue'
import PageNotFound from '@/components/NotFound/PageNotFound.vue'
import ResponseComment from '@/components/Comments/ResponseComment.vue'
import ResponseCommentSection from '@/components/Comments/ResponseCommentSection.vue'
import { useAuthStore } from "@/stores/AuthStore";
import Swal from "sweetalert2";
import AdminView from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: HomePage,
      meta: {layout: 'PublicLayout'}
    },

    {
      path: '/addcomment',
      name: 'add',
      component: AddComment,
    },

    {
      path: '/editcomment/:id',
      name: 'EditComment',
      component: EditComment,
      props: true
    },
     {
      path: '/responsecomment/:id',
      name: 'ResponseComment',
      component: ResponseComment,
      props: true
    },

     {
      path: '/responsecommentsection/:id',
      name: 'ResponseCommentSection',
      component: ResponseCommentSection,
      props: true
    },

    {
      path: '/comment/:id',
      name: 'DetailComment',
      component: DetailComment },
    // {
    //   path: '/post/:id',
    //   name: 'DetailsCard',
    //   component: DetailsCard,
    //   props: true,
    // },
    {
      path: '/profil/',
      name: 'Profil',
      component: Profil,
      props: true,
    },

    {
      path: '/Settings/',
      name: 'Settings',
      component: Settings,
      props: true,
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: PageNotFound,
    },
    {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminView,
    meta: {layout: 'AdminLayout'},
    beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        const user = authStore.user;

        // S'il n'est Pas connecté
        if (!user) {
          Swal.fire("Accès refusé", "Veuillez vous connecter pour continuer.", "warning");
          return next("/login");
        }

        // S'il n'est Pas admin
        if (!user.is_admin) {
          Swal.fire("Non autorisé", "Vous n’êtes pas administrateur.", "error");
          return next("/"); // redirige vers l’accueil
        }

        // OK pour l' admin
        next();
      },
  },

  {
    path: '/admin/users',
    name: 'AdminUsers',
    meta: {layout: 'AdminLayout'},
    component: () => import('@/components/Admin/UsersTable.vue'),
    // meta: { requiresAdmin: true },
    props: true,
  },

  {
    path: '/admin/comments',
    name: 'AdminComments',
    meta: {layout: 'AdminLayout'},
    component: () => import('@/components/Admin/CommentsTable.vue'),
    // meta: { requiresAdmin: true },
    props: true,
  },

  ],


})
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   const user = authStore.user;

//   if (to.meta.requiresAdmin && (user || user.is_admin)) {
//     return next('/');
//   }
//   next();});

export default router
