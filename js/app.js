const STORAGE_KEY = "expenseTrackerTransactions";
const THEME_KEY = "expenseTrackerTheme";


const categories = [
    "Salary",
    "Freelance",
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other"
];


const categoryIcons = {

    Salary: "₹",

    Freelance: "💼",

    Food: "🍔",

    Transport: "🚗",

    Shopping: "🛍",

    Bills: "📄",

    Entertainment: "🎬",

    Health: "❤",

    Education: "📚",

    Other: "●"
};


function getTransactions() {

    try {

        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (!stored) {

            return [];

        }

        const transactions =
            JSON.parse(stored);

        return Array.isArray(transactions)
            ? transactions
            : [];

    } catch (error) {

        console.error(
            "Unable to read transactions:",
            error
        );

        return [];
    }
}


function saveTransactions(transactions) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );
}


function createId() {

    return Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 9);
}


function getTodayString() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    if (!dateString) {

        return "-";
    }

    const date =
        new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {

        return dateString;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}



function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }
    ).format(Number(amount) || 0);
}



function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function initializeTheme() {

    const toggle =
        document.getElementById(
            "darkModeToggle"
        );

    const savedTheme =
        localStorage.getItem(THEME_KEY);


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode-active"
        );

    }


    if (toggle) {

        toggle.classList.toggle(
            "active",
            savedTheme === "dark"
        );


        toggle.addEventListener(
            "click",
            function () {

                const dark =
                    document.body.classList.toggle(
                        "dark-mode-active"
                    );


                localStorage.setItem(
                    THEME_KEY,
                    dark ? "dark" : "light"
                );


                toggle.classList.toggle(
                    "active",
                    dark
                );


                if (
                    typeof updateCharts ===
                    "function"
                ) {

                    updateCharts();

                }

            }
        );

    }

}


function initializeNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(function (item) {

        const href =
            item.getAttribute("href");

        if (!href) {

            return;
        }


        const targetPage =
            href
                .split("?")[0]
                .toLowerCase();


        if (
            targetPage === currentPage ||
            (
                currentPage === "" &&
                targetPage === "index.html"
            )
        ) {

            item.classList.add("active");

        }

    });

}


function calculateTotals(transactions) {

    let income = 0;
    let expense = 0;


    transactions.forEach(function (transaction) {

        const amount =
            Number(transaction.amount) || 0;


        if (transaction.type === "income") {

            income += amount;

        } else if (
            transaction.type === "expense"
        ) {

            expense += amount;

        }

    });


    return {

        income,
        expense,
        balance: income - expense

    };
}


function updateCurrentMonth() {

    const element =
        document.getElementById(
            "currentMonthLabel"
        );


    if (!element) {

        return;
    }


    const now = new Date();


    element.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );

}


function updateDashboard() {

    const transactions =
        getTransactions();


    const totals =
        calculateTotals(
            transactions
        );


    const incomeElement =
        document.getElementById(
            "totalIncome"
        );


    const expenseElement =
        document.getElementById(
            "totalExpenses"
        );


    const balanceElement =
        document.getElementById(
            "totalBalance"
        );


    const transactionElement =
        document.getElementById(
            "totalTransactions"
        );


    if (incomeElement) {

        incomeElement.textContent =
            formatCurrency(
                totals.income
            );

    }


    if (expenseElement) {

        expenseElement.textContent =
            formatCurrency(
                totals.expense
            );

    }


    if (balanceElement) {

        balanceElement.textContent =
            formatCurrency(
                totals.balance
            );

    }


    if (transactionElement) {

        transactionElement.textContent =
            transactions.length;

    }


    updateCurrentMonth();

    renderRecentTransactions();

    updateCharts();

}


function populateCategorySelect(
    selectElement,
    selectedValue = "all"
) {

    if (!selectElement) {

        return;
    }


    selectElement.innerHTML = "";


    const allOption =
        document.createElement("option");

    allOption.value = "all";

    allOption.textContent =
        "All Categories";

    selectElement.appendChild(
        allOption
    );


    categories.forEach(function (category) {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        selectElement.appendChild(
            option
        );

    });


    if (
        selectedValue &&
        [...selectElement.options]
            .some(
                option =>
                    option.value ===
                    selectedValue
            )
    ) {

        selectElement.value =
            selectedValue;

    }

}


