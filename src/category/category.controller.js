import Category from "../category/category.model.js"
import mongoose from "mongoose"

export const defaultCategory = async(req,res)=>{
    try {
        const categoryExists = await Category.findOne({ defaultCat: true })
 
        if(categoryExists){
            console.log('Default category already exists')
            return
        }
 
        const category = new Category(
            {
                name: 'Default Category',
                description: 'This is the default category',
                defaultCat: true,
            }
        )
        await category.save()
        console.log('Default category create succesfully')
    } catch(err){
        console.error(err);
        return res.status(500).send(
            {
                success: false,
                message: "General error",
                err,
            }
        )
    }
}

export const createCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
  
      const newCategory = new Category({ name, description });
      await newCategory.save();
  
      return res.status(201).json({ success: true, message: 'Category added successfully', category: newCategory });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Error adding category', err });
    }
  };
  
  // Admin: Editar una categoría
  export const updateCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name, description } = req.body;
  
      const category = await Category.findByIdAndUpdate(categoryId, { name, description }, { new: true });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      return res.status(200).json({ success: true, message: 'Category updated successfully', category });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Error updating category', err });
    }
  };
  
  // Admin: Eliminar una categoría y reasignar productos a la categoría predeterminada
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Buscar la categoría a eliminar
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Buscar la categoría predeterminada
        const defaultCategory = await Category.findOne({ defaultCat: true });
        if (!defaultCategory) {
            return res.status(404).json({ success: false, message: 'Default category not found' });
        }

        // Reasignar productos de la categoría a la categoría predeterminada
        const products = await Product.find({ category: categoryId });
        if (products.length > 0) {
            await Product.updateMany(
                { category: categoryId },
                { $set: { category: defaultCategory._id } }
            );
        }

        // Eliminar la categoría
        await category.remove();

        return res.status(200).json({
            success: true,
            message: 'Category deleted and products reassigned to the default category'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error deleting category', err });
    }
};
  
  // Admin y Usuario: Obtener todas las categorías
  export const getAllCategory = async (req, res) => {
    try {
      const categories = await Category.find();
      return res.status(200).json({ success: true, categories });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Error fetching categories', err });
    }
  };

  // Admin: Obtener una categoría por su ID
export const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Buscar la categoría por ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Devolver la categoría encontrada
        return res.status(200).json({
            success: true,
            category
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error fetching category by ID', err });
    }
};