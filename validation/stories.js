const Joi = require('@hapi/joi')

module.exports = {
  post: data => {
    const schema = {
      summary: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().regex(/^enhancement|bugfix|development|qa$/).required(),
      complexity: Joi.string().regex(/^low|mid|high$/).required(),
      etc: Joi.date().required(),
      cost: Joi.number().min(0).required()
    }
    return Joi.validate(data, schema)
  },
  patch: data => {
    const schema = {
      id: Joi.number().min(0).required(),
      summary: Joi.string(),
      description: Joi.string(),
      type: Joi.string().regex(/^enhancement|bugfix|development|qa$/),
      complexity: Joi.string().regex(/^low|mid|high$/),
      etc: Joi.date(),
      cost: Joi.number().min(0),
      status: Joi.string().regex(/^new|approved|rejected$/)
    }
    return Joi.validate(data, schema)
  }
}
