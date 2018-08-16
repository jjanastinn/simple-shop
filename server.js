const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Product = require('./models/product');
const Wishlist = require('./models/wishlist');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/simple-shop', {
  useNewUrlParser: true,
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function(req, res) {
  const product = new Product(req.body);
  product.save(function(err, savedProduct) {
    if (err) {
      res.status(500).send({error: 'Could not save the product'});
    } else {
      res.send(savedProduct);
    }
  });
})

app.get('/product', function(req, res){
  Product.find({}, function(err, products){
    if (err) {
      res.status(500).send({error: 'Could not fetch products'});
    } else {
      res.send(products);
    }
  });
})

app.get('/wishlist', function(req, res){
  Wishlist.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishlists) {
    if (err) {
      res.status(500).send({error: 'Could not fetch wishlists'});
    } else {
      res.send(wishlists);
    }
  });
})

app.post('/wishlist', function(req, res) {
  const wishlist = new Wishlist();
  wishlist.title = req.body.title;

  wishlist.save(function(err, newWishlist) {
    if (err) {
      res.status(500).send({error: 'Could not create wishlist'});
    } else {
      res.send(newWishlist);
    }
  });
})

app.put('/wishlist/product/add', function(req, res) {
  Product.findOne({_id: req.body.productId}, function(err, product) {
    if (err) {
      res.status(500).send({error: 'Could not add item to wishlist'});
    } else {
      Wishlist.update({_id: req.body.wishlistId}, {$addToSet: {products: product._id}}, function(err, wishlist) {
        if (err) {
          res.status(500).send({error: 'Could not add item to wishlist'});
        } else {
          res.send(wishlist);
        }
      })
    }
  })
})

app.listen(3000, function() {
  console.log('Shop running');
})