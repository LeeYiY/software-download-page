<template>
  <div id="app-root">
    <!-- 头部 -->
    <header class="header">
      <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
        <router-link to="/" class="logo" style="text-decoration: none; color: #fff;">
          📦 软件下载站
          <small>安全 · 快速 · 精选</small>
        </router-link>
        <router-link to="/admin" class="admin-btn">
          <el-icon><Tools /></el-icon>
          管理后台
        </router-link>
      </div>
    </header>

    <!-- 分类导航 -->
    <div class="category-nav" v-if="softwareList.length">
      <div class="container">
        <el-menu
          :default-active="activeCategory"
          mode="horizontal"
          @select="handleCategorySelect"
          style="display: flex;"
        >
          <el-menu-item index="all">
            <el-icon><List /></el-icon>
            全部
          </el-menu-item>
          <el-menu-item
            v-for="cat in categories"
            :key="cat.value"
            :index="cat.value"
          >
            <el-icon><component :is="cat.icon" /></el-icon>
            {{ cat.label }}
          </el-menu-item>
        </el-menu>
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="container">
        <router-view
          :softwareList="softwareList"
          :categories="categories"
          :loading="loading"
        />
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>© 2026 软件下载站 · 仅供学习交流使用 · 请支持正版软件</p>
      </div>
    </footer>

    <el-backtop :right="30" :bottom="80" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/utils/api'
import { List, Monitor, OfficeBuilding, VideoCamera, Tools, ChromeFilled, Plus } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const softwareList = ref([])
const loading = ref(true)

const categories = [
  { value: 'dev', label: '开发工具', icon: Monitor },
  { value: 'office', label: '办公效率', icon: OfficeBuilding },
  { value: 'media', label: '媒体工具', icon: VideoCamera },
  { value: 'web', label: '网络工具', icon: ChromeFilled },
  { value: 'sys', label: '系统工具', icon: Tools }
]

const activeCategory = computed(() => {
  if (route.name === 'Category' && route.params.cat) {
    return route.params.cat
  }
  return 'all'
})

function handleCategorySelect(index) {
  if (index === 'all') {
    router.push('/')
  } else {
    router.push(`/category/${index}`)
  }
}

onMounted(async () => {
  try {
    softwareList.value = await api.getSoftwareList()
  } catch (e) {
    console.error('数据加载失败:', e)
    softwareList.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

.main-content {
  min-height: calc(100vh - 160px);
  padding-bottom: 40px;
}

.footer {
  text-align: center;
  padding: 20px 0;
  color: #909399;
  font-size: 13px;
  border-top: 1px solid #e4e7ed;
  background: #fff;
}

.admin-btn {
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s;
}

.admin-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #fff;
}
</style>