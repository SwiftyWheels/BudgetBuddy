// This places the JS in strict mode which will throw errors when the code
// isn't written properly. Helps with debugging.
// This can also be placed inside a function to make the function strict mode
"use strict";
import '/js/bootstrap.js';

document.addEventListener("DOMContentLoaded", init);

function init() {
    addButtonEventListeners();
    addFormEventListeners();
}

function addButtonEventListeners() {
    const incomeTab = document.getElementById("incomeTab");
    const expenseTab = document.getElementById("expensesTab");
    const debtTab = document.getElementById("debtTab");
    const percentTab = document.getElementById("percentTab");
    const budgetTab = document.getElementById("budgetTab");

    const tabs = [incomeTab, expenseTab, debtTab, percentTab, budgetTab];
    const nextButtons = document.querySelectorAll("[data-btn='next']");

    nextButtons.forEach(button => {
        button.addEventListener("click", () => nextTab(tabs));
    });

    updateExpenseButtons();
}

function createExpenseInput(lastExpenseRow, idNumber) {
    const expenseRow = document.createElement("div");
    expenseRow.classList.add("row", "justify-content-center", "m-3");

    // expense col
    const expenseCol = document.createElement("div");
    expenseCol.classList.add("col-sm-9", "col-12");
    expenseRow.appendChild(expenseCol);

    // label
    const expenseLabel = document.createElement("label");
    expenseLabel.classList.add("form-label");
    expenseLabel.setAttribute("for", "expenseItem" + idNumber);
    expenseLabel.innerText = "Expense";
    expenseCol.appendChild(expenseLabel);

    // input
    const expenseInput = document.createElement("input");
    expenseInput.classList.add("form-control");
    expenseInput.id = "expenseItem" + idNumber;
    expenseInput.type = "number";
    expenseInput.placeholder = "Expense";
    expenseInput.step = "0.01";
    expenseInput.min = "0";
    expenseInput.value = "0";
    expenseCol.appendChild(expenseInput);

    // button col
    const buttonCol = document.createElement("div");
    buttonCol.classList.add("col-sm-3", "col-12", "justify-content-center", "mt-3", "add-button-container");
    expenseRow.appendChild(buttonCol);

    // button
    const button = document.createElement("button");
    button.classList.add("btn", "btn-highlight");
    button.type = "button";
    button.setAttribute("data-btn", "add");
    button.innerText = "Add Expense";
    buttonCol.appendChild(button);

    addExpenseEventListener(expenseRow);
    updateAddButton(lastExpenseRow);
    lastExpenseRow.insertAdjacentElement("afterend", expenseRow);
    updateExpenseButtons();
}

function removeExpenseInput(button) {
    const expenseRow = button.parentElement.parentElement;
    console.dir("Expense Row: " + expenseRow);
    expenseRow.remove();
    updateExpenseButtons();
    updateTotalExpenseInput();
}

function updateExpenseButtons() {
    let addButtons = document.querySelectorAll("[data-btn='add']");
    let removeButtons = document.querySelectorAll("[data-btn='remove']");
    let buttonsAmount = addButtons.length + removeButtons.length;

    addButtons.forEach(button => {
        button.addEventListener("click", () => createExpenseInput(button.parentElement.parentElement, buttonsAmount + 1));
    });

    removeButtons.forEach(button => {
        button.addEventListener("click", () => removeExpenseInput(button));
    });
}

function updateAddButton(expenseRow){
    const button = expenseRow.querySelector("[data-btn='add']");
    button.innerText = "Remove Expense";
    button.classList.remove("btn-highlight");
    button.classList.add("btn-outline-danger");
    button.setAttribute("data-btn", "remove");
}

function updateTotalExpenseInput() {
    const expenseInputs = document.querySelectorAll("*[id^='expenseItem']");
    const totalExpenseInput = document.getElementById("totalExpenses");
    let totalExpense = 0;

    console.log("Expense Inputs: " + expenseInputs)
    console.log("Total Expense Input: " + totalExpenseInput)

    expenseInputs.forEach(input => {
        totalExpense += parseFloat(input.value);
    });

    totalExpenseInput.value = totalExpense;
}

