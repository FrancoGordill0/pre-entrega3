import {ProductRepository} from "./product.repository.js";

export const productService = new ProductRepository(productDao);