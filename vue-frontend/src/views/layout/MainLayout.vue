<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <router-link to="/home" class="logo">
          <el-icon :size="24"><Reading /></el-icon>
          <span class="logo-text">智识笔记</span>
        </router-link>
      </div>
      
      <div class="header-center">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索知识点..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      
      <div class="header-right">
        <el-button :icon="House" circle @click="$router.push('/home')" />
        <el-button :icon="Upload" circle @click="$router.push('/import')" />
        <el-button :icon="Setting" circle @click="$router.push('/settings')" />
        <el-dropdown @command="handleCommand">
          <el-avatar :size="32" class="user-avatar">
            {{ userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U' }}
          </el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="settings">个人设置</el-dropdown-item>
              <el-dropdown-item command="category">分类管理</el-dropdown-item>
              <el-dropdown-item command="tag">标签管理</el-dropdown-item>
              <el-dropdown-item command="help">帮助指南</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="main-container">
      <!-- 侧边栏 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <el-icon v-if="sidebarCollapsed"><DArrowRight /></el-icon>
          <el-icon v-else><DArrowLeft /></el-icon>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-title" v-if="!sidebarCollapsed">分类</div>
            <el-menu
              :default-active="$route.path"
              :collapse="sidebarCollapsed"
              @select="handleMenuSelect"
            >
              <el-menu-item index="/knowledge/list">
                <el-icon><Document /></el-icon>
                <template #title>全部知识点</template>
              </el-menu-item>
              
              <el-sub-menu
                v-for="category in categoryStore.categoryList"
                :key="category.id"
                :index="`category-${category.id}`"
              >
                <template #title>
                  <el-icon><Folder /></el-icon>
                  <span>{{ category.name }}</span>
                </template>
                <el-menu-item
                  v-for="child in category.children"
                  :key="child.id"
                  :index="`/knowledge/list?categoryId=${child.id}`"
                >
                  <el-icon><FolderOpened /></el-icon>
                  <span>{{ child.name }}</span>
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </div>
          
          <div class="nav-section quick-actions" v-if="!sidebarCollapsed">
            <div class="nav-title">快捷操作</div>
            <el-button type="primary" class="action-btn" @click="$router.push('/knowledge/create')">
              <el-icon><Plus /></el-icon>
              新建知识点
            </el-button>
            <el-button class="action-btn" @click="$router.push('/import')">
              <el-icon><Upload /></el-icon>
              导入文件
            </el-button>
            <el-button class="action-btn" @click="$router.push('/graph')">
              <el-icon><DataLine /></el-icon>
              知识图谱
            </el-button>
          </div>
        </nav>
      </aside>

      <!-- 内容区域 -->
      <main class="content">
        <router-view />
      </main>
    </div>

    <!-- 回到顶部按钮 -->
    <transition name="fade">
      <div v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
        <el-icon><Top /></el-icon>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useCategoryStore } from '../../stores/category'
import { ElMessage } from 'element-plus'
import {
  House, Upload, Setting, Search, Document, Folder, FolderOpened,
  Plus, DataLine, DArrowLeft, DArrowRight, Top, Reading
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const categoryStore = useCategoryStore()

const searchKeyword = ref('')
const sidebarCollapsed = ref(false)
const showBackToTop = ref(false)

onMounted(() => {
  userStore.getUserInfo()
  categoryStore.getCategoryList()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/search', query: { q: searchKeyword.value } })
  }
}

function handleMenuSelect(index) {
  if (index.startsWith('/')) {
    router.push(index)
  } else if (index.startsWith('category-')) {
    const categoryId = index.replace('category-', '')
    router.push(`/knowledge/list?categoryId=${categoryId}`)
  }
}

function handleCommand(command) {
  switch (command) {
    case 'settings':
      router.push('/settings')
      break
    case 'category':
      router.push('/category/manage')
      break
    case 'tag':
      router.push('/tag/manage')
      break
    case 'help':
      router.push('/help')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      ElMessage.success('已退出登录')
      break
  }
}

function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #409eff;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  margin-left: 8px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.search-input {
  width: 400px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: #409eff;
  cursor: pointer;
}

.main-container {
  display: flex;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
}

.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 20px;
  width: 24px;
  height: 24px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-title {
  padding: 8px 20px;
  font-size: 12px;
  color: #909399;
  text-transform: uppercase;
}

.quick-actions {
  padding: 0 16px;
}

.action-btn {
  width: 100%;
  margin-bottom: 8px;
}

.content {
  flex: 1;
  margin-left: 260px;
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 48px;
  height: 48px;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
