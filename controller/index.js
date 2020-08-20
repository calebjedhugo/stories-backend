const router = require('express').Router();
require('dotenv').config()
const env = process.env.env

//log hits if not in production
router.use('/', (req, res, next) => {
  if(env !== 'production' || env !== 'prod'){
    console.log(req.originalUrl)
  }
  next()
})

//Import middleware
router.use(require('../middleware'))

//Start up the database connection.
require('../util/conn.js')

//Import Routes
router.use('/api', require('../routes'))

router.use(function(req, res){
  res.status(404).json(`Resource ${req.originalUrl} was not found`)
})

module.exports = router
