// Данные приложения
const appData = {
    totalBalance: 4059.61,
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
    ],
    userId: "001",
    history: []
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    renderAssets();
    initToggle();
    updateHistory();
    
    // Устанавливаем ID пользователя
    document.getElementById('userId').textContent = appData.userId;
    
    // Добавляем начальные записи в историю
    addToHistory("Начальный баланс", 4059.61, true);
    addToHistory("Бонус за регистрацию", 50, true);
}

// Рендеринг активов
function renderAssets() {
    const container = document.getElementById('assetsList');
    container.innerHTML = '';
    
    appData.assets.forEach(asset => {
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
                    <span class="asset-price">$${asset.price.toFixed(3)}</span>
                    ${asset.change !== 0 ? 
                        `<span class="asset-change ${asset.change > 0 ? 'positive' : 'negative'}">
                            ${asset.change > 0 ? '+' : ''}${asset.change}%
                        </span>` : 
                        '<span></span>'
                    }
                </div>
            </div>
        `;
        container.appendChild(div);
    });
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

// Переключатель
function initToggle() {
    document.getElementById('hideSmallBalances').addEventListener('change', function() {
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
function showPage(page) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    if (page === 'profile') {
        document.getElementById('profilePage').classList.remove('hidden');
        document.querySelector('.header').style.display = 'none';
        document.querySelector('.banner').style.display = 'none';
        document.querySelector('.assets-section').style.display = 'none';
    } else if (page === 'home') {
        document.getElementById('profilePage').classList.add('hidden');
        document.querySelector('.header').style.display = 'block';
        document.querySelector('.banner').style.display = 'block';
        document.querySelector('.assets-section').style.display = 'block';
    }
}

// Добавление денег
function addMoney(amount) {
    const oldBalance = appData.totalBalance;
    appData.totalBalance += amount;
    
    // Обновляем USDT баланс
    appData.assets[0].balance = appData.totalBalance;
    
    // Обновляем отображение
    updateBalanceDisplay();
    renderAssets();
    
    // Добавляем в историю
    addToHistory(`Добавлено +$${amount}`, amount, true);
    
    // Показываем уведомление
    showNotification(`+$${amount} добавлено к балансу!`);
}

// Добавление кастомной суммы
function addCustomMoney() {
    const input = document.getElementById('customAmount');
    const amount = parseFloat(input.value);
    
    if (!amount || amount <= 0 || amount > 10000) {
        alert('Введите сумму от $1 до $10,000');
        return;
    }
    
    addMoney(amount);
    input.value = '';
}

// Обновление отображения баланса
function updateBalanceDisplay() {
    document.getElementById('totalBalance').textContent = `$${formatNumber(appData.totalBalance)}`;
}

// Сброс баланса
function resetBalance() {
    if (!confirm('Сбросить баланс к начальному значению $4,059.61?')) {
        return;
    }
    
    appData.totalBalance = 4059.61;
    appData.assets[0].balance = 4059.61;
    
    // Сбрасываем остальные активы
    for (let i = 1; i < appData.assets.length; i++) {
        appData.assets[i].balance = 0;
    }
    
    updateBalanceDisplay();
    renderAssets();
    addToHistory("Сброс баланса", 0, false);
    showNotification("Баланс сброшен!");
}

// Случайная сделка
function randomTrade() {
    const types = ['Покупка BTC', 'Продажа ETH', 'Обмен TON', 'Торговля SOL'];
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = (Math.random() * 500 - 250).toFixed(2);
    const isPositive = parseFloat(amount) > 0;
    
    appData.totalBalance += parseFloat(amount);
    appData.assets[0].balance = appData.totalBalance;
    
    updateBalanceDisplay();
    renderAssets();
    addToHistory(type, Math.abs(parseFloat(amount)), isPositive);
    
    const message = isPositive 
        ? `Прибыль: +$${amount}`
        : `Убыток: -$${Math.abs(parseFloat(amount))}`;
    showNotification(`${type} - ${message}`);
}

// История операций
function addToHistory(description, amount, isPositive) {
    const transaction = {
        id: Date.now(),
        description,
        amount,
        isPositive,
        time: new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    appData.history.unshift(transaction);
    
    // Ограничиваем историю 10 записями
    if (appData.history.length > 10) {
        appData.history.pop();
    }
    
    updateHistory();
}

function updateHistory() {
    const container = document.getElementById('historyList');
    container.innerHTML = '';
    
    appData.history.forEach(transaction => {
        const div = document.createElement('div');
        div.className = `history-item ${transaction.isPositive ? 'positive' : 'negative'}`;
        div.innerHTML = `
            <div class="history-title">${transaction.description}</div>
            <div class="history-details">
                <span>${transaction.time} ${transaction.date}</span>
                <span class="history-amount ${transaction.isPositive ? '' : 'negative'}">
                    ${transaction.isPositive ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}
                </span>
            </div>
        `;
        container.appendChild(div);
    });
}

// Уведомления
function showNotification(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #5288c1;
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(82, 136, 193, 0.3);
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

// Добавляем стили для анимации
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

// Функции для кнопок
function showDeposit() {
    alert("Пополнение баланса\n\n1. Выберите криптовалюту\n2. Укажите сумму\n3. Отправьте на адрес кошелька");
}

function showWithdraw() {
    alert("Вывод средств\n\n1. Введите адрес кошелька\n2. Укажите сумму\n3. Подтвердите вывод");
}

function showExchange() {
    alert("Обмен валют\n\nДоступные пары:\n• USDT/TON\n• USDT/BTC\n• USDT/ETH");
}

function showMarket() {
    alert("Биржевые торги\n\nРежим песочницы - все сделки виртуальные");
}