function nextTab(tabs) {
    const activeTab = tabs.find(tab => tab.classList.contains("active"));
    tabs.forEach(function (tab, index, array) {
        if (tab === activeTab) {
            const nextIndex = index + 1;
            if (nextIndex < array.length) {
                const nextTab = array[nextIndex];
                console.log("Next tab: " + nextTab);
                const bootstrapTab = new bootstrap.Tab(nextTab);
                bootstrapTab.show();
            }
        }
    });
}

function addExpenseEventListener(expenseRow){
    const expenseInput = expenseRow.querySelector("[id^='expenseItem']");
    expenseInput.addEventListener("change", () => updateTotalExpenseInput());
}

function addFormEventListeners() {
    const incomePeriodSelect = document.getElementById("incomePeriod");
    const incomeInput = document.getElementById("income");
    const expenseInput = document.getElementById("totalExpenses");
    const debtMonthsInput = document.getElementById("debtMonths");
    const debtInput = document.getElementById("debt");
    const savingsPercentInput = document.getElementById("savingsPercent");
    const debtPercentInput = document.getElementById("debtPercent");

    const inputs = [incomePeriodSelect, incomeInput, expenseInput, debtMonthsInput, debtInput, savingsPercentInput, debtPercentInput];

    inputs.forEach(input => {
        input.addEventListener("change", () => calculateBudget());
    });

    const defaultExpenseInput = document.getElementById("expenseItem1");
    console.log("Default Expense Input: " + defaultExpenseInput)
    defaultExpenseInput.addEventListener("change", () => updateTotalExpenseInput());
}

function calculateBudget() {
    const incomeInput = document.getElementById("income");
    const expenseInput = document.getElementById("totalExpenses");
    const debtInput = document.getElementById("debt");
    const incomeBudgetInput = document.getElementById("incomeBudget");
    const expenseBudgetInput = document.getElementById("expensesBudget");
    const savingsBudgetInput = document.getElementById("savingsBudget");
    const debtBudgetInput = document.getElementById("debtBudget");
    const debtBudgetPercentInput = document.getElementById("debtBudgetPercent");
    const debtBudgetPercentMonths = document.getElementById("monthsToPayPercent");
    const debtBudgetMonthsInput = document.getElementById("debtBudgetMonths");
    const debtBudgetMonths = document.getElementById("monthsToPay");
    const debtMonthsInput = document.getElementById("debtMonths");
    const cashBudget = document.getElementById("cashBudget");

    incomeBudgetInput.value = incomeInput.value;
    expenseBudgetInput.value = expenseInput.value;
    debtBudgetInput.value = debtInput.value;
    savingsBudgetInput.value = calculateSavingsPercent();
    debtBudgetPercentInput.value = calculateDebtPercent();
    debtBudgetPercentMonths.innerText = calculateDebtMonths();
    debtBudgetMonthsInput.value = calculateDebtRepayBasedOnMonths();
    debtBudgetMonths.innerText = debtMonthsInput.value;
    cashBudget.value = calculateCashLeft();

    calculateCashLeftSpan();
}

function calculateCashLeftSpan() {
    const cashLeftSpan = document.getElementById("cashLeft");
    cashLeftSpan.innerText = String(calculateCashLeft());
}

function calculateCashLeft() {
    const incomeInput = document.getElementById("income");
    const expenseInput = document.getElementById("totalExpenses");

    const income = incomeInput.value;
    const expenses = expenseInput.value;
    const savings = calculateSavingsPercent();
    const debt = calculateDebtPercent();
    return (income - expenses - savings - debt);
}

function calculateSavingsPercent() {
    const incomeInput = document.getElementById("income");
    const income = incomeInput.value;
    const savingsPercentInput = document.getElementById("savingsPercent");
    const savingsPercent = savingsPercentInput.value / 100;
    return (income * savingsPercent).toFixed(2);
}

function calculateDebtPercent() {
    const incomeInput = document.getElementById("income");
    const income = incomeInput.value;
    const debtPercentInput = document.getElementById("debtPercent");
    const debtPercent = debtPercentInput.value / 100;
    return (income * debtPercent).toFixed(2);
}

function calculateDebtRepayBasedOnMonths() {
    const debtInput = document.getElementById("debt");
    const debt = debtInput.value;
    const debtMonthsInput = document.getElementById("debtMonths");
    const debtMonths = debtMonthsInput.value;
    return (debt / debtMonths).toFixed(2);
}

function calculateDebtMonths() {
    const debtInput = document.getElementById("debt");
    const debt = debtInput.value;
    return (debt / calculateDebtPercent()).toFixed(2);
}