let tasks = JSON.parse(localStorage.getItem("bloomyTasks")) || [];

const categoryNames = {
    research: "🌸 วิจัย",
    university: "💜 มหาวิทยาลัย",
    teaching: "🌼 งานสอน",
    personal: "🌿 ส่วนตัว",
    other: "🩵 อื่น ๆ"
};


/* PAGE */

function showPage(page) {

    document.getElementById("dashboardPage")
        .classList.toggle("hidden", page !== "dashboard");

    document.getElementById("tasksPage")
        .classList.toggle("hidden", page !== "tasks");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (page === "dashboard") {
        document.querySelectorAll(".nav-btn")[0]
            .classList.add("active");
    } else {
        document.querySelectorAll(".nav-btn")[1]
            .classList.add("active");
    }

    render();
}


/* MODAL */

function openModal() {

    document.getElementById("modal")
        .classList.remove("hidden");

    document.getElementById("taskName").value = "";
    document.getElementById("taskDeadline").value = "";

    document.getElementById("subtaskInputs").innerHTML = "";

    addSubtaskInput();
}


function closeModal() {

    document.getElementById("modal")
        .classList.add("hidden");
}


/* SUBTASK INPUT */

function addSubtaskInput() {

    const container =
        document.getElementById("subtaskInputs");

    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = "เช่น ทำแบบสัมภาษณ์";
    input.className = "new-subtask";

    input.style.marginTop = "8px";

    container.appendChild(input);
}


/* CREATE TASK */

function createTask() {

    const name =
        document.getElementById("taskName")
        .value.trim();

    const category =
        document.getElementById("taskCategory")
        .value;

    const deadline =
        document.getElementById("taskDeadline")
        .value;

    const subtaskInputs =
        document.querySelectorAll(".new-subtask");

    if (!name) {
        alert("กรุณาใส่ชื่องาน");
        return;
    }

    const subtasks = [];

    subtaskInputs.forEach(input => {

        if (input.value.trim()) {

            subtasks.push({
                text: input.value.trim(),
                completed: false
            });

        }

    });


    const task = {

        id: Date.now(),

        name,

        category,

        deadline,

        subtasks

    };


    tasks.push(task);

    saveTasks();

    closeModal();

    render();
}


/* SAVE */

function saveTasks() {

    localStorage.setItem(
        "bloomyTasks",
        JSON.stringify(tasks)
    );

}


/* TOGGLE SUBTASK */

function toggleSubtask(taskId, subIndex) {

    const task =
        tasks.find(t => t.id === taskId);

    if (!task) return;

    task.subtasks[subIndex].completed =
        !task.subtasks[subIndex].completed;

    saveTasks();

    render();
}


/* DELETE */

function deleteTask(id) {

    if (!confirm("ต้องการลบงานนี้ใช่ไหม?")) {
        return;
    }

    tasks =
        tasks.filter(task => task.id !== id);

    saveTasks();

    render();
}


/* PROGRESS */

function getProgress(task) {

    if (!task.subtasks.length) {
        return 0;
    }

    const completed =
        task.subtasks.filter(
            sub => sub.completed
        ).length;

    return Math.round(
        (completed / task.subtasks.length) * 100
    );
}


/* DEADLINE */

function daysUntil(date) {

    if (!date) return null;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const deadline = new Date(date);

    deadline.setHours(0, 0, 0, 0);

    return Math.ceil(
        (deadline - today) / 86400000
    );
}


function formatDate(date) {

    if (!date) return "No deadline";

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* TASK CARD */

function taskHTML(task) {

    const progress = getProgress(task);

    const days = daysUntil(task.deadline);

    let deadlineText =
        formatDate(task.deadline);

    let soonClass = "";

    if (days !== null) {

        if (days < 0) {
            deadlineText += " · Overdue";
            soonClass = "soon";
        }

        else if (days === 0) {
            deadlineText += " · Due today";
            soonClass = "soon";
        }

        else if (days <= 3) {
            deadlineText += ` · ${days} days left`;
            soonClass = "soon";
        }

    }


    const subtasks = task.subtasks.map(
        (sub, index) => `

        <div class="subtask ${sub.completed ? "done" : ""}">

            <input
                type="checkbox"
                ${sub.completed ? "checked" : ""}
                onchange="toggleSubtask(${task.id}, ${index})"
            >

            <span>${escapeHTML(sub.text)}</span>

        </div>

    `).join("");


    return `

    <div class="task-card ${task.category}">

        <div class="task-head">

            <div>

                <div class="task-title">
                    ${escapeHTML(task.name)}
                </div>

                <div class="deadline ${soonClass}">
                    📅 ${deadlineText}
                </div>

            </div>

            <span class="category">
                ${categoryNames[task.category]}
            </span>

        </div>


        <div class="progress">

            <div
                class="progress-bar"
                style="width:${progress}%"
            ></div>

        </div>

        <div class="progress-text">
            ${progress}% completed
        </div>


        <div class="subtasks">

            ${subtasks || `
                <div class="subtask">
                    ยังไม่มีงานย่อย
                </div>
            `}

        </div>


        <button
            class="delete-task"
            onclick="deleteTask(${task.id})"
        >
            🗑 Delete
        </button>

    </div>

    `;
}


/* RENDER */

function render() {

    const dashboard =
        document.getElementById("dashboardTasks");

    const allTasks =
        document.getElementById("allTasks");


    const sorted =
        [...tasks].sort((a, b) => {

            if (!a.deadline) return 1;
            if (!b.deadline) return -1;

            return new Date(a.deadline)
                - new Date(b.deadline);

        });


    dashboard.innerHTML =
        sorted
            .slice(0, 6)
            .map(taskHTML)
            .join("");


    allTasks.innerHTML =
        sorted
            .map(taskHTML)
            .join("");


    updateSummary();

}


/* SUMMARY */

function updateSummary() {

    const total = tasks.length;

    const completed =
        tasks.filter(
            task => getProgress(task) === 100
        ).length;

    const progress =
        total - completed;

    const dueSoon =
        tasks.filter(task => {

            const days =
                daysUntil(task.deadline);

            return days !== null &&
                days >= 0 &&
                days <= 3 &&
                getProgress(task) < 100;

        }).length;


    document.getElementById("totalTasks")
        .textContent = total;

    document.getElementById("progressTasks")
        .textContent = progress;

    document.getElementById("dueTasks")
        .textContent = dueSoon;

    document.getElementById("completedTasks")
        .textContent = completed;

}


/* SECURITY */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* TODAY */

document.getElementById("today")
    .textContent =
    new Date().toLocaleDateString(
        "en-GB",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );


render();
