import ManagerMongoDb from "../dao/ManagerMongoDb.js";

const ProductManager = new ManagerMongoDb.ProductManagerMongo();

export const getProd = async (req, res) => {
    const { limit, page, sort, query } = req.query
    let queryList = { limit, page, sort, query }

    try {
        const products = await ProductManager.getProduct(queryList);
        res.send({ status: 'success', products })
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export const getAllProds =  async (req, res) => {
    try {
        const products = await ProductManager.getAllProducts();
        res.send(products)
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export const createProd =  async (req, res) => {
    const newProduct = {
        ...req.body,
    };
    try {
        const response = await ProductManager.createProduct(newProduct);
        res.send(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const updateProd =  async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    try {
        const response = await ProductManager.updateProduct(id, product);
        res.send(response);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export const deleteProd = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await ProductManager.deleteProduct(id);
        res.send({
            message: 'Product deleted successfully',
            id: id
        })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export {ProductManager};