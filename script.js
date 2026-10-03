
const exportBtn = document.getElementById("export-btn");const themeBtn = document.getElementById("theme-btn");
const chartCanvas = document.getElementById("expenseChart");

let expenseChart;
const search = document.getElementById("search");
const category = document.getElementById("category");
const form = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const transactionList = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add Transaction
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const transaction = {
    id: Date.now(),
    text: text.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    date: new Date().toLocaleString()
};

    transactions.push(transaction);

    updateUI();

    form.reset();
});

// Update UI
function updateUI() {

    transactionList.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {

        const li = document.createElement("li");

       li.innerHTML = `
<div>
    <strong>${transaction.text}</strong><br>

    <small>
        ${transaction.category} |
        ${transaction.date}
    </small>
</div>

<div>
    ₹${transaction.amount}

    <button
    class="delete-btn"
    onclick="deleteTransaction(${transaction.id})">
    X
    </button>
</div>
`;
        transactionList.appendChild(li);

        if(transaction.type === "income"){
            totalIncome += transaction.amount;
        }else{
            totalExpense += transaction.amount;
        }

    });

    income.innerText = `₹${totalIncome}`;
    expense.innerText = `₹${totalExpense}`;
    balance.innerText = `₹${totalIncome-totalExpense}`;
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateChart(totalIncome, totalExpense);

}

// Delete Transaction
function deleteTransaction(id){

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    updateUI();


}
search.addEventListener("keyup", function () {

    const value = search.value.toLowerCase();

    const items = document.querySelectorAll("#transaction-list li");

    items.forEach(item => {

        if(item.innerText.toLowerCase().includes(value)){
            item.style.display = "flex";
        }else{
            item.style.display = "none";
        }

    });

});
function updateChart(incomeAmount, expenseAmount){

    if(expenseChart){
        expenseChart.destroy();
    }

    expenseChart = new Chart(chartCanvas,{
        type:"pie",

        data:{
            labels:["Income","Expense"],

            datasets:[{

                data:[incomeAmount,expenseAmount],

                backgroundColor:[
                    "#22c55e",
                    "#ef4444"
                ]

            }]
        }
    });

}
updateUI();
// Theme load
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
    themeBtn.innerHTML = "☀️ Light Mode";
}

// Theme toggle
themeBtn.addEventListener("click",function(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        themeBtn.innerHTML="☀️ Light Mode";
    }else{
        localStorage.setItem("theme","light");
        themeBtn.innerHTML="🌙 Dark Mode";
    }

});
exportBtn.addEventListener("click", () => {

    if(transactions.length === 0){
        alert("No transactions available.");
        return;
    }

    let csv =
"Description,Category,Type,Amount,Date\n";

    transactions.forEach(t => {

        csv += `"${t.text}","${t.category}","${t.type}",${t.amount},"${t.date}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Expense_Report.csv";

    a.click();

    URL.revokeObjectURL(url);

});