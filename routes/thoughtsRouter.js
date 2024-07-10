const express = require('express')
const router = express.Router()
const ThoughtsController = require('..')

router.get('/', ThoughtsController.showThoughts)

module.exports = router