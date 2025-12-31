// Данные приложения
const appData = {
    balance: 4759.61,
    assets: [
        {
            id: 1,
            name: "Tether",
            symbol: "USDT",
            balance: 4759.61,
            price: 0.998,
            change: -0.05,
            icon: "💵",
            color: "#26a17a"
        },
        {
            id: 2,
            name: "Toncoin",
            symbol: "TON",
            balance: 0,
            price: 1.64,
            change: 0.84,
            icon: "🔹",
            color: "#0088cc"
        },
        {
            id: 3,
            name: "Solana",
            symbol: "SOL",
            balance: 0,
            price: 0,
            change: 0,
            icon: "🔥",
            color: "#00ffa3"
        },
        {
            id: 4,
            name: "USDTo",
            symbol: "USDTo",
            balance: 0,
            price: 0,
            change: 0,
            icon: "💎",
            color: "#5a67d8"
        },
        {
            id: 5,
            name: "TON",
            symbol: "TON",
            balance: 0,
            price: 0,
            change: 0,
            icon: "🔹",
            color: "#0088cc"
        },
        {
            id: 6,
            name: "SOL",
            symbol: "SOL",
            balance: 0,
            price: 0,
            change: 0,
            icon: "🔥",
            color: "#00ffa3"
        }
    ]
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadAssets();
    setupTelegram();
});

// Основная инициализация
function initApp() {
    // Настройка переключателя
    const toggle = document.getElementById('hideZeroBalances');
    if (toggle) {
        toggle.addEventListener('change', function() {
            const items = document.querySelectorAll('.asset-item');
            items.forEach(item => {
                const balanceText = item.querySelector('.asset-balance').textContent;
                const balanceValue = parseFloat(balanceText);
                if (balanceValue === 0 && this.checked) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'flex';
                }
            });
        });
    }

    // Настройка навигации
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });

    // Автообновление баланса
    startAutoUpdate();
}

// Загрузка активов
function loadAssets() {
    const container = document.getElementById('assetsList');
    container.innerHTML = '';

    appData.assets.forEach(asset => {
        const assetElement = createAssetElement(asset);
        container.appendChild(assetElement);
    });
}

// Создание элемента актива
function createAssetElement(asset) {
    const div = document.createElement('div');
    div.className = 'asset-item';
    div.dataset.id = asset.id;

    const changeClass = asset.change > 0 ? 'change-positive' : 'change-negative';
    const changeSign = asset.change > 0 ? '+' : '';
    const changeText = asset.change !== 0 ? `${changeSign}${asset.change}%` : '';

    div.innerHTML = `
        <div class="asset-icon" style="background: ${asset.color}20; color: ${asset.color}">
            ${asset.icon}
        </div>
        <div class="asset-info">
            <div class="asset-name-row">
                <div class="asset-name">${asset.name}</div>
                <div class="asset-balance">${formatNumber(asset.balance)} ${asset.symbol}</div>
            </div>
            <div class="asset-price-row">
                <div class="asset-price">$${asset.price.toFixed(asset.price === 0 ? 0 : 3)}</div>
                ${asset.change !== 0 ? 
                    `<div class="asset-change ${changeClass}">${changeText}</div>` : 
                    '<div></div>'
                }
            </div>
        </div>
    `;

    // Добавляем обработчик клика
    div.addEventListener('click', () => selectAsset(asset.id));

    return div;
}

// Форматирование чисел
function formatNumber(num) {
    if (num === 0) return '0';
    if (num < 0.01) return num.toFixed(4);
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Интеграция с Telegram WebApp
function setupTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Расширяем на весь экран
        tg.expand();
        
        // Настраиваем кнопку
        tg.MainButton.setText("Обновить баланс");
        tg.MainButton.onClick(() => {
            updateBalance();
            tg.showAlert("Баланс обновлен!");
        });
        tg.MainButton.show();
        
        // Отправляем данные
        tg.sendData(JSON.stringify({
            action: "init",
            balance: appData.balance
        }));
        
        // Слушаем сообщения от бота
        tg.onEvent('viewportChanged', () => {
            tg.expand();
        });
    }
}

// Обновление баланса
function updateBalance() {
    // Случайное изменение баланса ±$50
    const change = (Math.random() - 0.5) * 100;
    const oldBalance = appData.balance;
    appData.balance += change;
    
    // Обновляем USDT баланс
    appData.assets[0].balance = appData.balance;
    appData.assets[0].change = change > 0 ? 0.05 : -0.05;
    
    // Обновляем отображение
    document.getElementById('totalBalance').textContent = `$${formatNumber(appData.balance)}`;
    loadAssets();
    
    // Отправляем в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: "balance_update",
            oldBalance: oldBalance,
            newBalance: appData.balance,
            change: change
        }));
    }
    
    showNotification(`Баланс ${change > 0 ? 'увеличился' : 'уменьшился'} на $${Math.abs(change).toFixed(2)}`);
}

// Автообновление
function startAutoUpdate() {
    // Обновляем каждые 30 секунд
    setInterval(updateBalance, 30000);
}

// Показ страниц
function showPage(page) {
    switch(page) {
        case 'home':
            // Уже открыта
            break;
        case 'exchange':
            alert("Функция обмена в разработке");
            break;
        case 'qr':
            alert("QR-код: https://2no.co/cryptobotrnyprofile");
            break;
        case 'history':
            alert("История транзакций будет здесь");
            break;
        case 'profile':
            alert("Профиль пользователя");
            break;
    }
}

// Выбор актива
function selectAsset(id) {
    const asset = appData.assets.find(a => a.id === id);
    if (asset) {
        alert(`${asset.name} (${asset.symbol})\nБаланс: ${formatNumber(asset.balance)}\nЦена: $${asset.price}`);
    }
}

// Функции кнопок
function showDeposit() {
    alert("Пополнение баланса:\n\n1. Выберите криптовалюту\n2. Укажите сумму\n3. Отправьте на адрес кошелька");
}

function showWithdraw() {
    alert("Вывод средств:\n\n1. Введите адрес кошелька\n2. Укажите сумму\n3. Подтвердите транзакцию");
}

function showExchange() {
    alert("Обмен валют:\n\nДоступные пары:\n• USDT/TON\n• USDT/BTC\n• USDT/ETH\n• USDT/SOL");
}

function showMarket() {
    alert("Биржевые торги:\n\n• BTC/USDT\n• ETH/USDT\n• TON/USDT\n• SOL/USDT");
}

// Уведомления
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #5288c1;
        color: #f5f5f5;
        padding: 12px 24px;
        border-radius: 12px;
        z-index: 3000;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(82, 136, 193, 0.3);
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем стили анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { top: -100px; opacity: 0; }
        to { top: 20px; opacity: 1; }
    }
    @keyframes slideUp {
        from { top: 20px; opacity: 1; }
        to { top: -100px; opacity: 0; }
    }
`;
document.head.appendChild(style);
