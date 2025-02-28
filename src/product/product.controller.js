import Product from '../product/product.model.js';
import Category from '../category/category.model.js';


// Admin: Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;

        // Verificar que la categoría exista
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Crear nuevo producto
        const product = new Product({
            name,
            description,
            price,
            stock,
            category: categoryId,
        });

        await product.save();
        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error creating product', err });
    }
};

// Admin: Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        return res.status(200).json({
            success: true,
            products,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error fetching products', err });
    }
};

// Admin: Obtener un producto por su ID
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate('category', 'name');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error fetching product by ID', err });
    }
};

// Admin: Editar un producto
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, price, stock, categoryId } = req.body;

        // Verificar si la categoría existe
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { name, description, price, stock, category: categoryId },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error updating product', err });
    }
};

// Admin: Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Buscar el producto por ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Eliminar el producto
        await product.remove();

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error deleting product', err });
    }
};

// Admin: Obtener los productos más vendidos
export const getBestSellingProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ sold: -1 }).limit(5); // Asumiendo que tienes un campo 'sold' para llevar el conteo
        return res.status(200).json({
            success: true,
            products,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error fetching most sold products', err });
    }
};

// Admin: Verificar stock antes de procesar una factura
export const getOutOfStockProducts = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock for this product',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Stock validated successfully',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error checking stock', err });
    }
};

// User: Explorar productos (sin necesidad de autenticación)
export const exploreProducts = async (req, res) => {
    try {
        const { categoryId, searchQuery } = req.query;
        const filter = {};

        if (categoryId) {
            filter.category = categoryId;
        }

        if (searchQuery) {
            filter.name = { $regex: searchQuery, $options: 'i' }; // Búsqueda por nombre
        }

        const products = await Product.find(filter).populate('category', 'name');
        return res.status(200).json({
            success: true,
            products,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error exploring products', err });
    }
};
