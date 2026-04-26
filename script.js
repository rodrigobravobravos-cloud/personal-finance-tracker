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
// --- CALCULATING SUMMARY (Only items from the last 7 days) ---
function displaySummary() {
    const weeklyTotalDisplay = document.getElementById('weeklyTotal');
    const categoryList = document.getElementById('categoryList');
    
    // 1. TRY-CATCH: Handles errors if LocalStorage is empty or corrupted
    try {
        let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
        let weeklyTotal = 0;
        let categories = {}; 

        // 2. DATE LOGIC: Calculate the timestamp for 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 3. LOOPING & FILTERING: Only count recent items
        expenses.forEach(item => {
            const itemDate = new Date(item.date);
            
            // Check if the expense happened within the last 7 days
            if (itemDate >= sevenDaysAgo) {
                weeklyTotal += item.price; // Arithmetic

                // Grouping by category
                if (categories[item.cat]) {
                    categories[item.cat] += item.price;
                } else {
                    categories[item.cat] = item.price;
                }
            }
        });

        // 4. DOM MANIPULATION: Update the UI
        if(weeklyTotalDisplay) {
            weeklyTotalDisplay.innerHTML = weeklyTotal.toFixed(2);
        }

        if(categoryList) {
            categoryList.innerHTML = ""; 
            for (let catName in categories) {
                let listItem = `<li>${catName}: $${categories[catName].toFixed(2)}</li>`;
                categoryList.innerHTML += listItem;
            }
        }
    } catch (error) {
        // Requirement: Error handling for invalid data
        console.error("Data retrieval error:", error);
        if(weeklyTotalDisplay) weeklyTotalDisplay.innerHTML = "Error loading data";
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
