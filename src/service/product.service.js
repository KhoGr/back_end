import Product from "../models/product.js";

class ProductService {
    static async getAllProducts() {
        return await Product.findAll();
    }

    static async getProductById(productId) {
        return await Product.findByPk(productId);
    }

    static async createProduct(productData) {
        return await Product.create(productData);
    }

    static async updateProduct(productId, updateData) {
        const product = await Product.findByPk(productId);
        if (!product) return null;
        return await product.update(updateData);
    }

    static async deleteProduct(productId) {
        const product = await Product.findByPk(productId);
        if (!product) return null;
        await product.destroy();
        return product;
    }
}

export default ProductService;
