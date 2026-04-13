// --- 1. SAVING DATA (Run from add-expense.html) ---
function validateAndSave() {
    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const priceInput = document.getElementById('price').value;
    const message = document.getElementById('message');
    
    const priceRegex = /^\d+(\.\d{1,2})?$/;

    if (!priceRegex.test(priceInput)) {
        message.style.color = "red";
        message.innerHTML = "Error: Please enter a valid price (e.g. 25.00)";
        return; 
    }

    const newExpense = {
        name: itemName,
        cat: category,
        price: parseFloat(priceInput),
        date: new Date().toLocaleDateString()
    };

    let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    expenses.push(newExpense);
    localStorage.setItem('myExpenses', JSON.stringify(expenses));

    window.alert("Expense Saved Successfully!");
    window.location.href = "index.html"; 
} // <--- THIS bracket closes the save function. Everything below is separate.

// --- 2. SUMMARY MATH (Run from summary.html) ---
function displaySummary() {
    const weeklyTotalDisplay = document.getElementById('weeklyTotal');
    const categoryList = document.getElementById('categoryList');
    
    let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    let total = 0;
    let categories = {}; 

    expenses.forEach(item => {
        total += item.price;
        if (categories[item.cat]) {
            categories[item.cat] += item.price;
        } else {
            categories[item.cat] = item.price;
        }
    });

    if(weeklyTotalDisplay) weeklyTotalDisplay.innerHTML = total.toFixed(2);

    if(categoryList) {
        categoryList.innerHTML = ""; 
        for (let catName in categories) {
            let listItem = `<li>${catName}: $${categories[catName].toFixed(2)}</li>`;
            categoryList.innerHTML += listItem;
        }
    }
}

// --- 3. DISPLAY TABLE (Run from index.html) ---
function displayExpenses() {
    const tableBody = document.getElementById('tableBody');
    const totalDisplay = document.getElementById('totalDisplay');
    
    let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    let runningTotal = 0;

    if(tableBody) {
        tableBody.innerHTML = "";
        expenses.forEach(item => {
            let row = `<tr>
                <td>${item.name}</td>
                <td>${item.cat}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.date}</td>
            </tr>`;
            tableBody.innerHTML += row; 
            runningTotal += item.price;
        });
    }

    if(totalDisplay) totalDisplay.innerHTML = runningTotal.toFixed(2);
}