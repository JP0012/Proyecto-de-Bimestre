
import mongoose, {Schema, model} from 'mongoose';

const userSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'CLIENT'], default: 'CLIENT' },
  status: { type: Boolean, default: true }, // Para marcar si el usuario está activo o no
});


export default model ("User",userSchema);
