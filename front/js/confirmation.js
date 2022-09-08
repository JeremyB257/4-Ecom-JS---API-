const orderId = document.getElementById('orderId');
const order = JSON.parse(localStorage.getItem('order'));

orderId.innerHTML = order.orderId;

localStorage.clear();