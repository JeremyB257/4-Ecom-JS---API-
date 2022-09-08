//SELECTOR
const APIURL = 'http://localhost:3000/api/products';

const itemId = document.location.search.substring(7);

const APIURLProduct = APIURL + '/' + itemId;
const itemImg = document.querySelector('.item__img');
const itemTitle = document.getElementById('title');
const itemPrice = document.getElementById('price');
const itemDesc = document.getElementById('description');
const itemColor = document.getElementById('colors');
const itemQty = document.getElementById('quantity');

const addToCart = document.getElementById('addToCart');


//EVENT



//FUNCTION

async function fetchProduct() {
    await fetch(APIURLProduct)
    .then((res) => res.json())
    .catch(err => console.log(err))
    .then((promise) => {
        product = promise
    })
    .catch(err => console.log(err))
};

// affiche le produit 
async function getProduct() {
    await fetchProduct();

    document.title = product.name;
    const img = document.createElement('img');
    img.alt = product.altTxt;
    img.src = product.imageUrl;
    itemImg.appendChild(img);
    itemTitle.innerHTML = product.name;
    itemPrice.innerHTML = product.price;
    itemDesc.innerHTML = product.description;

    for (let i = 0; i < product.colors.length; i++) {
        const option = document.createElement('option');
        option.value = product.colors[i];
        option.innerHTML = product.colors[i];
        itemColor.appendChild(option);
    }
    
    verifyInput(product);
    

    return product;
}

getProduct();

// Regex : verifie les Input couleur et quantité
function verifyInput(product) {
    addToCart.addEventListener('click', ()=> {
// verifie que l'utilisateur a bien selectioner une valeur
        if (itemColor.value.length >= 1) {
            const contentColor = document.querySelector('.color-err');
            contentColor.classList.add('hidden');
// verifie que l'utilisateur a bien mis une quantité
            if ((itemQty.value >= 1) && (itemQty.value <= 100)) {
                const contentQty = document.querySelector('.quantity-err');
                contentQty.classList.add('hidden');

                AddProductToCart(product, itemColor.value, parseInt(itemQty.value));

            } else {
                const contentQty = document.querySelector('.quantity-err');
                contentQty.classList.remove('hidden');
            }
        } else {
            const contentColor = document.querySelector('.color-err');
            contentColor.classList.remove('hidden');
        }
    })
}

//function ajouter au panier
function AddProductToCart(product, color, qty) {
    let productArray = JSON.parse(localStorage.getItem('product'));
    const productArrayFusion = Object.assign({}, product, {couleur: `${color}`, quantity: qty,});
    addToCart.classList.add('add-confirmation');
// verifie si un produit est deja dans le Local storage
// il n'y a pas de produit dans le local storage
    if (productArray == null || productArray.length == 0) {   
        productArray = [];
        productArray.push(productArrayFusion);
        localStorage.setItem('product', JSON.stringify(productArray));
// il y a un deja un produit dans le local storage
    } else if (productArray != null) {
        for(i = 0; i < productArray.length; i++) {
// verifie si c'est le même produit que l'on souhaite ajouter ID et couleur
            if (productArray[i]._id == product._id && productArray[i].couleur == color) {
                return (
                productArray[i].quantity += qty,
                localStorage.setItem('product', JSON.stringify(productArray)),
                productArray = JSON.parse(localStorage.getItem('product'))
                )
            }
        }
        for(i = 0; i < productArray.length; i++) {
// ce n'est pas le même produit que l'on souhaite ajouter
            if ((productArray[i]._id == product._id && productArray[i].couleur != color) || productArray[i]._id != product._id) {
                return (
                    productArray.push(productArrayFusion),
                    localStorage.setItem('product', JSON.stringify(productArray)),
                    productArray = JSON.parse(localStorage.getItem('product'))
                )
            }
        }
    }
    return (productArray = JSON.parse(localStorage.getItem('product')));   
}