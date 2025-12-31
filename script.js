// Данные приложения
const appState = {
    totalBalance: 4059.61,
    balanceChange: 0,
    userId: Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    transactionHistory: [],
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
    initApp();
    updateUI();
    startAutoSimulation();
});

// Основная инициализация
function initApp() {
    // Устанавливаем ID пользователя
    document.getElementById('userId').textContent = appState.userId;
    
    // Инициализируем переключатель
    initToggle();
    
    // Инициализируем историю транзакций
    initTransactionHistory();
    
    // Интеграция с Telegram WebApp
    initTelegramWebApp();
    
    // Добавляем обработчики событий
    setupEventListeners();
}

// Обновление интерфейса
function updateUI() {
    updateBalanceDisplay();
    renderAssets();
    updateTransactionHistory();
}

// Обновление отображения баланса
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('totalBalance');
    const changeElement = document.getElementById('balanceChange');
    
    if (balanceElement) {
        balanceElement.textContent = `$${formatNumber(appState.totalBalance)}`;
    }
    
    if (changeElement) {
        const change = appState.balanceChange;
        changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
        changeElement.style.color = change >= 0 ? '#26de81' : '#ff6b6b';
        changeElement.style.background = change >= 0 ? 'rgba(38, 222, 129, 0.1)' : 'rgba(255, 107, 107, 0.1)';
    }
}

// Рендеринг активов
function renderAssets() {
    const container = document.getElementById('assetsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appState.assets.forEach(asset => {
        const assetElement = createAssetElement(asset);
        container.appendChild(assetElement);
    });
}

