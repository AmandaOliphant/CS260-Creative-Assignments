var mongoose = require('mongoose');
var PieSchema = new mongoose.Schema({
  title: String,
  author: {type: String, default: "Anonymous"},
  picture: {type: String, default: "https://res.cloudinary.com/teepublic/image/private/s--jo2BaLTG--/t_Preview/b_rgb:ffffff,c_limit,f_jpg,h_630,q_90,w_630/v1517274444/production/designs/2320272_0.jpg"},
  upvotes: {type: Number, default: 0},
  ingredients: {type: Array, default: [{"name":"No ingredients listed"}]},
  directions: {type: Array, default: [{"text":"No directions"}]},
});
mongoose.model('Pie', PieSchema);