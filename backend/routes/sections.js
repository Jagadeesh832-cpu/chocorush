/**
 * Public Sections API - Read-only for website content
 * Editable content is fetched here; admin edits via /api/admin/sections
 */
import express from 'express'
import WebsiteSection from '../models/WebsiteSection.js'

const router = express.Router()

// GET all enabled sections (public - no auth required)
router.get('/', async (req, res) => {
  try {
    const sections = await WebsiteSection.find({ isEnabled: { $ne: false } })
    const map = {}
    sections.forEach((s) => { map[s.key] = s })
    res.json(map)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
