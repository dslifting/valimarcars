let repairHistory = JSON.parse(localStorage.getItem('repairHistory')) || [];

const form = document.getElementById('repairForm');
const historyTableBody = document.querySelector('#historyTable tbody');

function renderHistory() {
    historyTableBody.innerHTML = '';
    repairHistory.sort((a,b)=>new Date(a.date)-new Date(b.date));
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
        `;
        historyTableBody.appendChild(tr);
    });
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const date = document.getElementById('date').value;
    const km = document.getElementById('km').value;
    const brandModel = document.getElementById('brandModel').value;
    const regNumber = document.getElementById('regNumber').value;
    const vin = document.getElementById('vin').value;
    const mechanic = document.getElementById('mechanic').value;
    const notes = document.getElementById('notes').value;

    const services = Array.from(document.querySelectorAll('#servicesCheckboxes input[type=checkbox]:checked'))
                          .map(cb => cb.value);

    repairHistory.push({date, km, brandModel, regNumber, vin, mechanic, notes, services});
    localStorage.setItem('repairHistory', JSON.stringify(repairHistory));
    renderHistory();
    form.reset();
});

renderHistory();
