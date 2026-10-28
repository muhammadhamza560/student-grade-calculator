
const subjectsContainer = document.getElementById("subjects");
const addButton = document.getElementById("addSubject");
const form = document.getElementById("gradeForm");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");

let subjectCount = 0;

function addSubject(name = "", mark = "") {
  subjectCount++;

  const row = document.createElement("div");
  row.className = "subject-row";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = `Subject ${subjectCount}`;
  nameInput.value = name;
  nameInput.setAttribute("aria-label", `Subject ${subjectCount} name`);

  const markInput = document.createElement("input");
  markInput.type = "number";
  markInput.min = "0";
  markInput.max = "100";
  markInput.step = "any";
  markInput.placeholder = "0–100";
  markInput.value = mark;
  markInput.setAttribute("aria-label", `Subject ${subjectCount} marks`);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-btn";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", "Remove subject");

  removeButton.addEventListener("click", () => {
    row.remove();
    clearResults();
    errorBox.textContent = "";
    updateRemoveButtons();
  });

  row.append(nameInput, markInput, removeButton);
  subjectsContainer.appendChild(row);

  updateRemoveButtons();
}

function updateRemoveButtons() {
  const rows = subjectsContainer.querySelectorAll(".subject-row");
  rows.forEach(row => {
    row.querySelector(".remove-btn").disabled = rows.length === 1;
  });
}

function clearResults() {
  results.hidden = true;
}

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function resetSubjects() {
  subjectsContainer.replaceChildren();
  subjectCount = 0;

  for (let i = 0; i < 5; i++) {
    addSubject();
  }

  errorBox.textContent = "";
  clearResults();
}

addButton.addEventListener("click", () => {
  addSubject();
  clearResults();
  errorBox.textContent = "";
});

form.addEventListener("submit", event => {
  event.preventDefault();
  errorBox.textContent = "";
  clearResults();

  const rows = [...subjectsContainer.querySelectorAll(".subject-row")];

  if (rows.length === 0) {
    errorBox.textContent = "Please add at least one subject.";
    return;
  }

  let total = 0;

  for (let i = 0; i < rows.length; i++) {
    const nameInput = rows[i].querySelector('input[type="text"]');
    const markInput = rows[i].querySelector('input[type="number"]');
    const name = nameInput.value.trim();
    const rawMark = markInput.value.trim();
    const mark = Number(rawMark);

    if (!name) {
      errorBox.textContent = `Please enter a name for Subject ${i + 1}.`;
      nameInput.focus();
      return;
    }

    if (
      rawMark === "" ||
      !Number.isFinite(mark) ||
      mark < 0 ||
      mark > 100
    ) {
      errorBox.textContent =
        `Enter a valid mark from 0 to 100 for ${name}.`;
      markInput.focus();
      return;
    }

    total += mark;
  }

  const maximum = rows.length * 100;
  const percentage = (total / maximum) * 100;
  const grade = getGrade(percentage);

  document.getElementById("total").textContent =
    `${Number(total.toFixed(2))} / ${maximum}`;

  document.getElementById("percentage").textContent =
    `${percentage.toFixed(2)}%`;

  document.getElementById("grade").textContent = grade;

  results.hidden = false;
});

form.addEventListener("reset", () => {
  // Run after the browser's native reset event.
  setTimeout(resetSubjects, 0);
});

resetSubjects();
