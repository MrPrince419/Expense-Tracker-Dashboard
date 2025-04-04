// Main app data management
const expenseTracker = {
    transactions: [],
    budgets: [],
    selectedCurrency: 'USD',
    currencies: {
        'USD': { symbol: '$', rate: 1 },
        'EUR': { symbol: '€', rate: 0.91 },
        'GBP': { symbol: '£', rate: 0.78 },
        'CAD': { symbol: 'C$', rate: 1.35 }
    },
    exchangeRates: {
        'USD_EUR': 0.91,
        'USD_GBP': 0.78,
        'USD_CAD': 1.35,
        'EUR_USD': 1.10,
        'EUR_GBP': 0.86,
        'EUR_CAD': 1.48,
        'GBP_USD': 1.28,
        'GBP_EUR': 1.16,
        'GBP_CAD': 1.73,
        'CAD_USD': 0.74,
        'CAD_EUR': 0.67,
        'CAD_GBP': 0.58
    },
    
    // Initialize the app
    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderTransactions();
        this.updateSummary();
        this.renderBudgets();
        this.renderChart();
        
        // Set default date values for filters to cover Jan-May 2025
        document.getElementById('date-from').valueAsDate = new Date('2025-01-01');
        document.getElementById('date-to').valueAsDate = new Date('2025-05-31');
        
        // Set today's date as default for new transactions
        document.getElementById('transaction-date').valueAsDate = new Date();
        
        // Update currency selector
        const currencySelect = document.getElementById('currency-select');
        Object.keys(this.currencies).forEach(currency => {
            if (currency !== 'USD' && currency !== 'EUR' && currency !== 'GBP' && !currencySelect.querySelector(`option[value="${currency}"]`)) {
                const option = document.createElement('option');
                option.value = currency;
                option.textContent = currency;
                currencySelect.appendChild(option);
            }
        });
    },
    
    // Load saved data from localStorage
    loadData() {
        const savedTransactions = localStorage.getItem('transactions');
        const savedBudgets = localStorage.getItem('budgets');
        const savedCurrency = localStorage.getItem('selectedCurrency');
        
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        } else {
            // Add sample data for Jan-May 2025
            this.transactions = [
                { id: 1, type: 'income', description: 'Salary', amount: 3000, category: 'Other', date: '2025-01-15' },
                { id: 2, type: 'expense', description: 'Rent', amount: 1200, category: 'Rent', date: '2025-01-02' },
                { id: 3, type: 'expense', description: 'Grocery Shopping', amount: 150, category: 'Food', date: '2025-01-05' },
                { id: 4, type: 'expense', description: 'Internet Bill', amount: 60, category: 'Utilities', date: '2025-01-10' },
                { id: 5, type: 'expense', description: 'Movie Night', amount: 35, category: 'Entertainment', date: '2025-01-20' },
                { id: 6, type: 'income', description: 'Freelance Work', amount: 500, category: 'Other', date: '2025-02-10' },
                { id: 7, type: 'expense', description: 'Electricity Bill', amount: 85, category: 'Utilities', date: '2025-02-15' },
                { id: 8, type: 'expense', description: 'Restaurant Dinner', amount: 120, category: 'Food', date: '2025-02-20' },
                { id: 9, type: 'expense', description: 'Weekend Trip', amount: 350, category: 'Travel', date: '2025-02-25' },
                { id: 10, type: 'income', description: 'Bonus', amount: 1000, category: 'Other', date: '2025-03-05' },
                { id: 11, type: 'income', description: 'Side Project', amount: 1500, category: 'Other', date: '2025-03-15' },
                { id: 12, type: 'expense', description: 'New Laptop', amount: 1200, category: 'Shopping', date: '2025-03-20' },
                { id: 13, type: 'expense', description: 'Gym Membership', amount: 50, category: 'Entertainment', date: '2025-04-01' },
                { id: 14, type: 'income', description: 'Dividend', amount: 200, category: 'Other', date: '2025-04-10' },
                { id: 15, type: 'expense', description: 'Home Repairs', amount: 300, category: 'Other', date: '2025-04-15' },
                { id: 16, type: 'income', description: 'Salary', amount: 3000, category: 'Other', date: '2025-05-15' },
                { id: 17, type: 'expense', description: 'Rent', amount: 1200, category: 'Rent', date: '2025-05-02' },
                { id: 18, type: 'expense', description: 'Birthday Gift', amount: 75, category: 'Shopping', date: '2025-05-10' }
            ];
            this.saveTransactions();
        }
        
        if (savedBudgets) {
            this.budgets = JSON.parse(savedBudgets);
        } else {
            // Add some sample budgets if none exist
            this.budgets = [
                { id: 1, category: 'Food', amount: 300 },
                { id: 2, category: 'Entertainment', amount: 200 },
                { id: 3, category: 'Rent', amount: 1500 },
                { id: 4, category: 'Travel', amount: 400 },
                { id: 5, category: 'Shopping', amount: 250 }
            ];
            this.saveBudgets();
        }
        
        if (savedCurrency) {
            this.selectedCurrency = savedCurrency;
            document.getElementById('currency-select').value = savedCurrency;
        }
    },
    
    // Set up all event listeners
    setupEventListeners() {
        // Add transaction button
        document.getElementById('add-transaction-btn').addEventListener('click', () => {
            this.openTransactionModal();
        });
        
        // Transaction form submission
        document.getElementById('transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });
        
        // Add budget button
        document.getElementById('add-budget-btn').addEventListener('click', () => {
            this.openBudgetModal();
        });
        
        // Budget form submission
        document.getElementById('budget-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBudget();
        });
        
        // Close modals when clicking on X or outside the modal
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
        
        window.addEventListener('click', (e) => {
            document.querySelectorAll('.modal').forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Search transactions
        document.getElementById('search-btn').addEventListener('click', () => {
            this.searchTransactions();
        });
        
        document.getElementById('search-transaction').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.searchTransactions();
            }
        });
        
        // Apply filters
        document.getElementById('apply-filters').addEventListener('click', () => {
            this.filterTransactions();
        });
        
        // Reset filters
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
        
        // Currency select
        document.getElementById('currency-select').addEventListener('change', (e) => {
            this.selectedCurrency = e.target.value;
            localStorage.setItem('selectedCurrency', this.selectedCurrency);
            this.updateSummary();
            this.renderTransactions();
            this.renderBudgets();
            this.renderChart();
        });
        
        // Bulk actions
        document.getElementById('select-all').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.transaction-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
            this.updateBulkActionButtons();
        });
        
        document.getElementById('bulk-edit-btn').addEventListener('click', () => {
            document.getElementById('bulk-edit-modal').style.display = 'block';
        });
        
        document.getElementById('bulk-delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all selected transactions?')) {
                this.bulkDeleteTransactions();
            }
        });
        
        document.getElementById('bulk-edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.bulkEditTransactions();
        });
        
        // Currency converter logic
        document.getElementById('convert-btn').addEventListener('click', () => {
            this.convertCurrency();
        });
        
        // Make currency in header clickable to open converter
        document.getElementById('currency-select').addEventListener('dblclick', () => {
            document.getElementById('converter-modal').style.display = 'block';
            document.getElementById('from-currency').value = this.selectedCurrency;
        });

        // Enhanced event listeners for interactive charts
        document.getElementById('expense-chart').addEventListener('click', (e) => {
            const activePoints = this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
            
            if (activePoints.length > 0) {
                const firstPoint = activePoints[0];
                const month = this.chart.data.labels[firstPoint.index];
                const income = this.chart.data.datasets[0].data[firstPoint.index];
                const expense = this.chart.data.datasets[1].data[firstPoint.index];
                
                // Filter transactions for the selected month
                const monthIndex = firstPoint.index + 1;
                const monthStr = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
                const monthStart = `2025-${monthStr}-01`;
                const monthEnd = monthIndex === 12 
                    ? '2026-01-01' 
                    : `2025-${monthIndex < 9 ? '0' : ''}${monthIndex + 1}-01`;
                
                const filteredTransactions = this.transactions.filter(t => 
                    t.date >= monthStart && t.date < monthEnd
                );
                
                this.renderTransactions(filteredTransactions);
                
                // Display a tooltip with month details
                alert(`${month} 2025:\nIncome: ${this.formatCurrency(income / this.currencies[this.selectedCurrency].rate)}\nExpenses: ${this.formatCurrency(expense / this.currencies[this.selectedCurrency].rate)}`);
            }
        });
        
        // Add validation to transaction amount
        document.getElementById('transaction-amount').addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value);
            if (amount <= 0) {
                e.target.setCustomValidity('Amount must be greater than zero');
            } else {
                e.target.setCustomValidity('');
            }
        });
        
        // Add responsiveness checks
        window.addEventListener('resize', () => {
            this.renderChart();
        });
    },
    
    // Open transaction modal for adding new transaction
    openTransactionModal(transactionId) {
        const modal = document.getElementById('transaction-modal');
        const form = document.getElementById('transaction-form');
        const modalTitle = document.getElementById('modal-title');
        
        form.reset();
        
        if (transactionId) {
            // Edit existing transaction
            const transaction = this.transactions.find(t => t.id === transactionId);
            if (transaction) {
                modalTitle.textContent = 'Edit Transaction';
                document.getElementById('transaction-id').value = transaction.id;
                document.getElementById('transaction-type').value = transaction.type;
                document.getElementById('transaction-description').value = transaction.description;
                document.getElementById('transaction-amount').value = transaction.amount;
                document.getElementById('transaction-category').value = transaction.category;
                document.getElementById('transaction-date').value = transaction.date;
            }
        } else {
            // New transaction
            modalTitle.textContent = 'Add Transaction';
            document.getElementById('transaction-id').value = '';
            document.getElementById('transaction-date').valueAsDate = new Date();
        }
        
        modal.style.display = 'block';
    },
    
    // Save transaction from form with enhanced validation
    saveTransaction() {
        const transactionId = document.getElementById('transaction-id').value;
        const type = document.getElementById('transaction-type').value;
        const description = document.getElementById('transaction-description').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const category = document.getElementById('transaction-category').value;
        const date = document.getElementById('transaction-date').value;
        
        if (amount <= 0) {
            alert('Amount must be greater than zero');
            return;
        }
        
        if (!description.trim()) {
            alert('Description cannot be empty');
            return;
        }
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        // Ensure date is within 2025 range
        const selectedDate = new Date(date);
        const startDate = new Date('2025-01-01');
        const endDate = new Date('2025-12-31');
        
        if (selectedDate < startDate || selectedDate > endDate) {
            alert('Please select a date within 2025');
            return;
        }
        
        // Store the previous balance for animation
        const previousBalance = this.calculateBalance();
        
        if (transactionId) {
            // Update existing transaction
            const index = this.transactions.findIndex(t => t.id === parseInt(transactionId));
            if (index !== -1) {
                this.transactions[index] = {
                    ...this.transactions[index],
                    type,
                    description,
                    amount,
                    category,
                    date
                };
            }
        } else {
            // Add new transaction
            const newTransaction = {
                id: Date.now(),
                type,
                description,
                amount,
                category,
                date
            };
            this.transactions.push(newTransaction);
        }
        
        // Save and update UI
        this.saveTransactions();
        this.renderTransactions();
        this.updateSummary();
        this.renderBudgets();
        this.renderChart();
        
        // Animate the balance change
        const newBalance = this.calculateBalance();
        this.animateBalanceChange(previousBalance, newBalance);
        
        // Close modal
        document.getElementById('transaction-modal').style.display = 'none';
    },
    
    // Delete a transaction
    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.renderTransactions();
            this.updateSummary();
            this.renderBudgets();
            this.renderChart();
        }
    },
    
    // Open budget modal
    openBudgetModal(budgetId) {
        const modal = document.getElementById('budget-modal');
        const form = document.getElementById('budget-form');
        
        form.reset();
        
        if (budgetId) {
            // Edit existing budget
            const budget = this.budgets.find(b => b.id === budgetId);
            if (budget) {
                document.getElementById('budget-id').value = budget.id;
                document.getElementById('budget-category').value = budget.category;
                document.getElementById('budget-amount').value = budget.amount;
            }
        } else {
            // New budget
            document.getElementById('budget-id').value = '';
        }
        
        modal.style.display = 'block';
    },
    
    // Save budget from form
    saveBudget() {
        const budgetId = document.getElementById('budget-id').value;
        const category = document.getElementById('budget-category').value;
        const amount = parseFloat(document.getElementById('budget-amount').value);
        
        if (amount <= 0) {
            alert('Budget amount must be greater than zero');
            return;
        }
        
        // Check if budget for this category already exists
        const existingIndex = this.budgets.findIndex(b => b.category === category);
        
        if (budgetId) {
            // Update existing budget
            const index = this.budgets.findIndex(b => b.id === parseInt(budgetId));
            if (index !== -1) {
                this.budgets[index] = {
                    ...this.budgets[index],
                    category,
                    amount
                };
            }
        } else if (existingIndex !== -1) {
            // Update if category already has a budget
            this.budgets[existingIndex].amount = amount;
        } else {
            // Add new budget
            const newBudget = {
                id: Date.now(),
                category,
                amount
            };
            this.budgets.push(newBudget);
        }
        
        // Save and update UI
        this.saveBudgets();
        this.renderBudgets();
        
        // Close modal
        document.getElementById('budget-modal').style.display = 'none';
    },
    
    // Delete a budget
    deleteBudget(id) {
        if (confirm('Are you sure you want to delete this budget?')) {
            this.budgets = this.budgets.filter(b => b.id !== id);
            this.saveBudgets();
            this.renderBudgets();
        }
    },
    
    // Calculate total balance
    calculateBalance() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        return totalIncome - totalExpense;
    },
    
    // Animate balance change
    animateBalanceChange(oldValue, newValue) {
        const balanceElement = document.getElementById('total-balance');
        const startTime = performance.now();
        const duration = 500; // 0.5 seconds
        
        const animateStep = (timestamp) => {
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentValue = oldValue + (newValue - oldValue) * progress;
            balanceElement.textContent = this.formatCurrency(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animateStep);
            }
        };
        
        requestAnimationFrame(animateStep);
    },
    
    // Format currency based on selected currency with enhanced accuracy
    formatCurrency(amount) {
        const { symbol } = this.currencies[this.selectedCurrency];
        const rate = this.currencies[this.selectedCurrency].rate;
        const convertedAmount = amount * rate;
        return `${symbol}${convertedAmount.toFixed(2)}`;
    },
    
    // Save transactions to localStorage
    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    },
    
    // Save budgets to localStorage
    saveBudgets() {
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
    },
    
    // Render transactions list
    renderTransactions(filteredTransactions) {
        const tableBody = document.getElementById('transaction-list');
        const mobileContainer = document.getElementById('mobile-transactions');
        const transactions = filteredTransactions || this.transactions;
        
        // Sort transactions by date, newest first
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Clear both containers
        tableBody.innerHTML = '';
        mobileContainer.innerHTML = '';
        
        if (sortedTransactions.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">No transactions found</td>
                </tr>
            `;
            mobileContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--gray);">
                    No transactions found
                </div>
            `;
            return;
        }
        
        // Create select all checkbox for mobile
        const mobileSelectAll = document.createElement('div');
        mobileSelectAll.className = 'mobile-select-all';
        mobileSelectAll.innerHTML = `
            <label>
                <input type="checkbox" id="mobile-select-all" class="mobile-checkbox">
                Select All
            </label>
        `;
        mobileContainer.appendChild(mobileSelectAll);
        
        // Add event listener to mobile select all
        document.getElementById('mobile-select-all').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.mobile-transaction-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
            this.updateBulkActionButtons();
        });
        
        // Render transactions for desktop
        sortedTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            row.innerHTML = `
                <td><input type="checkbox" class="transaction-checkbox" data-id="${transaction.id}"></td>
                <td>${formattedDate}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td class="${transaction.type === 'income' ? 'income' : 'expense'}">
                    ${transaction.type === 'income' ? '+' : '-'} ${this.formatCurrency(transaction.amount)}
                </td>
                <td class="transaction-actions">
                    <button class="btn" onclick="expenseTracker.openTransactionModal(${transaction.id})">Edit</button>
                    <button class="btn btn-danger" onclick="expenseTracker.deleteTransaction(${transaction.id})">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
            
            // Create mobile transaction card
            const mobileCard = document.createElement('div');
            mobileCard.className = 'mobile-transaction';
            
            mobileCard.innerHTML = `
                <div class="mobile-transaction-header">
                    <div style="display: flex; align-items: center;">
                        <input type="checkbox" class="mobile-transaction-checkbox mobile-checkbox" data-id="${transaction.id}">
                        <span style="font-weight: 600;">${transaction.description}</span>
                    </div>
                    <span class="mobile-transaction-amount ${transaction.type === 'income' ? 'income' : 'expense'}">
                        ${transaction.type === 'income' ? '+' : '-'} ${this.formatCurrency(transaction.amount)}
                    </span>
                </div>
                <div class="mobile-transaction-details">
                    <div class="mobile-transaction-detail">
                        <span>Date:</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="mobile-transaction-detail">
                        <span>Category:</span>
                        <span>${transaction.category}</span>
                    </div>
                    <div class="mobile-transaction-detail">
                        <span>Type:</span>
                        <span>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
                    </div>
                </div>
                <div class="mobile-transaction-actions">
                    <button class="btn" onclick="expenseTracker.openTransactionModal(${transaction.id})">Edit</button>
                    <button class="btn btn-danger" onclick="expenseTracker.deleteTransaction(${transaction.id})">Delete</button>
                </div>
            `;
            
            mobileContainer.appendChild(mobileCard);
        });
        
        // Add event listener to checkboxes
        document.querySelectorAll('.transaction-checkbox, .mobile-transaction-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBulkActionButtons();
            });
        });
    },
    
    // Update bulk action buttons state
    updateBulkActionButtons() {
        const checkboxes = document.querySelectorAll('.transaction-checkbox:checked, .mobile-transaction-checkbox:checked');
        const bulkEditBtn = document.getElementById('bulk-edit-btn');
        const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
        const mobileBulkEditBtn = document.getElementById('mobile-bulk-edit-btn');
        const mobileBulkDeleteBtn = document.getElementById('mobile-bulk-delete-btn');
        
        const isAnyChecked = checkboxes.length > 0;
        
        // Update desktop buttons
        if (bulkEditBtn && bulkDeleteBtn) {
            if (isAnyChecked) {
                bulkEditBtn.removeAttribute('disabled');
                bulkDeleteBtn.removeAttribute('disabled');
            } else {
                bulkEditBtn.setAttribute('disabled', 'disabled');
                bulkDeleteBtn.setAttribute('disabled', 'disabled');
            }
        }
        
        // Update mobile buttons
        if (mobileBulkEditBtn && mobileBulkDeleteBtn) {
            if (isAnyChecked) {
                mobileBulkEditBtn.removeAttribute('disabled');
                mobileBulkDeleteBtn.removeAttribute('disabled');
            } else {
                mobileBulkEditBtn.setAttribute('disabled', 'disabled');
                mobileBulkDeleteBtn.setAttribute('disabled', 'disabled');
            }
        }
    },
    
    // Bulk edit transactions
    bulkEditTransactions() {
        const checkboxes = document.querySelectorAll('.transaction-checkbox:checked, .mobile-transaction-checkbox:checked');
        const category = document.getElementById('bulk-category').value;
        
        if (checkboxes.length === 0) {
            alert('Please select at least one transaction to edit');
            return;
        }
        
        checkboxes.forEach(checkbox => {
            const id = parseInt(checkbox.getAttribute('data-id'));
            const transaction = this.transactions.find(t => t.id === id);
            
            if (transaction) {
                transaction.category = category;
            }
        });
        
        this.saveTransactions();
        this.renderTransactions();
        this.renderBudgets();
        
        // Close modal
        document.getElementById('bulk-edit-modal').style.display = 'none';
    },
    
    // Bulk delete transactions
    bulkDeleteTransactions() {
        const checkboxes = document.querySelectorAll('.transaction-checkbox:checked, .mobile-transaction-checkbox:checked');
        
        if (checkboxes.length === 0) {
            alert('Please select at least one transaction to delete');
            return;
        }
        
        const idsToDelete = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));
        
        this.transactions = this.transactions.filter(t => !idsToDelete.includes(t.id));
        
        this.saveTransactions();
        this.renderTransactions();
        this.updateSummary();
        this.renderBudgets();
        this.renderChart();
    },
    
    // Update the summary section
    updateSummary() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const balance = totalIncome - totalExpense;
        
        document.getElementById('total-balance').textContent = this.formatCurrency(balance);
        document.getElementById('total-income').textContent = this.formatCurrency(totalIncome);
        document.getElementById('total-expense').textContent = this.formatCurrency(totalExpense);
    },
    
    // Render budgets and their progress
    renderBudgets() {
        const budgetContainer = document.getElementById('budget-items');
        budgetContainer.innerHTML = '';
        
        this.budgets.forEach(budget => {
            // Calculate spent amount for this category
            const spent = this.transactions
                .filter(t => t.type === 'expense' && t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            
            // Calculate percentage
            const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
            const isOverBudget = spent > budget.amount;
            
            // Create budget item element
            const budgetItem = document.createElement('div');
            budgetItem.className = 'budget-item';
            
            // Create circular progress for visual appeal
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 80;
            
            // Draw circular progress
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 35;
            
            // Background circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#e5e7eb';
            ctx.stroke();
            
            // Progress arc
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (Math.PI * 2 * percentage / 100);
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 8;
            ctx.strokeStyle = isOverBudget ? '#F87171' : '#2DD4BF';
            ctx.stroke();
            
            budgetItem.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3>${budget.category}</h3>
                        <div style="margin-top: 5px;">
                            <span class="${isOverBudget ? 'expense' : ''}">${this.formatCurrency(spent)}</span> 
                            of ${this.formatCurrency(budget.amount)}
                        </div>
                        <div class="budget-progress mt-20">
                            <div class="progress-bar ${isOverBudget ? 'over-budget' : 'under-budget'}" 
                                style="width: ${percentage}%"></div>
                        </div>
                    </div>
                    <div class="circular-progress">
                        <div class="progress-value">${percentage}%</div>
                    </div>
                </div>
                <div class="budget-actions" style="margin-top: 10px; text-align: right;">
                    <button class="btn" style="padding: 5px 10px; font-size: 14px;" 
                        onclick="expenseTracker.openBudgetModal(${budget.id})">Edit</button>
                    <button class="btn btn-danger" style="padding: 5px 10px; font-size: 14px;" 
                        onclick="expenseTracker.deleteBudget(${budget.id})">Delete</button>
                </div>
            `;
            
            // Add the canvas to the budget item
            const circularProgress = budgetItem.querySelector('.circular-progress');
            circularProgress.insertBefore(canvas, circularProgress.firstChild);
            
            budgetContainer.appendChild(budgetItem);
        });
        
        if (this.budgets.length === 0) {
            budgetContainer.innerHTML = `
                <p style="text-align: center; color: var(--gray);">No budget goals set</p>
            `;
        }
    },
    
    // Render expense chart with enhanced interactivity - Jan to May only
    renderChart() {
        const ctx = document.getElementById('expense-chart').getContext('2d');
        
        // Prepare data for chart - only Jan to May
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        
        // Get current year or 2025 as fallback
        const chartYear = 2025; // Using 2025 as specified in the requirements
        
        // Calculate monthly incomes and expenses - Jan to May only
        const monthlyData = months.map((_, index) => {
            const monthNumber = index + 1;
            const monthStr = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
            const monthStart = `${chartYear}-${monthStr}-01`;
            const monthEnd = monthNumber === 12
                ? `${chartYear + 1}-01-01`
                : `${chartYear}-${monthNumber < 9 ? '0' : ''}${monthNumber + 1}-01`;
            
            const monthTransactions = this.transactions.filter(t => {
                return t.date >= monthStart && t.date < monthEnd;
            });
            
            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
                
            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
                
            return { income, expense };
        });
        
        // Destroy previous chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create new chart with enhanced interactivity
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Income',
                        data: monthlyData.map(d => d.income * this.currencies[this.selectedCurrency].rate),
                        backgroundColor: '#2DD4BF',
                        borderColor: '#0F9488',
                        borderWidth: 1,
                        hoverBackgroundColor: '#0F9488'
                    },
                    {
                        label: 'Expenses',
                        data: monthlyData.map(d => d.expense * this.currencies[this.selectedCurrency].rate),
                        backgroundColor: '#F87171',
                        borderColor: '#DC2626',
                        borderWidth: 1,
                        hoverBackgroundColor: '#DC2626'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${chartYear} Monthly Overview (Jan-May)`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const symbol = expenseTracker.currencies[expenseTracker.selectedCurrency].symbol;
                                return `${context.dataset.label}: ${symbol}${context.raw.toFixed(2)}`;
                            },
                            footer: function(tooltipItems) {
                                const monthIndex = tooltipItems[0].dataIndex;
                                const monthName = months[monthIndex];
                                
                                const income = monthlyData[monthIndex].income;
                                const expense = monthlyData[monthIndex].expense;
                                const balance = income - expense;
                                
                                const symbol = expenseTracker.currencies[expenseTracker.selectedCurrency].symbol;
                                return `Balance: ${symbol}${(balance * expenseTracker.currencies[expenseTracker.selectedCurrency].rate).toFixed(2)}`;
                            }
                        }
                    }
                },
                onClick: function(e) {
                    const activePoints = this.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                    if (activePoints.length > 0) {
                        const firstPoint = activePoints[0];
                        const month = this.data.labels[firstPoint.index];
                        
                        // Highlight the clicked bar
                        this.data.datasets.forEach((dataset, i) => {
                            dataset.backgroundColor = dataset.data.map((_, j) => {
                                return j === firstPoint.index 
                                    ? (i === 0 ? '#0F9488' : '#DC2626') 
                                    : (i === 0 ? '#2DD4BF' : '#F87171');
                            });
                        });
                        this.update();
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                const symbol = expenseTracker.currencies[expenseTracker.selectedCurrency].symbol;
                                return symbol + value;
                            }
                        }
                    }
                },
                // Enhanced interaction options
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 500,
                    easing: 'easeOutQuart'
                }
            }
        });
    },
    
    // Search transactions by description
    searchTransactions() {
        const searchTerm = document.getElementById('search-transaction').value.trim().toLowerCase();
        
        if (!searchTerm) {
            this.renderTransactions();
            return;
        }
        
        const filtered = this.transactions.filter(t => 
            t.description.toLowerCase().includes(searchTerm)
        );
        
        this.renderTransactions(filtered);
    },
    
    // Filter transactions based on criteria with enhanced validation
    filterTransactions() {
        const category = document.getElementById('category-filter').value;
        const dateFrom = document.getElementById('date-from').value;
        const dateTo = document.getElementById('date-to').value;
        const amountMin = document.getElementById('amount-min').value ? parseFloat(document.getElementById('amount-min').value) : null;
        const amountMax = document.getElementById('amount-max').value ? parseFloat(document.getElementById('amount-max').value) : null;
        
        if (amountMin !== null && amountMax !== null && amountMin > amountMax) {
            alert('Minimum amount cannot be greater than maximum amount');
            return;
        }
        
        if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
            alert('Start date cannot be after end date');
            return;
        }
        
        let filtered = [...this.transactions];
        
        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(t => t.category === category);
        }
        
        // Filter by date range
        if (dateFrom) {
            filtered = filtered.filter(t => t.date >= dateFrom);
        }
        
        if (dateTo) {
            filtered = filtered.filter(t => t.date <= dateTo);
        }
        
        // Filter by amount range
        if (amountMin !== null) {
            filtered = filtered.filter(t => t.amount >= amountMin);
        }
        
        if (amountMax !== null) {
            filtered = filtered.filter(t => t.amount <= amountMax);
        }
        
        this.renderTransactions(filtered);
        
        // Show filter feedback
        const transactionTable = document.querySelector('.transaction-table');
        const mobileContainer = document.getElementById('mobile-transactions');
        
        if (transactionTable) {
            transactionTable.classList.add('filtered-results');
            setTimeout(() => {
                transactionTable.classList.remove('filtered-results');
            }, 500);
        }
        
        if (mobileContainer) {
            mobileContainer.classList.add('filtered-results');
            setTimeout(() => {
                mobileContainer.classList.remove('filtered-results');
            }, 500);
        }
    },
    
    // Reset all filters
    resetFilters() {
        document.getElementById('category-filter').value = 'all';
        document.getElementById('date-from').valueAsDate = new Date('2025-01-01');
        document.getElementById('date-to').valueAsDate = new Date('2025-05-31');
        document.getElementById('amount-min').value = '';
        document.getElementById('amount-max').value = '';
        document.getElementById('search-transaction').value = '';
        
        this.renderTransactions();
    },
    
    // Convert currency in the converter modal - enhanced with CAD
    convertCurrency() {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        const amount = parseFloat(document.getElementById('convert-amount').value);
        
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount greater than zero');
            return;
        }
        
        if (fromCurrency === toCurrency) {
            document.getElementById('conversion-result').textContent = 
                `${this.currencies[toCurrency].symbol}${amount.toFixed(2)}`;
            document.getElementById('conversion-rate').textContent = 
                'Conversion rate: 1:1';
            return;
        }
        
        const conversionKey = `${fromCurrency}_${toCurrency}`;
        const rate = this.exchangeRates[conversionKey];
        
        if (!rate) {
            alert('Conversion rate not available');
            return;
        }
        
        const result = amount * rate;
        
        document.getElementById('conversion-result').textContent = 
            `${this.currencies[toCurrency].symbol}${result.toFixed(2)}`;
        document.getElementById('conversion-rate').textContent = 
            `Conversion rate: 1 ${fromCurrency} = ${rate.toFixed(2)} ${toCurrency} on ${new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}`;
    }
};

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    expenseTracker.init();
    
    // Fix for browsers that don't support addListener
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const mobileBulkActions = document.getElementById('mobile-bulk-actions');
    
    function handleScreenChange(e) {
        if (e.matches && mobileBulkActions) {
            mobileBulkActions.style.display = 'flex';
        } else if (mobileBulkActions) {
            mobileBulkActions.style.display = 'none';
        }
    }
    
    // Use the proper event listener based on browser support
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleScreenChange);
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleScreenChange);
    }
    
    handleScreenChange(mediaQuery);
    
    // Add click handlers for mobile bulk buttons
    const mobileBulkEditBtn = document.getElementById('mobile-bulk-edit-btn');
    const mobileBulkDeleteBtn = document.getElementById('mobile-bulk-delete-btn');
    
    if (mobileBulkEditBtn) {
        mobileBulkEditBtn.addEventListener('click', function() {
            document.getElementById('bulk-edit-modal').style.display = 'block';
        });
    }
    
    if (mobileBulkDeleteBtn) {
        mobileBulkDeleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete all selected transactions?')) {
                expenseTracker.bulkDeleteTransactions();
            }
        });
    }
});