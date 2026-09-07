console.log("Expense Tracker JavaScript is connected!");

const pageTitle = document.getElementById("page-title");
console.log(pageTitle);

const expenseForm =document.getElementById("expense-form");
console.log(expenseForm);

const amountInput = document.getElementById("amount");

const categoryInput = document.getElementById("category");

const descriptionInput = document.getElementById("description");

const dateInput = document.getElementById("date");

const paymentMethodInput = document.getElementById("payment method");

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

    console.log(expense);

    const newRow = document.createElement("tr");
    
    const datecell = document.createElement("td");
    datecell.textContent = expense.date;
    newRow.appendChild(datecell);

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

    console.log(newRow);

    console.log(transactionsTable);
});
