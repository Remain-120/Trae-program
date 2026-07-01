import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const knowledgeList = ref([])
  const currentKnowledge = ref(null)
  const total = ref(0)
  const loading = ref(false)

  // 获取知识点列表
  async function getKnowledgeList(params = {}) {
    loading.value = true
    try {
      const res = await api.get('/api/knowledge/list', { params })
      knowledgeList.value = res.data.list || []
      total.value = res.data.total || 0
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 获取知识点详情
  async function getKnowledgeDetail(id) {
    loading.value = true
    try {
      const res = await api.get(`/api/knowledge/detail/${id}`)
      currentKnowledge.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 创建知识点
  async function createKnowledge(data) {
    loading.value = true
    try {
      const res = await api.post('/api/knowledge/create', data)
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 更新知识点
  async function updateKnowledge(id, data) {
    loading.value = true
    try {
      const res = await api.put(`/api/knowledge/edit/${id}`, data)
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 删除知识点
  async function deleteKnowledge(id) {
    loading.value = true
    try {
      const res = await api.delete(`/api/knowledge/delete/${id}`)
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 批量删除
  async function batchDeleteKnowledge(ids) {
    loading.value = true
    try {
      const res = await api.post('/api/knowledge/batch-delete', { ids })
      return res.data
    } finally {
      loading.value = false
    }
  }

  // 搜索知识点
  async function searchKnowledge(keyword, filters = {}) {
    loading.value = true
    try {
      const res = await api.post('/api/knowledge/search', {
        keyword,
        ...filters
      })
      knowledgeList.value = res.data.list || []
      total.value = res.data.total || 0
      return res.data
    } finally {
      loading.value = false
    }
  }

  return {
    knowledgeList,
    currentKnowledge,
    total,
    loading,
    getKnowledgeList,
    getKnowledgeDetail,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge,
    batchDeleteKnowledge,
    searchKnowledge
  }
})
