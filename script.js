// script.js

// 1. Управление отображением "страниц" (вкладок)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    function activateSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active-section');
        });
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active-section');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        document.querySelector('.main-nav').classList.remove('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const sectionId = href.substring(1);
            activateSection(sectionId);
            history.pushState(null, null, href);
        });
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash && ['main', 'catalog', 'contacts'].includes(initialHash)) {
        activateSection(initialHash);
    } else {
        activateSection('main');
    }

    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        if (hash && ['main', 'catalog', 'contacts'].includes(hash)) {
            activateSection(hash);
        } else {
            activateSection('main');
        }
    });

    // 2. Фильтрация каталога
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;

            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Мобильное меню
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // 4. Фон с падающими объектами
    const canvas = document.getElementById('falling-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const symbols = ['🍾', '💧', '$'];

    function initCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        particles = [];
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                size: 20 + Math.random() * 30,
                speed: 1 + Math.random() * 4,
                opacity: 0.4 + Math.random() * 0.5
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            ctx.font = `${p.size}px Arial, sans-serif`;
            ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
            if (p.symbol === '💧') ctx.fillStyle = `rgba(100, 150, 255, ${p.opacity})`;
            if (p.symbol === '🍾') ctx.fillStyle = `rgba(200, 100, 100, ${p.opacity})`;
            
            ctx.fillText(p.symbol, p.x, p.y);
            
            p.y += p.speed;
            
            if (p.y > height + p.size) {
                p.y = -p.size;
                p.x = Math.random() * width;
            }
        });
        
        requestAnimationFrame(drawParticles);
    }

    initCanvas();
    drawParticles();

    window.addEventListener('resize', function() {
        initCanvas();
    });
});

// 5. Функция отправки заявки в Telegram (глобальная)
async function sendOrder(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const statusDiv = document.getElementById('order-status');

    if (!name || !phone) {
        statusDiv.innerHTML = '❌ Пожалуйста, заполните имя и телефон.';
        statusDiv.style.color = 'red';
        return;
    }

    statusDiv.innerHTML = '⏳ Отправка...';
    statusDiv.style.color = 'blue';

    const orderData = {
        name: name,
        phone: phone,
        comment: comment || 'Без комментария',
        source: 'Alkovoz'
    };

    try {
        // ЗАМЕНИТЕ URL НА ВАШ АДРЕС
        const response = await fetch('https://alkovoz.online/telegram-sender.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            statusDiv.innerHTML = '✅ Спасибо! Заявка отправлена, скоро мы вам перезвоним.';
            statusDiv.style.color = 'green';
            document.getElementById('feedback-form').reset();
        } else {
            statusDiv.innerHTML = '❌ Ошибка при отправке. Попробуйте позже или позвоните нам.';
            statusDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        statusDiv.innerHTML = '❌ Ошибка соединения. Проверьте интернет.';
        statusDiv.style.color = 'red';
    }
}