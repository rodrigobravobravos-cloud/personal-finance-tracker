// --- 1. SAVING DATA (Run from add-expense.html) ---
function validateAndSave() {
    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const priceInput = document.getElementById('price').value;
    const message = document.getElementById('message');
    
    // REGEX: Fulfills security/validation requirement
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
}

// --- 2. SUMMARY MATH (Run from summary.html) ---
function displaySummary() {
    const weeklyTotalDisplay = document.getElementById('weeklyTotal');
    const categoryList = document.getElementById('categoryList');
    
    try {
        let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
        let weeklyTotal = 0;
        let categories = {}; 

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        expenses.forEach(item => {
            const itemDate = new Date(item.date);
            if (itemDate >= sevenDaysAgo) {
                weeklyTotal += item.price;
                if (categories[item.cat]) {
                    categories[item.cat] += item.price;
                } else {
                    categories[item.cat] = item.price;
                }
            }
        });

        if(weeklyTotalDisplay) weeklyTotalDisplay.innerHTML = weeklyTotal.toFixed(2);

        if(categoryList) {
            categoryList.innerHTML = ""; 
            for (let catName in categories) {
                let listItem = `<li>${catName}: $${categories[catName].toFixed(2)}</li>`;
                categoryList.innerHTML += listItem;
            }
        }
    } catch (error) {
        console.error("Data retrieval error:", error);
    }
}

// --- 3. DISPLAY TABLE & DELETE LOGIC (Run from index.html) ---
function displayExpenses() {
    const tableBody = document.getElementById('tableBody');
    const totalDisplay = document.getElementById('totalDisplay');
    
    let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    let runningTotal = 0;

    if(tableBody) {
        tableBody.innerHTML = "";
        expenses.forEach((item, index) => {
            let row = `<tr>
                <td>${item.name}</td>
                <td>${item.cat}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.date}</td>
                <td><button onclick="deleteExpense(${index})" style="background-color: #ff9900; color: white; border: none; padding: 5px; cursor: pointer; border-radius: 5px;">Delete</button></td>
            </tr>`;
            tableBody.innerHTML += row; 
            runningTotal += item.price;
        });
    }

    if(totalDisplay) totalDisplay.innerHTML = runningTotal.toFixed(2);
}

// 4. Delete a single row
function deleteExpense(index) {
    if (confirm("Are you sure you want to delete this expense?")) {
        let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
        expenses.splice(index, 1);
        localStorage.setItem('myExpenses', JSON.stringify(expenses));
        displayExpenses();
    }
}

// 5. Clear everything
function clearAllExpenses() {
    if (confirm("WARNING: This will delete ALL your saved expenses. Proceed?")) {
        localStorage.removeItem('myExpenses');
        displayExpenses();
    }
}
