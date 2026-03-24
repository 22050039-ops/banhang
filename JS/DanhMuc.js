// 1. Giả lập cơ sở dữ liệu sản phẩm (100 món)
const allProducts = [];
const brands = ['asus', 'razer', 'logitech'];
const cats = ['pc', 'laptop', 'keyboard', 'mouse', 'monitor'];

for(let i=1; i<=100; i++) {
    const type = cats[Math.floor(Math.random() * cats.length)];
    allProducts.push({
        id: i,
        name: `${type.toUpperCase()} Gaming Pro X${i}`,
        brand: brands[Math.floor(Math.random() * brands.length)],
        type: type,
        price: (Math.floor(Math.random() * 50) + 1) * 1000000,
        isPromo: i <= 15, // 15 sản phẩm đầu là khuyến mãi
        icon: type === 'keyboard' ? 'fas fa-keyboard' : type === 'mouse' ? 'fas fa-mouse' : 'fas fa-desktop'
    });
}

// 2. Biến điều hướng
let currentPage = 1;
const itemsPerPage = 12;
let filteredData = [...allProducts];

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    
    // Đọc URL để lọc nhanh (VD từ Header click vào "Bàn phím")
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    if(typeParam) {
        document.getElementById('filter-type').value = typeParam;
    }

    renderPromos(); // 15 sản phẩm khuyến mãi
    applyFilters(); // Render sản phẩm chính
    setupEvents();
});

// 3. Xử lý logic lọc
function applyFilters() {
    const type = document.getElementById('filter-type').value;
    const priceRange = document.getElementById('filter-price').value;
    const activeBrands = Array.from(document.querySelectorAll('.brand-f:checked')).map(i => i.value);

    filteredData = allProducts.filter(p => {
        const matchType = type === 'all' || p.type === type;
        const matchBrand = activeBrands.length === 0 || activeBrands.includes(p.brand);
        let matchPrice = true;
        if(priceRange === '0-10') matchPrice = p.price < 10000000;
        else if(priceRange === '10-30') matchPrice = p.price >= 10000000 && p.price <= 30000000;
        else if(priceRange === '30-999') matchPrice = p.price > 30000000;

        return matchType && matchBrand && matchPrice;
    });

    // Hiện/Ẩn lọc tùy chỉnh
    const extraBox = document.getElementById('extra-filters');
    const extraList = document.getElementById('extra-check-list');
    if(type === 'keyboard' || type === 'mouse') {
        extraBox.style.display = 'block';
        extraList.innerHTML = `
            <label class="check-item">Không dây <input type="checkbox"><span></span></label>
            <label class="check-item">LED RGB <input type="checkbox"><span></span></label>
        `;
    } else {
        extraBox.style.display = 'none';
    }

    currentPage = 1;
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('main-grid');
    const resText = document.getElementById('result-text');
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filteredData.slice(start, start + itemsPerPage);

    resText.innerText = `Tìm thấy ${filteredData.length} sản phẩm`;
    
    grid.innerHTML = pageItems.map(p => `
        <div class="product-card" onclick="location.href='ChiTiet.html?id=${p.id}'">
            <i class="${p.icon} fa-4x"></i>
            <h4 class="product-name">${p.name}</h4>
            <p class="price">${p.price.toLocaleString()}đ</p>
        </div>
    `).join('');

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const box = document.getElementById('pagination-box');
    box.innerHTML = '';

    for(let i=1; i<=totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => {
            currentPage = i;
            renderGrid();
            window.scrollTo({top: 500, behavior: 'smooth'});
        };
        box.appendChild(btn);
    }
}

function renderPromos() {
    const container = document.getElementById('promo-list');
    const promos = allProducts.filter(p => p.isPromo);
    container.innerHTML = promos.map(p => `
        <div class="product-card" style="min-width: 200px;">
            <div style="color:var(--neon-pink); font-size: 12px; font-weight: bold;">FLASH SALE</div>
            <i class="${p.icon} fa-3x"></i>
            <h4 style="font-size: 0.8rem;">${p.name}</h4>
            <p class="price" style="font-size: 0.9rem;">${(p.price * 0.7).toLocaleString()}đ</p>
        </div>
    `).join('');
}

function setupEvents() {
    document.getElementById('filter-type').addEventListener('change', applyFilters);
    document.getElementById('filter-price').addEventListener('change', applyFilters);
    document.querySelectorAll('.brand-f').forEach(cb => cb.addEventListener('change', applyFilters));
    
    // Nút slide
    document.getElementById('slide-next').onclick = () => document.getElementById('promo-list').scrollBy(300, 0);
    document.getElementById('slide-prev').onclick = () => document.getElementById('promo-list').scrollBy(-300, 0);
}

function initParticles() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
            position: absolute; width: 2px; height: 2px; background: var(--neon-blue);
            top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
            opacity: ${Math.random()}; box-shadow: 0 0 10px var(--neon-blue);
        `;
        container.appendChild(p);
    }
}