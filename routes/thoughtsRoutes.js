const express = require('express')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, ThoughtsController.createThought)
router.get('/dashboard', checkAuth, ThoughtsController.dashboard)
router.get('/', ThoughtsController.showThoughts)

module.exports = router