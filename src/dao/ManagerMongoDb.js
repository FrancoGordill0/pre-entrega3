import { productModel } from "../models/product.model.js";
import { cartModel } from "../models/cart.model.js";


class ProductManagerMongo{

    async getAllProducts() {
        try {
            const products = await productModel.find();
            return products;
        }
        catch (err) {
            throw err;
        }
    }
    

    async getProduct(queryList){
        const {query, sort} = queryList
        
        try{
            if (queryList){
                const productsParams = await productModel.paginate(query?{category: query}:{},{limit:queryList.limit || 10, page:queryList.page || 1});
                if (sort === 'asc'){
                    const productsParamas = await productModel.aggregate([
                        {
                            $sort: {price :1}
                        }
                    ])
                    return productsParamas
                }
                if (sort === 'desc'){
                    const productsParamas = await productModel.aggregate([
                        {
                            $sort: {price:-1}
                        }
                    ])
                    return productsParamas
                }
                 return productsParams; 
            }
        }
        catch(err){
            throw err; 
        }
    }

    async createProduct(product) {
        try {
            const newProduct = new productModel(product);
            await newProduct.save();
            return product;
        } catch (err) {
            throw err;
        }
    }

    async updateProduct(id, product) {
        try{
            const update = await productModel.findByIdAndUpdate(id, product);
            return update;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteProduct(id) {
        try {
            const deleteProd = await productModel.findByIdAndDelete(id);
            return deleteProd;
        }
        catch (err) {
            throw err;
        }
    }
}

class CartManagerMongo{

    async getCart(){
        try{
            const cart = await cartModel.find();
            return  JSON.stringify(cart, null, '\t');
        }
        catch (err) {
            throw err;
        }
    }

    async getCartUser(id){
        try{
            const cart = await cartModel.find({user: id});
            return  JSON.stringify(cart, null, '\t');
        }
        catch (err) {
            throw err;
        }
    }
    

    async createCart(cart){
        try{
            const newCart = new cartModel(cart);
            await newCart.save();
            return cart;
        }
        catch (err) {
            throw err;
        }
    }

    async addProductToCart(cid, pid, quantity){
        try{
            const cartId = await cartModel.findById(cid);
            let productId =  cartId.products.find(p => p.product.toString() === pid.toString())
            if (productId){
               productId.quantity = quantity
            }else{
                cartId.products.push({product:pid, quantity:quantity});
            }
            const cartUpdate = await cartModel.updateOne({_id: cid},cartId)
            return cartUpdate
        }
        catch (err) {
            throw err;
        }
    }

    async removeProductFromCart(cid, pid){
        try{
            const cartId = await cartModel.findById(cid);
                const findproduct = cartId.products
                const productCart = findproduct.findIndex(p=> p.product.toString() === pid.toString())
                
                findproduct.splice(productCart,1)
                const update = {products: findproduct}
                const updateCart = await cartModel.findByIdAndUpdate(cid, update );
                return updateCart
        }catch (err) {
            throw err;
        }
    }

    async deleteAllProductCart(id){
        try {
            const deleteProduct = {products:[]}
            const cart = await cartModel.findByIdAndUpdate(id, deleteProduct);
            return cart;
          } catch (err) {
            throw err;
          }
        }

        // Crea el ticket en la BD.
    async createTicket(cid) {
           try {
               // Busca el carrito.
               const cart = await cartModel.findOne({ _id: cid });
               const stockArray = [];
               const noStockArray = [];
        
               // Separa los productos que tienen stock de los que no.
               // A los productos que están en stock les multiplica su precio por la cantidad comprada, los quita del carrito y resta el stock.
               await Promise.all(
                   cart.products.map(async p => {
                       const product = await productModel.findOne({ _id: p.product });
                       if (product.stock < p.quantity) {
                           noStockArray.push({ product: p.product, quantity: p.quantity });
                           return;
                       }
                       stockArray.push({ product: p.product, quantity: p.quantity, price: product.price * p.quantity });
                       await this.deleteProduct(cid, p.product);
                       await productModel.updateOne({ _id: product._id }, {$set: { stock: product.stock - p.quantity } });                    
                   })
               );
        
               // Verifica que hayan quedado productos disponibles para comprar.
               if (stockArray.length > 0) {
                   // Suma el precio total de los productos que están en stock.
                   const total = stockArray.reduce((acc, p) => {
                       return (acc + p.price);
                   }, 0);
                       
                   // Crea el ticket de compra
                   const user = await userModel.findOne({ _id: cart.user });
                   await ticketModel.create({
                       code: new Date().toString().replaceAll(" ","").replaceAll(":", "").slice(0,18).toLowerCase(),
                       amount: total,
                       purchaser: user.email,
                   });
               }
               // Devuelve el array con los productos sin stock.
               return noStockArray;
           }
           catch (err) {
               console.log(err);
           }
        }

}

export default {ProductManagerMongo, CartManagerMongo}


