<template>
  <div class="category-manage-container">
    <el-page-header @back="$router.push('/home')">
      <template #title>
        <span>返回</span>
      </template>
      <template #content>
        <span class="page-title">分类管理</span>
      </template>
    </el-page-header>

    <div class="manage-content">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新建分类
        </el-button>
      </div>

      <el-card v-loading="categoryStore.loading">
        <el-tree
          :data="treeData"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <span class="tree-node">
              <span class="node-label">
                <el-icon><Folder /></el-icon>
                {{ node.label }}
              </span>
              <span class="node-actions">
                <el-button link type="primary" size="small" @click.stop="handleEdit(data)">编辑</el-button>
                <el-button link type="primary" size="small" @click.stop="handleAddChild(data)">添加子分类</el-button>
                <el-button link type="danger" size="small" @click.stop="handleDelete(data)">删除</el-button>
              </span>
            </span>
          </template>
        </el-tree>
        
        <el-empty v-if="!treeData.length" description="暂无分类" />
      </el-card>
    </div>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新建分类'"
      width="400px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父分类" v-if="form.parentId">
          <el-select v-model="form.parentId" placeholder="选择父分类" style="width: 100%">
            <el-option
              v-for="cat in flatCategories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useCategoryStore } from '../../stores/category'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Folder } from '@element-plus/icons-vue'

const categoryStore = useCategoryStore()

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const currentNode = ref(null)

const form = reactive({
  id: null,
  name: '',
  parentId: null
})

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const treeData = computed(() => {
  return categoryStore.categoryList.filter(cat => !cat.parentId)
})

const flatCategories = computed(() => {
  const result = []
  function flatten(categories) {
    categories.forEach(cat => {
      result.push(cat)
      if (cat.children && cat.children.length) {
        flatten(cat.children)
      }
    })
  }
  flatten(categoryStore.categoryList)
  return result
})

onMounted(() => {
  categoryStore.getCategoryList()
})

function handleAdd() {
  isEdit.value = false
  form.id = null
  form.name = ''
  form.parentId = null
  dialogVisible.value = true
}

function handleAddChild(data) {
  isEdit.value = false
  form.id = null
  form.name = ''
  form.parentId = data.id
  dialogVisible.value = true
}

function handleEdit(data) {
  isEdit.value = true
  form.id = data.id
  form.name = data.name
  form.parentId = data.parentId || null
  dialogVisible.value = true
}

async function handleDelete(data) {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${data.name}"吗？${data.children?.length ? '该分类下的子分类也会被删除。' : ''}`,
      '提示',
      { type: 'warning' }
    )
    await categoryStore.deleteCategory(data.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await categoryStore.updateCategory(form.id, {
            name: form.name,
            parentId: form.parentId
          })
          ElMessage.success('更新成功')
        } else {
          await categoryStore.createCategory({
            name: form.name,
            parentId: form.parentId
          })
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      }
    }
  })
}
</script>

<style scoped>
.category-manage-container {
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

.toolbar {
  margin-bottom: 20px;
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding-right: 16px;
}

.node-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-actions {
  display: flex;
  gap: 8px;
}
</style>
