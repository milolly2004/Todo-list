/* ==========================================
   BLOOMY PLANNER
========================================== */


/* ==========================================
   DATA
========================================== */

let tasks = [];

let editingTaskId = null;

let selectedIcon = "🌸";


/* ==========================================
   LOAD DATA
========================================== */

try {

    const saved =
        localStorage.getItem(
            "bloomyTasks"
        );


    if (saved) {

        tasks =
            JSON.parse(saved);

    }

} catch (error) {

    console.log(
        "Could not load saved tasks."
    );

    tasks = [];

}


/* ==========================================
   START
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupIconPicker();

        updateToday();

        render();

    }
);


/* ==========================================
   ICON PICKER
========================================== */

function setupIconPicker() {

    const buttons =
        document.querySelectorAll(
            ".icon-option"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedIcon =
                        button.dataset.icon;


                    buttons.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    button.classList.add(
                        "selected"
                    );

                }
            );

        }
    );

}


/* ==========================================
   SELECT ICON
========================================== */

function selectIcon(icon) {

    selectedIcon = icon;


    const buttons =
        document.querySelectorAll(
            ".icon-option"
        );


    buttons.forEach(
        function (button) {

            if (
                button.dataset.icon ===
                icon
            ) {

                button.classList.add(
                    "selected"
                );

            } else {

                button.classList.remove(
                    "selected"
                );

            }

        }
    );

}


/* ==========================================
   TODAY
========================================== */

