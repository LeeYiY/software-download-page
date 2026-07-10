<template>
  <div class="admin-page">
    <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理后台</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="form-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="font-size: 20px; color: #303133; margin: 0;">
          <el-icon><Tools /></el-icon>
          软件管理
        </h2>
        <el-button type="primary" @click="$router.push('/admin/add')">
          <el-icon><Plus /></el-icon>
          添加软件
        </el-button>
      </div>

      <el-input
        v-model="searchKeyword"
        placeholder="搜索软件名称..."
        clearable
        style="max-width: 360px; margin-bottom: 16px;"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-table :data="filteredList" v-loading="loading" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" align="center" />
        <el-table-column label="名称" min-width="160">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">{{ row.icon }}</span>
              <span style="font-weight: 600;">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column label="评分" width="120">
          <template #default="{ row }">
            <el-rate :model-value="row.rating" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column prop="downloads" label="下载量" width="100">
          <template #default="{ row }">
            {{ formatDownloads(row.downloads) }}
          </template>
        </el-table-column>
        <el-table-column label="推荐" width="70" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.featured" type="success" size="small">推荐</el-tag>
            <span v-else style="color: #909399;">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="$router.push(`/admin/edit/${row.id}`)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!filteredList.length && !loading" style="text-align: center; padding: 40px; color: #909399;">
        <el-icon :size="48" style="margin-bottom: 12px;"><Document /></el-icon>
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowRight, Plus, Search, Tools, Document } from '@element-plus/icons-vue'
import { api } from '@/utils/api'

const loading = ref(false)
const list = ref([])
const searchKeyword = ref('')

const filteredList = computed(() => {
  if (!searchKeyword.value) return list.value
  const kw = searchKeyword.value.toLowerCase()
  return list.value.filter(s =>
    s.name.toLowerCase().includes(kw) ||
    s.description.toLowerCase().includes(kw)
  )
})

function formatDownloads(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

async function loadData() {
  loading.value = true
  try {
    list.value = await api.getSoftwareList()
  } catch (err) {
    ElMessage.error('加载失败: ' + err.message)
  } finally {
    loading.value = false
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除「${row.name}」？此操作不可恢复。`, '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await api.deleteSoftware(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败: ' + err.message)
    }
  }
}

function handleSearch() {
  // 前端实时过滤，无需请求
}

onMounted(loadData)
</script>

<style scoped>
.admin-page {
  padding: 20px 0;
}

.form-card {
  background: #fff;
  padding: 28px 32px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
</style>