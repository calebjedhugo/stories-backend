const router = require('express').Router();
const jwt = require('jsonwebtoken')
const fs = require('fs')
const freshJwt = require('../util/freshJwt')

const verifyJwt = async (req, res, next) => {
  const token = req.header('Authorization');
  if(!token || token === 'null'){
    return res.json('Login Required')
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    if(req.user){
      if(req.user.exp - (new Date() / 1000) < 3600){ //Freshen up the jwt if expiring in < 10 minutes.
        try{res.set('Authorization', await freshJwt(req.user.id))}
        catch(e) {console.log(e, 'Fresh jwt didn\'t work.')}
      }
      next()
    }
    else res.status(401).json('Login Required. Token did not return a user.');
  } catch(e) {
    res.status(403).json('Login Required. Token was not valid.');
  }
}

//We need these open for the user to get the jwt in the first place so they should be excluded.
const jwtVerify = /^(?!\/api\/auth).*/

//Authenticate token for all other requests.
router.use(jwtVerify, verifyJwt)

module.exports = router
