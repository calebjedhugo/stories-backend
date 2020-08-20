const router = require('express').Router();
const storyValidation = require('../validation/stories')
const conn = require('../util/conn')
const {setActiveProps} = require('../util/sqlHelper')

router.route('/').all(async (req, res, next) => {

  //validate method
  if(req.method.toLowerCase() !== 'get'){
    if(!storyValidation[req.method.toLowerCase()]){
      return res.status(400).json(`${req.method} is not available for ${req.originalUrl}`);
    }

    //validate body
    const {error} = storyValidation[req.method.toLowerCase()](req.body)
    if(error) return res.status(400).json(error.details[0].message);
  }

  next()
}).get(async (req, res) => {
  let where = ''
  if(req.user.role !== 'admin'){
    where = `WHERE created_by = ${req.user.id}`
  }

  const query = `SELECT * FROM stories ${where}`
  conn.query(query, (e, data) => {
    if(e) return res.status(500).json(e.message)
    res.json(data.rows)
  })
}).post(async (req, res) => {
  const {summary, description, type, complexity, etc, cost} = req.body

  const query = `
    INSERT INTO stories (created_by, summary, description, type, complexity, etc, cost)
    VALUES(${req.user.id},'${summary}','${description}', '${type}', '${complexity}', '${etc}', ${cost})
  `
  conn.query(query, (e, data) => {
    if(e) return res.status(500).json(e.message)
    res.json('success')
  })
}).patch(async (req, res) => {
  //Only an admin can edit something.
  if(req.user.role !== 'admin'){
    return res.status(403).json('Only admins may patch')
  }

  //WHERE
  let where = `WHERE id = ${req.body.id}`

  //SET
  let set = setActiveProps(req.body)
  if(!set) return res.status(400).json('There was nothing to update')

  const query = `UPDATE stories ${set} ${where}`

  conn.query(query, (e, data) => {
    if(e) return res.status(500).json(e.message)
    res.json('success')
  })
})

module.exports = router;
