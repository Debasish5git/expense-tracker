console.log("Expense Tracker JavaScript is connected!");

const API_URL = "http://127.0.0.1:8000";

const pageTitle = document.getElementById("page-title");

const expenseForm = document.getElementById("expense-form");

const amountInput = document.getElementById("amount");

const categoryInput = document.getElementById("category");

const descriptionInput = document.getElementById("description");

const dateInput = document.getElementById("date");

const paymentMethodInput = document.getElementById("payment-method");

const transactionsTable = document.getElementById("transactions-table");
const transactionsBody = document.getElementById("transactions-body");

const totalExpenses = document.getElementById("total-expenses");

const balance = document.getElementById("balance");

const totalIncome = document.getElementById("total-income");

let totalExpenseAmount = 0;

let totalIncomeAmount = 0;

let transactions = [];

let selectedTransaction = null;

totalIncome.textContent = "₹" + totalIncomeAmount;
balance.textContent = "₹" + (totalIncomeAmount - totalExpenseAmount);

const incomeForm = document.getElementById("add-income");

const incomeAmountInput = document.getElementById("income-amount");
const incomeSourceInput = document.getElementById("income-source");
const incomeDateInput = document.getElementById("income-date");

const transactionModal = document.getElementById("transaction-modal");

const transactionDetails = document.getElementById("transaction-details");

const closeModal = document.getElementById("close-modal");

const cancelModal = document.getElementById("cancel-modal");

const editTransaction = document.getElementById("edit-transaction");

const deleteTransaction = document.getElementById("delete-transaction");

const typeFilter = document.getElementById("type-filter");

const sortFilter = document.getElementById("sort-filter");

const sidebar = document.getElementById("sidebar");

const sidebarToggle = document.getElementById("sidebar-toggle");

const analyticsMenuButton = document.getElementById("analytics-menu-button");

const analyticsMenuDropdown = document.getElementById("analytics-menu-dropdown");

analyticsMenuButton.addEventListener("click", function () {
    if (analyticsMenuDropdown.style.display === "block") {
        analyticsMenuDropdown.style.display = "none";
    }
    else {
        analyticsMenuDropdown.style.display = "block";
    }
});

sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
});

typeFilter.addEventListener("change", function () {
    const selectedType = typeFilter.value;

    const filteredTransactions = transactions.filter(function (transaction) {
        return selectedType === "all" || transaction.type === selectedType;
    });

    displayTransactions(filteredTransactions);
});

sortFilter.addEventListener("change", function () {
    const selectedType = typeFilter.value;
    const filteredTransactions = transactions.filter(function (transaction) {
        return selectedType === "all" || transaction.type === selectedType;
    });

    const sortedTransactions = sortTransactions(filteredTransactions);

    displayTransactions(sortedTransactions);
});

function sortTransactions(transactionList) {
    const selectedSort = sortFilter.value;

    if (selectedSort === "newest") {
        transactionList.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    }

    else if (selectedSort === "oldest") {
        transactionList.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });
    }

    else if (selectedSort === "amount-high") {
        transactionList.sort(function (a, b) {
            return Number(b.amount) - Number(a.amount);
        });
    }

    else if (selectedSort === "amount-low") {
        transactionList.sort(function (a, b) {
            return Number(a.amount) - Number(b.amount);
        });
    }

    return transactionList;
}

function showTransactionDetails(transaction) {

    transactionDetails.innerHTML = `
        <p><strong>Description:</strong> ${transaction.description}</p>
        <p><strong>Amount:</strong> ₹${transaction.amount}</p>
        <p><strong>Category:</strong> ${transaction.category || "-"}</p>
        <p><strong>Date:</strong> ${transaction.date}</p>
        <p><strong>Payment Method:</strong> ${transaction.paymentMethod || "-"}</p>
        <p><strong>Type:</strong> ${transaction.type}</p>
    `;
}

