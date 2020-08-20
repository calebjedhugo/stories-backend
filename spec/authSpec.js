const axios = require('axios')
const {register, login, getAdmin} = require('./support/user')
const {apiLink} = require('./support/util')

var user, admin, takenEmail
describe('Authentication', function(){
  beforeAll(async function(){
    const {email, password} = await register()
    takenEmail = email
    user = await login(email, password)
    admin = await getAdmin()
  })

  it('Login returns all props', function(){
    expect(Object.keys(user)).toEqual(['id', 'role', 'token', 'firstname', 'lastname'])
  })

  it('New users default to user role', function(){
    expect(user.role).toBe('user')
  })

  it('Allows admins to create admins', async function(){
    const {email, password} = await register(true, admin.token)
    let newAdmin = await login(email, password)
    expect(newAdmin.role).toEqual('admin')
  })

  it('does not allow the same email to be used again.', async function(){
    let message = await register(false, undefined, false, takenEmail)
    expect(message).toEqual(`${takenEmail} is already associated with an account.`)
  })
})
