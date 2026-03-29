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

    updateDashboard(); 
}


const buttons = document.querySelectorAll('.menu-item');
const orderList = document.getElementById('order-list'); 
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
            const newQty = currentQty + 1;
            qtyElement.innerText = newQty;

            const priceElement = existingItem.querySelector('.item-price');
            priceElement.innerText = `$${(price * newQty).toFixed(2)}`;
        } else {
            const newItem = document.createElement('div');
            newItem.classList.add('order-item');
            newItem.setAttribute('data-item-id', name);

            newItem.innerHTML = `
                <div class="item-info">
                    <span class="qty">1</span>x <span class="item-name">${name}</span>
                </div>
                <div class="item-actions">
                    <span class="item-price">$${price.toFixed(2)}</span>
                    <button class="remove-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;

            const delBtn = newItem.querySelector('.remove-btn');
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const qtyElement = newItem.querySelector('.qty');
                let qty = parseInt(qtyElement.innerText);

                currentTotal -= price;
                totalDisplay.innerText = `$${Math.max(0, currentTotal).toFixed(2)}`;

                if (qty > 1) {
                    const newQty = qty - 1;
                    qtyElement.innerText = newQty;
                    newItem.querySelector('.item-price').innerText = `$${(price * newQty).toFixed(2)}`;
                } else {
                    newItem.remove();
                }
            });

            orderList.appendChild(newItem);
        }

        currentTotal += price;
        totalDisplay.innerText = `$${currentTotal.toFixed(2)}`;
    });
});


//send data to backend

const checkoutBtn = document.querySelector('.checkout-btn');

checkoutBtn.addEventListener('click', async () => {
    const actualItems = [];
    
    const cartDivs = orderList.querySelectorAll('.order-item'); 

    cartDivs.forEach(div => {
        const name = div.getAttribute('data-item-id');
        const qtyElement = div.querySelector('.qty');
        const quantity = parseInt(qtyElement.innerText);

        const spans = div.querySelectorAll('span');
        const priceText = div.querySelector('.item-price').innerText;
        const price = parseFloat(priceText.replace('$', ''));

        actualItems.push({
            name: name,
            price: price,
            quantity: quantity
        });
    });

    if (actualItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const orderData = {
        order_items: actualItems
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Success:", result.status);
            
            alert("Order Successful!");
            orderList.innerHTML = ''; 
            totalDisplay.innerText = '$0.00'; 
            currentTotal = 0; 
        } else {
            alert("Server error. Please try again.");
        }

    } catch (error) {
        console.error("Connection Error:", error);
        alert("Python app not running?");
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

        console.log("Stats updated at: " + new Date().toLocaleTimeString());
    } catch (error) {
        console.error("Auto-update failed:", error);
    }
}

updateDashboard();

// run it every 5 seconds (5000 milliseconds)
setInterval(updateDashboard, 5000);





// chart
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the canvas context - using 'freq-chart' to match your HTML
    const canvasElement = document.getElementById('freq-chart');
    
    // Safety check: Make sure the element actually exists
    if (!canvasElement) {
        console.error("Could not find canvas with ID 'freq-chart'. Check your HTML!");
        return;
    }
    
    const ctx = canvasElement.getContext('2d');

    // 2. Initialize the Chart
    // We define this as 'const' inside the listener so loadGraphData can access it
    const activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Filled by fetch
            datasets: [{
                label: 'Order Volume',
                data: [], // Filled by fetch
                borderColor: '#6F4E37',
                backgroundColor: 'rgba(111, 78, 55, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6F4E37',
                pointRadius: 4,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#6F4E37',
                        font: { size: 14, family: 'serif' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    display: true, // Force display
                    ticks: {
                        color: '#4a3728', // Darker coffee brown
                        font: { size: 12 },
                        padding: 10 // Pushes numbers away from the line
                    },
                    title: {
                        display: true,
                        text: 'Number of Orders',
                        color: '#4a3728',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                x: {
                    display: true, // Ensure the axis is turned on
                    grid: {
                        display: false // Keeps the background clean
                    },
                    ticks: {
                        autoSkip: false,   // Force every hour to show up
                        maxRotation: 0,    // Keep them horizontal
                        color: '#6F4E37',  // Ensure they aren't white-on-white
                        font: { size: 10 }
                    },
                    title: {
                        display: true,
                        text: 'Time of Day',
                        color: '#6F4E37',
                        font: { family: 'serif', weight: 'bold' }
                    }
                }
            }
        }
    });

    // 3. Define the Fetch Function INSIDE the listener
    // This allows it to "see" the activityChart variable defined above
    function loadGraphData() {
        fetch('/api/cafe-activity')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
            console.log("Python sent this data:", data); // This will show in your console

            // 1. Explicitly clear any old data
            activityChart.data.labels = [];
            activityChart.data.datasets[0].data = [];

            // 2. Inject the new data using the exact names from your Python return
            // We use .push(...) to ensure the array updates correctly
            data.labels.forEach(label => activityChart.data.labels.push(label));
            data.values.forEach(val => activityChart.data.datasets[0].data.push(val));

            // 3. Force the chart to recalculate its axes and redraw
            activityChart.update();
        })
            
            .catch(error => {
                console.error('Error fetching graph data:', error);
            });
    }

    // 4. Run the fetch immediately on page load
    loadGraphData();
});