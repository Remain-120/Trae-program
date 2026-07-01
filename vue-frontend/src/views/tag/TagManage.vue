<template>
  <div class="tag-manage-container">
    <el-page-header @back="$router.push('/home')">
      <template #title>
        <span>返回</span>
      </template>
      <template #content>
        <span class="page-title">标签管理</span>
      </template>
    </el-page-header>

    <div class="manage-content">
      <!-- 新建标签 -->
      <el-card class="add-card">
        <el-form :inline="true" :model="addForm" @submit.prevent="handleAdd">
          <el-form-item label="标签名称">
            <el-input v-model="addForm.name" placeholder="请输入标签名称" />
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="addForm.color" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">添加</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 标签列表 -->
      <el-card v-loading="tagStore.loading">
        <el-table :data="tagStore.tagList" style="width: 100%">
          <el-table-column prop="name" label="标签名称" min-width="150">
            <template #default="{ row }">
              <el-tag :color="row.color" effect="dark">
                {{ row.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="color" label="颜色" width="120">
            <template #default="{ row }">
              <span :style="{ color: row.color }">{{ row.color }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="knowledgeCount" label="关联知识点" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-empty v-if="!tagStore.tagList.length" description="暂无标签" />
      </el-card>
    </div>

    <!-- 编辑标签对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑标签" width="400px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="editForm.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="editForm.color" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useTagStore } from '../../stores/tag'
import { ElMessage, ElMessageBox } from 'element-plus'

const tagStore = useTagStore()

const addForm = reactive({
  name: '',
  color: '#409eff'
})

const editForm = reactive({
  id: null,
  name: '',
  color: ''
})

const dialogVisible = ref(false)

onMounted(() => {
  tagStore.getTagList()
})

async function handleAdd() {
  if (!addForm.name.trim()) {
    ElMessage.warning('请输入标签名称')
    return
  }
  
  try {
    await tagStore.createTag({
      name: addForm.name,
      color: addForm.color
    })
    ElMessage.success('添加成功')
    addForm.name = ''
    addForm.color = '#409eff'
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

function handleEdit(row) {
  editForm.id = row.id
  editForm.name = row.name
  editForm.color = row.color
  dialogVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定要删除标签"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    await tagStore.deleteTag(row.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

async function handleSubmit() {
  if (!editForm.name.trim()) {
    ElMessage.warning('请输入标签名称')
    return
  }
  
  try {
    await tagStore.updateTag(editForm.id, {
      name: editForm.name,
      color: editForm.color
    })
    ElMessage.success('更新成功')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}
</script>

<style scoped>
.tag-manage-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-weight: 600;
  color: #303133;
}

.manage-content {
  margin-top: 24px;
}

.add-card {
  margin-bottom: 20px;
}
</style>
