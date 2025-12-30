let students = JSON.parse(localStorage.getItem("students"));

const dateinput = document.getElementById("dateinput");
function dateofNow() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);
  dateinput.value = formattedDate;
  return formattedDate;
}
dateofNow();
const today = dateofNow();
console.log(dateofNow);
const attendanceState = {};
if (!attendanceState[today]) {
  attendanceState[today] = {};
}
loadFromLocalStorage();
students.forEach((student) => {
  attendanceState[today][student.id] = {
    nom: attendanceState[today][student.id]?.nom || null,
    status: attendanceState[today][student.id]?.status || null,
    arrivalTime: attendanceState[today][student.id]?.arrivalTime || "",
    reason: attendanceState[today][student.id]?.reason || "",
  };
});

const container = document.getElementById("attendance-container");

function renderStudents(list = students) {
  container.innerHTML = "";

  list.forEach((student) => {
    container.innerHTML += `
        <div class="student-card bg-gray-900 px-10 py-3 mt-4"
             data-student-id="${student.id}">

          <div class="flex justify-between items-center">
            <div class="flex gap-[20px]">
              <div class="bg-violet-700 rounded-[10px] p-3 w-[5rem]">
                <h1 class="text-white text-[25px] text-center">
                  ${student.nom[0].toUpperCase()}
                </h1>
              </div>
              <div>
                <h1 class="text-[25px] text-white mb-1">
                  ${student.nom} 
                </h1>
                <p class="text-gray-500">
                  ${student.groupe} 
                </p>
              </div>
            </div>
            <div class="flex gap-2 bg-gray-500 p-3">
              <button data-status="present"
                class="status-btn bg-gray-600 text-white px-4 py-2 rounded-lg">
                Présent
              </button>
              <button data-status="absent"
                class="status-btn bg-gray-600 text-white px-4 py-2 rounded-lg">
                Absent
              </button>
              <button data-status="retard"
                class="status-btn bg-gray-600 text-white px-4 py-2 rounded-lg">
                Retard
              </button>
            </div>
          </div>

          <div class="retard-form hidden bg-gray-800 px-10 py-5 mt-4">
            <h1 class="text-yellow-600 mb-4 text-[22px]">
              Information du Retard
            </h1>
            <div class="flex gap-[8rem]">
              <div>
                <h1 class="text-white mb-2">HEURE D'ARRIVÉE</h1>
                <input type="time"
                  class="bg-white w-[15rem] px-5 py-1">
              </div>
              <div>
                <h1 class="text-white mb-2">Motif du Retard</h1>
                <input type="text"
                  class="bg-white w-[15rem] px-5 py-1">
              </div>
            </div>
          </div>
        </div>
      `;
  });
}
function setupStatusButtons() {
  const studentCards = document.querySelectorAll(".student-card");

  studentCards.forEach((card) => {
    const buttons = card.querySelectorAll(".status-btn");
    const timeInput = card.querySelector('input[type="time"]');
    const reasonInput = card.querySelector('input[type="text"]');
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        handleStatusClick(card, button.dataset.status);
      });
    });

    timeInput.addEventListener("input", (e) => {
      attendanceState[today][card.dataset.studentId].arrivalTime =
        e.target.value;
      saveToLocalStorage();
    });

    reasonInput.addEventListener("input", (e) => {
      attendanceState[today][card.dataset.studentId].reason = e.target.value;
      saveToLocalStorage();
    });
  });
}
// function saveToLocalStorage() {
//   const data = {
//     date: document.getElementById("dateinput").value,
//     attendance: attendanceState,
//   };

//   localStorage.setItem("attendanceData", JSON.stringify(data));
// }

function saveToLocalStorage() {
  const today = document.getElementById("dateinput").value;

  const saved = localStorage.getItem("attendanceData");
  const attendanceData = saved ? JSON.parse(saved) : {};

  attendanceData[today] = attendanceState[today];

  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
}
saveToLocalStorage();

function handleStatusClick(card, status) {
  const studentId = card.dataset.studentId;

  const buttons = card.querySelectorAll(".status-btn");
  const retardForm = card.querySelector(".retard-form");
  buttons.forEach((btn) => {
    btn.classList.remove("bg-green-600", "bg-red-600", "bg-amber-600");
    btn.classList.add("bg-gray-600");
  });

  const activeButton = card.querySelector(
    `.status-btn[data-status="${status}"]`
  );

  if (status === "present") activeButton.classList.add("bg-green-600");

  if (status === "absent") activeButton.classList.add("bg-red-600");

  if (status === "retard") {
    activeButton.classList.remove("bg-gray-600");
    activeButton.classList.add("bg-amber-600");
  }
  if (status === "retard") {
    retardForm.classList.remove("hidden");
  } else {
    retardForm.classList.add("hidden");
    attendanceState[today][studentId].arrivalTime = "";
    attendanceState[today][studentId].reason = "";
  }
  attendanceState[today][studentId].status = status;
  saveToLocalStorage();
}
function loadFromLocalStorage() {
  const saved = localStorage.getItem("attendanceData");
  if (!saved) return;

  const parsed = JSON.parse(saved);

  if (parsed.date) {
    document.getElementById("dateinput").value = parsed.date;
  }

  Object.keys(parsed[today]).forEach((studentId) => {
    attendanceState[today][studentId] = parsed[today][studentId];
  });
}
function restoreUIFromState() {
  document.querySelectorAll(".student-card").forEach((card) => {
    const studentId = card.dataset.studentId;
    console.log(attendanceState);

    const state = attendanceState[today][studentId];
    console.log(state);
    if (!state.status) return;

    handleStatusClick(card, state.status);

    if (state.status === "retard") {
      const timeInput = card.querySelector('input[type="time"]');
      const reasonInput = card.querySelector('input[type="text"]');

      timeInput.value = state.arrivalTime;
      reasonInput.value = state.reason;
    }
  });
}
const inputSearch = document.querySelector("input[type='text']");
inputSearch.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm)
  );
  renderStudents(filteredStudents);
  setupStatusButtons();
  restoreUIFromState();
});

renderStudents();
setupStatusButtons();
restoreUIFromState();
