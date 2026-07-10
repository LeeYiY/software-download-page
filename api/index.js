const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const softwareRoutes = require('../server/routes/software')
const Software = require('../server/models/Software')
const rawData = require('../raw-data.json')

const app = express()
app.use(cors())
app.use(express.json())

let dbConnected = false

async function ensureDB() {
  if (dbConnected) return

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI 环境变量未设置')
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  dbConnected = true

  const count = await Software.countDocuments()
  if (count === 0) {
    await Software.insertMany(rawData)
    console.log(`✅ 自动导入 ${rawData.length} 条软件数据`)
  }
}

// 管理密码从环境变量读取
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

// 挂载只读路由（无需密码）
app.use('/api/software', softwareRoutes)

// 写操作路由需要密码（覆盖在只读路由之后）
app.post('/api/software', requireAdmin, softwareRoutes)
app.put('/api/software/:id', requireAdmin, softwareRoutes)
app.delete('/api/software/:id', requireAdmin, softwareRoutes)

// Vercel Serverless Function 入口
module.exports = async (req, res) => {
  try {
    await ensureDB()
    return app(req, res)
  } catch (err) {
    console.error('Serverless Function Error:', err.message)
    res.status(500).json({
      success: false,
      error: '服务器错误: ' + err.message
    })
  }
}
