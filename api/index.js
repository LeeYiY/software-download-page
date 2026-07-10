const express = require('express')
const cors = require('cors')
const connectDB = require('../server/config/db')
const softwareRoutes = require('../server/routes/software')
const Software = require('../server/models/Software')
const rawData = require('../raw-data.json')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/software', softwareRoutes)

let dbConnected = false

async function ensureDB() {
  if (!dbConnected) {
    await connectDB()
    dbConnected = true

    // 如果数据库为空，自动导入数据
    const count = await Software.countDocuments()
    if (count === 0) {
      await Software.insertMany(rawData)
      console.log(`✅ 自动导入 ${rawData.length} 条软件数据`)
    }
  }
}

// Vercel Serverless Function 入口
module.exports = async (req, res) => {
  await ensureDB()
  return app(req, res)
}