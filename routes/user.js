const router = require('express').Router();
const {registerValidation, loginValidation} = require('../validation/users')
const bcrypt = require('bcryptjs')
const conn = require('../util/conn.js')
const jwt = require('jsonwebtoken')

router.route('/register').post(async (req, res, next) => {
  const userObj = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: req.body.role || 'user',
    email: req.body.email,
    password: req.body.password
  }

  const { error } = registerValidation(userObj);
  if(error) return res.status(400).json(error.details[0].message);

  if(req.body.role === 'admin'){ //Authenticate if creating new user with elevated role.
    //If there is no admin, let it happen anyway.
    const adminExists = (await conn.query(`SELECT role FROM users WHERE role = 'admin' LIMIT 1`)).rows[0]
    if(adminExists){
      try{
        const {id} = jwt.verify(req.header('Authorization'), process.env.TOKEN_SECRET)
        const {role} = (await conn.query(`SELECT role FROM users WHERE id = ${id}`)).rows[0]
        if(!/^admin/.test(role)) return res.status(401).json('Insufficient role')
      } catch(e){
        console.log(e.message)
        return res.status(403).json('Access Denied')
      }
    }
  }

  //Is the user already in the database?
  const emailExist = (await conn.query(`SELECT * FROM users WHERE email = '${userObj.email}' LIMIT 1`)).rows[0]
  if(emailExist) return res.status(400).json(`${req.body.email} is already associated with an account.`)

  var hashedPassword
  if(req.body.password && typeof req.body.password === 'string'){
    const salt = await bcrypt.genSalt(10)
    hashedPassword = await bcrypt.hash(req.body.password, salt)
  }

  const newUserQuery = `
    INSERT INTO users (firstName, lastName, role, email, password)
    VALUES ('${userObj.firstname}', '${userObj.lastname}', '${userObj.role}', '${userObj.email}', '${hashedPassword}')
  `
  conn.query(newUserQuery, (e, data) => {
    if(e) return res.status(400).json(e.message)
    res.json('success!');
  })
})

router.route('/login').post(async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if(error) return res.status(400).json(error.details[0].message);

  const {email, password} = req.body

  //Is the user already in the database?
  const user = (await conn.query(`SELECT * FROM users WHERE email = '${email}' LIMIT 1`)).rows[0]
  if(!user) return res.status(400).json(`${email} is not associated with an account. But you can create one!`)

  const validPass = await bcrypt.compare(password, user.password)
  if(!validPass) return res.status(400).json('Password was incorrect.')

  const token = jwt.sign({id: user.id, role: user.role}, process.env.TOKEN_SECRET, { expiresIn: process.env.jwtExp || '1h' })
  res.set('Authorization', token)
  res.json({
    id: user.id,
    role: user.role,
    token: token,
    firstname: user.firstname,
    lastname: user.lastname
  })
})

module.exports = router;
