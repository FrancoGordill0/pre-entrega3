class ProductRepository{
    constructor(dao){
        this.dao=dao;
    }

    async addProduct(product){
        const result = await this.dao.addProduct(product);
        return result;
    }

    async getProductById(id){
        const result = await this.dao.getProductById(id);
        return result;
    }
}

export {ProductRepository};