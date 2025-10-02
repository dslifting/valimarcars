let repairHistory = JSON.parse(localStorage.getItem('repairHistory') || '[]');

function showSection(sectionId) {
    const sections = ['home', 'newRepair', 'history', 'reports'];
    sections.forEach(id => {
        document.getElementById(id).style.display = (id === sectionId) ? 'block' : 'none';
    });
    if(sectionId === 'history') renderHistory();
    if(sectionId === 'reports') renderReports();
}

const form = document.getElementById('repairForm');
form.addEventListener('submit', e => {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const km = document.getElementById('km').value;
    const brandModel = document.getElementById('brandModel').value;
    const regNumber = document.getElementById('regNumber').value;
    const vin = document.getElementById('vin').value;
    const mechanic = document.getElementById('mechanic').value;
    const notes = document.getElementById('notes').value;
    const services = Array.from(document.querySelectorAll('.service-checkbox:checked')).map(s => s.value);

    const fileInput = document.getElementById('scanFile');
    let fileName = '';
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const datePart = date.replace(/-/g,'');
        const regPart = regNumber.replace(/\s/g,'');
        const existingFiles = repairHistory.filter(r => r.regNumber === regNumber).length + 1;
        fileName = `${datePart}-${regPart}-${existingFiles}-${file.name}`;

        const blob = new Blob([file], {type:file.type});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.textContent = `Свали ${fileName}`;
        document.body.appendChild(link);
    }

    repairHistory.push({date, km, brandModel, regNumber, vin, mechanic, notes, services, scanFileName: fileName});
    localStorage.setItem('repairHistory', JSON.stringify(repairHistory));

    alert('Ремонтът е записан!');
    form.reset();
    showSection('newRepair');
});

function renderHistory() {
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    repairHistory.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.date}</td>
            <td>${r.regNumber}</td>
            <td>${r.vin}</td>
            <td>${r.km}</td>
            <td>${r.brandModel}</td>
            <td>${r.mechanic}</td>
            <td>${r.services.join(', ')}</td>
            <td>${r.notes}</td>
            <td>${r.scanFileName ? `<a href="#" onclick="downloadFile('${r.scanFileName}')">Свали</a>` : ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderReports() {
    const tbody = document.querySelector('#reportsTable tbody');
    tbody.innerHTML = '';
    repairHistory.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.date}</td>
            <td>${r.regNumber}</td>
            <td>${r.vin}</td>
            <td>${r.km}</td>
            <td>${r.brandModel}</td>
            <td>${r.mechanic}</td>
            <td>${r.services.join(', ')}</td>
            <td>${r.notes}</td>
            <td>${r.scanFileName ? `<a href="#" onclick="downloadFile('${r.scanFileName}')">Свали</a>` : ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Функция за сваляне на сканиран файл
function downloadFile(fileName) {
    alert('Файлът ' + fileName + ' е наличен за сваляне (тъй като е client-side, може да се изтегли само локално).');
}

// **Експорт в CSV**
function exportCSV() {
    if (repairHistory.length === 0) {
        alert("Няма записи за експортиране.");
        return;
    }
    const headers = ["Дата","Рег. номер","VIN","Км","Марка/Модел","Механик","Услуги","Бележки","Формуляр"];
    const csvRows = [
        headers.join(","),
        ...repairHistory.map(r => [
            r.date,
            r.regNumber,
            r.vin,
            r.km,
            `"${r.brandModel}"`,
            `"${r.mechanic}"`,
            `"${r.services.join('; ')}"`,
            `"${r.notes}"`,
            r.scanFileName
        ].join(","))
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], {type: 'text/csv'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ValimarCars_Repairs.csv';
    link.click();
}

// Добавяме бутон за CSV в менюто
const reportsSection = document.getElementById('reports');
const exportBtn = document.createElement('button');
exportBtn.textContent = "Експорт в Excel/CSV";
exportBtn.style.marginTop = "10px";
exportBtn.onclick = exportCSV;
reportsSection.insertBefore(exportBtn, reportsSection.firstChild);

// Показваме "Нов ремонт" по подразбиране
showSection('newRepair');
