import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  // 用户注册
  async function register(username, email, password) {
    loading.value = true
    try {
      const res = await api.post('/api/user/register', {
        username,
        email,
        password
      })
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 用户登录
  async function login(username, password) {
    loading.value = true
    try {
      const res = await api.post('/api/user/login', {
        username,
        password
      })
      if (res.data.token) {
        token.value = res.data.token
        localStorage.setItem('token', res.data.token)
        await getUserInfo()
      }
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  // 获取用户信息
  async function getUserInfo() {
    if (!token.value) return null
    loading.value = true
    try {
      const res = await api.get('/api/user/info')
      userInfo.value = res.data
      return res.data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新用户信息
  async function updateUserInfo(data) {
    loading.value = true
    try {
      const res = await api.put('/api/user/info', data)
      userInfo.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 修改密码
  async function changePassword(oldPassword, newPassword) {
    loading.value = true
    try {
      const res = await api.put('/api/user/password', {
        oldPassword,
        newPassword
      })
      return res.data
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    userInfo,
    loading,
    isLoggedIn,
    register,
    login,
    logout,
    getUserInfo,
    updateUserInfo,
    changePassword
  }
})