// Создание элемента актива
function createAssetElement(asset) {
    const div = document.createElement('div');
    div.className = 'asset-item';
    div.onclick = () => selectAsset(asset.name);
    
    div.innerHTML = `
        <div class="asset-icon" style="background: linear-gradient(135deg, ${asset.color}30, ${asset.color});">
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
    return num.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}

// Интеграция с Telegram WebApp
function initTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Показываем панель Telegram
        document.getElementById('telegramPanel').style.display = 'block';
        
        // Расширяем на весь экран
        tg.expand();
        tg.enableClosingConfirmation();
        
        // Настраиваем кнопку
        tg.MainButton.setText("💰 Открыть баланс").show();
        tg.MainButton.onClick(() => {
            tg.showAlert(`Ваш баланс: $${formatNumber(appState.totalBalance)}`);
        });
        
        // Отправляем данные в бота
        tg.sendData(JSON.stringify({
            action: "init",
            userId: appState.userId,
            balance: appState.totalBalance
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

// Навигация между страницами
function showPage(pageId) {
    event.preventDefault();
    
    // Обновляем активную кнопку навигации
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Показываем нужную страницу
    if (pageId === 'home') {
        document.getElementById('profilePage').classList.add('hidden');
        document.querySelector('.app-container > .header').style.display = 'block';
        document.querySelector('.app-container > .banner').style.display = 'block';
        document.querySelector('.app-container > .assets-section').style.display = 'block';
    } else if (pageId === 'profile') {
        document.getElementById('profilePage').classList.remove('hidden');
        document.querySelector('.app-container > .header').style.display = 'none';
        document.querySelector('.app-container > .banner').style.display = 'none';
        document.querySelector('.app-container > .assets-section').style.display = 'none';
    }
}

// Добавление денег (песочница)
function addMoney(amount) {
    const oldBalance = appState.totalBalance;
    appState.totalBalance += amount;
    
    // Обновляем USDT баланс
    if (appState.assets[0]) {
        appState.assets[0].balance = appState.totalBalance;
    }
    
    // Рассчитываем изменение
    appState.balanceChange = ((appState.totalBalance - oldBalance) / oldBalance) * 100;
    
    // Добавляем в историю
    addTransaction({
        type: 'deposit',
        amount: amount,
        description: `Пополнение песочницы +$${amount}`,
        timestamp: new Date().toISOString(),
        positive: true
    });
    
    // Обновляем интерфейс
    updateUI();
    
    // Анимация
    animateBalanceChange(amount);
    
    // Уведомление
    showNotification(`Добавлено +$${amount} к балансу!`);
}

// Добавление кастомной суммы
function addCustomMoney() {
    const input = document.getElementById('customAmount');
    const amount = parseFloat(input.value);
    
    if (!amount || amount <= 0) {
        showNotification('Введите корректную сумму');
        return;
    }
    
    if (amount > 10000) {
        showNotification('Максимальная сумма: $10,000');
        return;
    }
    
    addMoney(amount);
    input.value = '';
}

// Анимация изменения баланса
function animateBalanceChange(amount) {
    const balanceElement = document.getElementById('totalBalance');
    if (!balanceElement) return;
    
    balanceElement.style.transform = 'scale(1.1)';
    balanceElement.style.color = '#26de81';
    
    setTimeout(() => {
        balanceElement.style.transform = 'scale(1)';
        balanceElement.style.color = '#e1e3e6';
    }, 300);
}

// Сброс баланса
function resetBalance() {
    if (!confirm('Сбросить баланс к начальному значению?')) return;
    
    appState.totalBalance = 4059.61;
    appState.balanceChange = 0;
    
    // Сбрасываем активы
    appState.assets[0].balance = 4059.61;
    appState.assets[0].change = -0.05;
    
    for (let i = 1; i < appState.assets.length; i++) {
        appState.assets[i].balance = 0;
        appState.assets[i].change = 0;
    }
    
    // Добавляем в историю
    addTransaction({
        type: 'reset',
        amount: 0,
        description: 'Сброс баланса к начальному значению',
        timestamp: new Date().toISOString(),
        positive: false
    });
    
    updateUI();
    showNotification('Баланс сброшен!');
}

// Симуляция случайной сделки
function simulateTrade() {
    const tradeTypes = ['buy', 'sell'];
    const assets = ['BTC', 'ETH', 'TON', 'SOL'];
    const tradeType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const amount = Math.random() * 1000 + 10;
    const profitLoss = (Math.random() - 0.5) * 200;
    
    // Обновляем баланс
    appState.totalBalance += profitLoss;
    if (appState.assets[0]) {
        appState.assets[0].balance = appState.totalBalance;
    }
    
    // Добавляем в историю
    addTransaction({
        type: 'trade',
        amount: profitLoss,
        description: `${tradeType === 'buy' ? 'Покупка' : 'Продажа'} ${asset} ${profitLoss >= 0 ? '+$' : '-$'}${Math.abs(profitLoss).toFixed(2)}`,
        timestamp: new Date().toISOString(),
        positive: profitLoss >= 0
    });
    
    updateUI();
    
    // Уведомление
    const message = profitLoss >= 0 
        ? `Успешная сделка! Прибыль: +$${profitLoss.toFixed(2)}`
        : `Убыточная сделка: -$${Math.abs(profitLoss).toFixed(2)}`;
    
    showNotification(message);
}

// Управление историей транзакций
function initTransactionHistory() {
    // Добавляем начальные транзакции
    addTransaction({
        type: 'initial',
        amount: 4059.61,
        description: 'Начальный баланс',
        timestamp: new Date().toISOString(),
        positive: true
    });
    
    addTransaction({
        type: 'bonus',
        amount: 50,
        description: 'Бонус за регистрацию',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        positive: true
    });
}

function addTransaction(transaction) {
    appState.transactionHistory.unshift(transaction);
    
    // Ограничиваем историю 20 последними записями
    if (appState.transactionHistory.length > 20) {
        appState.transactionHistory.pop();
    }
    
    updateTransactionHistory();
}

function updateTransactionHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appState.transactionHistory.forEach(trans => {
        const item = document.createElement('div');
        item.className = `history-item ${trans.positive ? 'positive' : 'negative'}`;
        
        const icon = getTransactionIcon(trans.type);
        const amountSign = trans.positive ? '+' : '-';
        
        item.innerHTML = `
            <div class="history-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="history-info">
                <div class="history-title">${trans.description}</div>
                <div class="history-details">
                    <span>${formatTime(trans.timestamp)}</span>
                    <span class="history-amount ${trans.positive ? '' : 'negative'}">
                        ${amountSign}$${Math.abs(trans.amount).toFixed(2)}
                    </span>
                </div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function getTransactionIcon(type) {
    const icons = {
        'deposit': 'fa-plus-circle',
        'withdraw': 'fa-minus-circle',
        'trade': 'fa-exchange-alt',
        'reset': 'fa-redo',
        'initial': 'fa-star',
        'bonus': 'fa-gift'
    };
    return icons[type] || 'fa-circle';
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Только что';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`;
    
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
    });
}

// Модальные окна
function showModal(type) {
    const modal = document.getElementById('depositModal');
    if (!modal) return;
    
    // Настраиваем модалку в зависимости от типа
    const content = modal.querySelector('.modal-content h3');
    if (content) {
        const titles = {
            'deposit': '<i class="fas fa-plus-circle"></i> Пополнение',
            'withdraw': '<i class="fas fa-arrow-up"></i> Вывод',
            'exchange': '<i class="fas fa-exchange-alt"></i> Обмен',
            'market': '<i class="fas fa-chart-line"></i> Биржа'
        };
        content.innerHTML = titles[type] || titles.deposit;
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Уведомления
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #26de81;
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(38, 222, 129, 0.3);
    `;
    
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Автосимуляция (случайные изменения баланса)
function startAutoSimulation() {
    setInterval(() => {
        // Случайное изменение баланса ±0.5%
        const change = (Math.random() - 0.5) * 0.01;
        appState.totalBalance *= (1 + change);
        
        // Обновляем USDT баланс
        if (appState.assets[0]) {
            appState.assets[0].balance = appState.totalBalance;
            appState.assets[0].change = change * 100;
        }
        
        // Обновляем изменение баланса
        appState.balanceChange = change * 100;
        
        updateUI();
    }, 30000); // Каждые 30 секунд
}

// Выбор актива
function selectAsset(name) {
    showNotification(`Выбран актив: ${name}`);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('depositModal');
        if (modal && event.target === modal) {
            closeModal();
        }
    });
    
    // Нажатие Escape закрывает модалку
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}
