<template>
  <div class="download-links">
    <div v-for="(link, idx) in links" :key="idx" class="download-row">
      <div class="dl-info">
        <div class="dl-name">
          {{ link.name }}
          <el-tag
            :type="link.type === 'direct' ? 'success' : 'warning'"
            size="small"
            effect="plain"
          >
            {{ link.type === 'direct' ? '直链' : '网盘' }}
          </el-tag>
        </div>
        <div class="dl-desc">{{ link.description || '' }}</div>
      </div>
      <div class="dl-actions">
        <!-- 有密码时显示密码复制 -->
        <div v-if="link.password" class="password-tag">
          <el-tag type="danger" size="small">
            密码: {{ link.password }}
          </el-tag>
          <el-button
            size="small"
            circle
            type="warning"
            :icon="CopiedIcon"
            @click="copyPassword(link.password)"
          />
        </div>
        <!-- 复制链接按钮 -->
        <el-tooltip
          :content="copiedLinkIdx === idx ? '已复制!' : '复制链接'"
          placement="top"
          :show-after="100"
        >
          <el-button
            size="small"
            circle
            :icon="LinkIcon"
            @click="copyUrl(link.url, idx)"
          />
        </el-tooltip>
        <!-- 跳转按钮 -->
        <el-button
          size="small"
          type="primary"
          @click="openUrl(link.url)"
        >
          前往下载
        </el-button>
      </div>
    </div>
    <div v-if="!links.length" style="color: #909399; padding: 16px; text-align: center;">
      暂无下载链接
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { copyToClipboard } from '@/utils/clipboard'
import { ElMessage } from 'element-plus'
import { Link as LinkIcon, CopyDocument as CopiedIcon } from '@element-plus/icons-vue'

const props = defineProps({
  links: { type: Array, default: () => [] }
})

const router = useRouter()
const copiedLinkIdx = ref(-1)

function openUrl(url) {
  window.open(url, '_blank')
}

async function copyUrl(url, idx) {
  const ok = await copyToClipboard(url)
  if (ok) {
    copiedLinkIdx.value = idx
    ElMessage.success('链接已复制')
    setTimeout(() => { copiedLinkIdx.value = -1 }, 2000)
  } else {
    ElMessage.error('复制失败，请手动复制')
  }
}

async function copyPassword(password) {
  const ok = await copyToClipboard(password)
  if (ok) {
    ElMessage.success('密码已复制')
  } else {
    ElMessage.error('复制失败')
  }
}
</script>