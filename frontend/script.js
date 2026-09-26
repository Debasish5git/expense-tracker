console.log("Expense Tracker JavaScript is connected!");

const pageTitle = document.getElementById("page-title");

const expenseForm =document.getElementById("expense-form");

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

typeFilter.addEventListener("change", function(){
    const selectedType = typeFilter.value;

    const filteredTransactions = transactions.filter(function(transaction){
        return selectedType === "all" || transaction.type === selectedType;
    });
    
    displayTransactions(filteredTransactions);
});

sortFilter.addEventListener("change", function(){
    const selectedType = typeFilter.value;
    const filteredTransactions = transactions.filter(function(transaction){
        return selectedType === "all" || transaction.type === selectedType;
    });

    const sortedTransactions = sortTransactions(filteredTransactions);

    displayTransactions(sortedTransactions);
});

function sortTransactions(transactionList){
    const selectedSort = sortFilter.value;

    if(selectedSort === "newest"){
        transactionList.sort(function(a, b){
            return new Date(b.date) - new Date(a.date);
        });
    }

    else if(selectedSort === "oldest"){
        transactionList.sort(function(a, b){
            return new Date(a.date) - new Date(b.date);
        });
    }

    else if(selectedSort === "amount-high"){
        transactionList.sort(function(a, b){
            return Number(b.amount) - Number(a.amount);
        });
    }

    else if(selectedSort === "amount-low"){
        transactionList.sort(function(a, b){
            return Number(a.amount) - Number(b.amount);
        });
    }

    return transactionList;
}

function showTransactionDetails(transaction){

    transactionDetails.innerHTML = `
        <p><strong>Description:</strong> ${transaction.description}</p>
        <p><strong>Amount:</strong> ₹${transaction.amount}</p>
        <p><strong>Category:</strong> ${transaction.category || "-"}</p>
        <p><strong>Date:</strong> ${transaction.date}</p>
        <p><strong>Payment Method:</strong> ${transaction.paymentMethod || "-"}</p>
        <p><strong>Type:</strong> ${transaction.type}</p>
    `;
}

function displayTransactions(transactionList = transactions){

    transactionsBody.innerHTML = "";

    if(transactionList.length === 0){
        const placeholderRow = document.createElement("tr");

        const placeholderCell = document.createElement("td");
        placeholderCell.colSpan = 5;
        placeholderCell.textContent = "No Transactions Yet";

        placeholderRow.appendChild(placeholderCell);
        transactionsBody.appendChild(placeholderRow);
    }

    transactionList.forEach(function(transaction){

        const newRow = document.createElement("tr");

        newRow.style.cursor = "pointer";

        newRow.addEventListener("click", function(){

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

expenseForm.addEventListener("submit", function(event){
    event.preventDefault();

    const expense = {
        amount: amountInput.value,
        category: categoryInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        paymentMethod: paymentMethodInput.value,
        type: "Expense"
    };
    transactions.push(expense);
    saveTransactions();

    totalExpenseAmount = totalExpenseAmount + Number(expense.amount);
    totalExpenses.textContent = "₹" + totalExpenseAmount;

    balance.textContent = "₹" + (totalIncomeAmount - totalExpenseAmount);

    displayTransactions();

    expenseForm.reset();
});

incomeForm.addEventListener("submit", function(event){
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

displayTransactions();

closeModal.addEventListener("click", function(){
    transactionModal.style.display = "none";
    document.body.classList.remove("modal-open");
});

cancelModal.addEventListener("click", function(){
    if(selectedTransaction === null){
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

editTransaction.addEventListener("click", function(){
    if(selectedTransaction === null){
        return
    }

    if(editTransaction.textContent === "Edit"){

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

            document.getElementById("edit-category").value = selectedTransaction.category;

            document.getElementById("edit-payment-method").value = selectedTransaction.paymentMethod;
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

        if (selectedTransaction.type === "Expense") {
            const editedAmount = document.getElementById("edit-amount").value;
            const editedCategory = document.getElementById("edit-category").value;
            const editedDescription = document.getElementById("edit-description").value;
            const editedDate = document.getElementById("edit-date").value;
            const editedPaymentMethod = document.getElementById("edit-payment-method").value;

            selectedTransaction.amount = editedAmount;
            selectedTransaction.category = editedCategory;
            selectedTransaction.description = editedDescription;
            selectedTransaction.date = editedDate;
            selectedTransaction.paymentMethod = editedPaymentMethod;
        }
        else if (selectedTransaction.type === "Income") {
            const editedAmount = document.getElementById("edit-income-amount").value;
            const editedSource = document.getElementById("edit-income-source").value;
            const editedDate = document.getElementById("edit-income-date").value;

            selectedTransaction.amount = editedAmount;
            selectedTransaction.description = editedSource;
            selectedTransaction.date = editedDate;
        }

        calculateTotals();
        saveTransactions();

        displayTransactions();

        transactionModal.style.display = "none";
        document.body.classList.remove("modal-open");

        editTransaction.textContent = "Edit";

        selectedTransaction = null;
    }
});

deleteTransaction.addEventListener("click", function(){
    if(selectedTransaction === null){
        return;
    }

    const transactionIndex = transactions.indexOf(selectedTransaction);

    if(transactionIndex === -1){
        return;
    }

    transactions.splice(transactionIndex, 1);

    calculateTotals();
    saveTransactions();

    displayTransactions();

    transactionModal.style.display = "none";
    document.body.classList.remove("modal-open");

    selectedTransaction = null;
});

function saveTransactions(){
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions(){
    const savedTransactions = localStorage.getItem("transactions");

    if(savedTransactions){
        transactions = JSON.parse(savedTransactions);
    }
}

loadTransactions();
calculateTotals();
displayTransactions();