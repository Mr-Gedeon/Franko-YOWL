import axios from 'axios'
import { defineStore } from 'pinia'
import { useModalStore } from './ModalSignInStore'

const apiUrl = import.meta.env.VITE_API_URL

const AxiosLike = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

AxiosLike.interceptors.request.use(config => {
  const token = sessionStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useLikeStore = defineStore('likeStore', {
  state: () => ({
    likers: [],
    selectedComment: null,

    likesCount: 0,

    loading: false,
    error: null
  }),

  actions: {
    async react(commentId, reaction) {
      try {

        const user = JSON.parse(sessionStorage.getItem('user'))

        if (user == null){
          const signIn = useModalStore();
          signIn.openLoginModal()
        }else{

          const content = {
            comment: commentId,
            user: user.id,
            toLike: reaction
          }
          await AxiosLike.post('react', content)
          // const res = await AxiosLike.post('react', content)
          // this.comments = res.data

        }
      } catch (error) {
        console.log(error)
      }
    },

    async fetchCommentLikers(commentId = null) {
      this.loading = true
      try {
        // const secondPartUri = "likers"
        const user = JSON.parse(sessionStorage.getItem('user'))
        let params = {}
        if (user != null){
          params = {
            comment: commentId,
            user: user.id,
          }

        }else{
          params = {
            comment: commentId,
          }
        }
        const res = await AxiosLike.get('likers', { params })
        this.likers = res.data.content
      } catch (error) {
        console.log(error)
      }
    },

    async fetchComments() {
      this.loading = true
      try {
        const res = await AxiosLike.get('comments')
        this.comments = res.data
      } catch (error) {
        console.log(error)
      }
    },

    async fetchCommentById(id) {
      this.loading = true
      try {
        const res = await AxiosLike.get(`comments/${id}`)
        this.selectedComment = res.data
      } catch (error) {
        console.log(error)
      }
    },

    async addComment(newComment) {
      this.loading = true
      try {
        const res = await AxiosLike.post('comments', newComment)
        this.comments.push(res.data)
      } catch (error) {
        console.log(error)
      }
    },

    async updateComment(id, updatedData) {
      this.loading = true
      try {
        const payload = {
          user_id: updatedData.user_id,
          content: updatedData.content,
          url: updatedData.url
        }
        await AxiosLike.put(`/comments/${id}`, payload)
        const index = this.comments.findIndex(c => c.id === id)
        if (index !== -1) {
          this.comments[index] = { ...this.comments[index], ...payload }
        }
      } catch (error) {
        console.log(error)
      }
    },

    async deleteComment(id) {
      this.loading = true
      try {
        await AxiosLike.delete(`/comments/${id}`)
        this.comments = this.comments.filter(c => c.id !== id)
      } catch (error) {
        console.log(error)
      }
    }
  }
})
