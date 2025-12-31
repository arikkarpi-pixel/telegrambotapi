// Данные приложения
const userBalance = {
    total: 4059.61,
    assets: [
        { 
            name: "Tether", 
            symbol: "USDT", 
            balance: 4059.61, 
            price: 0.998, 
            change: -0.05, 
            color: "#26a17a", 
            icon: "fa-dollar-sign" 
        },
        { 
            name: "Toncoin", 
            symbol: "TON", 
            balance: 0, 
            price: 1.64, 
            change: 0.84, 
            color: "#0088cc", 
            icon: "fa-telegram" 
        },
        { 
            name: "Solana", 
            symbol: "SOL", 
            balance: 0, 
            price: 0, 
            change: 0, 
            color: "#00ffa3", 
            icon: "fa-fire" 
        },
        { 
            name: "USDTo", 
            symbol: "USDTo", 
            balance: 0, 
            price: 0, 
            change: 0, 
            color: "#5a67d8", 
            icon: "fa-coins" 
        },
        { 
            name: "TON", 
            symbol: "TON", 
            balance: 0, 
            price: 0, 
            change: 0, 
            color: "#0088cc", 
            icon: "fa-telegram" 
        },
        { 
            name: "SOL", 
            symbol: "SOL", 
            balance: 0, 
            price: 0, 
            change: 0, 
            color: "#00ffa3", 
            icon: "fa-fire" 
        }
    ]
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    renderAssets();
    initTelegramWebApp();
    initToggle();
    initEventListeners();
    startAutoUpdate();
});

// Рендеринг списка активов
function renderAssets() {
    const container = document.getElementById('assetsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    userBalance.assets.forEach(asset => {
        const assetElement = createAssetElement(asset);
        container.appendChild(assetElement);
    });
}

// Создание элемента актива
function createAssetElement(asset) {
    const div = document.createElement('div');
    div.className = 'asset-item';
    
    div.innerHTML = `
        <div class="asset-icon" style="background-color: ${asset.color};">
            <i class="fas ${asset.icon}"></i>
        </div>
        <div class="asset-info">
            <div class="asset-name-row">
                <span class="asset-name">${asset.name}</span>
                <span class="asset-balance">${formatNumber(asset.balance)} ${asset.symbol}</span>
            </div>
            <div class="asset-price-row">
                <span class="asset-price">$${asset.price.toFixed(asset.price === 0 ? 0 : 3)}</span>
                ${asset.change !== 0 ? 
                    `<span class="asset-change ${asset.change > 0 ? 'positive' : 'negative'}">
                        ${asset.change > 0 ? '+' : ''}${asset.change}%
                    </span>` : 
                    '<span></span>'
                }
            </div>
        </div>
    `;
    
    return div;
}

// Форматирование чисел
function formatNumber(num) {
    if (num === 0) return '0';
    if (num < 0.01) return num.toFixed(4);
    if (num < 1) return num.toFixed(3);
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Интеграция с Telegram WebApp
function initTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Показываем панель Telegram
        document.getElementById('telegramPanel').style.display = 'block';
        
        // Расширяем на весь экран
        tg.expand();
        
        // Настраиваем кнопку
        tg.MainButton.setText("Открыть в боте").show();
        tg.MainButton.onClick(() => {
            tg.openTelegramLink('https://t.me/cryptobot');
        });
        
        // Отправляем данные в бота
        tg.sendData(JSON.stringify({
            action: "balance",
            value: userBalance.total
        }));
    }
}

// Закрытие Telegram панели
function closeTelegramPanel() {
    document.getElementById('telegramPanel').style.display = 'none';
}

// Инициализация переключателя
function initToggle() {
    const toggle = document.getElementById('hideSmallBalances');
    if (!toggle) return;
    
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

// Навигация
function setActive(element) {
    event.preventDefault();
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });
    element.classList.add('active');
}

// Функции для кнопок действий
function showDeposit() {
    alert("💳 Пополнение баланса\n\n1. Выберите криптовалюту\n2. Укажите сумму пополнения\n3. Скопируйте адрес кошелька\n4. Отправьте средства");
}

function showWithdraw() {
    alert("📤 Вывод средств\n\n1. Введите адрес кошелька\n2. Укажите сумму вывода\n3. Подтвердите транзакцию\n4. Дождитесь подтверждения сети");
}

function showExchange() {
    alert("🔄 Обмен валют\n\n1. Выберите валютную пару\n2. Введите сумму обмена\n3. Проверьте курс и комиссию\n4. Подтвердите обмен");
}

function showMarket() {
    alert("📊 Биржевые торги\n\nДоступные торговые пары:\n• BTC/USDT\n• ETH/USDT\n• TON/USDT\n• SOL/USDT\n• USDC/USDT");
}

// Обновление баланса (симуляция API)
function updateBalance() {
    // Случайное изменение баланса ±$10
    const change = (Math.random() - 0.5) * 20;
    userBalance.total += change;
    
    // Обновляем отображение
    const balanceElement = document.getElementById('totalBalance');
    if (balanceElement) {
        balanceElement.textContent = `$${formatNumber(userBalance.total)}`;
    }
    
    // Обновляем USDT баланс
    if (userBalance.assets[0]) {
        userBalance.assets[0].balance = userBalance.total;
        userBalance.assets[0].change = change > 0 ? 0.05 : -0.05;
    }
    
    renderAssets();
    
    // Симуляция обновления в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: "update",
            balance: userBalance.total,
            timestamp: new Date().toISOString()
        }));
    }
}

// Автообновление
function startAutoUpdate() {
    // Обновляем каждые 30 секунд
    setInterval(updateBalance, 30000);
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Добавь дополнительные обработчики здесь при необходимости
}
