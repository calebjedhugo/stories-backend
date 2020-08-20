const axios = require('axios')
const randomstring = require('randomstring')
const {apiLink} = require('./util')

const adminEmail = 'admin@admin.com'
const adminPassword = 'testing'

const register = (admin = false, token, hardcodedAdmin = false, email) => {
  let userObj = {
    "firstname": randomstring.generate(5),
    "lastname": randomstring.generate(5),
    "email": email || (hardcodedAdmin ? adminEmail : `${randomstring.generate(5)}@${randomstring.generate(5)}.com`),
    "password": hardcodedAdmin ? adminPassword : randomstring.generate(6)
  }

  let headers = {}
  if(admin){
    userObj.role = 'admin'
    headers = {headers: {Authorization: token}}
  }

  return new Promise((resolve, reject) => {
    axios.post(`${apiLink}auth/register`, userObj, headers).then(res => {
      resolve(userObj)
    }).catch(e => {
      if(e.response){
        resolve(e.response.data)
      } else {
        reject(e)
      }
    })
  })
}

const login = (email, password) => {
  return new Promise((resolve, reject) => {
    axios.post(`${apiLink}auth/login`, {email: email, password: password}).then(res => {
      resolve(res.data)
    }).catch(e => {
      if(e.response){
        resolve(e.response.data)
      } else {
        reject(e)
      }
    })
  })
}

const getAdmin = () => {
  return new Promise(async (resolve, reject) => {
    try{await register(true, undefined, true)} //try to create the admin
    catch(e){}//it's fine.
    let {token, id} = await login(adminEmail, adminPassword)
    if(token) resolve({token: token, id: id})
    else reject(new Error('Admin login failed.'))
  })
}

module.exports.register = register
module.exports.login = login
module.exports.getAdmin = getAdmin