function filterTransactions(
    transactions,
    type,
    category
) {

    return transactions.filter(
        function (transaction) {

            const typeMatches =
                type === "all" ||
                transaction.type === type;


            const categoryMatches =
                category === "all" ||
                transaction.category === category;


            return (
                typeMatches &&
                categoryMatches
            );

        }
    );

}


function renderRecentTransactions() {

    const container =
        document.getElementById(
            "transactionsList"
        );


    if (!container) {

        return;
    }


    const typeFilter =
        document.getElementById(
            "typeFilter"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (
        categoryFilter &&
        categoryFilter.options.length <= 1
    ) {

        populateCategorySelect(
            categoryFilter,
            categoryFilter.value || "all"
        );

    }


    const transactions =
        getTransactions();


    const type =
        typeFilter
            ? typeFilter.value
            : "all";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";


    let filtered =
        filterTransactions(
            transactions,
            type,
            category
        );


    filtered =
        [...filtered]
            .sort(
                (a, b) =>
                    new Date(
                        b.date
                    ) -
                    new Date(
                        a.date
                    )
            )
            .slice(0, 6);


    if (filtered.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ☷
                </div>

                <h3>
                    No Transactions Found
                </h3>

                <p>
                    Add a transaction to see it here.
                </p>

                <a
                    href="add-transaction.html"
                    class="primary-button"
                >
                    Add Transaction
                </a>

            </div>

        `;

        return;
    }


    container.innerHTML =
        filtered
            .map(
                transaction =>
                    createRecentTransactionHTML(
                        transaction
                    )
            )
            .join("");

}




function createRecentTransactionHTML(
    transaction
) {

    const isIncome =
        transaction.type === "income";


    const icon =
        isIncome
            ? "↗"
            : "↘";


    const sign =
        isIncome
            ? "+"
            : "-";


    return `

        <div
            class="transaction-item"
            data-id="${escapeHTML(transaction.id)}"
        >

            <div class="transaction-main">

                <div
                    class="transaction-icon ${
                        isIncome
                            ? "income"
                            : "expense"
                    }"
                >
                    ${icon}
                </div>


                <div class="transaction-info">

                    <h4>
                        ${escapeHTML(
                            transaction.description ||
                            transaction.category
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            transaction.category
                        )}
                    </p>

                </div>

            </div>


            <div class="transaction-date">

                ${formatDate(
                    transaction.date
                )}

            </div>


            <div class="transaction-amount ${
                isIncome
                    ? "income"
                    : "expense"
            }">

                ${sign}${formatCurrency(
                    transaction.amount
                )}

            </div>


            <div class="transaction-actions">

                <button
                    type="button"
                    class="action-button"
                    data-action="edit"
                    data-id="${escapeHTML(
                        transaction.id
                    )}"
                    title="Edit"
                >
                    ✎
                </button>


                <button
                    type="button"
                    class="action-button delete"
                    data-action="delete"
                    data-id="${escapeHTML(
                        transaction.id
                    )}"
                    title="Delete"
                >
                    ×
                </button>

            </div>

        </div>

    `;
}




function initializeTransactionsPage() {

    const container =
        document.getElementById(
            "allTransactionsList"
        );


    if (!container) {

        return;
    }


    const typeFilter =
        document.getElementById(
            "allTypeFilter"
        );


    const categoryFilter =
        document.getElementById(
            "allCategoryFilter"
        );


    if (categoryFilter) {

        populateCategorySelect(
            categoryFilter,
            "all"
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            renderAllTransactions
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderAllTransactions
        );

    }


    renderAllTransactions();

}


function renderAllTransactions() {

    const container =
        document.getElementById(
            "allTransactionsList"
        );


    const emptyState =
        document.getElementById(
            "emptyTransactions"
        );


    if (!container) {

        return;
    }


    const typeFilter =
        document.getElementById(
            "allTypeFilter"
        );


    const categoryFilter =
        document.getElementById(
            "allCategoryFilter"
        );


    const type =
        typeFilter
            ? typeFilter.value
            : "all";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";


    const transactions =
        getTransactions();


    const filtered =
        filterTransactions(
            transactions,
            type,
            category
        )
        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    if (filtered.length === 0) {

        container.innerHTML = "";


        if (emptyState) {

            emptyState.style.display =
                "block";

        }

        return;
    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    container.innerHTML =
        filtered
            .map(
                createTableRow
            )
            .join("");

}




function createTableRow(
    transaction
) {

    const isIncome =
        transaction.type === "income";


    const sign =
        isIncome
            ? "+"
            : "-";


    return `

        <tr>

            <td>

                <strong>
                    ${escapeHTML(
                        transaction.description ||
                        transaction.category
                    )}
                </strong>

            </td>


            <td>
                ${escapeHTML(
                    transaction.category
                )}
            </td>


            <td>
                ${formatDate(
                    transaction.date
                )}
            </td>


            <td>

                <span
                    class="type-badge ${
                        isIncome
                            ? "income"
                            : "expense"
                    }"
                >

                    ${
                        isIncome
                            ? "Income"
                            : "Expense"
                    }

                </span>

            </td>


            <td
                class="${
                    isIncome
                        ? "amount-income"
                        : "amount-expense"
                }"
            >

                ${sign}${formatCurrency(
                    transaction.amount
                )}

            </td>


            <td>

                <div class="transaction-actions">

                    <button
                        type="button"
                        class="action-button"
                        data-action="edit"
                        data-id="${escapeHTML(
                            transaction.id
                        )}"
                        title="Edit"
                    >
                        ✎
                    </button>


                    <button
                        type="button"
                        class="action-button delete"
                        data-action="delete"
                        data-id="${escapeHTML(
                            transaction.id
                        )}"
                        title="Delete"
                    >
                        ×
                    </button>

                </div>

            </td>

        </tr>

    `;
}




function initializeTransactionActions() {

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {

                return;
            }


            const action =
                button.dataset.action;


            const id =
                button.dataset.id;


            if (!id) {

                return;
            }


            if (action === "edit") {

                window.location.href =
                    `add-transaction.html?edit=${encodeURIComponent(
                        id
                    )}`;

                return;
            }


            if (action === "delete") {

                deleteTransaction(id);

            }

        }
    );

}



function deleteTransaction(id) {

    const transactions =
        getTransactions();


    const transaction =
        transactions.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!transaction) {

        return;
    }


    const confirmed =
        window.confirm(
            `Delete this transaction?\n\n${transaction.description || transaction.category}`
        );


    if (!confirmed) {

        return;
    }


    const updated =
        transactions.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveTransactions(updated);


    refreshPageData();

}


function refreshPageData() {

    updateDashboard();

    renderAllTransactions();

    initializeCategoriesPageRender();

}



function initializeAddPage() {

    const form =
        document.getElementById(
            "transactionForm"
        );


    if (!form) {

        return;
    }


    const amount =
        document.getElementById(
            "amount"
        );


    const category =
        document.getElementById(
            "category"
        );


    const date =
        document.getElementById(
            "transactionDate"
        );


    const description =
        document.getElementById(
            "description"
        );


    const cancelButton =
        document.getElementById(
            "cancelTransaction"
        );


    const status =
        document.getElementById(
            "formStatus"
        );


    const today =
        getTodayString();


    if (date) {

        date.max = today;


        if (!date.value) {

            date.value = today;

        }

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const editId =
        params.get("edit");


    let editingTransaction = null;


    if (editId) {

        const transactions =
            getTransactions();


        editingTransaction =
            transactions.find(
                item =>
                    String(item.id) ===
                    String(editId)
            );


        if (editingTransaction) {

            loadTransactionIntoForm(
                editingTransaction
            );

            const title =
                document.getElementById(
                    "formPageTitle"
                );


            if (title) {

                title.textContent =
                    "Edit Transaction";

            }

        }

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "index.html";

            }
        );

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearFormErrors();


            const transactionType =
                document.querySelector(
                    'input[name="transactionType"]:checked'
                );


            const type =
                transactionType
                    ? transactionType.value
                    : "expense";


            const amountValue =
                amount
                    ? amount.value.trim()
                    : "";


            const categoryValue =
                category
                    ? category.value
                    : "";


            const dateValue =
                date
                    ? date.value
                    : "";


            const descriptionValue =
                description
                    ? description.value.trim()
                    : "";


            const errors =
                validateTransactionForm(
                    amountValue,
                    categoryValue,
                    dateValue,
                    descriptionValue
                );


            if (Object.keys(errors).length) {

                showFormErrors(errors);

                return;
            }


            const transaction = {

                id:
                    editingTransaction
                        ? editingTransaction.id
                        : createId(),

                type,

                amount:
                    Number(amountValue),

                category:
                    categoryValue,

                date:
                    dateValue,

                description:
                    descriptionValue

            };


            const transactions =
                getTransactions();


            if (editingTransaction) {

                const index =
                    transactions.findIndex(
                        item =>
                            String(item.id) ===
                            String(editId)
                    );


                if (index !== -1) {

                    transactions[index] =
                        transaction;

                }

            } else {

                transactions.push(
                    transaction
                );

            }


            saveTransactions(
                transactions
            );


            if (status) {

                status.textContent =
                    editingTransaction
                        ? "Transaction updated successfully."
                        : "Transaction added successfully.";

                status.className =
                    "form-status success";

            }


            setTimeout(
                function () {

                    window.location.href =
                        editingTransaction
                            ? "transactions.html"
                            : "index.html";

                },
                500
            );

        }
    );

}


function loadTransactionIntoForm(
    transaction
) {

    const amount =
        document.getElementById(
            "amount"
        );


    const category =
        document.getElementById(
            "category"
        );


    const date =
        document.getElementById(
            "transactionDate"
        );


    const description =
        document.getElementById(
            "description"
        );


    const typeRadio =
        document.querySelector(
            `input[name="transactionType"][value="${transaction.type}"]`
        );


    if (typeRadio) {

        typeRadio.checked = true;

    }


    if (amount) {

        amount.value =
            transaction.amount;

    }


    if (category) {

        category.value =
            transaction.category;

    }


    if (date) {

        date.value =
            transaction.date;

    }


    if (description) {

        description.value =
            transaction.description || "";

    }

}



function validateTransactionForm(
    amount,
    category,
    date,
    description
) {

    const errors = {};


    if (
        !amount ||
        Number(amount) <= 0
    ) {

        errors.amount =
            "Please enter a valid amount.";

    }


    if (!category) {

        errors.category =
            "Please select a category.";

    }


    if (!date) {

        errors.date =
            "Please select a date.";

    }


    if (
        date &&
        date > getTodayString()
    ) {

        errors.date =
            "Date cannot be in the future.";

    }


    if (!description) {

        errors.description =
            "Please enter a description.";

    } else if (
        description.length < 2
    ) {

        errors.description =
            "Description is too short.";

    }


    return errors;

}


function showFormErrors(errors) {

    const status =
        document.getElementById(
            "formStatus"
        );


    const amountError =
        document.getElementById(
            "amountError"
        );


    const categoryError =
        document.getElementById(
            "categoryError"
        );


    const dateError =
        document.getElementById(
            "dateError"
        );


    const descriptionError =
        document.getElementById(
            "descriptionError"
        );


    if (amountError) {

        amountError.textContent =
            errors.amount || "";

    }


    if (categoryError) {

        categoryError.textContent =
            errors.category || "";

    }


    if (dateError) {

        dateError.textContent =
            errors.date || "";

    }


    if (descriptionError) {

        descriptionError.textContent =
            errors.description || "";

    }


    const amount =
        document.getElementById(
            "amount"
        );


    const category =
        document.getElementById(
            "category"
        );


    const date =
        document.getElementById(
            "transactionDate"
        );


    const description =
        document.getElementById(
            "description"
        );


    amount?.classList.toggle(
        "form-error",
        Boolean(errors.amount)
    );


    category?.classList.toggle(
        "form-error",
        Boolean(errors.category)
    );


    date?.classList.toggle(
        "form-error",
        Boolean(errors.date)
    );


    description?.classList.toggle(
        "form-error",
        Boolean(errors.description)
    );


    if (status) {

        status.textContent =
            "Please fix the errors above.";

        status.className =
            "form-status error";

    }

}


function clearFormErrors() {

    const errorIds = [

        "amountError",

        "categoryError",

        "dateError",

        "descriptionError"

    ];


    errorIds.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent = "";

        }

    });


    [

        "amount",

        "category",

        "transactionDate",

        "description"

    ].forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.classList.remove(
                "form-error"
            );

        }

    });


    const status =
        document.getElementById(
            "formStatus"
        );


    if (status) {

        status.textContent = "";

        status.className =
            "form-status";

    }

}




let incomeExpenseChart = null;
let categoryChart = null;




function updateCharts() {

    updateIncomeExpenseChart();

    updateExpenseCategoryChart();

}



function updateIncomeExpenseChart() {

    const canvas =
        document.getElementById(
            "expenseOverviewChart"
        );


    if (!canvas) {

        return;
    }


    if (
        typeof Chart ===
        "undefined"
    ) {

        return;
    }


    const transactions =
        getTransactions();


    const totals =
        calculateTotals(
            transactions
        );


    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();

    }


    incomeExpenseChart =
        new Chart(
            canvas.getContext("2d"),
            {

                type: "line",

                data: {

                    labels: [
                        "Income",
                        "Expenses"
                    ],

                    datasets: [

                        {

                            label: "Income",

                            data: [
                                totals.income,
                                0
                            ],

                            borderColor:
                                "#16a765",

                            backgroundColor:
                                "rgba(22,167,101,0.08)",

                            borderWidth: 3,

                            tension: 0.35,

                            fill: false,

                            pointRadius: 5,

                            pointHoverRadius: 7

                        },


                        {

                            label: "Expenses",

                            data: [
                                0,
                                totals.expense
                            ],

                            borderColor:
                                "#ef4444",

                            backgroundColor:
                                "rgba(239,68,68,0.08)",

                            borderWidth: 3,

                            tension: 0.35,

                            fill: false,

                            pointRadius: 5,

                            pointHoverRadius: 7

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        mode: "index",

                        intersect: false

                    },


                    plugins: {

                        legend: {

                            display: true,

                            position: "top"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            context.dataset
                                                .label +
                                            ": " +
                                            formatCurrency(
                                                context.parsed.y
                                            )
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function (
                                        value
                                    ) {

                                        return formatCurrency(
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}



function updateExpenseCategoryChart() {

    const canvas =
        document.getElementById(
            "categoryBreakdownChart"
        );


    if (!canvas) {

        return;
    }


    if (
        typeof Chart ===
        "undefined"
    ) {

        return;
    }


    const transactions =
        getTransactions();


    const expenseTransactions =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    const categoryTotals = {};


    expenseTransactions.forEach(
        function (transaction) {

            const category =
                transaction.category ||
                "Other";


            categoryTotals[category] =
                (
                    categoryTotals[category] ||
                    0
                ) +
                (
                    Number(
                        transaction.amount
                    ) || 0
                );

        }
    );


    const labels =
        Object.keys(categoryTotals);


    const values =
        labels.map(
            category =>
                categoryTotals[category]
        );


    const generatedColors = [

        "#635bff",

        "#16a765",

        "#ef4444",

        "#f59e0b",

        "#06b6d4",

        "#8b5cf6",

        "#ec4899",

        "#84cc16",

        "#f97316",

        "#64748b"

    ];


    if (categoryChart) {

        categoryChart.destroy();

    }


    categoryChart =
        new Chart(
            canvas.getContext("2d"),
            {

                type: "doughnut",

                data: {

                    labels,

                    datasets: [

                        {

                            data: values,

                            backgroundColor:
                                generatedColors
                                    .slice(
                                        0,
                                        labels.length
                                    ),

                            borderWidth: 0,

                            hoverOffset: 5

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "68%",

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            " " +
                                            context.label +
                                            ": " +
                                            formatCurrency(
                                                context.raw
                                            )
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );


    renderCategoryLegend(
        labels,
        values,
        generatedColors
    );

}




function renderCategoryLegend(
    labels,
    values,
    colors
) {

    const container =
        document.getElementById(
            "categoryLegend"
        );


    if (!container) {

        return;
    }


    if (!labels.length) {

        container.innerHTML = `

            <div class="empty-state">

                <p>
                    No expense data available.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        labels
            .map(
                function (
                    label,
                    index
                ) {

                    return `

                        <div
                            class="legend-item"
                        >

                            <div
                                class="legend-left"
                            >

                                <span
                                    class="legend-dot"
                                    style="
                                        background:${colors[index]};
                                    "
                                ></span>

                                <span>
                                    ${escapeHTML(
                                        label
                                    )}
                                </span>

                            </div>


                            <strong>
                                ${formatCurrency(
                                    values[index]
                                )}
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}




function initializeCategoriesPage() {

    const grid =
        document.getElementById(
            "categoryGrid"
        );


    if (!grid) {

        return;
    }


    initializeCategoriesPageRender();

}




function initializeCategoriesPageRender() {

    const grid =
        document.getElementById(
            "categoryGrid"
        );


    if (!grid) {

        return;
    }


    const transactions =
        getTransactions();


    const categoryTotals = {};


    categories.forEach(
        function (category) {

            categoryTotals[category] =
                0;

        }
    );


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type ===
                "expense"
            ) {

                const category =
                    transaction.category ||
                    "Other";


                if (
                    categoryTotals[
                        category
                    ] === undefined
                ) {

                    categoryTotals[
                        category
                    ] = 0;

                }


                categoryTotals[category] +=
                    Number(
                        transaction.amount
                    ) || 0;

            }

        }
    );


    grid.innerHTML =
        Object.keys(categoryTotals)
            .map(
                function (category) {

                    const total =
                        categoryTotals[
                            category
                        ];


                    return `

                        <div
                            class="category-card"
                        >

                            <div
                                class="category-card-icon"
                            >

                                ${
                                    categoryIcons[
                                        category
                                    ] || "●"
                                }

                            </div>


                            <h3>
                                ${escapeHTML(
                                    category
                                )}
                            </h3>


                            <p>
                                Total expenses
                            </p>


                            <div
                                class="category-card-amount"
                            >
                                ${formatCurrency(
                                    total
                                )}
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}




function initializeDashboardFilters() {

    const typeFilter =
        document.getElementById(
            "typeFilter"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (
        categoryFilter &&
        categoryFilter.options.length <= 1
    ) {

        populateCategorySelect(
            categoryFilter,
            "all"
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            renderRecentTransactions
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderRecentTransactions
        );

    }

}




function initializeViewAllButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-view-all]"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                window.location.href =
                    "transactions.html";

            }
        );

    });

}




function initializeStorageSync() {

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                STORAGE_KEY
            ) {

                refreshPageData();

            }


            if (
                event.key ===
                THEME_KEY
            ) {

                const dark =
                    event.newValue ===
                    "dark";


                document.body.classList.toggle(
                    "dark-mode-active",
                    dark
                );


                const toggle =
                    document.getElementById(
                        "darkModeToggle"
                    );


                toggle?.classList.toggle(
                    "active",
                    dark
                );

            }

        }
    );

}




document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeTheme();

        initializeNavigation();

        initializeTransactionActions();

        initializeDashboardFilters();

        initializeTransactionsPage();

        initializeAddPage();

        initializeCategoriesPage();

        initializeViewAllButtons();

        initializeStorageSync();

        updateDashboard();

        renderAllTransactions();

        initializeCategoriesPageRender();

    }
);