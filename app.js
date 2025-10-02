let repairHistory = JSON.parse(localStorage.getItem('repairHistory')) || [];

// Навигация
function showTab(tabName){
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

// Запазване на ремонт
function saveRepair(){
    const date = document.getElementById('date').value;
    const regNumber = document.getElementById('regNumber').value;
    const vin = document.getElementById('vin').value;
    const km = document.getElementById('km').value;
    const brandModel = document.getElementById('brandModel').value;
    const mechanic = document.getElementById('mechanic').value;
    const services = Array.from(document.getElementById('services').selectedOptions).map(o=>o.value);
    const notes = document.getElementById('notes').value;

    // Сканирани файлове
    const files = Array.from(document.getElementById('scanFiles').files).map(f => f.name);

    repairHistory.push({date, regNumber, vin, km, brandModel, mechanic, services, notes, files});
    localStorage.setItem('repairHistory', JSON.stringify(repairHistory));

    alert('Ремонтът е запазен!');
    loadHistoryTable();
    document.getElementById('repairForm').reset();
}

// Зареждане на таблица
function loadHistoryTable(){
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    repairHistory.forEach(r=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.date}</td>
            <td>${r.regNumber}</td>
            <td>${r.vin}</td>
            <td>${r.km}</td>
            <td>${r.brandModel}</td>
            <td>${r.mechanic}</td>
            <td>${r.services.join(', ')}</td>
            <td>${r.files.join(', ')}</td>
        `;
        tbody.appendChild(tr);
    });
}
loadHistoryTable();

// Excel експорт
function exportToExcel(){
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(repairHistory);
    XLSX.utils.book_append_sheet(wb, ws, "History");
    XLSX.writeFile(wb, "ValimarCars_History.xlsx");
}

// Сканиране на няколко формуляра
async function recognizeMultiple(){
    const files = document.getElementById('scanFiles').files;
    if(files.length === 0) { alert("Изберете поне един файл"); return; }

    for(let i=0;i<files.length;i++){
        const file = files[i];
        const reader = new FileReader();
        reader.onload = async function() {
            const imgData = reader.result;
            const { data: { text } } = await Tesseract.recognize(imgData, 'bul', { logger: m => console.log(m) });

            // Прости regex за извличане
            const regMatch = text.match(/рег[\.| |:]*(\S+)/i);
            const vinMatch = text.match(/vin[\.| |:]*(\S+)/i);
            const kmMatch = text.match(/км[\.| |:]*(\d+)/i);
            const brandModelMatch = text.match(/Марка, модел[\.| ]*(.+)/i);

            if(regMatch) document.getElementById('regNumber').value = regMatch[1];
            if(vinMatch) document.getElementById('vin').value = vinMatch[1];
            if(kmMatch) document.getElementById('km').value = kmMatch[1];
            if(brandModelMatch) document.getElementById('brandModel').value =
