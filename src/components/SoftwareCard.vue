<template>
  <el-card
    class="software-card"
    shadow="hover"
    @click="goDetail"
  >
    <div class="card-body">
      <div class="card-icon">{{ software.icon || '📦' }}</div>
      <div class="card-name">{{ software.name }}</div>
      <div class="card-meta">v{{ software.version }} · {{ software.size }}</div>
      <div class="card-tags">
        <el-tag
          v-for="tag in software.tags"
          :key="tag"
          size="small"
          :type="getTagType(tag)"
          effect="plain"
          @click.stop="handleTagClick(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>
      <el-rate
        v-model="displayRating"
        disabled
        show-score
        text-color="#ff9900"
        score-template=""
        size="small"
        style="margin-bottom: 8px;"
      />
      <div class="card-footer">
        <el-button type="primary" size="small" round @click.stop="goDetail">
          查看下载
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  software: { type: Object, required: true }
})

const router = useRouter()

const displayRating = computed(() => props.software.rating)

const tagColors = ['primary', 'success', 'warning', 'info', 'danger']
let tagIndex = 0

function getTagType(tag) {
  // 根据标签字符串生成固定颜色
  const hash = tag.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return tagColors[hash % tagColors.length]
}

function goDetail() {
  router.push(`/software/${props.software.id}`)
}

function handleTagClick(tag) {
  router.push({ query: { tag } })
}
</script>