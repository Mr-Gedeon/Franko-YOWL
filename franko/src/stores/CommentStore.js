import axios from 'axios'
import { defineStore } from 'pinia'

const apiUrl = import.meta.env.VITE_API_URL

const AxiosComment = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

AxiosComment.interceptors.request.use(config => {
  const token = sessionStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

AxiosComment.interceptors.request.use(config => {
  const token = sessionStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useCommentStore = defineStore('commentStore', {
  state: () => ({
    comments: [],
    filteredComments: [],
    selectedComment: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchComments() {
      this.loading = true
      try {
        const res = await AxiosComment.get('comments')
        this.comments = res.data
      } catch (error) {
        console.log(error)
      } 
    },

    async fetchCommentById(id) {
      this.loading = true
      try {
        const res = await AxiosComment.get(`comments/${id}`)
        this.selectedComment = res.data
      } catch (error) {
        console.log(error)
      } 
    },

    async addComment(newComment) {
      this.loading = true
      try {
        const res = await AxiosComment.post('comments', newComment)
        this.comments.push(res.data)
        await this.fetchComments()
        return res.data.comment
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
        await AxiosComment.put(`/comments/${id}`, payload)
        const index = this.comments.findIndex(c => c.id === id)
        if (index !== -1) {
          this.comments[index] = { ...this.comments[index], ...payload }
        }
        await this.fetchComments()
      } catch (error) {
        console.log(error)
      } 
    },

    async fetchCommentByInput(input) {

      try {
        const res = await axios.get(`${apiUrl}comments/search/${input}`)
        this.filteredComments = res.data.result
      } catch (error) {
        console.log(error)
      } 
    },

    async deleteComment(id) {
      this.loading = true
      try {
        await AxiosComment.delete(`comments/${id}`)
        this.comments = this.comments.filter(c => c.id !== id)
        await this.fetchComments()
      } catch (error) {
        console.log(error)
      }
    }
  }
})