function displayTransactions(transactionList = transactions) {

    transactionsBody.innerHTML = "";

    if (transactionList.length === 0) {
        const placeholderRow = document.createElement("tr");

        const placeholderCell = document.createElement("td");
        placeholderCell.colSpan = 5;
        placeholderCell.textContent = "No Transactions Yet";

        placeholderRow.appendChild(placeholderCell);
        transactionsBody.appendChild(placeholderRow);
    }

    transactionList.forEach(function (transaction) {

        const newRow = document.createElement("tr");

        newRow.style.cursor = "pointer";

        newRow.addEventListener("click", function () {

            selectedTransaction = transaction;

            showTransactionDetails(transaction);
            transactionModal.style.display = "flex";
            document.body.classList.add("modal-open");
        });

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;
        newRow.appendChild(dateCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;
        newRow.appendChild(descriptionCell);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category || "-";
        newRow.appendChild(categoryCell);

        const typeCell = document.createElement("td");
        typeCell.textContent = transaction.type;
        newRow.appendChild(typeCell);

        const amountCell = document.createElement("td");
        amountCell.textContent = "₹" + transaction.amount;
        newRow.appendChild(amountCell);

        transactionsBody.appendChild(newRow);

    });
}

function calculateTotals() {
    totalExpenseAmount = 0;
    totalIncomeAmount = 0;

    transactions.forEach(function (transaction) {
        if (transaction.type === "Expense") {
            totalExpenseAmount = totalExpenseAmount + Number(transaction.amount);
        }

        if (transaction.type === "Income") {
            totalIncomeAmount = totalIncomeAmount + Number(transaction.amount);
        }
    });

    totalExpenses.textContent = "₹" + totalExpenseAmount;
    totalIncome.textContent = "₹" + totalIncomeAmount;
    balance.textContent = "₹" + (totalIncomeAmount - totalExpenseAmount);
}

expenseForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const expenseData = {
        amount: Number(amountInput.value),
        category: categoryInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        paymentMethod: paymentMethodInput.value
    };

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expenseData)
        });

        if (!response.ok) {
            const errorData = await response.json();

            throw new Error(
                errorData.detail ? JSON.stringify(errorData.detail) : "Failed to save expense"
            );
        }

        const savedExpense = await response.json();

        const transaction = {
            ...savedExpense,
            type: "Expense"
        };

        transactions.push(transaction);

        calculateTotals();
        displayTransactions();
        updateExpenseCategoryChart();

        expenseForm.reset();

        console.log("Expense saved to MySQL:", savedExpense);
    }
    catch (error) {

        console.error("Error saving expense:", error);
        alert(`Could not save expense: ${error.message}`);
    }
});

incomeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const incomeAmount = incomeAmountInput.value;
    const incomeSource = incomeSourceInput.value;
    const incomeDate = incomeDateInput.value;

    const income = {
        amount: incomeAmount,
        description: incomeSource,
        date: incomeDate,
        type: "Income"
    };

    transactions.push(income);

    saveTransactions();

    totalIncomeAmount = totalIncomeAmount + Number(incomeAmount);

    totalIncome.textContent = "₹" + totalIncomeAmount;

    balance.textContent = "₹" + (totalIncomeAmount - totalExpenseAmount);

    displayTransactions();

    incomeForm.reset();
});

closeModal.addEventListener("click", function () {
    transactionModal.style.display = "none";
    document.body.classList.remove("modal-open");
});

cancelModal.addEventListener("click", function () {
    if (selectedTransaction === null) {
        return;
    }

    if (editTransaction.textContent === "Save Changes") {

        showTransactionDetails(selectedTransaction);
        editTransaction.textContent = "Edit";

        return;
    }

    transactionModal.style.display = "none";
    document.body.classList.remove("modal-open");

    selectedTransaction = null;
});

