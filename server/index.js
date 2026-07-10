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

// API 路由
app.use('/api/software', softwareRoutes)

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