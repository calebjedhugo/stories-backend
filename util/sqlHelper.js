const setActiveProps = body => {
  let f = ''
  for(let prop in body){
    if(prop !== 'id' && body[prop]){
      if(!f){
        f = 'SET '
      } else {
        f += ', '
      }
      f += `${prop} = '${body[prop]}'`
    }
  }
  return f
}

module.exports.setActiveProps = setActiveProps
