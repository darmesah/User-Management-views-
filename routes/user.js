const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, userController.getIndex);

module.exports = router;
