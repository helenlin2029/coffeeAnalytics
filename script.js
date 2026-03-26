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

        const existingItem = orderList.querySelector(`[data-item-id="${name}"]`);

        if (existingItem) {
            const qtyElement = existingItem.querySelector('.qty');
            let currentQty = parseInt(qtyElement.innerText);
            qtyElement.innerText = currentQty + 1;
        } else {
            const newItem = document.createElement('div');
            newItem.classList.add('order-item');
            
            newItem.setAttribute('data-item-id', name);
            
            newItem.innerHTML = `
                <span><span class="qty">1</span>x ${name}</span>
                <span>$${price.toFixed(2)}</span>
            `;
            
            orderList.appendChild(newItem);
        }

        currentTotal += price;
        totalDisplay.innerText = `$${currentTotal.toFixed(2)}`;
    });
});

const clearBtn = document.getElementById('clear-cart-btn');

clearBtn.addEventListener('click', () => {
    orderList.innerHTML = '';
    currentTotal = 0;
    totalDisplay.innerText = `$0.00`;
});


//send data to backend


const checkoutBtn = document.querySelector('.checkout-btn');

checkoutBtn.addEventListener('click', async () => {
    // This object 'orderData' is what Python receives as 'request.json'
    const orderData = {
        order_items: [
            { name: "Iced Latte", price: 4.50, quantity: 1 },
            { name: "Croissant", price: 3.25, quantity: 2 }
        ]
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Success:", result.status);
            alert("Order Successful!");
        }
    } catch (error) {
        console.error("Connection Error:", error);
    }
});
