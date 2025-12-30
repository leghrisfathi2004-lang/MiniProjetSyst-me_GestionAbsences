const container = document.getElementById("attendance-container");

// const list = {
//   "2025-12-29": {
//     1: { status: "absent", arrivalTime: "", reason: "" },
//     2: { status: "present", arrivalTime: "", reason: "" },
//     3: { status: "absent", arrivalTime: "", reason: "" },
//     4: { status: "retard", arrivalTime: "09:05", reason: "Traffic" },
//   },
//   "2025-12-30": {
//     1: { status: "present", arrivalTime: "", reason: "" },
//     2: { status: "retard", arrivalTime: "09:10", reason: "Bus" },
//     3: { status: "absent", arrivalTime: "", reason: "" },
//   },
//   "2025-12-31": {
//     1: { status: "absent", arrivalTime: "", reason: "Sick" },
//     2: { status: "present", arrivalTime: "", reason: "" },
//     3: { status: "present", arrivalTime: "", reason: "" },
//   },
//   "2025-01-01": {
//     1: { status: "present", arrivalTime: "", reason: "" },
//     2: { status: null, arrivalTime: "", reason: "" },
//     3: { status: "retard", arrivalTime: "09:05", reason: "Traffic" },
//   },
// };
const list=JSON.parse(localStorage.getItem("attendanceData"))
const students=JSON.parse(localStorage.getItem("students"))
const summary = [];
const schoolTime = "09:00";
for (const date in list) {
  let absent = 0;
  let retard = 0;
  let present = 0;

  for (const studentId in list[date]) {
    const student = list[date][studentId];
    if (student.status === "absent") absent++;
    if (student.status === "retard") retard++;
    if (student.status === "present") present++;
  }
  const dateObj = new Date(date);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatedDate = dateObj.toLocaleDateString("fr-FR", options);
  summary.push({
    formatedDate,
    date: date,
    absent: absent,
    retard: retard,
    present: present,
  });
}

console.log(summary);
let detailedStudents = [];

const selectedDates = "2025-12-29";
function DetailsDate(selectedDate) {
  const detailedStudents = [];
  for (const studentId in list[selectedDate]) {
    const attendance = list[selectedDate][studentId];
    const studentInfo = students.find((s) => s.id == studentId);
    console.log(attendance);
    if (studentInfo) {
      detailedStudents.push({
        ...studentInfo,
        status:
          attendance.status === "absent" || attendance.status === "present"
            ? attendance.status
            : `${
                timeToMinutes(attendance.arrivalTime) -
                timeToMinutes(schoolTime)
              } min retard`,
      });
    }
  }
  const modal = document.getElementById("myModal");
  const details = document.getElementById("details");
  const studentCards = document.getElementById("studentCards");
  const dateObj = new Date(selectedDate);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatedDate = dateObj.toLocaleDateString("fr-FR", options);
  details.textContent = formatedDate;
  details.style.color = "white";
  studentCards.innerHTML = "";

  detailedStudents.forEach((student) => {
    const card = document.createElement("div");

    card.className =
      "flex justify-between items-center bg-gradient-to-r from-[#0b132b] to-[#1c2541] rounded-xl p-6";

    card.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="bg-orange-400 w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold">
          ${student.nom[0]}${student.nom.split(" ")[1]?.[0] || ""}
        </div>

        <div>
          <h2 class="text-white text-xl font-semibold">
            ${student.nom}
          </h2>
          <p class="text-gray-400">
            Groupe ${student.groupe} . ID: #${student.id}
          </p>
        </div>
      </div>

      <button class="border  ${
        student.status === "absent"
          ? "text-red-500 border-red-500"
          : student.status === "present"
          ? "text-green-500 border-green-500"
          : "text-yellow-500 border-yellow-500"
      } px-6 py-2 rounded-full">
        ${student.status}f
      </button>
    `;

    studentCards.appendChild(card);
  });

  modal.classList.remove("hidden");
}
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}
function renderStudents(list) {
  container.innerHTML = "";
  list.forEach((element) => {
    container.innerHTML += `
        <div class="student-card bg-gray-900 px-10 py-3 mt-4   rounded-[10px]"
        data-student-id="1">
        
        <div class="flex justify-between items-center">
        <div class="flex gap-[20px]">
        <i class="fa-solid text-white self-start fa-calendar text-[3rem]"></i>
        <div class="flex flex-col">
        <h1 class="text-[25px] text-white mb-1">
        ${element.formatedDate}
        </h1>
        <div class="flex gap-5  text-xl">
        <p class="text-gray-500">
        absent : ${element.absent}
                 </p>
                 <p class="text-gray-500">
                    retard : ${element.retard}
                 </p>
                 <p class="text-gray-500">
                    present : ${element.present}
                 </p>
                 </div>
                    <button onclick="(DetailsDate('${element.date}'))"  id="btnDetails" class=" self-start bg-red-400 p-2 rounded-[10px] mt-2">view Details</button>
                    </div>
                        </div>
                            </div>
                 <div class="retard-form hidden bg-gray-800 px-10 py-5 mt-4">
                    <h1 class="text-yellow-600 mb-4 text-[22px]">
                        Information du Retard
                    </h1>
                 <div class="flex gap-[8rem]">
                    <div>
                        <h1 class="text-white mb-2">HEURE D'ARRIVÉE</h1>
                        <input type="time" class="bg-white w-[15rem] px-5 py-1">
                 </div>
                 <div>
                 <h1 class="text-white mb-2">Motif du Retard</h1>
                 <input type="text"
                 class="bg-white w-[15rem] px-5 py-1">
                 </div>
                 </div>
                 </div>
                 </div>
<div id="myModal" class="fixed inset-0  bg-black/40 backdrop-blur-sm  z-40 flex items-center  justify-center hidden">
  <div id="main" class="bg-[#1c20476b] p-6 rounded-lg w-[40rem] ">
  <div class="flex justify-end">
  <button id="closeModal" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">X</button>
  </div>
    <h2 id="details" class="text-xl font-bold mb-4">Details</h2>
    <p id="name"></p>
  <h3 id="absent-count" class="text-red-500 text-xl mb-4"></h3>
  <div id="studentCards" class="flex flex-col gap-4"></div>
  </div>
</div>
<button id="openModal" class="px-4 py-2 bg-blue-500 text-white rounded mt-4 hidden">Open Modal</button>

                 `;
  });
}
renderStudents(summary);

const btn = document.querySelector("#btnDetails");
console.log(btn);

console.log(detailedStudents);
const modal = document.getElementById("myModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
