<template>
  <div class="search-container">
    <div class="search-header">
      <el-input
        v-model="keyword"
        placeholder="搜索知识点..."
        size="large"
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      
      <div class="search-filters">
        <el-select v-model="filterCategory" placeholder="全部分类" clearable style="width: 150px">
          <el-option
            v-for="cat in categoryStore.categoryList"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
        
        <el-select v-model="filterTag" placeholder="全部标签" clearable style="width: 150px">
          <el-option
            v-for="tag in tagStore.tagList"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
        
        <el-select v-model="sortBy" style="width: 120px">
          <el-option label="相关度" value="relevance" />
          <el-option label="创建时间" value="createTime" />
          <el-option label="更新时间" value="updateTime" />
        </el-select>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="!keyword && searchHistory.length">
      <div class="history-header">
        <span>搜索历史</span>
        <el-button text size="small" @click="clearHistory">清除</el-button>
      </div>
      <div class="history-tags">
        <el-tag
          v-for="(history, index) in searchHistory"
          :key="index"
          class="history-tag"
          @click="keyword = history; handleSearch()"
        >
          {{ history }}
        </el-tag>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results" v-loading="loading">
      <div class="results-header" v-if="keyword">
        <span>找到 {{ total }} 条与 "<em>{{ keyword }}</em>" 相关的结果</span>
      </div>
      
      <div class="results-list" v-if="results.length">
        <div
          v-for="item in results"
          :key="item.id"
          class="result-item"
          @click="$router.push(`/knowledge/detail/${item.id}`)"
        >
          <h3 class="result-title" v-html="highlightKeyword(item.title)"></h3>
          <p class="result-summary" v-html="highlightKeyword(item.summary || item.content?.substring(0, 200))"></p>
          <div class="result-meta">
            <span class="category" v-if="item.category">
              <el-icon><Folder /></el-icon> {{ item.category.name }}
            </span>
            <div class="tags">
              <el-tag v-for="tag in item.tags" :key="tag.id" size="small">
                {{ tag.name }}
              </el-tag>
            </div>
            <span class="time">{{ formatDate(item.createTime) }}</span>
          </div>
        </div>
      </div>
      
      <el-empty v-else-if="keyword && !loading" description="未找到相关知识点" />
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoryStore } from '../../stores/category'
import { useTagStore } from '../../stores/tag'
import { useKnowledgeStore } from '../../stores/knowledge'
import { ElMessage } from 'element-plus'
import { Search, Folder } from '@element-plus/icons-vue'

const route = useRoute()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()
const knowledgeStore = useKnowledgeStore()

const keyword = ref('')
const filterCategory = ref(null)
const filterTag = ref(null)
const sortBy = ref('relevance')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const results = ref([])
const loading = ref(false)
const searchHistory = ref([])

onMounted(async () => {
  await Promise.all([
    categoryStore.getCategoryList(),
    tagStore.getTagList()
  ])
  
  // 加载搜索历史
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
  
  // 检查 URL 参数
  if (route.query.q) {
    keyword.value = route.query.q
    handleSearch()
  }
})

watch([keyword], () => {
  if (!keyword.value) {
    results.value = []
    total.value = 0
  }
})

async function handleSearch() {
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  loading.value = true
  currentPage.value = 1
  
  try {
    // 保存搜索历史
    if (!searchHistory.value.includes(keyword.value)) {
      searchHistory.value.unshift(keyword.value)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }
    
    await knowledgeStore.searchKnowledge(keyword.value, {
      categoryId: filterCategory.value,
      tagId: filterTag.value,
      sortBy: sortBy.value,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
    results.value = knowledgeStore.knowledgeList
    total.value = knowledgeStore.total
  } catch (error) {
    ElMessage.error('搜索失败')
  } finally {
    loading.value = false
  }
}

async function handlePageChange(page) {
  loading.value = true
  try {
    await knowledgeStore.searchKnowledge(keyword.value, {
      categoryId: filterCategory.value,
      tagId: filterTag.value,
      sortBy: sortBy.value,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    results.value = knowledgeStore.knowledgeList
  } finally {
    loading.value = false
  }
}

function clearHistory() {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

function highlightKeyword(text) {
  if (!text || !keyword.value) return text
  const regex = new RegExp(`(${keyword.value})`, 'gi')
  return text.replace(regex, '<em class="highlight">$1</em>')
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.search-container {
  max-width: 900px;
  margin: 0 auto;
}

.search-header {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.search-input {
  margin-bottom: 16px;
}

.search-filters {
  display: flex;
  gap: 12px;
}

.search-history {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #606266;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  cursor: pointer;
}

.search-results {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-height: 300px;
}

.results-header {
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
}

.results-header em {
  color: #409eff;
  font-style: normal;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.result-title :deep(.highlight) {
  color: #409eff;
  background: #ecf5ff;
}

.result-summary {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-summary :deep(.highlight) {
  color: #409eff;
  background: #ecf5ff;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.result-meta .category {
  display: flex;
  align-items: center;
  gap: 4px;
}

.result-meta .tags {
  display: flex;
  gap: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
