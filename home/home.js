// const attendanceData = [
//   { id: 1, nom: "Mohamed Amine", groupe: "Groupee 4", status: "absent" },
//   { id: 1, nom: "Mohamed Amine", groupe: "Groupee 4", status: "retard" },
//   { id: 2, nom: "Sara El Amrani", groupe: "Groupee 5", status: "present" },
//   { id: 2, nom: "Sara El Amrani", groupe: "Groupee 5", status: "absent" },
//   { id: 3, nom: "Youssef Benjelloun", groupe: "Groupee 6", status: "retard" }
// ];
  
const studentsList = JSON.parse(localStorage.getItem("students")) || [];
const attendanceByDate = JSON.parse(localStorage.getItem("attendanceData")) || {};

const selectedDate = "2025-12-30";
const dailyAttendance = attendanceByDate[selectedDate] || {};

const attendanceData = Object.keys(dailyAttendance).map((id) => {
  const student = studentsList.find(s => s.id == id);

  return {
    id: Number(id),
    nom: student?.nom,
    groupe: student?.groupe,
    status: dailyAttendance[id].status,
  };
});
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
    let id = attendanceData[i].id;

    if (!students[id]) {
      students[id] = {
        nom: attendanceData[i].nom,
        groupe: attendanceData[i].groupe,
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
        <td class="p-4 text-white">${studentsArray[i].nom}</td>
        <td class="p-4 text-red-500">${studentsArray[i].absences}</td>
      </tr>
    `;
  }
}

// Top retard
function afficherRetards() {
  let students = {};

  for (let i = 0; i < attendanceData.length; i++) {
    let id = attendanceData[i].id;

    if (!students[id]) {
      students[id] = {
        nom: attendanceData[i].nom,
        groupe: attendanceData[i].groupe,
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
        <td class="p-4 text-white">${studentsArray[i].nom}</td>
        <td class="p-4 text-yellow-400">${studentsArray[i].retards}</td>
      </tr>
    `;
  }
}
calculerTaux();
afficherAbsents();
afficherRetards();
