<template>
  <div class="login-page">
    <div class="login-card">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 8px;">🔒</div>
        <h2 style="margin: 0; color: #303133;">管理后台登录</h2>
        <p style="margin: 4px 0 0; color: #909399; font-size: 13px;">需要密码才能访问管理功能</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入管理密码"
            show-password
            size="large"
            @keyup.enter="handleLogin"
            prefix-icon="Lock"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          style="width: 100%;"
          @click="handleLogin"
          :loading="loading"
        >
          登录
        </el-button>

        <div style="text-align: center; margin-top: 16px;">
          <el-button link type="info" @click="$router.push('/')">
            ← 返回首页
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { api } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({ password: '' })
const rules = {
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await api.login(form.password)
    api.setAdminPassword(form.password)
    ElMessage.success('登录成功')

    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  } catch (err) {
    ElMessage.error(err.message || '登录失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const cfg = await api.checkAuthConfigured()
    if (!cfg.configured) {
      ElMessage.warning('服务器未配置管理密码，请联系管理员')
    }
  } catch (e) {
    // ignore
  }
})
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 20px;
}

.login-card {
  background: #fff;
  padding: 36px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}
</style>
