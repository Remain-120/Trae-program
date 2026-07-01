import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useTagStore = defineStore('tag', () => {
  const tagList = ref([])
  const loading = ref(false)

  // 获取标签列表
  async function getTagList() {
    loading.value = true
    try {
      const res = await api.get('/api/tag/list')
      tagList.value = res.data || []
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 创建标签
  async function createTag(data) {
    loading.value = true
    try {
      const res = await api.post('/api/tag/create', data)
      await getTagList()
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 更新标签
  async function updateTag(id, data) {
    loading.value = true
    try {
      const res = await api.put(`/api/tag/edit/${id}`, data)
      await getTagList()
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 删除标签
  async function deleteTag(id) {
    loading.value = true
    try {
      const res = await api.delete(`/api/tag/delete/${id}`)
      await getTagList()
      return res.data
    } finally {
      loading.value = false
    }
  }

  return {
    tagList,
    loading,
    getTagList,
    createTag,
    updateTag,
    deleteTag
  }
})
