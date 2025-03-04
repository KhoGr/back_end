import ProductService from "../service/product.service.js";

class ProductController {
    static async getAll(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm" });
        }
    }

    static async getById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: "Lỗi lấy sản phẩm" });
        }
    }

    static async create(req, res) {
        try {
            const newProduct = await ProductService.createProduct(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: "Lỗi tạo sản phẩm" });
        }
    }

    static async update(req, res) {
        try {
            const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
            if (!updatedProduct) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: "Lỗi cập nhật sản phẩm" });
        }
    }

    static async remove(req, res) {
        try {
            const deleted = await ProductService.deleteProduct(req.params.id);
            if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            res.json({ message: "Xóa sản phẩm thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi xóa sản phẩm" });
        }
    }
}

export default ProductController;
