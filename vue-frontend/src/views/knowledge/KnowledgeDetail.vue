<template>
  <div class="knowledge-detail-container" v-loading="loading">
    <el-page-header @back="$router.push('/knowledge/list')">
      <template #title>
        <span>返回列表</span>
      </template>
      <template #content>
        <span class="page-title">知识点详情</span>
      </template>
    </el-page-header>

    <div class="detail-content" v-if="knowledge">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="title">{{ knowledge.title }}</h1>
        <div class="meta-info">
          <span class="category" v-if="knowledge.category">
            <el-icon><Folder /></el-icon>
            {{ knowledge.category.name }}
          </span>
          <span class="time">
            创建于 {{ formatDate(knowledge.createTime) }}
          </span>
          <span class="time" v-if="knowledge.updateTime">
            更新于 {{ formatDate(knowledge.updateTime) }}
          </span>
        </div>
        <div class="tags" v-if="knowledge.tags && knowledge.tags.length">
          <el-tag v-for="tag in knowledge.tags" :key="tag.id" size="small">
            {{ tag.name }}
          </el-tag>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <el-button type="primary" @click="$router.push(`/knowledge/edit/${knowledge.id}`)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </div>

      <!-- Markdown 内容 -->
      <div class="content-section">
        <div class="markdown-body" v-html="renderedContent"></div>
      </div>
    </div>

    <el-empty v-else description="知识点不存在" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKnowledgeStore } from '../../stores/knowledge'
import { marked } from 'marked'
import highlight from 'highlight.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Edit, Delete } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const knowledgeStore = useKnowledgeStore()

const loading = ref(false)
const knowledge = ref(null)

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && highlight.getLanguage(lang)) {
      return highlight.highlight(code, { language: lang }).value
    }
    return highlight.highlightAuto(code).value
  }
})

const renderedContent = computed(() => {
  if (!knowledge.value?.content) return ''
  return marked(knowledge.value.content)
})

onMounted(async () => {
  await loadKnowledge()
})

async function loadKnowledge() {
  loading.value = true
  try {
    const id = route.params.id
    knowledge.value = await knowledgeStore.getKnowledgeDetail(id)
  } catch (error) {
    ElMessage.error('加载知识点失败')
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm('确定要删除这个知识点吗？', '提示', {
      type: 'warning'
    })
    await knowledgeStore.deleteKnowledge(knowledge.value.id)
    ElMessage.success('删除成功')
    router.push('/knowledge/list')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}
</script>

<style scoped>
.knowledge-detail-container {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.page-title {
  font-weight: 600;
  color: #303133;
}

.detail-content {
  margin-top: 24px;
}

.header-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  line-height: 1.4;
}

.meta-info {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.meta-info .category {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.content-section {
  min-height: 300px;
}

.markdown-body {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.markdown-body :deep(h1) { font-size: 28px; }
.markdown-body :deep(h2) { font-size: 24px; }
.markdown-body :deep(h3) { font-size: 20px; }

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(code) {
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: Consolas, Monaco, monospace;
}

.markdown-body :deep(pre) {
  background: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  margin: 16px 0;
  color: #606266;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #ebeef5;
  padding: 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: #f5f7fa;
  font-weight: 600;
}
</style>
