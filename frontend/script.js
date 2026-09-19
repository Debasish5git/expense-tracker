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

const deleteTransaction = document.getElementById("delete-transaction");

function displayTransactions(){

    transactionsBody.innerHTML = "";

    if(transactions.length === 0){
        const placeholderRow = document.createElement("tr");

        const placeholderCell = document.createElement("td");
        placeholderCell.colSpan = 5;
        placeholderCell.textContent = "No Transactions Yet";

        placeholderRow.appendChild(placeholderCell);
        transactionsBody.appendChild(placeholderRow);
    }

    transactions.forEach(function(transaction){

        const newRow = document.createElement("tr");

        newRow.style.cursor = "pointer";

        newRow.addEventListener("click", function(){

            selectedTransaction = transaction;

            transactionDetails.innerHTML = `
            <p><strong>Description:</strong> ${transaction.description}</p>
            <p><strong>Amount:</strong> ₹${transaction.amount}</p>
            <p><strong>Category:</strong> ${transaction.category || "-"}</p>
            <p><strong>Date:</strong> ${transaction.date}</p>
            <p><strong>Payment Method:</strong> ${transaction.paymentMethod || "-"}</p>
            <p><strong>Type:</strong> ${transaction.type}</p>
            `;
            transactionModal.style.display = "flex";
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

    totalIncomeAmount = totalIncomeAmount + Number(incomeAmount);

    totalIncome.textContent = "₹" + totalIncomeAmount;

    balance.textContent = "₹" + (totalIncomeAmount - totalExpenseAmount);

    displayTransactions();

    incomeForm.reset();
});

displayTransactions();

closeModal.addEventListener("click", function(){
    transactionModal.style.display = "none";
});

cancelModal.addEventListener("click", function(){
    transactionModal.style.display = "none";
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

    displayTransactions();

    transactionModal.style.display = "none";

    selectedTransaction = null;
});