var express = require('express');
var Product = require('../models/products').Product;
//var util = require('util');
var _ = require('underscore')._;
var router = express.Router();
var au = require('audoku');



router.post('/products',
    au.doku({  // json documentation

        description: 'Insert a new product',
        title: 'Insert a new product',
        version: '1.0.0',
        name: 'products',
        group: 'products',
        bodyFields: {
            name: {type: 'String', required: true, description: 'Name of product'},
            description: {type: 'String', required: true, description: 'Description of product'},
            supplierId: {type: 'ObjectId', required: true, description: 'Owner of the product [supplier Id]'},
            categories: {type: 'Array', required: true, description: 'Product categories'},
            images: {type: 'Array', required: false, description: 'Product images'},
            tags: {type: 'Array', required: false, description: 'Product tags'}
            }
    }),
    function (req, res) {

        if (_.isEmpty(req.body))
            return res.boom.badData('Empty body'); // Error 422

        Product.create(req.body).then( function ( entities) {

            if (_.isEmpty(entities))
                res.boom.badImplementation('Something strange'); // Error 500
            else
                return res.status(201).send(entities);  // HTTP 201 created
            
        }).catch(function (err) {
            if (err.name === 'ValidationError')
                {
                  console.log(err);
                  return res.boom.badData(err);  
                }
                 // Error 422
            else
                return res.boom.badImplementation(err);// Error 500
        });

    });




router.get('/products',
    au.doku({  // json documentation
        description: 'Get all the products defined in db',
        fields: {
            page: {
                description: 'The current page for pagination',
                type: 'integer', required: false
            },
            limit: {
                description: 'The current limit for pagination',
                type: 'integer', required: false
            }
        }
    }),
    function (req, res) {

        var query = _.extend({}, req.query);
        if (query.hasOwnProperty('page')) delete query.page;
        if (query.hasOwnProperty('limit')) delete query.limit;

        Product.paginate(query, {page: req.query.page, limit: req.query.limit}, function (err, entities) {
            if (err) return res.boom.badImplementation(err); // Error 500

            if (entities.total === 0)
                res.boom.notFound("No Products found for query " + JSON.stringify(query)); // Error 404
            else
                res.send(entities); // HTTP 200 ok

        });

    });


router.get('/products/:id',
    au.doku({  // json documentation
        title: 'Get a product by id',
        version: '1.0.0',
        name: 'GetProduct',
        group: 'Product',
        description: 'Get a product by id',
        params: {
            id: {type: 'String', required: true, description: 'The product identifier'}
        }

    }), function (req, res) {
        var id = req.params.id.toString();

        var newVals = req.body; // body already parsed

        Product.findById(id, newVals).then(function (entities) {

            if (_.isEmpty(entities))
                res.boom.notFound('No entry with id ' + id); // Error 404
            else
                res.send(entities);  // HTTP 200 ok
        }).catch(function (err) {
            if (err.name === 'CastError')
                res.boom.badData('Id malformed'); // Error 422
            else
                res.boom.badImplementation(err);// Error 500
        });
    }
);




router.put('/products/:id',
    au.doku({  // json documentation
        title: 'Update a product by id',
        version: '1.0.0',
        name: 'UpdateProduct',
        group: 'products',
        description: 'Update a product by id',
        params: {
            id: {type: 'String', required: true, description: 'The product identifier'}
        },
        bodyFields: {
            name: {type: 'String', required: true, description: 'Name of product'},
            description: {type: 'String', required: true, description: 'Description of product'},
            supplierId: {type: 'ObjectId', required: true, description: 'Owner of the product [supplier Id]'},
            categories: {type: 'Array', required: true, description: 'Product categories'},
            images: {type: 'Array', required: false, description: 'Product images'},
            tags: {type: 'Array', required: false, description: 'Product tags'}
        }
    }),
    function (req, res) {

    if (_.isEmpty(req.body))
        return res.boom.badData('Empty boby'); // Error 422

    var id = req.params.id;

    var newVals = req.body; // body already parsed
    
    Product.findByIdAndUpdate(id, newVals).then(function (entities) {

        if (_.isEmpty(entities))
            res.boom.notFound('No entry with id ' + id); // Error 404
        else
            res.send(entities);  // HTTP 200 ok
    }).catch(function (err) {
        if (err.name === 'ValidationError')
            res.boom.badData(err.message); // Error 422
        else if (err.name === 'CastError')
            res.boom.badData('Id malformed'); // Error 422
        else
            res.boom.badImplementation(err);// Error 500
    });

}



);





module.exports = router;