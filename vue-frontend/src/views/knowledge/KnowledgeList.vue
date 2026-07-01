<template>
  <div class="knowledge-list-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-select v-model="viewMode" placeholder="视图" style="width: 120px">
          <template #prefix><el-icon><Grid /></el-icon></template>
          <el-option label="卡片视图" value="card" />
          <el-option label="列表视图" value="list" />
        </el-select>
        
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
      </div>
      
      <div class="toolbar-right">
        <el-button type="primary" @click="$router.push('/knowledge/create')">
          <el-icon><Plus /></el-icon>
          新建知识点
        </el-button>
      </div>
    </div>

    <!-- 批量操作 -->
    <div class="batch-actions" v-if="selectedIds.length > 0">
      <span>已选择 {{ selectedIds.length }} 项</span>
      <el-button size="small" @click="handleBatchDelete">批量删除</el-button>
      <el-button size="small" @click="handleBatchMove">移动到分类</el-button>
      <el-button size="small" text @click="selectedIds = []">取消</el-button>
    </div>

    <!-- 卡片视图 -->
    <div v-if="viewMode === 'card'" v-loading="knowledgeStore.loading">
      <div class="knowledge-grid">
        <el-card
          v-for="item in knowledgeStore.knowledgeList"
          :key="item.id"
          class="knowledge-card"
          shadow="hover"
          @click="$router.push(`/knowledge/detail/${item.id}`)"
        >
          <template #header>
            <div class="card-header">
              <el-checkbox
                v-model="item.selected"
                @click.stop
                @change="handleSelect(item)"
              />
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
      </div>
      
      <el-empty v-if="!knowledgeStore.knowledgeList.length && !knowledgeStore.loading" description="暂无知识点" />
    </div>

    <!-- 列表视图 -->
    <div v-else v-loading="knowledgeStore.loading">
      <el-table :data="knowledgeStore.knowledgeList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category.name" label="分类" width="120" />
        <el-table-column label="标签" width="200">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag.id" size="small" style="margin-right: 4px">
              {{ tag.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="$router.push(`/knowledge/edit/${row.id}`)">编辑</el-button>
            <el-button link type="danger" @click.stop="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="!knowledgeStore.knowledgeList.length && !knowledgeStore.loading" description="暂无知识点" />
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="knowledgeStore.total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="knowledgeStore.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useKnowledgeStore } from '../../stores/knowledge'
import { useCategoryStore } from '../../stores/category'
import { useTagStore } from '../../stores/tag'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Folder, Grid } from '@element-plus/icons-vue'

const route = useRoute()
const knowledgeStore = useKnowledgeStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()

const viewMode = ref('card')
const filterCategory = ref(null)
const filterTag = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
const selectedIds = ref([])

onMounted(async () => {
  await Promise.all([
    categoryStore.getCategoryList(),
    tagStore.getTagList()
  ])
  
  // 检查 URL 参数
  if (route.query.categoryId) {
    filterCategory.value = parseInt(route.query.categoryId)
  }
  
  loadKnowledgeList()
})

watch([filterCategory, filterTag, currentPage, pageSize], () => {
  loadKnowledgeList()
})

async function loadKnowledgeList() {
  await knowledgeStore.getKnowledgeList({
    page: currentPage.value,
    pageSize: pageSize.value,
    categoryId: filterCategory.value,
    tagId: filterTag.value
  })
}

function handleSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.id)
}

function handleSelect(item) {
  if (item.selected) {
    selectedIds.value.push(item.id)
  } else {
    selectedIds.value = selectedIds.value.filter(id => id !== item.id)
  }
}

async function handleDelete(id) {
  try {
    await ElMessageBox.confirm('确定要删除这个知识点吗？', '提示', {
      type: 'warning'
    })
    await knowledgeStore.deleteKnowledge(id)
    ElMessage.success('删除成功')
    loadKnowledgeList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个知识点吗？`, '提示', {
      type: 'warning'
    })
    await knowledgeStore.batchDeleteKnowledge(selectedIds.value)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    loadKnowledgeList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

function handleBatchMove() {
  // TODO: 实现批量移动
  ElMessage.info('功能开发中')
}

function handlePageChange(page) {
  currentPage.value = page
}

function handleSizeChange(size) {
  pageSize.value = size
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.knowledge-list-container {
  max-width: 1400px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #ecf5ff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.batch-actions span {
  color: #409eff;
  font-weight: 500;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.knowledge-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.knowledge-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header .title {
  font-weight: 600;
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
