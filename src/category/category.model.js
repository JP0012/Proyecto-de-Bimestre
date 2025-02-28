import mongoose, {Schema, model} from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Category = mongoose.model('Category', categorySchema);

export default model ("Category",categorySchema);
