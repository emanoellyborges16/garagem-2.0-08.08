// DOM Elements
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');
const doorStatus = document.getElementById('door-status');
const garageDoor = document.querySelector('.garage-door');
const simulateCarBtn = document.getElementById('simulate-car');
const carStatus = document.getElementById('car-status');
const sensorIndicator = document.getElementById('sensor-indicator');
const carImage = document.getElementById('car-image');
const car = document.getElementById('car');
const toggleAlarmBtn = document.getElementById('toggle-alarm');
const alarmStatus = document.getElementById('alarm-status');
const alarmStatusText = alarmStatus.nextElementSibling.querySelector('span');
const motionStatus = document.getElementById('motion-status');
const motionStatusText = motionStatus.nextElementSibling.querySelector('span');
const emergencyBtn = document.getElementById('emergency-btn');
const tempSlider = document.getElementById('temp-slider');
const temperatureDisplay = document.getElementById('temperature');
const humidityDisplay = document.getElementById('humidity');
const tempUpBtn = document.getElementById('temp-up');
const tempDownBtn = document.getElementById('temp-down');
const climateAutoBtn = document.getElementById('climate-auto');
const lightMain = document.getElementById('light-main');
const lightWork = document.getElementById('light-work');
const lightAmbient = document.getElementById('light-ambient');
const lightAllOnBtn = document.getElementById('light-all-on');
const lightAllOffBtn = document.getElementById('light-all-off');
const activityLog = document.getElementById('activity-log');

// State management
let doorOpen = false;
let cars = [];
let alarmActive = false;
let emergencyMode = false;
let temperature = 24;
let humidity = 45;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
});

function initializeSystem() {
    logActivity('Sistema iniciado', 'Sucesso');
    updateTemperatureDisplay();
    updateHumidityDisplay();
}

// Door control functions
openBtn.addEventListener('click', function() {
    openDoor();
});

closeBtn.addEventListener('click', function() {
    closeDoor();
});

function openDoor() {
    console.log('openDoor called');
    garageDoor.classList.add('door-open');
    doorStatus.textContent = 'Aberto';
    doorStatus.className = 'px-3 py-1 rounded-full bg-green-100 text-green-800';
    openBtn.disabled = true;
    closeBtn.disabled = false;
    doorOpen = true;
    logActivity('Portão aberto', 'Sucesso');
}

function closeDoor() {
    console.log('closeDoor called');
    garageDoor.classList.remove('door-open');
    doorStatus.textContent = 'Fechado';
    doorStatus.className = 'px-3 py-1 rounded-full bg-red-100 text-red-800';
    openBtn.disabled = false;
    closeBtn.disabled = true;
    doorOpen = false;
    logActivity('Portão fechado', 'Sucesso');
}

// Car simulation functions
simulateCarBtn.addEventListener('click', function() {
    addCar();
});

function addCar() {
    const newCar = {
        id: Date.now(),
        name: `Carro ${cars.length + 1}`
    };
    cars.push(newCar);
    updateCarList();
    logActivity(`${newCar.name} chegou`, 'Sucesso');
}

function removeCar(id) {
    cars = cars.filter(car => car.id !== id);
    updateCarList();
    logActivity(`Carro removido`, 'Sucesso');
}

function updateCarList() {
    const carList = document.getElementById('car-list');
    const carStatus = document.getElementById('car-status');
    const sensorIndicator = document.getElementById('sensor-indicator');
    const carCountSpan = document.getElementById('car-count');

    carList.innerHTML = '';

    if (cars.length > 0) {
        carStatus.textContent = `${cars.length} veículo${cars.length > 1 ? 's' : ''} detectado${cars.length > 1 ? 's' : ''}`;
        sensorIndicator.className = 'w-4 h-4 rounded-full bg-green-500 mr-2';
        carCountSpan.textContent = `Total: ${cars.length}`;

        cars.forEach(car => {
            const carDiv = document.createElement('div');
            carDiv.className = 'bg-gray-200 p-2 rounded flex flex-col space-y-2';
            carDiv.innerHTML = `
                <div class="flex items-center justify-between">
                    <span>${car.name}</span>
                    <button class="text-red-600 hover:text-red-800" data-id="${car.id}">Remover</button>
                </div>
                <div>
                    <label class="block font-semibold mb-1">Revisões:</label>
                    <div>
                        <label><input type="checkbox" data-car-id="${car.id}" data-revision="Troca de óleo" ${car.revisions?.includes('Troca de óleo') ? 'checked' : ''}> Troca de óleo</label><br>
                        <label><input type="checkbox" data-car-id="${car.id}" data-revision="Verificação de pneus" ${car.revisions?.includes('Verificação de pneus') ? 'checked' : ''}> Verificação de pneus</label><br>
                        <label><input type="checkbox" data-car-id="${car.id}" data-revision="Inspeção de freios" ${car.revisions?.includes('Inspeção de freios') ? 'checked' : ''}> Inspeção de freios</label><br>
                        <label><input type="checkbox" data-car-id="${car.id}" data-revision="Revisão geral" ${car.revisions?.includes('Revisão geral') ? 'checked' : ''}> Revisão geral</label>
                    </div>
                </div>
            `;
            carList.appendChild(carDiv);
        });

        // Hide the single car image since we have multiple cars now
        const carImage = document.getElementById('car-image');
        const car = document.getElementById('car');
        carImage.style.display = 'none';
        car.style.display = 'none';

        // Add event listeners to remove buttons
        carList.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.target.getAttribute('data-id'));
                removeCar(id);
            });
        });

        // Add event listeners to revision checkboxes
        carList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const carId = Number(e.target.getAttribute('data-car-id'));
                const revision = e.target.getAttribute('data-revision');
                const checked = e.target.checked;
                updateCarRevision(carId, revision, checked);
            });
        });
    } else {
        carStatus.textContent = 'Garagem vazia';
        sensorIndicator.className = 'w-4 h-4 rounded-full bg-red-500 mr-2';
        carCountSpan.textContent = '';

        // Show the single car image when no cars in list
        const carImage = document.getElementById('car-image');
        const car = document.getElementById('car');
        carImage.style.display = '';
        car.style.display = '';

        carList.innerHTML = '';
    }
}

