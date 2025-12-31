// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Анимация загрузки
    animateElements();
    
    // Настройка переключателя
    setupToggle();
    
    // Настройка навигации
    setupNavigation();
    
    // Настройка кнопок
    setupButtons();
    
    // Запуск симуляции
    startSimulation();
});

// Анимация элементов
function animateElements() {
    const elements = document.querySelectorAll('.asset-card, .banner, .action-btn');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + index * 100);
    });
}

// Настройка переключателя
function setupToggle() {
    const toggle = document.getElementById('hideSmall');
    const assetCards = document.querySelectorAll('.asset-card');
    
    toggle.addEventListener('change', function() {
        assetCards.forEach(card => {
            const balanceText = card.querySelector('.asset-balance').textContent;
            if (balanceText.includes('0') && this.checked) {
                card.style.display = 'none';
            } else {
                card.style.display = 'flex';
            }
        });
    });
}

// Настройка навигации
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Удаляем активный класс у всех
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Добавляем активный класс текущему
            this.classList.add('active');
            
            // Анимация перехода
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Настройка кнопок действий
function setupButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Эффект нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Получаем тип действия
            const action = this.querySelector('.btn-text').textContent;
            
            // Показываем соответствующее сообщение
            switch(action) {
                case 'Пополнить':
                    showNotification('📥 Открыт интерфейс пополнения');
                    break;
                case 'Вывести':
                    showNotification('📤 Открыт интерфейс вывода');
                    break;
                case 'Обмен':
                    showNotification('🔄 Открыт интерфейс обмена');
                    break;
                case 'Биржа':
                    showNotification('📈 Открыт интерфейс биржи');
                    break;
            }
        });
    });
}

// Показ уведомлений
function showNotification(message) {
    // Удаляем предыдущие уведомления
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.innerHTML = `
        <div class="notification-content">
            ${message}
        </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(82, 136, 193, 0.95), rgba(38, 222, 129, 0.95));
        color: white;
        padding: 16px 28px;
        border-radius: 16px;
        font-weight: 600;
        font-size: 15px;
        z-index: 9999;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 12px 40px rgba(82, 136, 193, 0.4);
        animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 90%;
        text-align: center;
        letter-spacing: 0.3px;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 3000);
}

// Анимации для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideDown {
        from {
            top: -100px;
            opacity: 0;
        }
        to {
            top: 20px;
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            top: 20px;
            opacity: 1;
        }
        to {
            top: -100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Симуляция изменений цен
function startSimulation() {
    const assets = [
        {
            name: 'Tether',
            priceElement: document.querySelector('.asset-card:nth-child(1) .asset-price'),
            changeElement: document.querySelector('.asset-card:nth-child(1) .price-change'),
            basePrice: 0.998,
            volatility: 0.0005
        },
        {
            name: 'Toncoin',
            priceElement: document.querySelector('.asset-card:nth-child(2) .asset-price'),
            changeElement: document.querySelector('.asset-card:nth-child(2) .price-change'),
            basePrice: 1.65,
            volatility: 0.02
        },
        {
            name: 'Solana',
            priceElement: document.querySelector('.asset-card:nth-child(3) .asset-price'),
            changeElement: document.querySelector('.asset-card:nth-child(3) .price-change'),
            basePrice: 3.4,
            volatility: 0.05
        }
    ];
    
    // Обновляем цены каждые 10 секунд
    setInterval(() => {
        assets.forEach(asset => {
            // Генерируем случайное изменение
            const change = (Math.random() - 0.5) * 2 * asset.volatility;
            const newPrice = asset.basePrice * (1 + change);
            const percentage = (change * 100).toFixed(2);
            
            // Обновляем отображение
            const priceText = `$${newPrice.toFixed(asset.name === 'Tether' ? 3 : 2)}`;
            const changeText = `${parseFloat(percentage) > 0 ? '+' : ''}${percentage}%`;
            
            asset.priceElement.innerHTML = `${priceText} <span class="price-change ${parseFloat(percentage) > 0 ? 'positive' : 'negative'}">${changeText}</span>`;
            
            // Небольшая анимация
            asset.priceElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                asset.priceElement.style.transform = 'scale(1)';
            }, 200);
        });
    }, 10000);
}

// Эффект параллакса при скролле
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const balanceSection = document.querySelector('.balance-section');
    if (balanceSection) {
        balanceSection.style.transform = `translateY(${rate * 0.3}px)`;
    }
    
    lastScroll = scrolled;
});

// Добавляем эффект при наведении на карточки
document.querySelectorAll('.asset-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.asset-icon');
        icon.style.transform = 'rotate(10deg) scale(1.1)';
        icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.asset-icon');
        icon.style.transform = 'rotate(0) scale(1)';
    });
});
