// ==== app.js ====
let cars = JSON.parse(localStorage.getItem('cars')) || [];

function generateFileName(regNumber) {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const existing = cars.filter(c => c.regNumber === regNumber).length + 1;
    return `${yyyy}-${mm}-${dd}-${regNumber}-${existing}`;
}

document.getElementById('carForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const carData = {
        brandModel: document.getElementById('brandModel').value,
        year: document.getElementById('year').value,
        regNumber: document.getElementById('regNumber').value.replace(/\s+/g, ''),
        km: document.getElementById('km').value,
        vin: document.getElementById('vin').value,
        engineCapacity: document.getElementById('engineCapacity').value,
        power: document.getElementById('power').value,
        fuel: document.getElementById('fuel').value,
        services: Array.from(document.querySelectorAll('input[name="service"]:checked')).map(el => el.value),
        otherNotes: document.getElementById('otherNotes').value,
        mechanic: document.getElementById('mechanic').value,
        scans: []
    };

    const scanFile = document.getElementById('scanFile').files[0];
    if(scanFile){
        const fileName = generateFileName(carData.regNumber);
        carData.scans.push({
            name: fileName,
            originalName: scanFile.name,
            type: scanFile.type
        });
        alert(`Файлът ще се запази като: ${fileName}`);
    }

    const existingIndex = cars.findIndex(c => c.vin === carData.vin || c.regNumber === carData.regNumber);
    if(existingIndex >= 0){
        cars[existingIndex].scans.push(...carData.scans);
        cars[existingIndex].services.push(...carData.services);
    } else {
        cars.push(carData);
    }

    localStorage.setItem('cars', JSON.stringify(cars));
    alert('Данните са записани успешно!');
    document.getElementById('carForm').reset();
});

function searchCar(){
    const query = document.getElementById('searchInput').value.replace(/\s+/g,'').toLowerCase();
    const result = cars.find(c => c.regNumber.toLowerCase() === query || c.vin.toLowerCase() === query);
    if(result){
        alert(`Намерено: ${result.brandModel} | KM: ${result.km} | Механик: ${result.mechanic}`);
    } else {
        alert('Автомобилът не е намерен.');
    }
}

function searchHistory(){
    const query = document.getElementById('searchHistoryInput').value.replace(/\s+/g,'').toLowerCase();
    const resultsDiv = document.getElementById('historyResults');
    resultsDiv.innerHTML = '';
    const result = cars.find(c => c.regNumber.toLowerCase() === query || c.vin.toLowerCase() === query);
    if(result){
        let html = `<h3>${result.brandModel} (${result.regNumber})</h3>`;
        html += `<p>Механик: ${result.mechanic} | Км: ${result.km}</p>`;
        html += `<ul>`;
        result.scans.forEach(s => {
            html += `<li>${s.name} (${s.originalName})</li>`;
        });
        html += `</ul>`;
        resultsDiv.innerHTML = html;
    } else {
        resultsDiv.innerHTML = '<p>Няма намерени резултати.</p>';
    }
}
