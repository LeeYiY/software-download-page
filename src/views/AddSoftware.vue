<template>
  <div class="admin-page">
    <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>添加软件</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="form-card">
      <h2 style="margin-bottom: 20px; font-size: 20px; color: #303133;">
        <el-icon><Plus /></el-icon>
        添加新软件
      </h2>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="top"
        size="default"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="软件名称" prop="name">
              <el-input v-model="form.name" placeholder="如：Visual Studio Code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标 (Emoji)" prop="icon">
              <el-input v-model="form.icon" placeholder="如：📦" style="width: 80px;" />
              <span style="margin-left: 8px; font-size: 24px; line-height: 32px;">{{ form.icon || '📦' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" placeholder="选择分类" style="width: 100%;" @change="onCategoryChange">
                <el-option v-for="cat in categories" :key="cat.value" :label="cat.label" :value="cat.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="如：1.0.0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="大小" prop="size">
              <el-input v-model="form.size" placeholder="如：150 MB" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="平台" prop="platform">
              <el-input v-model="form.platform" placeholder="如：Windows / macOS" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="许可证" prop="license">
              <el-input v-model="form.license" placeholder="如：免费开源" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评分" prop="rating">
              <el-rate v-model="form.rating" show-score text-color="#ff9900" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 预览图 -->
        <el-form-item label="预览图 URL" prop="imageUrl">
          <el-input v-model="form.imageUrl" placeholder="https://example.com/screenshot.png">
            <template #append>
              <el-button @click="form.imageUrl = ''">清除</el-button>
            </template>
          </el-input>
          <div v-if="form.imageUrl" class="image-preview">
            <img :src="form.imageUrl" alt="预览图" @error="imageError = true" v-if="!imageError">
            <div v-else class="image-error">❌ 图片加载失败</div>
          </div>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; width: 100%;">
            <el-tag
              v-for="tag in form.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              size="large"
              style="margin-bottom: 4px;"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="showTagInput"
              ref="tagInputRef"
              v-model="newTag"
              size="small"
              style="width: 120px;"
              placeholder="输入标签"
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <el-button v-else size="small" @click="showTagInput = true">
              + 添加标签
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="简介" prop="description">
          <el-input v-model="form.description" placeholder="一句话简介" maxlength="100" show-word-limit />
        </el-form-item>

        <el-form-item label="详细介绍" prop="fullDescription">
          <el-input
            v-model="form.fullDescription"
            type="textarea"
            :rows="4"
            placeholder="详细介绍软件功能和特点"
          />
        </el-form-item>

        <el-form-item label="官网地址" prop="homepage">
          <el-input v-model="form.homepage" placeholder="https://example.com" />
        </el-form-item>

        <el-form-item label="推荐软件">
          <el-switch v-model="form.featured" active-text="推荐" inactive-text="普通" />
        </el-form-item>

        <!-- 下载链接 -->
        <el-divider content-position="left">
          <el-icon><Download /></el-icon>
          下载链接
        </el-divider>

        <div v-for="(link, idx) in form.downloadLinks" :key="'dl-' + idx" class="dynamic-row">
          <el-row :gutter="12" align="middle">
            <el-col :span="6">
              <el-input v-model="link.name" placeholder="链接名称" size="default" />
            </el-col>
            <el-col :span="8">
              <el-input v-model="link.url" placeholder="下载地址 URL" size="default" />
            </el-col>
            <el-col :span="3">
              <el-select v-model="link.type" size="default" style="width: 100%;">
                <el-option label="直链" value="direct" />
                <el-option label="网盘" value="cloud" />
                <el-option label="镜像" value="mirror" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input v-model="link.password" placeholder="提取码" size="default" />
            </el-col>
            <el-col :span="2">
              <el-button type="danger" circle size="small" :icon="Delete" @click="removeLink(idx)" />
            </el-col>
          </el-row>
        </div>

        <el-button type="primary" plain size="small" @click="addLink" style="margin-top: 8px;">
          + 添加下载链接
        </el-button>

        <!-- 历史版本 -->
        <el-divider content-position="left">
          <el-icon><Clock /></el-icon>
          历史版本
        </el-divider>

        <div v-for="(ver, idx) in form.versionHistory" :key="'vh-' + idx" class="version-row">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #303133;">版本 {{ idx + 1 }}</span>
            <el-button type="danger" link size="small" @click="removeVersion(idx)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </div>
          <el-row :gutter="12" style="margin-bottom: 10px;">
            <el-col :span="6">
              <el-input v-model="ver.version" placeholder="版本号" size="default" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="ver.date" placeholder="发布日期 2024-01-01" size="default" />
            </el-col>
            <el-col :span="12">
              <el-input v-model="ver.changes" placeholder="更新说明" size="default" />
            </el-col>
          </el-row>
          <div class="sub-download-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 12px; color: #909399;">下载链接</span>
              <el-button size="small" text type="primary" @click="addVersionLink(idx)">
                + 添加链接
              </el-button>
            </div>
            <div v-for="(link, li) in ver.downloadLinks" :key="'vl-' + li" class="sub-dl-row">
              <el-row :gutter="8" align="middle">
                <el-col :span="5">
                  <el-input v-model="link.name" placeholder="名称" size="small" />
                </el-col>
                <el-col :span="10">
                  <el-input v-model="link.url" placeholder="下载地址" size="small" />
                </el-col>
                <el-col :span="3">
                  <el-select v-model="link.type" size="small" style="width: 100%;">
                    <el-option label="直链" value="direct" />
                    <el-option label="网盘" value="cloud" />
                    <el-option label="镜像" value="mirror" />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="link.password" placeholder="提取码" size="small" />
                </el-col>
                <el-col :span="2">
                  <el-button type="danger" circle size="small" :icon="Delete" @click="removeVersionLink(idx, li)" />
                </el-col>
              </el-row>
            </div>
          </div>
        </div>

        <el-button type="primary" plain size="small" @click="addVersion" style="margin-top: 8px;">
          + 添加历史版本
        </el-button>

        <!-- 验证码 -->
        <el-divider />
        <el-form-item label="验证码" prop="captchaAnswer" class="captcha-item">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="captcha-question">{{ captchaNum1 }} + {{ captchaNum2 }} = ?</span>
            <el-input v-model="form.captchaAnswer" placeholder="请输入答案" style="width: 120px;" />
            <el-button link type="primary" @click="refreshCaptcha">换一题</el-button>
          </div>
        </el-form-item>

        <!-- 提交 -->
        <div style="display: flex; gap: 12px; justify-content: center; padding-top: 16px;">
          <el-button type="primary" size="large" @click="submitForm" :loading="submitting">
            提交到数据库
          </el-button>
          <el-button size="large" @click="resetForm">
            重置表单
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, ArrowRight, Download, Delete, Clock } from '@element-plus/icons-vue'
import { api } from '@/utils/api'

const router = useRouter()
const formRef = ref(null)
const tagInputRef = ref(null)
const submitting = ref(false)
const showTagInput = ref(false)
const newTag = ref('')
const imageError = ref(false)

// 验证码
const captchaNum1 = ref(0)
const captchaNum2 = ref(0)

function refreshCaptcha() {
  captchaNum1.value = Math.floor(Math.random() * 20) + 1
  captchaNum2.value = Math.floor(Math.random() * 20) + 1
}
refreshCaptcha()

const categories = [
  { value: 'dev', label: '开发工具' },
  { value: 'office', label: '办公效率' },
  { value: 'media', label: '媒体工具' },
  { value: 'web', label: '网络工具' },
  { value: 'sys', label: '系统工具' }
]

const categoryMap = {}
categories.forEach(c => { categoryMap[c.value] = c.label })

const form = reactive({
  name: '',
  icon: '📦',
  category: '',
  categoryName: '',
  tags: [],
  version: '',
  description: '',
  fullDescription: '',
  platform: '',
  size: '',
  license: '',
  imageUrl: '',
  rating: 4.0,
  featured: false,
  homepage: '',
  downloadLinks: [{ name: '', url: '', type: 'direct', password: '', description: '' }],
  versionHistory: [],
  captchaAnswer: ''
})

const rules = {
  name: [{ required: true, message: '请输入软件名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  captchaAnswer: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

function onCategoryChange(val) {
  form.categoryName = categoryMap[val] || ''
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  newTag.value = ''
  showTagInput.value = false
}

function removeTag(tag) {
  form.tags = form.tags.filter(t => t !== tag)
}

function addLink() {
  form.downloadLinks.push({ name: '', url: '', type: 'direct', password: '', description: '' })
}

function removeLink(idx) {
  form.downloadLinks.splice(idx, 1)
}

function addVersion() {
  form.versionHistory.push({ version: '', date: '', changes: '', downloadLinks: [] })
}

function removeVersion(idx) {
  form.versionHistory.splice(idx, 1)
}

function addVersionLink(vIdx) {
  form.versionHistory[vIdx].downloadLinks.push({ name: '', url: '', type: 'direct', password: '', description: '' })
}

function removeVersionLink(vIdx, li) {
  form.versionHistory[vIdx].downloadLinks.splice(li, 1)
}

async function submitForm() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  // 验证码校验
  const answer = parseInt(form.captchaAnswer)
  if (answer !== captchaNum1.value + captchaNum2.value) {
    ElMessage.error('验证码错误，请重新输入')
    refreshCaptcha()
    form.captchaAnswer = ''
    return
  }

  submitting.value = true
  try {
    const data = {
      name: form.name,
      icon: form.icon,
      category: form.category,
      categoryName: form.categoryName,
      tags: form.tags,
      version: form.version,
      description: form.description,
      fullDescription: form.fullDescription,
      platform: form.platform,
      size: form.size,
      license: form.license,
      imageUrl: form.imageUrl,
      downloads: 0,
      rating: form.rating,
      featured: form.featured,
      homepage: form.homepage,
      downloadLinks: form.downloadLinks.filter(l => l.url.trim()),
      versionHistory: form.versionHistory.filter(v => v.version.trim())
    }

    const result = await api.addSoftware(data)
    ElMessage.success(`软件「${data.name}」添加成功！ID: ${result.id}`)
    router.push(`/software/${result.id}`)
  } catch (err) {
    ElMessage.error('添加失败: ' + err.message)
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  formRef.value?.resetFields()
  form.tags = []
  form.downloadLinks = [{ name: '', url: '', type: 'direct', password: '', description: '' }]
  form.versionHistory = []
  form.icon = '📦'
  form.rating = 4.0
  form.imageUrl = ''
  imageError.value = false
  refreshCaptcha()
}
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

.dynamic-row {
  margin-bottom: 8px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

.version-row {
  margin-bottom: 10px;
  padding: 14px 16px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #c6e2ff;
}

.image-preview {
  margin-top: 8px;
  padding: 8px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  display: inline-block;
  max-width: 100%;
}

.image-preview img {
  max-width: 400px;
  max-height: 240px;
  border-radius: 4px;
  display: block;
}

.image-error {
  color: #f56c6c;
  padding: 12px;
  font-size: 14px;
}

.captcha-item {
  margin-bottom: 0;
}

.captcha-question {
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
  letter-spacing: 2px;
  user-select: none;
}

.sub-download-section {
  padding: 10px 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px dashed #dcdfe6;
}

.sub-dl-row {
  margin-bottom: 6px;
}

.sub-dl-row:last-child {
  margin-bottom: 0;
}
</style>
