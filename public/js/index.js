//Sign up

const elementExists = (id) => document.getElementById(id) !== null;

elementExists('signup') &&
    document.getElementById('signup').addEventListener('click', function () {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const age = document.getElementById('age').value;

        const data = { firstName, lastName, email, password, age }
        console.log(data)

        fetch('/api/registro', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((data)=>{
            const result = data.json();
            console.log(result);
            if ( data.status === 200){

                window.location.href='/api/login'
            }else{
                alert('El email ya existe')
            }
        })
    })

//Login

const handleLogin = async (email, password) => {
    const config = {
        method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password})
    }
    try {
        const response = await fetch(`/api/login/user`, config)
        const data = await response.json()
        console.log(data)
        return data.message
    } catch (error) {
        console.log(error)
    }
}

elementExists('send') &&
    document.getElementById('send').addEventListener('click', function () {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        handleLogin(email, password).then(data => {
            if (data === 'success') {
                window.location.href = '/api/login/products'
            }else{
                alert('Usuario o contraseña incorrecta')
            }
        })
        
    })

elementExists('logout') && 
    document.getElementById('logout').addEventListener('click', async function(){
        try {
            const response = await fetch('/api/login/logout')
            const data = await response.json()
            console.log(data)
            if (data.message === 'LogoutOK'){
                window.location.href = '/api/home';
            }else{
                alert('logout failed')
            }
        } catch (error) {
            console.log(error)
        }
    })

//Products

let containerCards = document.getElementById('containerCards')
let containerCart = document.getElementById('containerCart')
let btnAnterior = document.getElementById('btnAnterior')
let btnSiguiente = document.getElementById('btnSiguiente')
let linkCarrito = document.getElementById('linkCarrito')
let tituloCarrito = document.getElementById('tituloCarrito')
let pag = document.getElementById('pag')
let admin = document.getElementById('admin')
let pagina = 1
//let limite


const paginaProductos = () => {

    const getProduct = async (limit = 2, page = 1) => {
        const product = await fetch(`/api/products/?limit=${limit}&page=${page}`)
        const result = await product.json()
        return result
    }

    const renderProducts = async () => {
        const products = await getProduct()

        if (!products.products.hasPrevPage) {
            btnAnterior.disabled = true
        }
        if (products.products.hasNextPage) {
            btnSiguiente.disabled = false
        }
        if (!products.products.hasNextPage) {
            btnSiguiente.disabled = true
        }
        if (products.products.hasPrevPage) {
            btnAnterior.disabled = false
        }

        render(products)
    }
    renderProducts()


    const render = (products) => {

        containerCards.innerHTML = ''
        products.products.docs.map((prod, index) => {
            const item = document.createElement('div')
            item.classList.add('item')
            item.innerHTML =
                `<div class="card" style="width: 15rem; margin: 5px">
                <div class="card-body">
                <h5 class="card-title">${prod.title}</h5>
                <p class="card-text"> ${prod.description}</p>
                <p class="card-text">PRECIO: $${prod.price}</p>
                <p class="card-text">CATEGORIA: ${prod.category}</p>
                <p class="card-text">Codigo: ${prod.code}</p>
                <label for="cantidad">Cantidad:</label>
                <input type=number class="card-text" min="1" value="1" id="${index}"/>
                </div>
                <button class="btn btn-primary mx-auto mb-1" id=${prod._id}>Agregar al Carrito</button>
                </div>`
            containerCards.appendChild(item)
            const cantidad = document.getElementById(index)
            cantidad.addEventListener('change', (e) => { recibirCantidad(e.target.value) })

            let quantity;
            const recibirCantidad = (cant) => {
                quantity = cant
            }
            const btnAgregar = document.getElementById(prod._id)
            btnAgregar.addEventListener('click', () => addCart(prod._id, quantity))

        }
        )
    }

    const siguiente = async () => {
        pagina++
        pag.innerHTML = pagina
        const products = await getProduct(6, pagina)
        if (!products.products.hasNextPage) {
            btnSiguiente.disabled = true
        }
        if (products.products.hasPrevPage) {
            btnAnterior.disabled = false
        }

        render(products)
    }
    const anterior = async () => {
        pagina--
        pag.innerHTML = pagina
        const products = await getProduct(6, pagina)

        if (!products.products.hasPrevPage) {
            btnAnterior.disabled = true
        }
        if (products.products.hasNextPage) {
            btnSiguiente.disabled = false
        }

        render(products)
    }

    btnSiguiente.addEventListener('click', siguiente)
    btnAnterior.addEventListener('click', anterior)

}
elementExists('pag') && paginaProductos()


//Cart
const getUser = async () => {
    const user = await fetch(`/api/login/user`)
    const data = await user.json()
    return data
}

const getCart = async () => {
    const user = await getUser()
    const userId = user.user._id
    const getCartUser = await fetch(`/api/carts/${userId}`)
    const data = await getCartUser.json()
    return data
}

const addCart = async (pid, quantity) => {
    console.log(quantity)
    const carritoUser = await getUser()
    const cartId = carritoUser.user.cart

    try {
        const addCartProduct = await fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: quantity
            })
        })
        alert('Producto agregado al carrito')
    } catch (err) {
        console.log(err)
    }

}

