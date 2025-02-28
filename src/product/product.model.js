import mongoose, {Schema, model} from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

export default model ("Product",productSchema);
