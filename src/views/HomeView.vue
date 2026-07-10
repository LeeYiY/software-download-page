<template>
  <div>
    <!-- 搜索 + 排序 + 标签筛选栏 -->
    <div class="filter-bar">
      <el-row :gutter="16" align="middle">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索软件名称..."
            :prefix-icon="Search"
            clearable
            class="search-box"
          />
        </el-col>
        <el-col :xs="12" :sm="6" :md="4">
          <el-select v-model="sortBy" placeholder="排序方式" size="default" style="width: 100%;">
            <el-option label="推荐优先" value="featured" />
            <el-option label="下载量最多" value="downloads" />
            <el-option label="评分最高" value="rating" />
          </el-select>
        </el-col>
      </el-row>

      <!-- 当前分类标签显示 -->
      <div v-if="activeTag || currentCategory" class="active-tags">
        <span class="label">当前筛选:</span>
        <el-tag
          v-if="currentCategory"
          closable
          @close="clearCategory"
          type="primary"
        >
          分类: {{ categoryLabel }}
        </el-tag>
        <el-tag
          v-if="activeTag"
          closable
          @close="clearTag"
          type="success"
        >
          标签: {{ activeTag }}
        </el-tag>
        <el-button
          v-if="activeTag || currentCategory"
          link
          type="info"
          size="small"
          @click="clearAll"
        >
          清空全部
        </el-button>
      </div>

      <!-- 标签筛选 -->
      <div v-if="currentTags.length" class="tag-filter-row">
        <span class="label">标签:</span>
        <div
          v-for="tag in currentTags"
          :key="tag"
          class="tag-pill"
          :class="{ active: activeTag === tag }"
          :style="pillStyle(tagCounts[tag])"
          @click="toggleTag(tag)"
        >
          <span class="tag-name">{{ tag }}</span>
          <span class="tag-count" :class="countClass(tagCounts[tag])">{{ tagCounts[tag] }}</span>
        </div>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="empty-state">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 软件卡片网格 -->
    <div v-else class="card-grid">
      <el-row :gutter="20">
        <el-col
          v-for="sw in filteredSoftware"
          :key="sw.id"
          :xl="6"
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
          style="margin-bottom: 20px;"
        >
          <SoftwareCard :software="sw" />
        </el-col>
      </el-row>

      <!-- 空结果 -->
      <div v-if="!filteredSoftware.length" class="empty-state">
        <el-empty description="没有找到匹配的软件" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import SoftwareCard from '@/components/SoftwareCard.vue'

const props = defineProps({
  softwareList: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const sortBy = ref('featured')
const activeTag = ref('')

// 当前分类 - 来自路由参数
const currentCategory = computed(() => {
  if (route.name === 'Category' && route.params.cat) {
    return route.params.cat
  }
  return ''
})

const categoryLabel = computed(() => {
  const cat = props.categories.find(c => c.value === currentCategory.value)
  return cat ? cat.label : currentCategory.value
})

// 获取当前分类下的所有标签
const currentTags = computed(() => {
  const list = currentCategory.value
    ? props.softwareList.filter(s => s.category === currentCategory.value)
    : props.softwareList
  const tags = new Set()
  list.forEach(s => s.tags.forEach(t => tags.add(t)))
  return [...tags].sort()
})

// 标签对应软件数量统计
const tagCounts = computed(() => {
  const counts = {}
  const list = currentCategory.value
    ? props.softwareList.filter(s => s.category === currentCategory.value)
    : props.softwareList
  list.forEach(s => {
    s.tags.forEach(t => {
      counts[t] = (counts[t] || 0) + 1
    })
  })
  return counts
})

// 筛选 + 排序
const filteredSoftware = computed(() => {
  let list = [...props.softwareList]

  // 分类筛选
  if (currentCategory.value) {
    list = list.filter(s => s.category === currentCategory.value)
  }

  // 标签筛选
  if (activeTag.value) {
    list = list.filter(s => s.tags.includes(activeTag.value))
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    )
  }

  // 排序
  if (sortBy.value === 'featured') {
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  } else if (sortBy.value === 'downloads') {
    list.sort((a, b) => b.downloads - a.downloads)
  } else if (sortBy.value === 'rating') {
    list.sort((a, b) => b.rating - a.rating)
  }

  return list
})

// 检测 URL query 中的 tag
watch(() => route.query.tag, (newTag) => {
  if (newTag) {
    activeTag.value = newTag
  }
}, { immediate: true })

function toggleTag(tag) {
  if (activeTag.value === tag) {
    activeTag.value = ''
  } else {
    activeTag.value = tag
  }
}

// 标签 pill 背景色根据数量变化
function pillStyle(count) {
  const opacity = Math.min(0.08 + count * 0.04, 0.35)
  return { backgroundColor: `rgba(64, 158, 255, ${opacity})` }
}

// 角标颜色/大小根据数量变化
function countClass(count) {
  if (count >= 6) return 'count-high'
  if (count >= 3) return 'count-mid'
  return 'count-low'
}

function clearTag() {
  activeTag.value = ''
}

function clearCategory() {
  router.push('/')
}

function clearAll() {
  activeTag.value = ''
  searchQuery.value = ''
  router.push('/')
}
</script>