editTransaction.addEventListener("click", async function () {
    if (selectedTransaction === null) {
        return
    }

    if (editTransaction.textContent === "Edit") {

        editTransaction.textContent = "Save Changes";

        if (selectedTransaction.type === "Expense") {

            transactionDetails.innerHTML = `
            <div>
                <label>Amount</label>
                <input type="number" id="edit-amount" value="${selectedTransaction.amount}">
            </div>

            <div>
                <label>Category</label>
                <select id="edit-category">
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="bills">Bills</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="travel">Travel</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label>Description</label>
                <input type="text" id="edit-description" value="${selectedTransaction.description}">
            </div>

            <div>
                <label>Date</label>
                <input type="date" id="edit-date" value="${selectedTransaction.date}">
            </div>

            <div>
                <label>Payment Method</label>
                <select id="edit-payment-method">
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="debit-card">Debit Card</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="bank-transfer">Bank Transfer</option>
                </select>
            </div>

            <div>
                <label>Type</label>
                <input type="text" value="${selectedTransaction.type}" disabled>
            </div>
        `;

            document.getElementById("edit-category").value = (selectedTransaction.category || "").trim().toLowerCase();

            document.getElementById("edit-payment-method").value = (selectedTransaction.paymentMethod || "").trim().toLowerCase().replace(/\s+/g,"-");
        }

        else if (selectedTransaction.type === "Income") {
            transactionDetails.innerHTML = `
        <div>
            <label>Amount</label>
            <input
                type="number"
                id="edit-income-amount"
                value="${selectedTransaction.amount}"
            >
        </div>

        <div>
            <label>Source</label>
            <input
                type="text"
                id="edit-income-source"
                value="${selectedTransaction.description}"
            >
        </div>

        <div>
            <label>Date</label>
            <input
                type="date"
                id="edit-income-date"
                value="${selectedTransaction.date}"
            >
        </div>

        <div>
            <label>Type</label>
            <input
                type="text"
                value="${selectedTransaction.type}"
                disabled
            >
        </div>
        `;
        }
    }

    else {

        try {
            if (selectedTransaction.type === "Expense") {
                const editedAmount = Number(document.getElementById("edit-amount").value);
                const editedCategory = document.getElementById("edit-category").value;
                const editedDescription = document.getElementById("edit-description").value.trim();
                const editedDate = document.getElementById("edit-date").value;

                const paymentMethodLabels = {
                    "cash": "Cash",
                    "upi": "UPI",
                    "debit-card": "Debit Card",
                    "credit-card": "Credit Card",
                    "bank-transfer": "Bank Transfer"
                };

                const editedPaymentMethod =
                    paymentMethodLabels[
                    document.getElementById("edit-payment-method").value
                    ];
                
                if(
                    !Number.isFinite(editedAmount)||
                    editedAmount <= 0 ||
                    !editedCategory ||
                    !editedDescription ||
                    !editedDate ||
                    !editedPaymentMethod
                )
                {
                    alert("Please enter valid values for all fields");
                    return;
                }

                const updatedExpenseData = {
                    amount:editedAmount,
                    category:editedCategory,
                    description:editedDescription,
                    date:editedDate,
                    paymentMethod:editedPaymentMethod
                };

                const response = await fetch(`${API_URL}/expenses/${selectedTransaction.id}`,
                    {
                        method:"PUT",
                        headers:{
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedExpenseData)
                    }
                );

                if(!response.ok){
                    const errorData = await response.json();

                    throw new Error(
                        errorData.detail ? JSON.stringify(errorData.detail) : "Failed to update expense"
                    );
                }

                const updatedExpense = await response.json();

                Object.assign(selectedTransaction, updatedExpense, {
                    type:"Expense"
                });
            }

            else if (selectedTransaction.type === "Income") {
                const editedAmount = document.getElementById("edit-income-amount").value;
                const editedSource = document.getElementById("edit-income-source").value;
                const editedDate = document.getElementById("edit-income-date").value;

                selectedTransaction.amount = editedAmount;
                selectedTransaction.description = editedSource;
                selectedTransaction.date = editedDate;

                saveTransactions();
            }
            calculateTotals();

            displayTransactions();

            updateExpenseCategoryChart();

            transactionModal.style.display = "none";

            document.body.classList.remove("modal-open");

            editTransaction.textContent = "Edit";
            selectedTransaction = null;

            console.log("Transaction updated successfully.");
        }
        catch(error){

            console.error("Error updating transaction:", error);
            alert(`Could not update transaction: ${error.message}`);
        }
    }
});

