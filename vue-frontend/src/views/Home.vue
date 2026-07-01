<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h1>欢迎回来，{{ userStore.userInfo?.username || '用户' }}</h1>
      <p>这里是您的知识管理中心</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <el-icon :size="40" color="#409eff"><Document /></el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ stats.knowledgeCount }}</div>
            <div class="stat-label">知识点总数</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <el-icon :size="40" color="#67c23a"><Folder /></el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ stats.categoryCount }}</div>
            <div class="stat-label">分类数量</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <el-icon :size="40" color="#e6a23c"><PriceTag /></el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ stats.tagCount }}</div>
            <div class="stat-label">标签数量</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <el-icon :size="40" color="#f56c6c"><TrendCharts /></el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ stats.week新增 }}</div>
            <div class="stat-label">本周新增</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 最近知识点 -->
    <div class="section">
      <div class="section-header">
        <h2>最近知识点</h2>
        <el-button text type="primary" @click="$router.push('/knowledge/list')">
          查看全部 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      
      <div class="knowledge-grid" v-loading="knowledgeStore.loading">
        <el-card
          v-for="item in recentKnowledge"
          :key="item.id"
          class="knowledge-card"
          shadow="hover"
          @click="$router.push(`/knowledge/detail/${item.id}`)"
        >
          <template #header>
            <div class="card-header">
              <span class="title">{{ item.title }}</span>
            </div>
          </template>
          <div class="card-content">
            <p class="summary">{{ item.summary || '暂无摘要' }}</p>
            <div class="tags" v-if="item.tags && item.tags.length">
              <el-tag v-for="tag in item.tags" :key="tag.id" size="small">
                {{ tag.name }}
              </el-tag>
            </div>
            <div class="meta">
              <span class="category" v-if="item.category">
                <el-icon><Folder /></el-icon> {{ item.category.name }}
              </span>
              <span class="time">{{ formatDate(item.createTime) }}</span>
            </div>
          </div>
        </el-card>
        
        <el-empty v-if="!recentKnowledge.length && !knowledgeStore.loading" description="暂无知识点" />
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="section">
      <div class="section-header">
        <h2>快速操作</h2>
      </div>
      
      <div class="quick-actions">
        <el-card class="action-card" shadow="hover" @click="$router.push('/knowledge/create')">
          <el-icon :size="48" color="#409eff"><Plus /></el-icon>
          <span>新建知识点</span>
        </el-card>
        
        <el-card class="action-card" shadow="hover" @click="$router.push('/import')">
          <el-icon :size="48" color="#67c23a"><Upload /></el-icon>
          <span>导入文件</span>
        </el-card>
        
        <el-card class="action-card" shadow="hover" @click="$router.push('/graph')">
          <el-icon :size="48" color="#e6a23c"><DataLine /></el-icon>
          <span>知识图谱</span>
        </el-card>
        
        <el-card class="action-card" shadow="hover" @click="$router.push('/search')">
          <el-icon :size="48" color="#f56c6c"><Search /></el-icon>
          <span>搜索知识</span>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useKnowledgeStore } from '../stores/knowledge'
import { useCategoryStore } from '../stores/category'
import { useTagStore } from '../stores/tag'
import {
  Document, Folder, PriceTag, TrendCharts, Plus, Upload, DataLine, Search, ArrowRight
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const knowledgeStore = useKnowledgeStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()

const stats = ref({
  knowledgeCount: 0,
  categoryCount: 0,
  tagCount: 0,
  week新增: 0
})

const recentKnowledge = ref([])

onMounted(async () => {
  await loadData()
})

async function loadData() {
  try {
    // 获取统计数据
    const [knowledgeRes, categoryRes, tagRes] = await Promise.all([
      knowledgeStore.getKnowledgeList({ page: 1, pageSize: 5 }),
      categoryStore.getCategoryList(),
      tagStore.getTagList()
    ])
    
    recentKnowledge.value = knowledgeStore.knowledgeList
    stats.value = {
      knowledgeCount: knowledgeStore.total || 0,
      categoryCount: categoryStore.categoryList.length || 0,
      tagCount: tagStore.tagList.length || 0,
      week新增: 3 // TODO: 后端需要返回本周新增数
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 32px;
}

.welcome-section h1 {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.welcome-section p {
  font-size: 16px;
  color: #909399;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.stat-info {
  text-align: left;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.knowledge-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.knowledge-card:hover {
  transform: translateY(-4px);
}

.card-header .title {
  font-weight: 600;
  color: #303133;
}

.card-content .summary {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-content .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.card-content .meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.card-content .category {
  display: flex;
  align-items: center;
  gap: 4px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  cursor: pointer;
  transition: transform 0.3s;
}

.action-card:hover {
  transform: translateY(-4px);
}

.action-card span {
  font-size: 16px;
  color: #303133;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
