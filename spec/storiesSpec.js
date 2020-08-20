const axios = require('axios')
const {register, login, getAdmin} = require('./support/user')
const {apiLink} = require('./support/util')

const goodStoryObj = {
    summary: "This is a great story summary.",
    description: "This is a great story description.",
    type: "bugfix",
    etc: "2020/10/13",
    cost: 5,
    complexity: "low"
}

const badStoryObj = {
    summary: "This is a bad story summary.",
    description: "bugfix is missing the 'x'!",
    type: "bugfi",
    etc: "2020/10/13",
    cost: 5,
    complexity: "low"
}

var user, admin
describe('Stories', function() {
  beforeAll(async function(){
    const {email, password} = await register()
    user = await login(email, password)
    admin = await getAdmin()

    await postStory(user.token, goodStoryObj)
    await postStory(admin.token, goodStoryObj)
  })

  it('can be created by a user.', async function() {
    let data = await postStory(user.token, goodStoryObj)
    expect(data).toEqual('success');
  })

  it('can be created by an admin.', async function() {
    let data = await postStory(admin.token, goodStoryObj)
    expect(data).toEqual('success');
  })

  it('can only be retrived by the creator of the story.', async function() {
    let data = await getStory(user.token)
    data.forEach(entry => {
      expect(entry.created_by).toEqual(user.id)
    })
  })

  it('admins can see everything.', async function() {
    let data = await getStory(admin.token)
    for(var i = 0; i < data.length; i++){
      if(data[i].created_by !== admin.id) break;
    }
    expect(data[i].created_by).not.toBe(admin.id)
  })

  it('cannot be edited by a user', async function() {
    let storyId = (await getStory(user.token))[0].id
    let data = await patchStory(user.token, storyId)
    expect(data).toEqual('Only admins may patch')
  })

  it('can be edited by an admin', async function() {
    let storyId = (await getStory(user.token))[0].id
    let data = await patchStory(admin.token, storyId)
    expect(data).toEqual('success')

    let stories = await getStory(user.token)
    for(let i = stories.length - 1; i > -1; i--){
      if(stories[i].id === storyId){
        expect(stories[i].description).toEqual('change')
        break
      }
    }
  })
})

const postStory = (token, story) => {
  return new Promise((resolve, reject) => {
    axios.post(`${apiLink}stories`, story, {
      headers: {
        Authorization: token
      }
    }).then(res => {
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

const patchStory = (token, id) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${apiLink}stories`, {id: id, description: 'change'}, {
      headers: {
        Authorization: token
      }
    }).then(res => {
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

const getStory = token => {
  return new Promise((resolve, reject) => {
    axios.get(`${apiLink}stories`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
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
