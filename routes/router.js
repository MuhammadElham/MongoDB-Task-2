const route = require('express').Router()
const userData = require('../controler/userController')


route.post('/signup',userData.signupData)
route.post('/login',userData.loginData)
route.put('/update/:id',userData.updateData)
route.delete('/del/:id',userData.deleteData)
route.get('/data',userData.getData)

module.exports = route