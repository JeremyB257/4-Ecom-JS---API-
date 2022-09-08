// CONST
const APIURL = 'http://localhost:3000/api/products';

let productArray = JSON.parse(localStorage.getItem('product'));

const cartItems = document.getElementById('cart__items');

const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');

const cartOrder = document.querySelector('.cart__order');
const inputFirstName = document.getElementById('firstName');
const inputLastName = document.getElementById('lastName');
const inputAddress = document.getElementById('address');
const inputCity = document.getElementById('city');
const inputEmail = document.getElementById('email');
const orderBtn = document.getElementById('order');

const regExpText = /^[a-zA-Z ]{2,25}$/;
const regExpAddress = /^[a-zA-Z0-9 '-]{2,75}$/;
const regExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// EVENT

inputFirstName.addEventListener('change', verifyFirstName);
inputLastName.addEventListener('change', verifyLastName);
inputAddress.addEventListener('change', verifyAddress);
inputCity.addEventListener('change', verifyCity);
inputEmail.addEventListener('change', verifyEmail);

orderBtn.addEventListener('click', submitOrder);


// FUNCTION

async function fetchProduct() {
    await fetch(APIURL)
    .then((res) => res.json())
    .catch(err => console.log(err))
    .then((promise) => {
        respData = promise
    })
    .catch(err => console.log(err))
};


async function getProduct() {
    await fetchProduct();
    await productArray;
    
// verifie si il y a un produit dans le local storage
    if (productArray) {
// trie les produits dans le local storage par id
        productArray.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0));
        for(i = 0; i < productArray.length; i++) {
            respData.forEach(productAPI => {
// prend l'id du produit dans le local storage et le cherche dans l'api
            if (productArray[i]._id == productAPI._id ) {
// creer un bloc pour chaque produit dans le local storage, on utilise le 
// prix venant de l'API pour eviter les modifs dans le local storage
                const cartItem = document.createElement('article');
                cartItem.className =`cart__item`;
                cartItem.setAttribute('data-id', `${productAPI._id}`)
                cartItem.setAttribute('data-color', `${productArray[i].couleur}`)
                cartItem.innerHTML = `
                    <div class="cart__item__img">
                        <img src="${productAPI.imageUrl}" alt="${productAPI.altTxt}">
                    </div>`;
                cartItems.appendChild(cartItem);

                const content = document.createElement('div');
                content.className = 'cart__item__content';
                content.innerHTML = `
                    <div class="cart__item__content__description">
                        <h2>${productAPI.name}t</h2>
                        <p>${productArray[i].couleur}</p>
                        <p>${productAPI.price}</p>
                    </div>`;
                cartItem.appendChild(content);


                const contentSetting = document.createElement('div');
                contentSetting.className = "cart__item__content__settings";
                content.appendChild(contentSetting);

                const quantityDiv = document.createElement('div');
                quantityDiv.className = "cart__item__content__settings__quantity";
                quantityDiv.innerHTML = "<p>Qté : </p>";
                contentSetting.appendChild(quantityDiv);

                const inputQty = document.createElement('input');
                inputQty.type = "number";
                inputQty.className = "itemQuantity";
                inputQty.name = "itemQuantity";
                inputQty.setAttribute('min', "1");
                inputQty.setAttribute('max', "100");
                inputQty.setAttribute('value', `${productArray[i].quantity}`);
                quantityDiv.appendChild(inputQty);
                inputQty.addEventListener('focusout', (e) => {
                    updateQty(e);
                });

                const deleteBtnDiv = document.createElement('div');
                deleteBtnDiv.className = "cart__item__content__settings__delete";
                contentSetting.appendChild(deleteBtnDiv);

                const deleteItem = document.createElement('p');
                deleteItem.innerText = "Supprimer";
                deleteBtnDiv.appendChild(deleteItem);
                deleteItem.addEventListener('click', (e) => {
                    removeProduct(e);
                });

            }
            });
        }
    } else {
        cartOrder.classList.add('hidden');
    }
}

getProduct();

// modifie la quantité du produit
function updateQty(e) {
    const parentTarget = e.target.parentNode.parentNode.parentNode.parentNode;
    const dataId = parentTarget.getAttribute('data-id');
    const dataColor = parentTarget.getAttribute('data-color');
    for(let i = 0; i < productArray.length; i++) {
        if (dataId == productArray[i]._id && dataColor == productArray[i].couleur ) {
// verifie si la quantité a changer           
            if (productArray[i].quantity != e.target.value) {
                if ( e.target.value ==0) {
                    return ( removeProduct(e) );
                } else {
                    return ( 
                        productArray = JSON.parse(localStorage.getItem('product')),
                        productArray[i].quantity = e.target.value,
                        localStorage.setItem('product', JSON.stringify(productArray)),
                        productArray = JSON.parse(localStorage.getItem('product')),
                        qtyTotal(),
                        priceTotal()
                    );
                }
            } 
        } 
    }
}

