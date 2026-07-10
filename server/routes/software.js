const express = require('express')
const router = express.Router()
const Software = require('../models/Software')

// GET /api/software - 全部软件列表
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, sort = 'featured' } = req.query
    let query = {}

    if (category && category !== 'all') {
      query.category = category
    }
    if (tag) {
      query.tags = { $in: [tag] }
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    let sortOption = {}
    if (sort === 'featured') sortOption = { featured: -1 }
    else if (sort === 'downloads') sortOption = { downloads: -1 }
    else if (sort === 'rating') sortOption = { rating: -1 }

    const list = await Software.find(query).sort(sortOption).lean()
    res.json({ success: true, data: list })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/software/:id - 单个软件详情
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const software = await Software.findOne({ id }).lean()
    if (!software) {
      return res.status(404).json({ success: false, error: '未找到该软件' })
    }
    res.json({ success: true, data: software })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router