// State Management
let cart = JSON.parse(localStorage.getItem('mvelase_cart') || '[]');
let isAdminLoggedIn = localStorage.getItem('mvelase_admin_auth') === 'true';
let isCustomerLoggedIn = localStorage.getItem('mvelase_customer_session') !== null;

// System Logging Utility
function addLog(action, details, type = 'info') {
    const logs = JSON.parse(localStorage.getItem('mvelase_system_logs') || '[]');
    const newLog = {
        id: 'LOG-' + Date.now(),
        timestamp: new Date().toLocaleString(),
        action: action,
        details: details,
        type: type // info, success, warning, error
    };
    logs.unshift(newLog);
    localStorage.setItem('mvelase_system_logs', JSON.stringify(logs.slice(0, 100))); // Keep last 100 logs
}

// UI Components - Injected via JS to keep HTML files clean and consistent
const sharedComponents = {
    navbar: `
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="index.html" class="flex-shrink-0 flex items-center cursor-pointer">
                    <span class="text-2xl font-serif font-bold text-primary">Mvelase</span>
                    <span class="ml-2 text-sm font-medium text-gray-500 uppercase tracking-widest hidden sm:block">Pinafore Collection</span>
                </a>
                <div class="hidden lg:flex space-x-6">
                    <a href="index.html" class="nav-link text-gray-600 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">Home</a>
                    <a href="shop.html" class="nav-link text-gray-600 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">Shop</a>
                    <a href="gallery.html" class="nav-link text-gray-600 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">Gallery</a>
                    <a href="tracking.html" class="nav-link text-gray-600 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">Track Order</a>
                    <a href="faq.html" class="nav-link text-gray-600 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">FAQ</a>
                    <a href="about.html" class="nav-link text-gray-600 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">About Us</a>
                    <a href="contact.html" class="nav-link text-gray-600 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">Contact</a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="customer_dashboard.html" class="p-2 text-gray-600 hover:text-primary flex items-center group" title="My Dashboard">
                        <i data-lucide="user" class="w-6 h-6"></i>
                    </a>
                    <a href="cart.html" class="p-2 text-gray-600 hover:text-primary relative" title="Shopping Bag">
                        <i data-lucide="shopping-bag" class="w-6 h-6"></i>
                        <span id="cart-count" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full hidden">0</span>
                    </a>
                    <button id="mobile-menu-button" class="lg:hidden p-2 text-gray-600 hover:text-primary">
                        <i data-lucide="menu" class="w-6 h-6"></i>
                    </button>
                </div>
            </div>
        </div>
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="lg:hidden hidden bg-white border-t border-gray-100 pb-4">
            <div class="px-2 pt-2 space-y-1">
                <a href="index.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream">Home</a>
                <a href="shop.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream">Shop</a>
                <a href="gallery.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream">Gallery</a>
                <a href="customer_dashboard.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream">My Dashboard</a>
                <a href="tracking.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream">Track Order</a>
                <a href="faq.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream">FAQ</a>
                <a href="about.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream">About Us</a>
                <a href="contact.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream">Contact</a>
                <a href="dashboard_admin.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-cream border-t border-gray-100 mt-2 pt-2">Admin Dashboard</a>
            </div>
        </div>
    </nav>
    `,
    footer: `
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div class="md:col-span-2">
                    <span class="text-3xl font-serif font-bold text-primary">Mvelase</span>
                    <p class="mt-4 text-gray-400 max-w-sm">Premium handmade aprons from the heart of KwaZulu-Natal. Empowering local craftsmanship and bringing quality to every kitchen.</p>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-4">Quick Links</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="index.html" class="hover:text-primary">Home</a></li>
                        <li><a href="shop.html" class="hover:text-primary">Shop</a></li>
                        <li><a href="gallery.html" class="hover:text-primary">Gallery</a></li>
                        <li><a href="customer_dashboard.html" class="hover:text-primary">My Dashboard</a></li>
                        <li><a href="faq.html" class="hover:text-primary">FAQ</a></li>
                        <li><a href="terms.html" class="hover:text-primary">Terms & Privacy</a></li>
                        <li><a href="dashboard_admin.html" class="hover:text-primary">Admin Portal</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-4">Follow Us</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-primary"><i data-lucide="facebook"></i></a>
                        <a href="#" class="text-gray-400 hover:text-primary"><i data-lucide="instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                <p>&copy; 2024 Mvelase Pinafore Collection. All rights reserved. Pietermaritzburg, South Africa.</p>
            </div>
        </div>
    </footer>
    `
};

// Initialize shared components on load
function initShared() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (navPlaceholder) navPlaceholder.innerHTML = sharedComponents.navbar;
    if (footerPlaceholder) footerPlaceholder.innerHTML = sharedComponents.footer;

    // Mobile Menu Toggle logic
    const mobileBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // Set active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('text-primary');
            link.classList.remove('text-gray-600');
        }
    });

    updateCartUI();
    lucide.createIcons();
}

// Cart Logic
function addToCart(name, price, idPrefix) {
    const sizeElem = document.getElementById(`${idPrefix}-size`);
    const colorElem = document.getElementById(`${idPrefix}-color`);
    const qtyElem = document.getElementById(`${idPrefix}-qty`);

    const size = sizeElem ? sizeElem.value : 'Medium';
    const color = colorElem ? colorElem.value : 'Natural';
    const qty = qtyElem ? parseInt(qtyElem.value) : 1;

    if (qty < 1) return;

    const existingItem = cart.find(i => i.name === name && i.size === size && i.color === color);
    
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ name, price, size, color, qty });
    }

    saveCart();
    updateCartUI();
    addLog('Cart Action', `${qty}x ${name} added to cart`, 'info');
    
    // Toast notification
    showToast(`${qty} x ${name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('mvelase_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        if (count > 0) {
            cartCount.innerText = count;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-[100] transition-opacity duration-300';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Data Handling Helpers
function getOrders() {
    return JSON.parse(localStorage.getItem('mvelase_orders') || '[]');
}

function saveOrders(orders) {
    localStorage.setItem('mvelase_orders', JSON.stringify(orders));
}

function getSystemLogs() {
    return JSON.parse(localStorage.getItem('mvelase_system_logs') || '[]');
}

// Inventory (CRM Feature)
const defaultStock = [
    { id: 'basic', name: 'Basic Apron', stock: 45, price: 80 },
    { id: 'premium', name: 'Premium Apron', stock: 20, price: 150 }
];

function getInventory() {
    return JSON.parse(localStorage.getItem('mvelase_inventory') || JSON.stringify(defaultStock));
}

function saveInventory(inventory) {
    localStorage.setItem('mvelase_inventory', JSON.stringify(inventory));
}

document.addEventListener('DOMContentLoaded', initShared);
