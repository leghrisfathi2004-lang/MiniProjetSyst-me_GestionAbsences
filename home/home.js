const attendanceData = [
  { studentId: 1, name: "Mohamed Amine", group: "Groupe 4", status: "absent" },
  { studentId: 1, name: "Mohamed Amine", group: "Groupe 4", status: "retard" },
  { studentId: 2, name: "Sara El Amrani", group: "Groupe 5", status: "present" },
  { studentId: 2, name: "Sara El Amrani", group: "Groupe 5", status: "absent" },
  { studentId: 3, name: "Youssef Benjelloun", group: "Groupe 6", status: "retard" }
];

const taux_absence = document.getElementById("taux_absence");
const taux_retard = document.getElementById("taux_retard");
const taux_presence = document.getElementById("taux_presence");

const tbodyAbs = document.getElementById("display-abs");
const tbodyRet = document.getElementById("display-ret");

// taux
function calculerTaux() {
  let absent = 0;
  let retard = 0;
  let present = 0;

  for (let i = 0; i < attendanceData.length; i++) {
    if (attendanceData[i].status === "absent") {
      absent++;
    } else if (attendanceData[i].status === "retard") {
      retard++;
    } else {
      present++;
    }
  }

  let total = attendanceData.length;

  taux_absence.innerText = Math.round((absent / total) * 100) + "%";
  taux_retard.innerText = Math.round((retard / total) * 100) + "%";
  taux_presence.innerText = Math.round((present / total) * 100) + "%";
}

// Top absences
function afficherAbsents() {
  let students = {};

  for (let i = 0; i < attendanceData.length; i++) {
    let id = attendanceData[i].studentId;

    if (!students[id]) {
      students[id] = {
        name: attendanceData[i].name,
        group: attendanceData[i].group,
        absences: 0,
        retards: 0
      };
    }

    if (attendanceData[i].status === "absent") {
      students[id].absences++;
    }

    if (attendanceData[i].status === "retard") {
      students[id].retards++;
    }
  }

  let studentsArray = Object.values(students);

  studentsArray.sort(function(a, b) {
    return b.absences - a.absences;
  });

  for (let i = 0; i < 3; i++) {
    if (!studentsArray[i]) continue;

    tbodyAbs.innerHTML += `
      <tr>
        <td class="p-4 text-white">${i + 1}</td>
        <td class="p-4 text-white">${studentsArray[i].name}</td>
        <td class="p-4 text-red-500">${studentsArray[i].absences}</td>
      </tr>
    `;
  }
}

// Top retard
function afficherRetards() {
  let students = {};

  for (let i = 0; i < attendanceData.length; i++) {
    let id = attendanceData[i].studentId;

    if (!students[id]) {
      students[id] = {
        name: attendanceData[i].name,
        group: attendanceData[i].group,
        absences: 0,
        retards: 0
      };
    }

    if (attendanceData[i].status === "retard") {
      students[id].retards++;
    }
  }

  let studentsArray = Object.values(students);

  studentsArray.sort(function(a, b) {
    return b.retards - a.retards;
  });

  for (let i = 0; i < 3; i++) {
    if (!studentsArray[i]) continue;

    tbodyRet.innerHTML += `
      <tr>
        <td class="p-4 text-white">${i + 1}</td>
        <td class="p-4 text-white">${studentsArray[i].name}</td>
        <td class="p-4 text-yellow-400">${studentsArray[i].retards}</td>
      </tr>
    `;
  }
}
calculerTaux();
afficherAbsents();
afficherRetards();
