require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const softwareRoutes = require('./routes/software')
const Software = require('./models/Software')

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 管理密码
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// POST /api/auth - 登录校验
app.post('/api/auth', async (req, res) => {
  try {
    const { password } = req.body
    if (!ADMIN_PASSWORD) {
      return res.status(500).json({ success: false, error: '服务器未配置管理密码' })
    }
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true, token: 'admin' })
    } else {
      res.status(401).json({ success: false, error: '密码错误' })
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/auth/check - 检查密码是否已配置
app.get('/api/auth/check', async (req, res) => {
  res.json({ success: true, configured: !!ADMIN_PASSWORD })
})

// 管理操作密码校验中间件
function requireAdmin(req, res, next) {
  const pwd = req.headers['x-admin-password']
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ success: false, error: '服务器未配置管理密码' })
  }
  if (pwd !== ADMIN_PASSWORD) {
    return res.status(403).json({ success: false, error: '无权访问，密码错误' })
  }
  next()
}

// 只读路由（无需密码）
app.use('/api/software', softwareRoutes)

// 写操作需要密码
app.post('/api/software', requireAdmin, softwareRoutes)
app.put('/api/software/:id', requireAdmin, softwareRoutes)
app.delete('/api/software/:id', requireAdmin, softwareRoutes)

// 生产环境: 托管静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// 启动
async function start() {
  await connectDB()

  // 如果数据库为空，自动导入数据
  const count = await Software.countDocuments()
  if (count === 0) {
    const rawDataPath = path.join(__dirname, '../raw-data.json')
    const data = require(rawDataPath)
    await Software.insertMany(data)
    console.log(`✅ 自动导入 ${data.length} 条软件数据`)
  } else {
    console.log(`📦 数据库已有 ${count} 条软件数据`)
  }

  app.listen(PORT, () => {
    console.log(`🚀 后端服务运行在 http://localhost:${PORT}`)
  })
}

start()