function updateCarRevision(carId, revision, checked) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    if (!car.revisions) {
        car.revisions = [];
    }

    if (checked) {
        if (!car.revisions.includes(revision)) {
            car.revisions.push(revision);
            logActivity(`Revisão "${revision}" marcada para ${car.name}`, 'Sucesso');
        }
    } else {
        const index = car.revisions.indexOf(revision);
        if (index > -1) {
            car.revisions.splice(index, 1);
            logActivity(`Revisão "${revision}" desmarcada para ${car.name}`, 'Sucesso');
        }
    }
}

// Security system functions
toggleAlarmBtn.addEventListener('click', function() {
    toggleAlarm();
});

emergencyBtn.addEventListener('click', function() {
    triggerEmergency();
});

function toggleAlarm() {
    alarmActive = !alarmActive;
    if (alarmActive) {
        alarmStatus.className = 'w-4 h-4 rounded-full bg-red-500 mr-2';
        alarmStatusText.textContent = 'Ativado';
        toggleAlarmBtn.textContent = 'Desativar Alarme';
        toggleAlarmBtn.className = 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition';
        logActivity('Alarme ativado', 'Sucesso');
    } else {
        alarmStatus.className = 'w-4 h-4 rounded-full bg-gray-500 mr-2';
        alarmStatusText.textContent = 'Desligado';
        toggleAlarmBtn.textContent = 'Ativar Alarme';
        toggleAlarmBtn.className = 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition';
        logActivity('Alarme desativado', 'Sucesso');
    }
}

function triggerEmergency() {
    emergencyMode = !emergencyMode;
    if (emergencyMode) {
        emergencyBtn.textContent = 'Cancelar Emergência';
        emergencyBtn.className = 'px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition';
        document.body.classList.add('security-alert');
        logActivity('Modo emergência ativado', 'Alerta');
    } else {
        emergencyBtn.textContent = 'Emergência';
        emergencyBtn.className = 'px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition';
        document.body.classList.remove('security-alert');
        logActivity('Modo emergência desativado', 'Sucesso');
    }
}

// Climate control functions
tempSlider.addEventListener('input', function() {
    temperature = parseInt(this.value);
    updateTemperatureDisplay();
});

tempUpBtn.addEventListener('click', function() {
    if (temperature < 35) {
        temperature++;
        updateTemperatureDisplay();
        logActivity(`Temperatura ajustada para ${temperature}°C`, 'Sucesso');
    }
});

tempDownBtn.addEventListener('click', function() {
    if (temperature > 10) {
        temperature--;
        updateTemperatureDisplay();
        logActivity(`Temperatura ajustada para ${temperature}°C`, 'Sucesso');
    }
});

climateAutoBtn.addEventListener('click', function() {
    temperature = 24;
    updateTemperatureDisplay();
    logActivity('Controle climático automático ativado', 'Sucesso');
});

function updateTemperatureDisplay() {
    temperatureDisplay.textContent = `${temperature}°C`;
    tempSlider.value = temperature;
}

function updateHumidityDisplay() {
    humidityDisplay.textContent = `${humidity}%`;
}

// Lighting control functions
lightAllOnBtn.addEventListener('click', function() {
    turnAllLightsOn();
});

lightAllOffBtn.addEventListener('click', function() {
    turnAllLightsOff();
});

function turnAllLightsOn() {
    lightMain.className = 'w-12 h-12 rounded-full bg-yellow-400';
    lightWork.className = 'w-12 h-12 rounded-full bg-yellow-400';
    lightAmbient.className = 'w-12 h-12 rounded-full bg-yellow-400';
    logActivity('Todas as luzes ligadas', 'Sucesso');
}

function turnAllLightsOff() {
    lightMain.className = 'w-12 h-12 rounded-full bg-gray-300';
    lightWork.className = 'w-12 h-12 rounded-full bg-gray-300';
    lightAmbient.className = 'w-12 h-12 rounded-full bg-gray-300';
    logActivity('Todas as luzes desligadas', 'Sucesso');
}

// Activity logging function
function logActivity(event, status) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const timestamp = `${dateStr} ${timeStr}`;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${timestamp}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${event}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm ${status === 'Sucesso' ? 'text-green-600' : 'text-red-600'}">${status}</td>
    `;
    
    activityLog.insertBefore(newRow, activityLog.firstChild);
}
