const express = require('express');
const router = express.Router();

// GET /experts - with pagination and filter
router.get('/', (req, res) => {
  try {
    const db = req.app.get('db');
    let experts = db.get('experts').value();

    // Filter by category
    const { category, search, page = 1, limit = 10 } = req.query;

    if (category) {
      experts = experts.filter(e => 
        e.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name
    if (search) {
      experts = experts.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const total = experts.length;
    const paginatedExperts = experts.slice(startIndex, endIndex);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: paginatedExperts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /experts/:id - get single expert
router.get('/:id', (req, res) => {
  try {
    const db = req.app.get('db');
    const expert = db.get('experts').find({ id: req.params.id }).value();

    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    res.json({ success: true, data: expert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;