<template>
  <div class="import-container">
    <el-page-header @back="$router.push('/home')">
      <template #title>
        <span>返回</span>
      </template>
      <template #content>
        <span class="page-title">文件导入</span>
      </template>
    </el-page-header>

    <div class="import-content">
      <!-- 步骤指示器 -->
      <el-steps :active="currentStep" align-center class="steps">
        <el-step title="上传文件" />
        <el-step title="AI提取" />
        <el-step title="校正保存" />
      </el-steps>

      <!-- 步骤1：上传文件 -->
      <el-card v-if="currentStep === 0" class="step-card">
        <template #header>
          <span>第一步：上传文件</span>
        </template>
        
        <el-upload
          ref="uploadRef"
          class="upload-area"
          drag
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp"
        >
          <el-icon class="upload-icon"><UploadFilled /></el-icon>
          <div class="upload-text">
            <span>拖拽文件到此处，或 <em>点击上传</em></span>
            <span class="upload-hint">支持 PDF、Word、TXT、图片格式</span>
          </div>
        </el-upload>
        
        <div class="upload-actions">
          <el-button type="primary" :disabled="!file" @click="handleUpload">
            开始上传
          </el-button>
        </div>
      </el-card>

      <!-- 步骤2：AI提取 -->
      <el-card v-if="currentStep === 1" class="step-card" v-loading="extracting">
        <template #header>
          <span>第二步：AI提取知识点</span>
        </template>
        
        <div class="extracting-status" v-if="extracting">
          <el-icon class="is-loading" :size="48"><Loading /></el-icon>
          <p>正在使用 AI 分析文件内容...</p>
          <p class="hint">请稍候，这可能需要几秒钟时间</p>
        </div>
        
        <div class="uploaded-file" v-else>
          <el-icon size="48" color="#67c23a"><Document /></el-icon>
          <span>{{ uploadedFileName }}</span>
        </div>
      </el-card>

      <!-- 步骤3：校正保存 -->
      <el-card v-if="currentStep === 2" class="step-card">
        <template #header>
          <span>第三步：校正并保存</span>
        </template>
        
        <div class="extracted-results">
          <div
            v-for="(item, index) in extractedKnowledge"
            :key="index"
            class="result-item"
          >
            <el-input v-model="item.title" placeholder="知识点标题" />
            <el-input
              v-model="item.content"
              type="textarea"
              :rows="4"
              placeholder="知识点内容"
            />
            <div class="result-tags">
              <el-tag
                v-for="(tag, tagIndex) in item.tags"
                :key="tagIndex"
                closable
                @close="removeTag(index, tagIndex)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-model="item.newTag"
                placeholder="添加标签"
                size="small"
                style="width: 100px"
                @keyup.enter="addTag(index)"
              />
            </div>
          </div>
          
          <el-empty v-if="!extractedKnowledge.length" description="未提取到知识点" />
        </div>
        
        <div class="save-options">
          <el-form-item label="保存到分类">
            <el-select v-model="selectedCategoryId" placeholder="选择分类" style="width: 100%">
              <el-option
                v-for="cat in categoryStore.categoryList"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
              />
            </el-select>
          </el-form-item>
        </div>
        
        <div class="save-actions">
          <el-button @click="handleReset">重新上传</el-button>
          <el-button type="primary" :loading="saving" @click="handleSave">
            确认保存
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../stores/category'
import api from '../api'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document, Loading } from '@element-plus/icons-vue'

const router = useRouter()
const categoryStore = useCategoryStore()

const currentStep = ref(0)
const extracting = ref(false)
const saving = ref(false)
const file = ref(null)
const uploadedFileName = ref('')
const selectedCategoryId = ref(null)
const extractedKnowledge = ref([])

onMounted(() => {
  categoryStore.getCategoryList()
})

function handleFileChange(fileItem) {
  file.value = fileItem.raw
  uploadedFileName.value = fileItem.name
}

function handleFileRemove() {
  file.value = null
}

async function handleUpload() {
  if (!file.value) {
    ElMessage.warning('请先选择文件')
    return
  }
  
  currentStep.value = 1
  extracting.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', file.value)
    
    // 调用后端 API 进行文件解析和 AI 提取
    const res = await api.post('/api/import/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (res.data && res.data.length) {
      extractedKnowledge.value = res.data.map(item => ({
        title: item.title || '',
        content: item.content || '',
        tags: item.tags || [],
        newTag: ''
      }))
      currentStep.value = 2
    } else {
      ElMessage.warning('未提取到知识点，请尝试其他文件')
      currentStep.value = 0
    }
  } catch (error) {
    console.error('AI 提取失败:', error)
    ElMessage.error('文件处理失败，请重试')
    currentStep.value = 0
  } finally {
    extracting.value = false
  }
}

function addTag(index) {
  const tag = extractedKnowledge.value[index].newTag.trim()
  if (tag && !extractedKnowledge.value[index].tags.includes(tag)) {
    extractedKnowledge.value[index].tags.push(tag)
  }
  extractedKnowledge.value[index].newTag = ''
}

function removeTag(itemIndex, tagIndex) {
  extractedKnowledge.value[itemIndex].tags.splice(tagIndex, 1)
}

async function handleSave() {
  if (!extractedKnowledge.value.length) {
    ElMessage.warning('没有可保存的知识点')
    return
  }
  
  saving.value = true
  try {
    await api.post('/api/import/save', {
      categoryId: selectedCategoryId.value,
      knowledgeList: extractedKnowledge.value
    })
    
    ElMessage.success('保存成功')
    router.push('/knowledge/list')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

function handleReset() {
  currentStep.value = 0
  file.value = null
  uploadedFileName.value = ''
  extractedKnowledge.value = []
}
</script>

<style scoped>
.import-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-weight: 600;
  color: #303133;
}

.import-content {
  margin-top: 32px;
}

.steps {
  margin-bottom: 32px;
}

.step-card {
  min-height: 300px;
}

.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 67px;
  color: #409eff;
  margin-bottom: 16px;
}

.upload-text {
  text-align: center;
}

.upload-text em {
  color: #409eff;
  font-style: normal;
}

.upload-hint {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.upload-actions {
  margin-top: 24px;
  text-align: center;
}

.extracting-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.extracting-status p {
  margin-top: 16px;
  font-size: 16px;
  color: #303133;
}

.extracting-status .hint {
  font-size: 14px;
  color: #909399;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: #f5f7fa;
  border-radius: 8px;
}

.extracted-results {
  margin-bottom: 24px;
}

.result-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 16px;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.save-options {
  margin-bottom: 24px;
}

.save-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
