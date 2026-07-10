<template>
  <el-collapse v-if="history.length" accordion>
    <el-collapse-item
      v-for="(item, idx) in history"
      :key="idx"
      :title="`${item.version} — ${item.date}`"
    >
      <div style="margin-bottom: 12px; color: #606266; font-size: 13px;">
        {{ item.changes }}
      </div>
      <DownloadLinks :links="item.downloadLinks || []" />
    </el-collapse-item>
  </el-collapse>
  <div v-else style="color: #909399; padding: 8px 0;">
    暂无版本历史
  </div>
</template>

<script setup>
import DownloadLinks from './DownloadLinks.vue'

defineProps({
  history: { type: Array, default: () => [] }
})
</script>