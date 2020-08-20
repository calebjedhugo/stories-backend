const jwt = require('jsonwebtoken')
const conn = require('./conn.js')

module.exports = (id) => {
  return new Promise(async (resolve, reject) => {
    try{
      const user = (await conn.query(`SELECT id, role FROM users WHERE id = ${id}`)).rows[0]
      const token = jwt.sign({id: user.id, role: user.role}, process.env.TOKEN_SECRET, { expiresIn: process.env.jwtExp || '1h' });
      resolve(token)
    } catch(e) {
      reject(e.message)
    }
  })
}
