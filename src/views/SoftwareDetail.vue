<template>
  <div class="detail-page">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="software" :to="{ path: `/category/${software.category}` }">
        {{ software.categoryName }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="software">{{ software.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 未找到 -->
    <div v-if="!software && !loading" class="empty-state">
      <el-empty description="未找到该软件" />
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="empty-state">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 详情内容 -->
    <template v-if="software">
      <!-- 基本信息 -->
      <div class="detail-header">
        <div class="detail-icon">{{ software.icon || '📦' }}</div>
        <div class="detail-info">
          <h1>
            {{ software.name }}
            <el-rate
              v-model="software.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
              style="display: inline-flex;"
            />
          </h1>
          <div class="detail-meta">
            <span>版本: <strong>{{ software.version }}</strong></span>
            <span>大小: <strong>{{ software.size }}</strong></span>
            <span>平台: <strong>{{ software.platform }}</strong></span>
            <span>许可证: <strong>{{ software.license }}</strong></span>
            <span>下载量: <strong>{{ formatNumber(software.downloads) }}</strong></span>
          </div>
          <div class="detail-tags">
            <el-tag
              v-for="tag in software.tags"
              :key="tag"
              size="small"
              effect="plain"
              :type="tagType(tag)"
              style="cursor: pointer;"
              @click="goCategory(software.category)"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div style="font-size: 14px; color: #606266; margin-top: 6px;">
            {{ software.description }}
          </div>
        </div>
      </div>

      <!-- 软件介绍 -->
      <div class="detail-section">
        <h3>
          <el-icon><InfoFilled /></el-icon>
          软件介绍
        </h3>
        <p>{{ software.fullDescription }}</p>
        <div v-if="software.homepage" style="margin-top: 12px;">
          <el-link :href="software.homepage" type="primary" target="_blank">
            访问官网 <el-icon><TopRight /></el-icon>
          </el-link>
        </div>
      </div>

      <!-- 预览图片 -->
      <div v-if="software.imageUrl" class="detail-section">
        <h3>
          <el-icon><Picture /></el-icon>
          预览图
        </h3>
        <el-image
          :src="software.imageUrl"
          :preview-src-list="[software.imageUrl]"
          fit="contain"
          style="max-width: 100%; max-height: 400px; border-radius: 4px;"
        >
          <template #error>
            <div style="padding: 40px; text-align: center; color: #909399;">
              图片加载失败
            </div>
          </template>
        </el-image>
      </div>

      <!-- 下载链接 -->
      <div class="detail-section">
        <h3>
          <el-icon><Download /></el-icon>
          下载链接
        </h3>
        <DownloadLinks :links="software.downloadLinks" />
      </div>

      <!-- 版本历史 -->
      <div class="detail-section">
        <h3>
          <el-icon><Clock /></el-icon>
          版本历史
        </h3>
        <VersionHistory :history="software.versionHistory" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/utils/api'
import DownloadLinks from '@/components/DownloadLinks.vue'
import VersionHistory from '@/components/VersionHistory.vue'
import {
  ArrowRight,
  InfoFilled,
  Picture,
  Download,
  Clock,
  TopRight
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const software = ref(null)

const tagColors = ['primary', 'success', 'warning', 'info', 'danger']

function tagType(tag) {
  const hash = tag.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return tagColors[hash % tagColors.length]
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

function goCategory(cat) {
  router.push(`/category/${cat}`)
}

onMounted(async () => {
  try {
    const id = parseInt(route.params.id)
    software.value = await api.getSoftwareDetail(id)
  } catch (e) {
    console.error('数据加载失败:', e)
    software.value = null
  } finally {
    loading.value = false
  }
})
</script>