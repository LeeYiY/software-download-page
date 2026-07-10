require('dotenv').config()
const path = require('path')
const connectDB = require('../config/db')
const Software = require('../models/Software')

async function seed() {
  await connectDB()

  // 清空旧数据
  await Software.deleteMany({})
  console.log('🗑️  已清空旧数据')

  // 读取 raw-data.json
  const rawDataPath = path.join(__dirname, '../../raw-data.json')
  const data = require(rawDataPath)

  // 插入数据
  await Software.insertMany(data)
  console.log(`✅ 成功导入 ${data.length} 条软件数据到 MongoDB`)

  process.exit(0)
}

seed().catch(err => {
  console.error('❌ 导入失败:', err)
  process.exit(1)
})