// variables general ---------------------------------------------------
let total_etd = document.getElementById("etudTotal");
let actif_etd = 0;
let inactif_etd = document.getElementById("etudInactif");

let students = JSON.parse(localStorage.getItem("students"));
if (!idcount) {
    localStorage.setItem("idcount", 0);
    }


// buttons --------------------------------------------------------------
let ajoute_etd = document.getElementById("ajoute_etd");
let annule_ajoute = document.getElementById("annule_etd");
let save_ajoute = document.getElementById("save_etd");
let suppreme_etd = document.getElementById("suppreme_etd")
let modifie_etd = document.getElementById("modifie_etd");
// input ----------------------------------------------------------------
let search = document.getElementById("search_home");

// other ----------------------------------------------------------------
let table = document.getElementById("table_etd");
let modal = document.getElementById("modal");

// fonctions ------------------------------------------------------------
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
    modal.classList.toggle("hidden");
    let nom_input = document.getElementById("new_nom");
    let email_input = document.getElementById("new_email");
    let groupe_input = document.getElementById("new_grp");

    let students = JSON.parse(localStorage.getItem("students"));

    students.push ({
        nom: nom_input.value,
        email: email_input.value,
        groupe: groupe_input.value,
        id: idcount++
    });
    displayStudents(students);
    localStorage.setItem("students" , JSON.stringify(students));
}

function displayStudents(tab){

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
    const row = btn.closest("tr");
    const cells = row.querySelectorAll("td");
    let students = JSON.parse(localStorage.getItem("students"));
    console.log(cells[0].textContent);
    students = students.filter(st => (st.id != cells[0].textContent)&&(st.nom != cells[1].textContent));
    localStorage.setItem("students" , JSON.stringify(students));
    row.remove();
}

function editrow(btn) {
    const row = btn.closest("tr");
    const cells = row.querySelectorAll("td");
    document.getElementById("modal_mssg").textContent = "modifie un etudiant: ";
    document.getElementById("new_nom").value= cells[0].textContent;
    document.getElementById("new_email").value = cells[1].textContent;
    document.getElementById("new_grp").value = cells[2].textContent;
    modal.classList.toggle("hidden");
    save_ajoute.onclick = function (){
           
    }
}

//still need to (storage the edit and id) and also part about (variables total) and (searche)
