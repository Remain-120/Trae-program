<template>
  <div class="settings-container">
    <el-page-header @back="$router.push('/home')">
      <template #title>
        <span>返回</span>
      </template>
      <template #content>
        <span class="page-title">个人设置</span>
      </template>
    </el-page-header>

    <div class="settings-content">
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="profile">
          <el-card>
            <template #header>
              <span>基本信息</span>
            </template>
            
            <div class="avatar-section">
              <el-avatar :size="80" class="avatar">
                {{ userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U' }}
              </el-avatar>
              <el-upload
                class="avatar-upload"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleAvatarChange"
              >
                <el-button size="small">更换头像</el-button>
              </el-upload>
            </div>
            
            <el-form :model="profileForm" label-width="80px" style="max-width: 500px">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="savingProfile" @click="handleSaveProfile">
                  保存修改
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 密码修改 -->
        <el-tab-pane label="密码修改" name="password">
          <el-card>
            <template #header>
              <span>密码修改</span>
            </template>
            
            <el-form :model="passwordForm" :rules="passwordRules" label-width="100px" style="max-width: 500px">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="passwordForm.oldPassword" type="password" show-password />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" type="password" show-password />
              </el-form-item>
              <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="changingPassword" @click="handleChangePassword">
                  修改密码
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 使用偏好 -->
        <el-tab-pane label="使用偏好" name="preferences">
          <el-card>
            <template #header>
              <span>使用偏好</span>
            </template>
            
            <el-form label-width="100px" style="max-width: 500px">
              <el-form-item label="默认视图">
                <el-radio-group v-model="preferences.defaultView">
                  <el-radio label="card">卡片视图</el-radio>
                  <el-radio label="list">列表视图</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="主题模式">
                <el-radio-group v-model="preferences.theme">
                  <el-radio label="light">浅色模式</el-radio>
                  <el-radio label="dark">深色模式</el-radio>
                  <el-radio label="auto">跟随系统</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSavePreferences">
                  保存偏好
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const activeTab = ref('profile')
const savingProfile = ref(false)
const changingPassword = ref(false)

const profileForm = reactive({
  username: '',
  email: '',
  nickname: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferences = reactive({
  defaultView: 'card',
  theme: 'light'
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

onMounted(() => {
  if (userStore.userInfo) {
    profileForm.username = userStore.userInfo.username || ''
    profileForm.email = userStore.userInfo.email || ''
    profileForm.nickname = userStore.userInfo.nickname || ''
  }
  
  // 加载偏好设置
  const savedPrefs = localStorage.getItem('userPreferences')
  if (savedPrefs) {
    Object.assign(preferences, JSON.parse(savedPrefs))
  }
})

function handleAvatarChange(file) {
  // TODO: 实现头像上传
  ElMessage.info('头像上传功能开发中')
}

async function handleSaveProfile() {
  savingProfile.value = true
  try {
    await userStore.updateUserInfo({
      email: profileForm.email,
      nickname: profileForm.nickname
    })
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    savingProfile.value = false
  }
}

async function handleChangePassword() {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  
  changingPassword.value = true
  try {
    await userStore.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    ElMessage.error(error.message || '密码修改失败')
  } finally {
    changingPassword.value = false
  }
}

function handleSavePreferences() {
  localStorage.setItem('userPreferences', JSON.stringify(preferences))
  ElMessage.success('偏好设置已保存')
}
</script>

<style scoped>
.settings-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-weight: 600;
  color: #303133;
}

.settings-content {
  margin-top: 24px;
}

.settings-tabs {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.avatar {
  background: #409eff;
  font-size: 32px;
}
</style>
