const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const checkAuth = require('../middleware/check-auth');
const OrdersCotroller = require('../controllers/orders');

router.get('/', checkAuth, OrdersCotroller.orders_get_all);

router.post('/', checkAuth, OrdersCotroller.orders_create_order);

router.get('/:orderId', checkAuth, OrdersCotroller.orders_get_single_order);

router.delete('/:orderId', checkAuth, OrdersCotroller.orders_delete);

module.exports = router;
