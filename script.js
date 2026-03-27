function showView(viewName) {
    const customerView = document.getElementById('customer-view');
    const ownerView = document.getElementById('owner-view');
    const aboutUsView = document.getElementById('about-us-view');
    const productsView = document.getElementById('products-view');
    const contactView = document.getElementById('contact-view');

    if (viewName === 'customer') {
        customerView.style.display = 'block';
        ownerView.style.display = 'none';
        aboutUsView.style.display = 'none';
        productsView.style.display = 'none';
        contactView.style.display = 'none';
    }
    if (viewName === 'about') {
        customerView.style.display = 'none';
        ownerView.style.display = 'none';
        aboutUsView.style.display = 'block';
        productsView.style.display = 'none';
        contactView.style.display = 'none';
    }
    if (viewName === 'owner') {
        customerView.style.display = 'none';
        ownerView.style.display = 'block';
        aboutUsView.style.display = 'none';
        productsView.style.display = 'none';
        contactView.style.display = 'none';
    }
    if (viewName === 'products') {
        customerView.style.display = 'none';
        ownerView.style.display = 'none';
        aboutUsView.style.display = 'none';
        productsView.style.display = 'block';
        contactView.style.display = 'none';
    }
    if (viewName === 'contact') {
        customerView.style.display = 'none';
        ownerView.style.display = 'none';
        aboutUsView.style.display = 'none';
        productsView.style.display = 'none';
        contactView.style.display = 'block';
    }

    updateDashboard(); //later
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
            orderList.innerHTML = '';
            currentTotal = 0;
            totalDisplay.innerText = `$0.00`;
        }

    } catch (error) {
        console.error("Connection Error:", error);
    }
});


async function updateDashboard() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/stats');
        const data = await response.json();

        document.getElementById('stat-revenue').innerText = data.total_revenue;
        document.getElementById('stat-hour').innerText = data.busiest_hour;

        const list = document.getElementById('stat-list');
        list.innerHTML = ''; 
        
        data.popularity.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item[0]}: ${item[1]} sold`;
            list.appendChild(li);
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
    }
}

document.getElementById('refresh-stats').addEventListener('click', updateDashboard);
