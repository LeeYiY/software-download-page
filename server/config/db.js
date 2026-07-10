const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer = null

async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (uri && uri !== 'memory') {
    // 使用配置的 MongoDB（本地或云）
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
      console.log('✅ MongoDB 连接成功:', uri.replace(/:.*@/, ':****@'))
      return
    } catch (err) {
      console.warn('⚠️ 配置的 MongoDB 连接失败，切换到内存数据库')
    }
  }

  // 使用内存数据库（开发和测试环境）
  mongoServer = await MongoMemoryServer.create()
  const memoryUri = mongoServer.getUri() + 'software-download'
  await mongoose.connect(memoryUri)
  console.log('✅ MongoDB 内存数据库已启动:', memoryUri)
}

module.exports = connectDB