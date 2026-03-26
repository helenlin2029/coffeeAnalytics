// Logic to switch screens
function showView(viewName) {
    const customerDiv = document.getElementById('customer-view');
    const ownerDiv = document.getElementById('owner-view');

    if (viewName === 'customer') {
        customerDiv.classList.remove('hidden');
        ownerDiv.classList.add('hidden');
    } else {
        ownerDiv.classList.remove('hidden');
        customerDiv.classList.add('hidden');
    }
}



let orders = [];
function showView(viewName) {
    const customerView = document.getElementById('customer-view');
    const ownerView = document.getElementById('owner-view');

    if (viewName === 'customer') {
        customerView.style.display = 'block';
        ownerView.style.display = 'none';
    } else {
        ownerView.style.display = 'block';
        customerView.style.display = 'none';
        updateDashboard(); //later
    }
}



function goToHome() {
    const home = document.getElementById('customer-view');
    const analytics = document.getElementById('owner-view');

    home.style.display = 'block';
    analytics.style.display = 'none';
}



const buttons = document.querySelectorAll('.menu-item');
const orderList = document.querySelector('.order-list');
const totalDisplay = document.querySelector('.total-row span:last-child');

let currentTotal = 0;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('item-name');
        const price = parseFloat(button.getAttribute('item-price'));

        const newItem = document.createElement('div');
        newItem.classList.add('order-item');
        newItem.innerHTML = `
            <span>${name}</span>
            <span>$${price.toFixed(2)}</span>
        `;

        orderList.appendChild(newItem);

        currentTotal += price;
        totalDisplay.innerText = `$${currentTotal.toFixed(2)}`;
    });
});