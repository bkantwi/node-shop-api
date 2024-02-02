const express = require('express');
const router = express.Router();
const UsersCotroller = require('../controllers/user');

router.post('/signup', UsersCotroller.create_user);

router.post('/login', UsersCotroller.login_user);

router.delete('/:userId', UsersCotroller.delete_user);

module.exports = router;