function updateToday() {

    const element =
        document.getElementById(
            "today"
        );


    if (!element) return;


    const today =
        new Date();


    element.textContent =
        today.toLocaleDateString(
            "en-GB",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


/* ==========================================
   PAGE NAVIGATION
========================================== */

function showPage(page) {

    const dashboard =
        document.getElementById(
            "dashboardPage"
        );


    const tasksPage =
        document.getElementById(
            "tasksPage"
        );


    const dashboardNav =
        document.getElementById(
            "dashboardNav"
        );


    const tasksNav =
        document.getElementById(
            "tasksNav"
        );


    if (
        page === "dashboard"
    ) {

        dashboard.classList.remove(
            "hidden"
        );


        tasksPage.classList.add(
            "hidden"
        );


        dashboardNav.classList.add(
            "active"
        );


        tasksNav.classList.remove(
            "active"
        );

    } else {

        dashboard.classList.add(
            "hidden"
        );


        tasksPage.classList.remove(
            "hidden"
        );


        dashboardNav.classList.remove(
            "active"
        );


        tasksNav.classList.add(
            "active"
        );

    }


    render();

}


/* ==========================================
   OPEN CREATE MODAL
========================================== */

function openCreateModal() {

    editingTaskId = null;

    selectedIcon = "🌸";


    document
        .getElementById("modal")
        .classList.remove(
            "hidden"
        );


    document
        .getElementById("modalTitle")
        .textContent =
        "Create a new task";


    document
        .getElementById("saveButton")
        .innerHTML =
        'Create task <span>→</span>';


    document
        .getElementById("taskName")
        .value = "";


    document
        .getElementById("taskDeadline")
        .value = "";


    document
        .getElementById("subtaskInputs")
        .innerHTML = "";


    addSubtaskInput();


    selectIcon("🌸");


    setTimeout(
        function () {

            document
                .getElementById("taskName")
                .focus();

        },
        100
    );

}


/* ==========================================
   CLOSE MODAL
========================================== */

function closeModal() {

    document
        .getElementById("modal")
        .classList.add(
            "hidden"
        );

}


/* ==========================================
   ADD SUBTASK
========================================== */

function addSubtaskInput(
    value = "",
    completed = false
) {

    const container =
        document.getElementById(
            "subtaskInputs"
        );


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "subtask-input-row";


    const input =
        document.createElement(
            "input"
        );


    input.type = "text";

    input.placeholder =
        "e.g. Finish chapter 1";

    input.value =
        value;


    input.className =
        "subtask-input";


    input.dataset.completed =
        completed
        ? "true"
        : "false";


    const remove =
        document.createElement(
            "button"
        );


    remove.type = "button";

    remove.className =
        "remove-subtask";

    remove.textContent =
        "×";


    remove.addEventListener(
        "click",
        function () {

            row.remove();

        }
    );


    row.appendChild(
        input
    );


    row.appendChild(
        remove
    );


    container.appendChild(
        row
    );

}


/* ==========================================
   SAVE TASK
========================================== */

function saveTask() {

    const nameElement =
        document.getElementById(
            "taskName"
        );


    const deadlineElement =
        document.getElementById(
            "taskDeadline"
        );


    const name =
        nameElement.value.trim();


    const deadline =
        deadlineElement.value;


    if (!name) {

        alert(
            "ใส่ชื่องานก่อนนะ 🌷"
        );


        nameElement.focus();


        return;

    }


    const inputRows =
        document.querySelectorAll(
            ".subtask-input-row"
        );


    const subtasks = [];


    inputRows.forEach(
        function (row) {

            const input =
                row.querySelector(
                    "input"
                );


            const text =
                input.value.trim();


            if (text) {

                subtasks.push({

                    text:
                        text,

                    completed:
                        input.dataset.completed
                        === "true"

                });

            }

        }
    );


    /* ==================================
       EDIT EXISTING TASK
    ================================== */

    if (
        editingTaskId !== null
    ) {

        const task =
            tasks.find(
                function (item) {

                    return (
                        item.id ===
                        editingTaskId
                    );

                }
            );


        if (task) {

            task.name =
                name;


            task.icon =
                selectedIcon;


            task.deadline =
                deadline;


            task.subtasks =
                subtasks;

        }

    }


    /* ==================================
       CREATE NEW TASK
    ================================== */

    else {

        const task = {

            id:
                Date.now(),

            name:
                name,

            icon:
                selectedIcon,

            deadline:
                deadline,

            subtasks:
                subtasks

        };


        tasks.push(
            task
        );

    }


    saveData();

    closeModal();

    render();

}


/* ==========================================
   EDIT TASK
========================================== */

function editTask(id) {

    const task =
        tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task) return;


    editingTaskId =
        id;


    selectedIcon =
        task.icon ||
        "🌸";


    document
        .getElementById("modal")
        .classList.remove(
            "hidden"
        );


    document
        .getElementById("modalTitle")
        .textContent =
        "Edit your task";


    document
        .getElementById("saveButton")
        .innerHTML =
        'Save changes <span>→</span>';


    document
        .getElementById("taskName")
        .value =
        task.name;


    document
        .getElementById("taskDeadline")
        .value =
        task.deadline ||
        "";


    const container =
        document.getElementById(
            "subtaskInputs"
        );


    container.innerHTML = "";


    if (
        task.subtasks &&
        task.subtasks.length > 0
    ) {

        task.subtasks.forEach(
            function (sub) {

                addSubtaskInput(
                    sub.text,
                    sub.completed
                );

            }
        );

    } else {

        addSubtaskInput();

    }


    selectIcon(
        selectedIcon
    );

}


/* ==========================================
   DELETE TASK
========================================== */

function deleteTask(id) {

    const confirmed =
        window.confirm(
            "Delete this task?"
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            function (task) {

                return (
                    task.id !== id
                );

            }
        );


    saveData();

    render();

}


/* ==========================================
   TOGGLE SUBTASK
========================================== */

function toggleSubtask(
    taskId,
    subtaskIndex
) {

    const task =
        tasks.find(
            function (item) {

                return (
                    item.id ===
                    taskId
                );

            }
        );


    if (!task) return;


    if (
        !task.subtasks ||
        !task.subtasks[subtaskIndex]
    ) {

        return;

    }


    task.subtasks[
        subtaskIndex
    ].completed =
        !task.subtasks[
            subtaskIndex
        ].completed;


    saveData();

    render();

}


/* ==========================================
   SAVE LOCAL STORAGE
========================================== */

function saveData() {

    try {

        localStorage.setItem(
            "bloomyTasks",
            JSON.stringify(
                tasks
            )
        );

    } catch (error) {

        console.log(
            "Could not save tasks."
        );

    }

}


/* ==========================================
   PROGRESS
========================================== */

function getProgress(task) {

    if (
        !task.subtasks ||
        task.subtasks.length === 0
    ) {

        return 0;

    }


    const completed =
        task.subtasks.filter(
            function (sub) {

                return (
                    sub.completed === true
                );

            }
        ).length;


    return Math.round(
        (
            completed /
            task.subtasks.length
        ) * 100
    );

}


/* ==========================================
   DEADLINE
========================================== */

function daysUntil(date) {

    if (!date) {

        return null;

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const deadline =
        new Date(
            date +
            "T00:00:00"
        );


    return Math.ceil(
        (
            deadline -
            today
        ) /
        86400000
    );

}


/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(date) {

    if (!date) {

        return "No deadline";

    }


    const value =
        new Date(
            date +
            "T00:00:00"
        );


    return value.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ==========================================
   TASK HTML
========================================== */

function createTaskHTML(task) {

    const progress =
        getProgress(task);


    const days =
        daysUntil(
            task.deadline
        );


    let deadlineText =
        formatDate(
            task.deadline
        );


    let deadlineClass =
        "";


    if (
        days !== null
    ) {

        if (days < 0) {

            deadlineText +=
                " · Overdue";

            deadlineClass =
                "soon";

        }

        else if (days === 0) {

            deadlineText +=
                " · Due today";

            deadlineClass =
                "soon";

        }

        else if (days <= 3) {

            deadlineText +=
                ` · ${days} days left`;

            deadlineClass =
                "soon";

        }

    }


    let subtasksHTML =
        "";


    if (
        task.subtasks &&
        task.subtasks.length
    ) {

        subtasksHTML =
            task.subtasks.map(
                function (
                    sub,
                    index
                ) {

                    return `

                        <div class="
                            subtask
                            ${
                                sub.completed
                                    ? "done"
                                    : ""
                            }
                        ">

                            <input
                                type="checkbox"
                                ${
                                    sub.completed
                                        ? "checked"
                                        : ""
                                }
                                onchange="
                                    toggleSubtask(
                                        ${task.id},
                                        ${index}
                                    )
                                "
                            >

                            <span>
                                ${escapeHTML(
                                    sub.text
                                )}
                            </span>

                        </div>

                    `;

                }
            ).join("");

    } else {

        subtasksHTML = `

            <div class="subtask">

                <span>
                    No subtasks yet
                </span>

            </div>

        `;

    }


    return `

        <article class="task-card">


            <div class="task-top">


                <div class="task-icon">

                    ${
                        task.icon ||
                        "🌸"
                    }

                </div>


                <div>

                    <div class="task-title">

                        ${escapeHTML(
                            task.name
                        )}

                    </div>


                    <div class="
                        deadline
                        ${deadlineClass}
                    ">

                        ${
                            task.deadline
                                ? "⌁ "
                                : ""
                        }

                        ${deadlineText}

                    </div>

                </div>


            </div>



            <div class="progress">

                <div
                    class="progress-bar"
                    style="
                        width: ${progress}%;
                    "
                ></div>

            </div>


            <div class="progress-row">

                <span class="progress-text">
                    ${progress}% complete
                </span>

                <span class="progress-text">
                    ${
                        task.subtasks
                            ? task.subtasks.length
                            : 0
                    }
                    ${
                        task.subtasks &&
                        task.subtasks.length === 1
                            ? "item"
                            : "items"
                    }
                </span>

            </div>



            <div class="subtasks">

                ${subtasksHTML}

            </div>



            <div class="task-actions">

                <button
                    type="button"
                    class="edit-task"
                    onclick="
                        editTask(
                            ${task.id}
                        )
                    "
                >
                    ✎ Edit
                </button>


                <button
                    type="button"
                    class="delete-task"
                    onclick="
                        deleteTask(
                            ${task.id}
                        )
                    "
                >
                    Delete
                </button>

            </div>


        </article>

    `;

}


/* ==========================================
   EMPTY STATE
========================================== */

function emptyStateHTML() {

    return `

        <div class="empty-state">

            <div class="empty-icon">
                🌱
            </div>

            <h3>
                Nothing here yet
            </h3>

            <p>
                Create your first little task
                and watch your list bloom.
            </p>

        </div>

    `;

}


/* ==========================================
   RENDER
========================================== */

function render() {

    const dashboard =
        document.getElementById(
            "dashboardTasks"
        );


    const allTasks =
        document.getElementById(
            "allTasks"
        );


    if (
        !dashboard ||
        !allTasks
    ) {

        return;

    }


    const sorted =
        [...tasks].sort(
            function (
                a,
                b
            ) {

                if (
                    !a.deadline &&
                    !b.deadline
                ) {

                    return 0;

                }


                if (!a.deadline) {

                    return 1;

                }


                if (!b.deadline) {

                    return -1;

                }


                return (
                    new Date(
                        a.deadline
                    ) -
                    new Date(
                        b.deadline
                    )
                );

            }
        );


    if (
        sorted.length === 0
    ) {

        dashboard.innerHTML =
            emptyStateHTML();


        allTasks.innerHTML =
            emptyStateHTML();

    } else {

        dashboard.innerHTML =
            sorted
                .slice(0, 4)
                .map(
                    createTaskHTML
                )
                .join("");


        allTasks.innerHTML =
            sorted
                .map(
                    createTaskHTML
                )
                .join("");

    }


    updateSummary();

}


/* ==========================================
   SUMMARY
========================================== */

function updateSummary() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return (
                    getProgress(task) ===
                    100
                );

            }
        ).length;


    const inProgress =
        total -
        completed;


    const dueSoon =
        tasks.filter(
            function (task) {

                const days =
                    daysUntil(
                        task.deadline
                    );


                return (

                    days !== null &&

                    days >= 0 &&

                    days <= 3 &&

                    getProgress(task) < 100

                );

            }
        ).length;


    document.getElementById(
        "totalTasks"
    ).textContent =
        total;


    document.getElementById(
        "progressTasks"
    ).textContent =
        inProgress;


    document.getElementById(
        "dueTasks"
    ).textContent =
        dueSoon;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value;


    return element.innerHTML;

}


/* ==========================================
   CLOSE MODAL WHEN CLICK BACKDROP
========================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal-backdrop"
            )
        ) {

            closeModal();

        }

    }
);


/* ==========================================
   ESC KEY
========================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);
