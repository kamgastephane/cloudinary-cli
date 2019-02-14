const cloudinary = require('./configCloudinary')

function createTransform (name, parameters, next) {
  cloudinary.v2.api.create_transformation(name, parameters, (error, result) => {
    if (error) {
      return console.log(error)
    } else {
      console.log(`transformation ${name} created!`)
    }
    return next
  })
}
module.exports = createTransform
