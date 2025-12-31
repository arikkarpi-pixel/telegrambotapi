document.addEventListener('DOMContentLoaded', function() {
    const totalBalance = document.getElementById('totalBalance');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const exchangeBtn = document.getElementById('exchangeBtn');
    const marketBtn = document.getElementById('marketBtn');
    const hideSmallBalances = document.getElementById('hideSmallBalances');
    const depositModal = document.getElementById('depositModal');

    // Обработчики кнопок действий
    depositBtn.addEventListener('click', function() {
        alert('Симуляция: Открыт интерфейс пополнения');
    });

    withdrawBtn.addEventListener('click', function() {
        alert('Симуляция: Открыт интерфейс вывода');
    });

    exchangeBtn.addEventListener('click', function() {
        alert('Симуляция: Открыт интерфейс обмена');
    });

    marketBtn.addEventListener('click', function() {
        alert('Симуляция: Открыта биржа');
    });

    // Переключатель скрытия мелких балансов
    hideSmallBalances.addEventListener('change', function() {
        const zeroBalances = document.querySelectorAll('.asset-balance');
        zeroBalances.forEach(balance => {
            if (balance.textContent.includes('0.00') || balance.textContent.includes('0 ')) {
                const assetItem = balance.closest('.asset-item');
                if (assetItem) {
                    assetItem.style.display = this.checked ? 'none' : 'flex';
                }
            }
        });
    });

    // Обновление баланса (симуляция)
    setTimeout(() => {
        totalBalance.textContent = '$4059.61';
    }, 1000);

    // Навигация
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            if (this.querySelector('i').classList.contains('fa-user')) {
                alert('Симуляция: Открыт профиль');
            }
        });
    });
});
