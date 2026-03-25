
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

// This array acts as our temporary database
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