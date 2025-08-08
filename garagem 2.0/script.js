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
let carPresent = false;
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
    if (!carPresent) {
        simulateCarArrival();
    } else {
        simulateCarDeparture();
    }
});

function simulateCarArrival() {
    carPresent = true;
    carStatus.textContent = 'Veículo detectado';
    sensorIndicator.className = 'w-4 h-4 rounded-full bg-green-500 mr-2';
    carImage.src = 'https://placehold.co/600x300/2c3e50/FFFFFF?text=Carro+Estacionado';
    carImage.alt = 'Carro prateado moderno estacionado na garagem';
    car.classList.remove('opacity-0');
    car.classList.add('car-parked');
    simulateCarBtn.textContent = 'Simular Saída';
    logActivity('Veículo chegou', 'Sucesso');
}

function simulateCarDeparture() {
    carPresent = false;
    carStatus.textContent = 'Garagem vazia';
    sensorIndicator.className = 'w-4 h-4 rounded-full bg-red-500 mr-2';
    carImage.src = 'https://placehold.co/600x300/2c3e50/FFFFFF?text=Garagem+Vazia';
    carImage.alt = 'Área de garagem vazia com piso de concreto e marcações de estacionamento';
    car.classList.add('opacity-0');
    car.classList.remove('car-parked');
    simulateCarBtn.textContent = 'Simular Chegada';
    logActivity('Veículo saiu', 'Sucesso');
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
