import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref([])
  const loading = ref(false)

  // 获取分类列表
  async function getCategoryList() {
    loading.value = true
    try {
      const res = await api.get('/api/category/list')
      categoryList.value = res.data || []
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 创建分类
  async function createCategory(data) {
    loading.value = true
    try {
      const res = await api.post('/api/category/create', data)
      await getCategoryList()
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 更新分类
  async function updateCategory(id, data) {
    loading.value = true
    try {
      const res = await api.put(`/api/category/edit/${id}`, data)
      await getCategoryList()
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 删除分类
  async function deleteCategory(id) {
    loading.value = true
    try {
      const res = await api.delete(`/api/category/delete/${id}`)
      await getCategoryList()
      return res.data
    } finally {
      loading.value = false
    }
  }

  return {
    categoryList,
    loading,
    getCategoryList,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
