// app.js - logic for ValimarCars web app

let records = JSON.parse(localStorage.getItem('records') || '[]');
let files = JSON.parse(localStorage.getItem('files') || '{}');

const form = document.getElementById('vehicle-form');
const recordsList = document.getElementById('records-list');
const searchInput = document.getElementById('search');

function saveToStorage() {
  localStorage.setItem('records', JSON.stringify(records));
  localStorage.setItem('files', JSON.stringify(files));
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const regNumber = document.getElementById('regNumber').value.trim().toUpperCase();
  const vin = document.getElementById('vin').value.trim().toUpperCase();
  const km = document.getElementById('km').value.trim();
  const mechanic = document.getElementById('mechanic').value.trim();
  const services = Array.from(document.getElementById('services').selectedOptions).map(o => o.text);
  const notes = document.getElementById('notes').value.trim();
  const fileInput = document.getElementById('formFile');

  if (!regNumber) {
    alert('Registration number is required');
    return;
  }
  if (!km) {
    alert('Kilometers are required');
    return;
  }

  // determine next index for this regNumber
  const existingForReg = records.filter(r => r.regNumber === regNumber);
  const index = existingForReg.length + 1;
  const date = new Date().toISOString().split('T')[0];
  let savedFileName = null;

  if (fileInput.files && fileInput.files[0]) {
    const f = fileInput.files[0];
    const cleaned = f.name.replace(/\s+/g, '_');
    savedFileName = `${date}-${regNumber}-${index}-${cleaned}`;
    const base64 = await readFileAsDataURL(f);
    files[savedFileName] = { name: savedFileName, dataUrl: base64, mime: f.type };
  }

  const record = {
    id: Date.now().toString() + Math.random().toString(36).slice(2,8),
    regNumber,
    vin,
    km,
    mechanic,
    services,
    notes,
    date,
    file: savedFileName
  };

  records.push(record);
  saveToStorage();
  displayRecords();
  form.reset();
});

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function displayRecords() {
  const filter = (searchInput.value || '').trim().toUpperCase();
  recordsList.innerHTML = '';

  const filtered = records
    .filter(r => {
      if (!filter) return true;
      return r.regNumber.includes(filter) || (r.vin || '').includes(filter);
    })
    .sort((a,b) => {
      if (a.date === b.date) return b.id.localeCompare(a.id);
      return new Date(b.date) - new Date(a.date);
    });

  filtered.forEach(r => {
    const div = document.createElement('div');
    div.className = 'record';

    let fileHtml = 'None';
    if (r.file && files[r.file]) {
      fileHtml = `<a href="${files[r.file].dataUrl}" download="${files[r.file].name}">Download ${files[r.file].name}</a>`;
    }

    div.innerHTML = `
      <strong>${r.regNumber}${r.vin ? ' (' + r.vin + ')' : ''}</strong>
      <div>${r.date} — ${r.km} km — Mechanic: ${r.mechanic || '-'}</div>
      <div>Services: ${r.services.join(', ') || '-'}</div>
      <div>Notes: ${r.notes || '-'}</div>
      <div>File: ${fileHtml}</div>
    `;
    recordsList.appendChild(div);
  });
}

searchInput.addEventListener('input', displayRecords);

// initial load
displayRecords();