// supprime le produit du panier
function removeProduct(e) {
    const parentTarget = e.target.parentNode.parentNode.parentNode.parentNode;
    const dataId = parentTarget.getAttribute('data-id');
    const dataColor = parentTarget.getAttribute('data-color');
    for(let i = 0; i < productArray.length; i++) {
        if (dataId == productArray[i]._id && dataColor == productArray[i].couleur ) {
            productArray = JSON.parse(localStorage.getItem('product'));
            productArray.splice(i, 1);
            localStorage.setItem('product', JSON.stringify(productArray));
            productArray = JSON.parse(localStorage.getItem('product'));
            parentTarget.remove();
            if (productArray.length == 0) {
                localStorage.removeItem('product');
                cartOrder.classList.add('hidden');
            }
            return (    
                qtyTotal(),
                priceTotal()
            );
        }
    }
}


// calcule la quantité total de produit dans le panier
function qtyTotal() {
    let qtySum = 0
    if (productArray) {
        for(i = 0; i < productArray.length; i++) {
        qtySum += parseInt(productArray[i].quantity);
        }
    }
    return (
        totalQuantity.innerHTML = qtySum
    );
    
}

qtyTotal();

// calcule le prix total du panier
async function priceTotal() {
    await fetchProduct();
    let priceSum = 0
    if (productArray) {
        for(i = 0; i < productArray.length; i++) {
            respData.forEach(productAPI => {
// prend l'id du produit dans le local storage et le cherche dans l'api
                if (productArray[i]._id == productAPI._id ) {
                    let priceTotalProduct = productAPI.price * productArray[i].quantity;
                    priceSum += priceTotalProduct;
                }
            });
        }
    }
    return (
        totalPrice.innerHTML = priceSum
    );
}

priceTotal();


//////////////////////// FORMULAIRE /////////////////////////

let valueFirstName = null;
function verifyFirstName() {
    const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    if (inputFirstName.value.length >= 3 && inputFirstName.value.length <= 25) {
        firstNameErrorMsg.innerHTML = '';
        if (regExpText.test(inputFirstName.value)) {
            return ( valueFirstName = inputFirstName.value );
            
        } else {
            valueFirstName = null;
            firstNameErrorMsg.innerHTML = 'Le prénom ne doit pas contenir de caracteres speciaux';
        }
    } else {
        valueFirstName = null;
        firstNameErrorMsg.innerHTML = 'Le prénom doit etre compris entre 3 et 25 caracteres';
    }    
}

let valueLastName = null;
function verifyLastName() {
    const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    if (inputLastName.value.length >= 3 && inputLastName.value.length <= 25) {
        lastNameErrorMsg.innerHTML = '';
        if (regExpText.test(inputLastName.value)) {
            return ( valueLastName = inputLastName.value );
            
        } else {
            valueLastName = null;
            lastNameErrorMsg.innerHTML = 'Le nom ne doit pas contenir de caracteres speciaux ou accent';
        }
    } else {
        valueLastName = null;
        lastNameErrorMsg.innerHTML = 'Le nom doit etre compris entre 3 et 25 caracteres';
    }    
}

let valueAddress = null;
function verifyAddress() {
    const addressErrorMsg = document.getElementById('addressErrorMsg');
    if (inputAddress.value.length >= 3 && inputAddress.value.length <= 25) {
        addressErrorMsg.innerHTML = '';
        if (regExpAddress.test(inputAddress.value)) {
            return ( valueAddress = inputAddress.value );
            
        } else {
            valueAddress = null;
            addressErrorMsg.innerHTML = "L'adresse ne doit pas contenir de caracteres speciaux ou accent";
        }
    } else {
        valueAddress = null;
        addressErrorMsg.innerHTML = "L'adresse doit etre compris entre 3 et 75 caracteres";
    }    
}

let valueCity = null;
function verifyCity() {
    const cityErrorMsg = document.getElementById('cityErrorMsg');
    if (inputCity.value.length >= 3 && inputCity.value.length <= 25) {
        cityErrorMsg.innerHTML = '';
        if (regExpAddress.test(inputCity.value)) {
            return ( valueCity = inputCity.value );
            
        } else {
            valueCity = null;
            cityErrorMsg.innerHTML = "La ville ne doit pas contenir de caracteres speciaux ou accent";
        }
    } else {
        valueCity = null;
        cityErrorMsg.innerHTML = "La ville doit etre compris entre 3 et 75 caracteres";
    }    
}

let valueEmail = null;
function verifyEmail() {
    const emailErrorMsg = document.getElementById('emailErrorMsg');
    emailErrorMsg.innerHTML = "";
    if (regExpEmail.test(inputEmail.value)) {
        return ( valueEmail = inputEmail.value );
           
    } else {
        valueEmail = null;
        emailErrorMsg.innerHTML = "Entrez une email valide, ex: Bob@gmail.com";
    }
}

function submitOrder(e) {
    e.preventDefault();
    if (valueFirstName && valueLastName && valueAddress && valueCity && valueEmail) {
        const orderProductId = [];
        productArray.forEach(product => {
            orderProductId.push(product._id);
        });
        const order = {
         contact: {
           firstName: valueFirstName,
           lastName: valueLastName,
           address: valueAddress,
           city: valueCity,
           email: valueEmail
         },
         products: orderProductId
        }
        fetch("http://localhost:3000/api/products/order", {
	        method: "POST",
	        headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
        },
	    body: JSON.stringify(order)
        })
        .then(function(res) {
            if (res.ok) {
              return res.json();
            }
          })
          .then(function(value) {
              localStorage.setItem('order', JSON.stringify(value));
              window.location.href = "./confirmation.html";
          });
          
    } else {
        alert('Veuillez remplir les champs correctement');
    }
}
