import Cart from '../cart/cart.model.js';
import Product from '../product/product.model.js';

// Cliente: Agregar producto al carrito
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      const newCart = new Cart({ user: req.user.id, items: [{ product: productId, quantity }] });
      await newCart.save();
      return res.status(201).json({ success: true, message: 'Product added to cart', cart: newCart });
    }

    const existingProductIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (existingProductIndex !== -1) {
      cart.items[existingProductIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ success: true, message: 'Product added to cart', cart });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error adding product to cart', err });
  }
};

// Cliente: Obtener su carrito
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    return res.status(200).json({ success: true, cart });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching cart', err });
  }
};

// Cliente: Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    cart.items.splice(productIndex, 1);
    await cart.save();

    return res.status(200).json({ success: true, message: 'Product removed from cart', cart });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error removing product from cart', err });
  }
};
