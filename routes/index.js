const router = require('express').Router();

router.use('/stories', require('./stories'))
router.use('/auth', require('./user'))

module.exports = router
