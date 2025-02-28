import Invoice from "../invoice/invoice.model.js";
import Product from "../product/product.model.js"; // Importación para validar productos y actualizar stock
import Cart from "../cart/cart.model.js"; // Importación para obtener los productos del carrito

// Crear una nueva factura desde el carrito del usuario
export const createInvoice = async (req, res) => {
    try {
        const { userId } = req.body;

        // Obtener el carrito del usuario
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No hay productos en el carrito para crear una factura",
            });
        }

        // Validación: Asegurarse de que los productos del carrito existan y verificar el stock
        const validProducts = cart.products.map((item) => {
            const product = item.productId;
            if (!product || product.stock <= 0) {
                throw new Error(`Producto con ID ${product._id} no disponible o sin stock`);
            }
            return product;
        });

        // Crear la factura con los productos del carrito
        const newInvoice = new Invoice({
            userId,
            products: validProducts.map((product) => ({ productId: product._id, quantity: 1 })), // Se asume que por ahora solo compran 1 unidad
            status: "pending", // Se puede modificar según el estado inicial de la factura
        });

        await newInvoice.save();

        // Actualizar el stock de los productos después de generar la factura
        validProducts.forEach(async (product) => {
            product.stock -= 1; // Reducir el stock en 1, puedes modificarlo si hay más de 1 producto
            await product.save();
        });

        // Vaciar el carrito del usuario después de crear la factura
        await Cart.findOneAndUpdate({ userId }, { products: [] });

        return res.status(201).json({
            success: true,
            message: "Factura creada exitosamente",
            invoice: newInvoice,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message || "Error general al crear la factura",
        });
    }
};

// Obtener todas las facturas de un usuario
export const getInvoicesByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const invoices = await Invoice.find({ userId }).populate('products.productId', 'name price stock');
        
        return res.status(200).json({
            success: true,
            invoices,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message || "Error al obtener facturas",
        });
    }
};

// Obtener una factura por ID
export const getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await Invoice.findById(invoiceId).populate('products.productId', 'name price stock');
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Factura no encontrada",
            });
        }

        return res.status(200).json({
            success: true,
            invoice,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message || "Error al obtener la factura",
        });
    }
};

// Editar una factura (solo para Admin)
export const updateInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { products, status } = req.body;

        // Verificar que el usuario sea Admin (esto debería ser validado en algún middleware de autenticación)
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "Acceso denegado. Solo los administradores pueden editar facturas",
            });
        }

        // Validación: Asegurarse de que los productos existan y verificar el stock
        const productPromises = products.map(async (productId) => {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }
            return product;
        });

        const validProducts = await Promise.all(productPromises);

        // Validación de stock: Verificar que haya suficiente cantidad de productos en inventario
        validProducts.forEach((product) => {
            if (product.stock <= 0) {
                throw new Error(`No hay stock disponible para el producto ${product.name}`);
            }
        });

        // Actualizar la factura
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            invoiceId,
            { products, status },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Factura actualizada exitosamente",
            invoice: updatedInvoice,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message || "Error al actualizar la factura",
        });
    }
};

// Eliminar una factura (solo para Admin)
export const deleteInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        // Verificar que el usuario sea Admin (esto debería ser validado en algún middleware de autenticación)
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "Acceso denegado. Solo los administradores pueden eliminar facturas",
            });
        }

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Factura no encontrada",
            });
        }

        // Devolver stock de los productos
        await Promise.all(invoice.products.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += 1;  // Aumentar el stock
                await product.save();
            }
        }));

        // Eliminar la factura
        await Invoice.findByIdAndDelete(invoiceId);

        return res.status(200).json({
            success: true,
            message: "Factura eliminada exitosamente",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message || "Error al eliminar la factura",
        });
    }
};
