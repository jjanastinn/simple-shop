const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const wishlistSchema = new Schema ({
  title: {type: String, default: 'Cool wishlist'},
  products: [{type: ObjectId, ref: 'Product'}]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);