deleteTransaction.addEventListener("click", async function () {
    if (selectedTransaction === null) {
        return;
    }

    const transactionIndex = transactions.indexOf(selectedTransaction);

    if (transactionIndex === -1) {
        return;
    }

    try {
        if (selectedTransaction.type === "Expense") {
            const response = await fetch(`${API_URL}/expenses/${selectedTransaction.id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                const errorData = await response.json();

                throw new Error(errorData.detail || "Failed to delete expense");
            }
        }

        transactions.splice(transactionIndex, 1);

        calculateTotals();
        saveTransactions();
        displayTransactions();
        updateExpenseCategoryChart();

        transactionModal.style.display = "none";
        document.body.classList.remove("modal-open");

        selectedTransaction = null;

        console.log("Transaction deleted successfully");
    }
    catch (error) {
        console.error("Error deleting the transaction:", error);
        alert(`Could not delete transaction: ${error.message}`);
    }
});

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
        const localTransactions = JSON.parse(savedTransactions);
        transactions = localTransactions.filter(function (transaction) {
            return transaction.type === "income";
        });
    }
}

async function loadExpensesFromAPI() {
    try {
        const response = await fetch(`${API_URL}/expenses`);

        if (!response.ok) {
            throw new Error("Failed to load expenses");
        }

        const expenses = await response.json();

        const expenseTransactions = expenses.map(function (expense) {
            return {
                ...expense,
                type: "Expense"
            };
        });

        transactions = [
            ...transactions.filter(function (transaction) {
                return transaction.type === "income";
            }),
            ...expenseTransactions
        ];

        calculateTotals();
        displayTransactions();
        updateExpenseCategoryChart();
    }
    catch (error) {
        console.error("Error loading expenses:", error);
        alert("Could not load expenses from the backend. Check that FastAPI is running.");
    }
}

async function initializeTransactions() {
    loadTransactions();
    calculateTotals();
    displayTransactions();
    await loadExpensesFromAPI();
}

function calculateExpensesByCategory() {
    const categoryTotals = {};

    transactions.forEach(function (transaction) {

        if (transaction.type === "Expense") {

            const category = transaction.category
                ? transaction.category.trim()
                    .toLowerCase()
                    .replace(/\b\w/g, function (letter) {
                        return letter.toUpperCase();
                    })
                : "Other";

            if (categoryTotals[category]) {
                categoryTotals[category] = categoryTotals[category] + Number(transaction.amount);
            }

            else {
                categoryTotals[category] = Number(transaction.amount);
            }
        }
    });

    return categoryTotals;
}

const expenseCategoryCanvas = document.getElementById("expense-category-chart");

let expenseCategoryChart = null;

const doughnutChartOption = document.getElementById("doughnut-chart-option");

const barChartOption = document.getElementById("bar-chart-option");

doughnutChartOption.addEventListener("click", function () {

    localStorage.setItem("chartType", "doughnut");

    expenseCategoryChart.destroy();

    expenseCategoryChart = null;

    updateExpenseCategoryChart();

    analyticsMenuDropdown.style.display = "none";
});

barChartOption.addEventListener("click", function () {

    localStorage.setItem("chartType", "bar");

    expenseCategoryChart.destroy();

    expenseCategoryChart = null;

    updateExpenseCategoryChart();

    analyticsMenuDropdown.style.display = "none";
});

function updateExpenseCategoryChart() {

    const categoryTotals = calculateExpensesByCategory();

    const categories = Object.keys(categoryTotals);

    const amounts = Object.values(categoryTotals);

    const savedChartType = localStorage.getItem("chartType") || "doughnut";

    const chartColors = [
        "#3B82F6",
        "#F97316",
        "#22C55E",
        "#EF4444",
        "#8B5CF6",
        "#EAB308",
        "#EC4899",
        "#14B8A6",
        "#6366F1"
    ];

    if (expenseCategoryChart === null) {

        expenseCategoryChart = new Chart(expenseCategoryCanvas, {
            type: savedChartType,
            data: {
                labels: categories,
                datasets: [{
                    label: "Expenses",
                    data: amounts,
                    backgroundColor: chartColors
                }]
            },

            options: savedChartType === "bar"
                ? {
                    responsive: true,
                    maintainAspectRatio: false,

                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
                : {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {}
                }
        });
    }
    else {
        expenseCategoryChart.data.labels = categories;
        expenseCategoryChart.data.datasets[0].data = amounts;
        expenseCategoryChart.data.datasets[0].backgroundColor = chartColors;
        expenseCategoryChart.update();
    }
}

initializeTransactions();