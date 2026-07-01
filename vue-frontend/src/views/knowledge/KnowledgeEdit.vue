<template>
  <div class="knowledge-edit-container">
    <el-page-header @back="$router.push('/knowledge/list')">
      <template #title>
        <span>返回</span>
      </template>
      <template #content>
        <span class="page-title">{{ isEdit ? '编辑知识点' : '新建知识点' }}</span>
      </template>
    </el-page-header>

    <div class="edit-content">
      <!-- 基本信息 -->
      <el-card class="basic-info-card">
        <template #header>
          <span>基本信息</span>
        </template>
        
        <el-form :model="form" label-width="80px">
          <el-form-item label="标题" required>
            <el-input v-model="form.title" placeholder="请输入知识点标题" />
          </el-form-item>
          
          <el-form-item label="分类">
            <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%">
              <el-option
                v-for="cat in categoryStore.categoryList"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="标签">
            <el-select
              v-model="form.tagIds"
              multiple
              placeholder="选择标签"
              style="width: 100%"
              allow-create
              filterable
            >
              <el-option
                v-for="tag in tagStore.tagList"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 内容编辑 -->
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <span>内容</span>
            <div class="toolbar-actions">
              <el-button size="small" @click="insertMarkdown('**', '**')">粗体</el-button>
              <el-button size="small" @click="insertMarkdown('*', '*')">斜体</el-button>
              <el-button size="small" @click="insertMarkdown('`', '`')">行内代码</el-button>
              <el-button size="small" @click="insertMarkdown('\n```\n', '\n```')">代码块</el-button>
              <el-button size="small" @click="insertMarkdown('\n> ', '')">引用</el-button>
              <el-button size="small" @click="insertMarkdown('\n- ', '')">列表</el-button>
            </div>
          </div>
        </template>
        
        <div class="editor-container">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="20"
            placeholder="请输入 Markdown 内容..."
            class="markdown-editor"
            @keydown.tab.prevent="handleTab"
          />
          
          <div class="preview-container">
            <div class="preview-header">预览</div>
            <div class="markdown-body" v-html="renderedContent"></div>
          </div>
        </div>
      </el-card>

      <!-- 操作按钮 -->
      <div class="actions">
        <el-button @click="$router.push('/knowledge/list')">取消</el-button>
        <el-button @click="handleSaveAndNew" :loading="loading">保存并新建</el-button>
        <el-button type="primary" @click="handleSave" :loading="loading">
          {{ isEdit ? '保存修改' : '创建知识点' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKnowledgeStore } from '../../stores/knowledge'
import { useCategoryStore } from '../../stores/category'
import { useTagStore } from '../../stores/tag'
import { marked } from 'marked'
import highlight from 'highlight.js'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const knowledgeStore = useKnowledgeStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()

const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  categoryId: null,
  tagIds: [],
  content: ''
})

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
  if (!form.content) return '<p style="color: #909399">预览区域</p>'
  return marked(form.content)
})

onMounted(async () => {
  await Promise.all([
    categoryStore.getCategoryList(),
    tagStore.getTagList()
  ])
  
  if (isEdit.value) {
    await loadKnowledge()
  }
})

async function loadKnowledge() {
  try {
    const knowledge = await knowledgeStore.getKnowledgeDetail(route.params.id)
    form.title = knowledge.title
    form.categoryId = knowledge.category?.id || null
    form.tagIds = knowledge.tags?.map(t => t.id) || []
    form.content = knowledge.content || ''
  } catch (error) {
    ElMessage.error('加载知识点失败')
  }
}

function handleTab(e) {
  const textarea = e.target
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value
  
  form.content = value.substring(0, start) + '  ' + value.substring(end)
  
  // 设置光标位置
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 2
  }, 0)
}

function insertMarkdown(before, after) {
  const textarea = document.querySelector('.markdown-editor textarea')
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.content.substring(start, end)
  const value = form.content.substring(0, start) + before + selectedText + after + form.content.substring(end)
  
  form.content = value
  
  // 设置光标位置
  setTimeout(() => {
    if (selectedText) {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
    } else {
      textarea.selectionStart = textarea.selectionEnd = start + before.length
    }
    textarea.focus()
  }, 0)
}

async function handleSave() {
  if (!form.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  
  if (!form.content.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  loading.value = true
  try {
    const data = {
      title: form.title,
      content: form.content,
      categoryId: form.categoryId,
      tagIds: form.tagIds
    }
    
    if (isEdit.value) {
      await knowledgeStore.updateKnowledge(route.params.id, data)
      ElMessage.success('修改成功')
    } else {
      await knowledgeStore.createKnowledge(data)
      ElMessage.success('创建成功')
    }
    
    router.push('/knowledge/list')
  } catch (error) {
    ElMessage.error(isEdit.value ? '修改失败' : '创建失败')
  } finally {
    loading.value = false
  }
}

async function handleSaveAndNew() {
  if (!form.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  
  if (!form.content.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  loading.value = true
  try {
    const data = {
      title: form.title,
      content: form.content,
      categoryId: form.categoryId,
      tagIds: form.tagIds
    }
    
    await knowledgeStore.createKnowledge(data)
    ElMessage.success('创建成功')
    
    // 重置表单
    form.title = ''
    form.content = ''
    form.categoryId = null
    form.tagIds = []
  } catch (error) {
    ElMessage.error('创建失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.knowledge-edit-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-weight: 600;
  color: #303133;
}

.edit-content {
  margin-top: 24px;
}

.basic-info-card {
  margin-bottom: 20px;
}

.content-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.editor-container {
  display: flex;
  gap: 20px;
}

.markdown-editor {
  flex: 1;
}

.markdown-editor :deep(textarea) {
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
}

.preview-container {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: auto;
}

.preview-header {
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  font-size: 14px;
  color: #606266;
}

.markdown-body {
  padding: 16px;
  font-size: 14px;
  line-height: 1.8;
  min-height: 400px;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-top: 20px;
  margin-bottom: 12px;
}

.markdown-body :deep(p) {
  margin-bottom: 12px;
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
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
  }
  
  .toolbar-actions {
    display: none;
  }
}
</style>
