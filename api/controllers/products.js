const Product = require('../models/product'); 
const mongoose = require('mongoose');

exports.get_products = (req, res, next) => {
    Product.find()
    .select('name price id productImage')
    .exec()
    .then(docs => {
        const response  = {
            count: docs.length,
            products: docs.map(doc => {
                // meta information request
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/products/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.post_products = (req, res, next) => {
    console.log(req.file);
    const product = new Product({ 
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path 
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Action successful',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3001/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_single_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'FIND PRODUCTS',
                        url: "http://localhost:3001/products"
                    }
                });
            } else {
                res.status(400).json({message: 'No valid entry for provided ID'});
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: {
                    type: 'GET',
                    url: 'http://localhost:3001/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3001/products',
                description: 'CREATE A NEW PRODUCT',
                body: { name: 'String', price: 'Number' }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}