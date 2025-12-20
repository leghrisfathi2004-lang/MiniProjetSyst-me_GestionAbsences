// variables general ----------------------------------------------------------------
let total_etd = document.getElementById("etudTotal");
let actif_etd = document.getElementById("etudActif");
let inactif_etd = document.getElementById("etudInactif");

let students = JSON.parse(localStorage.getItem("students"));
let idcount = Number(localStorage.getItem('idcount'));
// buttons ----------------------------------------------------------------
let ajoute_etd = document.getElementById("ajoute_etd");
let annule_ajoute = document.getElementById("annule_etd");
let save_ajoute = document.getElementById("save_etd");
let suppreme_etd = document.getElementById("suppreme_etd")
let modifie_etd = document.getElementById("modifie_etd");
let btn = document.getElementById("search_btn");

// input ----------------------------------------------------------------
let search = document.getElementById("search");

// other ----------------------------------------------------------------
let table = document.getElementById("table_etd");
let modal = document.getElementById("modal");

// fonctions ----------------------------------------------------------------
document.addEventListener( "DOMContentLoaded", () =>
    displayStudents(students)
);

btn.onclick = () => {
    let mot = search.value.trim();
    if(mot == ""){
        alert("nothing to search for");
        displayStudents(students);
        return;
    }
    let result = students.filter(st => ((st.id === Number(mot))||(st.nom === mot)||(st.email === mot)||(st.groupe === mot)));
    if(result)  displayStudents(result);
    else alert("cette etudiant n exist pas!")
};

ajoute_etd.onclick = () => {
    modal.classList.toggle("hidden");
    document.getElementById("modal_mssg").textContent = "ajoute un etudiant: ";
    document.getElementById("new_id").textContent = `etudiant id: ${idcount+1}`
    document.getElementById("new_nom").value= "";
    document.getElementById("new_email").value = "";
    document.getElementById("new_grp").value = "";
};

annule_ajoute.onclick = () => {
    modal.classList.toggle("hidden")
};

save_ajoute.onclick = () => {
    idcount++;
    localStorage.setItem('idcount', idcount);
    idcount = Number(localStorage.getItem('idcount'));
    modal.classList.toggle("hidden");
    let nom_input = document.getElementById("new_nom");
    let email_input = document.getElementById("new_email");
    let groupe_input = document.getElementById("new_grp");
    students.push ({
        id: idcount,
        nom: nom_input.value,
        email: email_input.value,
        groupe: groupe_input.value
    });

    displayStudents(students);
    localStorage.setItem("students" , JSON.stringify(students));
    students = JSON.parse(localStorage.getItem("students"));
}

function displayStudents(tab){

    actif_etd.textContent = tab.length;
    let i = Number( localStorage.getItem('inactifEtd'));
    inactif_etd.textContent = i;
    total_etd.textContent = tab.length+i;
    table.innerHTML = "";
    tab.forEach(student => {
        const tr = document.createElement("tr");
        tr.className = "text-center";
        tr.innerHTML = `
            <td id="etud_nom">${student.id}</td>
            <td id="etud_nom">${student.nom}</td>
            <td id="etud_email">${student.email}</td>
            <td id="etud_group">${student.groupe}</td>
            <td class="text-xl">
                <button onclick="deleterow(this)" id="suppreme_etd">
                    <i class="pr-10 fa-solid fa-trash-can hover:drop-shadow-[0_4px_8px_rgba(255,255,250,0.8)]"></i>
                </button>
                <button onclick="editrow(this)" id="modifie_etd">
                    <i class="fa-solid fa-pen-to-square hover:drop-shadow-[0_4px_8px_rgba(255,255,250,0.8)]"></i>
                </button>
            </td>`;
        table.appendChild(tr);
    });
}

function deleterow(btn) {
    if (!localStorage.getItem('inactifEtd')){
        localStorage.setItem('inactifEtd', '0');
    }
    let inactif = Number(localStorage.getItem('inactifEtd'));
    inactif++;
    localStorage.setItem('inactifEtd', inactif);
    const row = btn.closest("tr");
    const cells = row.querySelectorAll("td");
    console.log(cells[0].textContent);
    students = students.filter(st => (st.id != cells[0].textContent));
    displayStudents(students);
    localStorage.setItem("students" , JSON.stringify(students));
    students = JSON.parse(localStorage.getItem("students"));
}

function editrow(btn) {
    const row = btn.closest("tr");
    const cells = row.querySelectorAll("td");
    document.getElementById("modal_mssg").textContent = "modifie un etudiant: ";
    let id = Number(cells[0].textContent);
    document.getElementById("new_id").textContent = `etudiant id: ${id}`
    document.getElementById("new_nom").value= cells[1].textContent;
    document.getElementById("new_email").value = cells[2].textContent;
    document.getElementById("new_grp").value = cells[3].textContent;
    modal.classList.toggle("hidden");
    
    save_ajoute.onclick = () => {
        let i = students.findIndex(st => st.id == id)
        students[i].nom = document.getElementById("new_nom").value;
        students[i].email = document.getElementById("new_email").value;
        students[i].groupe = document.getElementById("new_grp").value;
        modal.classList.toggle("hidden");
        displayStudents(students);
        localStorage.setItem("students" , JSON.stringify(students));
        students = JSON.parse(localStorage.getItem("students"));
    }
}