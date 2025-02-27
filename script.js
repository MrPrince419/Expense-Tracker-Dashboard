// Initial data
const expenseData = [1000, 1100, 1050, 1150, 1100, 1620.49];
const incomeData = [1500, 1600, 1650, 1700, 1750, 2550.00];
const transactions = [
    { category: 'groceries', amount: 130.50 },
    { category: 'coffee', amount: 94.99 },
    { category: 'rent', amount: 250.00 },
    { category: 'gas', amount: 145.00 },
    { category: 'new', amount: 1000.00 }
];
const pieData = {
    labels: ['Groceries', 'Coffee Shop', 'Rent', 'Gas', 'New Item'],
    datasets: [{
        data: [130.50, 94.99, 250.00, 145.00, 1000.00],
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'],
        borderWidth: 1
    }]
};
let viewType = 1; // 0: line, 1: bar, 2: pie
let estimatedBudget = 1500.00;
let savingsGoal = 1000.00;
let expenseChart = null;

// DOM elements with error handling
const ctx = document.getElementById('expenseChart')?.getContext('2d');
const updateSummaryBtn = document.getElementById('updateSummaryBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const toggleViewBtn = document.getElementById('toggleViewBtn');
const addTransactionBtn = document.getElementById('addTransactionBtn');
const modal = document.getElementById('updateModal');
const closeModal = document.querySelector('.close');
const saveChangesBtn = document.getElementById('saveChangesBtn');
const transactionDate = document.getElementById('transactionDate');
const setSavingsGoal = document.getElementById('setSavingsGoal');
const loading = document.getElementById('loading');
const transactionItems = document.querySelectorAll('.transaction-item');

// Chart options generator
function getChartOptions(type) {
    const textColor = '#333'; // Static for light mode
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: { family: 'Aleo', size: 16 },
                    color: textColor
                }
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        let label = (type === 'pie' ? pieData.labels[tooltipItem.dataIndex] : tooltipItem.dataset.label) || '';
                        if (label) label += ': ';
                        label += '$' + tooltipItem.raw.toFixed(2);
                        return label;
                    }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: textColor,
                bodyColor: textColor
            }
        }
    };
    if (type !== 'pie') {
        options.scales = {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => '$' + value,
                    color: textColor,
                    font: { size: 14 }
                }
            },
            x: {
                ticks: {
                    color: textColor,
                    font: { size: 14 }
                }
            }
        };
    }
    return options;
}

// Initialize or recreate chart
function createChart(type, data) {
    if (!ctx) {
        console.error('Canvas context not found');
        return;
    }
    if (expenseChart) expenseChart.destroy();
    try {
        expenseChart = new Chart(ctx, {
            type: type,
            data: data,
            options: getChartOptions(type)
        });
    } catch (error) {
        console.error('Chart initialization failed:', error);
    }
}

// Initial chart setup
createChart('bar', {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1
    }, {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(40, 167, 69, 0.8)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1
    }]
});

// Update totals
function updateTotals() {
    let totalExpenses = 0;
    const editableElements = document.querySelectorAll('.editable');
    const transactionItemsArray = Array.from(document.querySelectorAll('.transaction-item'));
    if (editableElements.length > 0 && transactionItemsArray.length > 0) {
        editableElements.forEach((edit, index) => {
            const value = parseFloat(edit.textContent.replace('$', '')) || 0;
            totalExpenses += value;
            edit.textContent = '$' + value.toFixed(2);
            pieData.datasets[0].data[index] = value;
            pieData.labels[index] = transactionItemsArray[index].textContent.trim();
        });
        const totalIncome = parseFloat(document.getElementById('income').textContent.replace('$', '')) || 2550.00;
        const totalBalance = totalIncome - totalExpenses;
        document.getElementById('totalBalance').textContent = '$' + totalBalance.toFixed(2);
        document.getElementById('expenses').textContent = '$' + totalExpenses.toFixed(2);
        if (viewType === 2) {
            createChart('pie', {
                labels: pieData.labels,
                datasets: [{
                    data: pieData.datasets[0].data,
                    backgroundColor: pieData.datasets[0].backgroundColor,
                    borderWidth: 1
                }]
            });
        } else {
            expenseChart.data.datasets[0].data[5] = totalExpenses;
            expenseChart.data.datasets[1].data[5] = totalIncome;
            expenseChart.update();
        }
    } else {
        console.warn('No editable elements or transaction items found, using default values');
        document.getElementById('expenses').textContent = '$1620.49';
        document.getElementById('totalBalance').textContent = '$929.51';
    }
    checkBudgetAlert(totalExpenses);
}

// Check budget alert
function checkBudgetAlert(expenses) {
    const alert = document.getElementById('budgetAlert');
    const alertAmount = document.getElementById('alertAmount');
    if (alert && alertAmount) {
        if (expenses > estimatedBudget) {
            alertAmount.textContent = '$' + (expenses - estimatedBudget).toFixed(2);
            alert.style.display = 'block';
        } else {
            alert.style.display = 'none';
        }
    } else {
        console.warn('Budget alert elements not found');
    }
}

// Update totals on edit
document.querySelectorAll('.editable, .transaction-item').forEach(element => {
    element.addEventListener('input', (e) => {
        const value = element.classList.contains('editable') 
            ? parseFloat(e.target.textContent.replace('$', '')) || 0 
            : e.target.textContent.trim();
        if (element.classList.contains('editable')) {
            e.target.textContent = '$' + value.toFixed(2);
        }
        updateTotals();
    });
});

