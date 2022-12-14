// SELECTOR
//const APIURL = 'http://localhost:3000/api/products';
const APIURL = '../datas/products.json';
const items = document.getElementById('items');
const qtyCart = document.querySelector('.qty-cart');
let productArray = JSON.parse(localStorage.getItem('product'));

// EVENT

// FUNCTION
if (productArray) {
  qtyCart.innerHTML = `(${productArray.length})`;
}

async function fetchProduct() {
  await fetch(APIURL)
    .then((res) => res.json())
    .catch((err) => console.log(err))
    .then((promise) => {
      respData = promise;
    })
    .catch((err) => console.log(err));
}

async function getProduct() {
  await fetchProduct();

  respData.forEach((product) => {
    const a = document.createElement('a');
    a.href = `./product.html?id= ${product._id}`;
    items.appendChild(a);

    const article = document.createElement('article');
    a.appendChild(article);

    const img = document.createElement('img');
    img.src = `../images/${product.imageUrl}`;
    img.alt = product.altTxt;
    article.appendChild(img);

    const title = document.createElement('h3');
    title.classList = 'productName';
    title.innerHTML = product.name;
    article.appendChild(title);

    const desc = document.createElement('p');
    desc.classList = 'productDescription';
    desc.innerHTML = product.description;
    article.appendChild(desc);
  });
  return respData;
}

getProduct();
