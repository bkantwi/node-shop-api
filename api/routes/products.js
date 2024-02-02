const express = require('express');
const router = express.Router();
const Product = require('../models/product'); 
const mongoose = require('mongoose');
const { json } = require('body-parser');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsCotroller = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(requ, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // Reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProductsCotroller.get_products);

router.post('/', checkAuth, upload.single('productImage'), ProductsCotroller.post_products);

router.get('/:productId', ProductsCotroller.get_single_product);

router.patch('/:productId', checkAuth, ProductsCotroller.update_product);

router.delete("/:productId", checkAuth, ProductsCotroller.delete_product);

module.exports = router;
