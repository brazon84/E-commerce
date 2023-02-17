// Botón del carrito => Mostrar y ocultar carrito.
const carToggle = document.querySelector(".car__toggle");
const carBlock = document.querySelector(".car__block");
// URL para petición AXIOS.
const baseURL = "https://academlo-api-production.up.railway.app/api"
const productsList = document.querySelector("#products-container")
// Carrito de compras
const car = document.querySelector('#car');
const carList = document.querySelector('#car__list')
let carProducts = []


// Lógica para mostrar y ocultar el carrito.
carToggle.addEventListener("click", () => {
    carBlock.classList.toggle("nav__car__visible")
})

//! Listeners
eventListenersLoader()


function eventListenersLoader() {
    //* Se ejecuta cuando se presione el botón "Add to car"
    productsList.addEventListener('click', addProduct);
    // elimina una a una los productos
    car.addEventListener('click', deleteProduct);
    //vacia el carrito
    document.getElementById('empty__car').addEventListener('click', emptyCart);

    // se ejecuta al cargar la pagina
    document.addEventListener('DOMContentLoaded', () => {
        carProducts = JSON.parse(localStorage.getItem("car")) || []
        carElementsHTML();
    })
}

// Petición GET.
function getProducts() {
    axios.get(`${baseURL}/products`)
        .then(function (response) {
            const products = response.data
            printProducts(products)
        })
        .catch(function (error) {
            console.log(error)
        })
};
getProducts()

// Pintar productos dentro de la web:
function printProducts(products) {
    let html = '';
    for (let i = 0; i < products.length; i++) {
        html += `
        <div class="product__container">
            <div class="product__container__img">
                <img src="${products[i].images.image1}" alt="">
            </div>
            <div class="product__container__name">
                <p>${products[i].name}</p>
            </div>
            <div class="product__container__price">
                <p>$ ${products[i].price.toFixed(2)}</p>
            </div>
            <div class="product__container__button">
                <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}">Add to car</button>
            </div>
        </div>
        `
    }
    productsList.innerHTML = html;
}

//* Agregar productos al carrito.

//* 1. Capturar la información del producto al que le de click.
function addProduct(e) {
    if (e.target.classList.contains('add__to__car')) {
        const product = e.target.parentElement.parentElement
        carProductsElements(product)
    }
}

//* 2. Debo transformar la información HTML en un array de objetos.
function carProductsElements(product) {
    const infoProduct = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('.product__container__name p').textContent,
        price: product.querySelector('.product__container__price p').textContent,
        quantity: 1
    }

    //* Agregar contador
    if (carProducts.some(product => product.id === infoProduct.id)) {
        const product = carProducts.map(product => {
            if (product.id === infoProduct.id) {
                product.quantity++;
                return product;
            } else {
                return product;
            }
        })
        carProducts = [...product]
    } else {
        carProducts = [...carProducts, infoProduct]
    }

    carElementsHTML()
}

//* 3. Imprimir, pintar, dibujar O renderizar los productos dentro del carrito.
function carElementsHTML() {

    //! como cada vez que iteramos con forEach creamos un nuevo div, debemos depurar los duplicados reinicializando el carList con innerHTML vacío. Esto borra todo lo que pueda ser repetido.
    carList.innerHTML = "";

    carProducts.forEach(product => {
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="car__product">
            <div class="car__product__image">
                <img src="${product.image}" alt="">
            </div>
            <div class="car__product__description">
                <div>
                    <p>${product.name}</p>
                </div>
                <div>
                    <p>Precio: ${product.price}</p>
                </div>
                <div>
                    <p>Cantidad: ${product.quantity}</p>
                </div>
                <div class="car__product__button">
                    <button class="delete__product" data-id="${product.id}">Delete</button>
                </div>
            </div>
        </div>
        <hr>
        `;
        carList.appendChild(div)
    })
    // se llama la funcion del productStore
    productStore()
}

function productStore() {
    localStorage.setItem('car', JSON.stringify(carProducts))
}
//eliminar producto
function deleteProduct(e) {
    if (e.target.classList.contains('delete__product')) {
        const productId = e.target.getAttribute('data-id');
        const filteredProducts = carProducts.filter(product => product.id === productId);

        if (filteredProducts.length > 0) {
            const productIndex = carProducts.indexOf(filteredProducts[0]);

            if (carProducts !== -1) {
                const product = carProducts[productIndex];
                if (product.quantity > 10) {
                    carProducts[productIndex].quantity -= 10;
                } else if (product.quantity > 1) {
                    carProducts[productIndex].quantity--;
                } else {
                    carProducts.splice(productIndex, 1);
                }
                carElementsHTML();
            }
        }
    }
}
//vacia el carrito de compras
function emptyCart() {
    carProducts = [];
    carElementsHTML();
}
//button de modo oscuro
const darkModeButton = document.getElementById('dark-mode-button');
const body = document.body;

darkModeButton.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
});