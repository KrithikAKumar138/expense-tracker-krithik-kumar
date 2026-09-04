<<<<<<< HEAD
# 💰 Expense Tracker

A simple, responsive, and user-friendly **Expense Tracker Web Application** built using **HTML, CSS, and JavaScript**.

This application helps users manage their income and expenses, view their financial balance, analyze spending by category, and maintain transaction records using the browser's Local Storage.

---

## 📌 Project Overview

The Expense Tracker is designed to provide a simple way to record and manage daily financial transactions.

Users can add income and expenses, edit or delete existing transactions, filter transactions, view financial summaries, and analyze expenses through charts.

The application uses **Local Storage**, so transaction data remains available even after refreshing the browser.

---

## 🚀 Features

- Add income transactions
- Add expense transactions
- Edit transactions
- Delete transactions
- Automatically set today's date
- Calculate total income
- Calculate total expenses
- Calculate total balance
- Display total number of transactions
- Filter transactions by type
- Filter transactions by category
- View recent transactions
- View complete transaction history
- Category-wise expense summary
- Income & Expenses chart
- Expense by Category donut chart
- Local Storage persistence
- Dark Mode
- Responsive design
- Separate pages for different sections

---

## 🛠️ Technologies Used

- **HTML5** – Structure of the application
- **CSS3** – Styling and responsive layout
- **JavaScript** – Application logic and functionality
- **Chart.js** – Financial charts and data visualization
- **Local Storage** – Browser-based transaction data storage

---

# 📄 Pages

## 🏠 Dashboard

The Dashboard provides an overview of the user's financial activity.

It displays:

- Total Income
- Total Expenses
- Total Balance
- Total Transactions
- Income & Expenses chart
- Expense by Category chart
- Recent Transactions

The Dashboard gives users a quick overview of their current financial status.

---

## 💳 Transactions

The Transactions page displays the complete transaction history.

Users can:

- View all transactions
- Filter by Income or Expense
- Filter by Category
- Edit transactions
- Delete transactions

Each transaction displays:

- Description
- Category
- Date
- Type
- Amount
- Edit action
- Delete action

---

## ➕ Add Transaction

The Add Transaction page allows users to create a new transaction.

Users can enter:

- Transaction Type
- Amount
- Category
- Date
- Description

The available transaction types are:

- Income
- Expense

The date is automatically set to today's date.

The form also includes validation to ensure that valid transaction information is entered.

---

## 🗂️ Categories

The Categories page displays the available expense categories and their total expenses.

Categories include:

- Salary
- Freelance
- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Education
- Other

The category section helps users understand how their expenses are distributed.

---

# 💾 Data Storage

This project uses the browser's **Local Storage** to save transactions.

No external database is required.

Transactions remain available after refreshing the page because the data is stored locally in the browser.

The application stores transaction information such as:

- Transaction ID
- Transaction type
- Amount
- Category
- Date
- Description

---

# 🌙 Dark Mode

The application includes **Dark Mode**.

Users can switch between:

- Light Mode
- Dark Mode

The selected theme is stored in Local Storage, so the user's theme preference remains active when navigating between pages.

---

# 📊 Charts

The application uses **Chart.js** to display financial information.

## Income & Expenses

Displays an overview of income and expenses.

The chart provides a visual representation of the user's financial activity.

## Expense by Category

Displays expense distribution across different categories.

This helps users understand where their money is being spent.

---

# 📱 Responsive Design

The application is designed to work on:

- Desktop
- Laptop
- Tablet
- Mobile devices

The layout automatically adjusts according to the screen size.

The responsive design ensures that the application remains usable on smaller screens.

---

# 📁 Project Structure

```text
expense-tracker/
│
├── index.html
├── transactions.html
├── add-transaction.html
├── categories.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
=======

