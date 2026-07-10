const mongoose = require('mongoose')

const DownloadLinkSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: { type: String, enum: ['direct', 'cloud', 'mirror'] },
  password: { type: String, default: '' },
  description: String
}, { _id: false })

const VersionHistorySchema = new mongoose.Schema({
  version: String,
  date: String,
  changes: String,
  downloadLinks: [DownloadLinkSchema]
}, { _id: false })

const SoftwareSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, default: '📦' },
  category: { type: String, required: true },
  categoryName: String,
  tags: [String],
  version: String,
  versionHistory: [VersionHistorySchema],
  description: String,
  fullDescription: String,
  platform: String,
  size: String,
  license: String,
  imageUrl: { type: String, default: '' },
  downloads: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  homepage: String,
  downloadLinks: [DownloadLinkSchema]
}, {
  timestamps: true,
  collection: 'softwares'
})

SoftwareSchema.index({ category: 1 })
SoftwareSchema.index({ tags: 1 })

module.exports = mongoose.model('Software', SoftwareSchema)