const deleteCart = async (pid) => {
    const carritoUser = await getUser()
    const cartId = carritoUser.user.cart
    try {
        const deleteCartProduct = await fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        alert('Producto eliminado del carrito')
        renderCart()
    }
    catch (err) {
        console.log(err)
    }
}

const renderCart = async () => {
    const productos = await getCart()
    containerCart.innerHTML = ''
    await productos[0].products.map((prod) => {
        console.log(prod)
        const item = document.createElement('div')
        item.classList.add('item')
        item.innerHTML =
            `<div class="card" style="width: 15rem; margin: 5px">
        <div class="card-body">
            <h5 class="card-title">${prod.product.title}</h5>
            <p class="card-text"> ${prod.product.description}</p>
            <p class="card-text">PRECIO: $${prod.product.price}</p>
            <p class="card-text">Cantidad: ${prod.quantity}</p>
            <button class="btn btn-danger mx-auto mb-1" id=${prod.product._id}>Eliminar del Carrito</button>
         </div>
     </div>`

        containerCart.appendChild(item)

        const btnEliminar = document.getElementById(prod.product._id)
        btnEliminar.addEventListener('click', () => deleteCart(prod.product._id))

    }
    )
}
elementExists('containerCart') && renderCart()

//Admin Vista

const paginaAdministrador = () => {
    let paginaAdm = document.getElementById('pagina')

    const getProduct = async (limit = 6, page = 1) => {
        console.log(limit, page)
        const product = await fetch(`/api/products/?limit=${limit}&page=${page}`)
        const result = await product.json()
        return result
    }

    const getAllProducts = async () => {
        const getAllProducts = await fetch(`/api/products/all`)
        const result = await getAllProducts.json()
        return result
    }

    const renderProductsAdmin = async() => {
        const products = await getProduct()
        if (!products.products.hasPrevPage) {
            btnAnterior.disabled = true
        }
        if (products.products.hasNextPage) {
            btnSiguiente.disabled = false
        }
        if (!products.products.hasNextPage) {
            btnSiguiente.disabled = true
        }
        if (products.products.hasPrevPage) {
            btnAnterior.disabled = false
        }

        render(products)
    }

    renderProductsAdmin()

    const render = async (products) => {
        console.log(products)
        containerCards.innerHTML = ''
        products.products.docs.map((prod, index) => {
            const item = document.createElement('div')
            item.classList.add('item')
            item.innerHTML =
                `<div class="card" style="width: 15rem; margin: 5px">
                <div class="card-body">
                <h5 class="card-title">${prod.title}</h5>
                <p class="card-text"> ${prod.description}</p>
                <p class="card-text">PRECIO: $${prod.price}</p>
                <p class="card-text">CATEGORIA: ${prod.category}</p>
                <p class="card-text">Codigo: ${prod.code}</p>
                </div>
            
                </div>`
            containerCards.appendChild(item)
        }
        )
    }


    const addProduct = async (e) => {
        e.preventDefault()
        const products = await getAllProducts()
        
        const prod = {
            title: document.getElementById('nombre').value,
            description: document.getElementById('descripcion').value,
            price: document.getElementById('precio').value,
            category: document.getElementById('categoria').value,
            code: document.getElementById('codigo').value
        }

        const code = products.find(prod => prod.code == document.getElementById('codigo').value)

        if (code) {
            alert('El codigo ya existe')
            return
        }
        if (!prod.title || !prod.description || !prod.price || !prod.category || !prod.code) {
            alert('Todos los campos son obligatorios')
            return
        }

        console.log(prod)
        await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        })
        alert('Producto agregado')
        renderProductsAdmin()
        pagina=1
        paginaAdm.innerHTML = pagina
        formulario.reset()
    }

    const deleteProduct = async (e) => {
        e.preventDefault()
        const products = await getAllProducts()
        const deleteProduct = document.getElementById('codigoEliminar').value
        const id = products.find(prod => prod.code == deleteProduct)

        if (!id) {
            alert('El codigo no existe')
            return
        }

        await fetch(`/api/products/${id._id}`, {
            method: 'DELETE'
        })
        alert('Producto eliminado')
        renderProductsAdmin()
        pagina=1
        paginaAdm.innerHTML = pagina
        formulario.reset()
    }

    const formulario = document.getElementById('form')
    document.getElementById('btnAdd').addEventListener('click', addProduct)
    document.getElementById('btnEliminar').addEventListener('click', deleteProduct)


    const siguiente = async () => {
        pagina++
        paginaAdm.innerHTML = pagina
        const products = await getProduct(6, pagina)
        if (!products.products.hasNextPage) {
            btnSiguiente.disabled = true
        }
        if (products.products.hasPrevPage) {
            btnAnterior.disabled = false
        }

        render(products)
    }
    const anterior = async () => {
        pagina--
        paginaAdm.innerHTML = pagina
        const products = await getProduct(6, pagina)

        if (!products.products.hasPrevPage) {
            btnAnterior.disabled = true
        }
        if (products.products.hasNextPage) {
            btnSiguiente.disabled = false
        }

        render(products)
    }
    let btnAnterior = document.getElementById('btnAnt')
    let btnSiguiente = document.getElementById('btnSig')

    btnSiguiente.addEventListener('click', siguiente)
    btnAnterior.addEventListener('click', anterior)
}

elementExists('btnAdd') && paginaAdministrador()