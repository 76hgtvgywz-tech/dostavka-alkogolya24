document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    const categoryBtns = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product-card');
    if (categoryBtns.length && products.length) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const category = this.dataset.category;
                products.forEach(product => {
                    if (category === 'all' || product.dataset.category === category) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Обработка формы обратной связи
    const form = document.getElementById('feedback-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const statusDiv = document.getElementById('order-status');
            statusDiv.innerHTML = '⏳ Отправка...';
            statusDiv.style.color = '#333';

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const comment = document.getElementById('comment').value.trim();

            const data = {
                name: name,
                phone: phone,
                comment: comment,
                source: 'Сайт АЛКОдоставка'
            };

            try {
                // ⚠️ ЗАМЕНИТЕ URL НА АДРЕС ВАШЕГО PHP-СКРИПТА
                const response = await fetch('https://dostavka-alkogolya24.vercel.app/api/telegram', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    statusDiv.innerHTML = '✅ Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
                    statusDiv.style.color = '#2e7d32';
                    form.reset();
                } else {
                    statusDiv.innerHTML = '❌ Ошибка: ' + (result.error || 'Неизвестная ошибка');
                    statusDiv.style.color = '#d32f2f';
                }
            } catch (error) {
                statusDiv.innerHTML = '❌ Ошибка соединения. Попробуйте позже или позвоните нам.';
                statusDiv.style.color = '#d32f2f';
            }
        });
    }
});