// Update Summary button
if (updateSummaryBtn) {
    updateSummaryBtn.addEventListener('click', () => {
        if (modal && loading) {
            loading.style.display = 'block';
            setTimeout(() => {
                document.getElementById('modalBalance').value = parseFloat(document.getElementById('totalBalance').textContent.replace('$', '')) || 0;
                document.getElementById('modalIncome').value = parseFloat(document.getElementById('income').textContent.replace('$', '')) || 0;
                document.getElementById('modalExpenses').value = parseFloat(document.getElementById('expenses').textContent.replace('$', '')) || 0;
                modal.style.display = 'block';
                loading.style.display = 'none';
            }, 500);
        } else {
            console.error('Modal or loading element not found');
        }
    });
} else {
    console.error('Update Summary button not found');
}

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });
} else {
    console.error('Close button not found');
}

// Save changes
if (saveChangesBtn) {
    saveChangesBtn.addEventListener('click', () => {
        if (modal && loading) {
            loading.style.display = 'block';
            setTimeout(() => {
                const newBalance = parseFloat(document.getElementById('modalBalance').value) || 0;
                const newIncome = parseFloat(document.getElementById('modalIncome').value) || 0;
                const newExpenses = parseFloat(document.getElementById('modalExpenses').value) || 0;
                document.getElementById('totalBalance').textContent = '$' + newBalance.toFixed(2);
                document.getElementById('income').textContent = '$' + newIncome.toFixed(2);
                document.getElementById('expenses').textContent = '$' + newExpenses.toFixed(2);
                expenseData[5] = newExpenses;
                incomeData[5] = newIncome;
                modal.style.display = 'none';
                updateTotals();
                alert('Summary updated successfully!');
                loading.style.display = 'none';
            }, 500);
        } else {
            console.error('Modal or loading element not found during save');
        }
    });
} else {
    console.error('Save Changes button not found');
}

// Toggle view
if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', () => {
        viewType = (viewType + 1) % 3;
        if (viewType === 0) {
            createChart('line', {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: 'rgba(220, 53, 69, 1)',
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5
                }, {
                    label: 'Income',
                    data: incomeData,
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5
                }]
            });
            toggleViewBtn.textContent = 'Switch View (Bar)';
        } else if (viewType === 1) {
            createChart('bar', {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(220, 53, 69, 0.8)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                }, {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                }]
            });
            toggleViewBtn.textContent = 'Switch View (Pie)';
        } else {
            createChart('pie', {
                labels: pieData.labels,
                datasets: [{
                    data: pieData.datasets[0].data,
                    backgroundColor: pieData.datasets[0].backgroundColor,
                    borderWidth: 1
                }]
            });
            toggleViewBtn.textContent = 'Switch View (Line)';
        }
        updateTotals();
    });
} else {
    console.error('Toggle View button not found');
}

// Add transaction
if (addTransactionBtn && transactionDate) {
    addTransactionBtn.addEventListener('click', () => {
        if (loading) loading.style.display = 'block';
        setTimeout(() => {
            const date = transactionDate.value || new Date().toISOString().split('T')[0];
            const [month, day, year] = new Date(date).toLocaleDateString('en-US').split('/');
            const formattedDate = `(${month.slice(0, 3)} ${day})`;
            const li = document.createElement('li');
            li.innerHTML = `
                <span contenteditable="true" class="transaction-item" data-category="new">New Item</span>
                <span class="transaction-amount">$<span contenteditable="true" class="editable" data-category="new">0.00</span></span>
                <span class="transaction-date">${formattedDate}</span>
            `;
            document.getElementById('transactionList').appendChild(li);
            const newItem = li.querySelector('.transaction-item');
            const newEditable = li.querySelector('.editable');
            newItem.addEventListener('input', (e) => {
                const newLabel = e.target.textContent.trim();
                const index = Array.from(document.querySelectorAll('.transaction-item')).indexOf(e.target);
                pieData.labels[index] = newLabel;
                updateTotals();
            });
            newEditable.addEventListener('input', (e) => {
                const value = parseFloat(e.target.textContent.replace('$', '')) || 0;
                e.target.textContent = '$' + value.toFixed(2);
                updateTotals();
            });
            transactions.push({ category: 'new', amount: 0.00 });
            pieData.labels.push('New Item');
            pieData.datasets[0].data.push(0.00);
            updateTotals();
            if (loading) loading.style.display = 'none';
            alert('Transaction added successfully!');
        }, 500);
    });
} else {
    console.error('Add Transaction button or date input not found');
}

// Export data
if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
        if (loading) loading.style.display = 'block';
        setTimeout(() => {
            const data = {
                totalBalance: document.getElementById('totalBalance').textContent,
                income: document.getElementById('income').textContent,
                expenses: document.getElementById('expenses').textContent,
                savingsGoal: document.getElementById('savingsGoal').textContent,
                transactions: Array.from(document.querySelectorAll('.editable')).map(edit => ({
                    category: edit.dataset.category,
                    amount: edit.textContent
                }))
            };
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'expense_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (loading) loading.style.display = 'none';
            alert('Data exported successfully!');
        }, 500);
    });
} else {
    console.error('Export Data button not found');
}

// Savings goal
if (setSavingsGoal) {
    setSavingsGoal.addEventListener('change', () => {
        savingsGoal = parseFloat(setSavingsGoal.value) || 1000.00;
        document.getElementById('savingsGoal').textContent = '$' + savingsGoal.toFixed(2);
        updateTotals();
    });
} else {
    console.error('Savings Goal input not found');
}

// Window click to close modal
window.addEventListener('click', (event) => {
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
});

// Initial setup
updateTotals();