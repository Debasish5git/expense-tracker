console.log("Expense Tracker JavaScript is connected!");

const pageTitle = document.getElementById("page-title");

const expenseForm =document.getElementById("expense-form");

const amountInput = document.getElementById("amount");

const categoryInput = document.getElementById("category");

const descriptionInput = document.getElementById("description");

const dateInput = document.getElementById("date");

const paymentMethodInput = document.getElementById("payment-method");

const transactionsTable = document.getElementById("transactions-table");

expenseForm.addEventListener("submit", function(event){
    event.preventDefault();

    const expense = {
        amount: amountInput.value,
        category: categoryInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        paymentMethod: paymentMethodInput.value
    };

    const newRow = document.createElement("tr");
    
    const dateCell = document.createElement("td");
    dateCell.textContent = expense.date;
    newRow.appendChild(dateCell);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = expense.description;
    newRow.appendChild(descriptionCell);

    const categoryCell = document.createElement("td");
    categoryCell.textContent = expense.category;
    newRow.appendChild(categoryCell);

    const amountCell = document.createElement("td");
    amountCell.textContent = "₹" + expense.amount;
    newRow.appendChild(amountCell);

    transactionsTable.appendChild(newRow);
});
