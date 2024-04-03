const router=require('express').Router()
const { sendVerificationEmail } = require('../controller/appController')



router.post('/user/signup', sendVerificationEmail  );

module.exports = router