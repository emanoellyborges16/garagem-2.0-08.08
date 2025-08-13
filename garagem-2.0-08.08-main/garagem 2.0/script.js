// Configuração da API de previsão do tempo
const WEATHER_API_KEY = 'd83e13ac0774bdbf277faa2425cdf71b';
const WEATHER_CITY = 'São Paulo';

// Estado do sistema
let doorOpen = false;
let temperature = 24;
let humidity = 45;
let vehicles = [];
let fleetCars = [];
let alarmActive = false;
let emergencyActive = false;

// Inicializar ao carregar a página
window.addEventListener('load', () => {
    fetchWeather();
    loadVehicles();
    loadFleetCars();
    logActivity('Sistema iniciado', 'Sucesso');
});

// Função para buscar previsão do tempo
async function fetchWeather() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(WEATHER_CITY)}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`
        );
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do tempo');
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('city-name').textContent = 'Erro ao carregar o tempo';
    }
}

function updateWeatherUI(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('weather-temperature').textContent = Math.round(data.main.temp) + '°C';
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('weather-humidity').textContent = data.main.humidity + '%';
    document.getElementById('weather-wind').textContent = (data.wind.speed * 3.6).toFixed(1) + ' km/h';

    const iconCode = data.weather[0].icon;
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
}

function refreshWeather() {
    fetchWeather();
}

// Funções de controle do portão
function openDoor() {
    doorOpen = true;
    document.getElementById('door-status').textContent = 'Aberto';
    document.getElementById('door-status').className = 'px-3 py-1 rounded-full bg-green-100 text-green-800';
    document.getElementById('open-btn').disabled = true;
    document.getElementById('close-btn').disabled = false;
    // Adiciona classe para animar porta 3D
    document.querySelector('.garage-door').classList.add('door-open');
    logActivity('Portão aberto', 'Sucesso');
}

function closeDoor() {
    doorOpen = false;
    document.getElementById('door-status').textContent = 'Fechado';
    document.getElementById('door-status').className = 'px-3 py-1 rounded-full bg-red-100 text-red-800';
    document.getElementById('open-btn').disabled = false;
    document.getElementById('close-btn').disabled = true;
    // Remove classe para animar porta 3D
    document.querySelector('.garage-door').classList.remove('door-open');
    logActivity('Portão fechado', 'Sucesso');
}


// Funções de controle de veículos
async function addVehicle() {
    const model = document.getElementById('vehicle-model').value;
    const plate = document.getElementById('vehicle-plate').value;
    
    if (!model || !plate) {
        alert('Por favor, preencha modelo e placa do veículo.');
        return;
    }
    
    const newVehicle = {
        model: model,
        plate: plate,
        date: new Date().toLocaleDateString('pt-BR')
    };
    
    try {
        const response = await fetch('/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newVehicle)
        });
        
        if (response.ok) {
            const result = await response.json();
            newVehicle.id = result.id;
            vehicles.push(newVehicle);
            displayVehicles();
            logActivity(`Veículo ${model} adicionado`, 'Sucesso');
            
            document.getElementById('vehicle-model').value = '';
            document.getElementById('vehicle-plate').value = '';
        }
    } catch (error) {
        console.error('Erro ao adicionar veículo:', error);
    }
}

async function loadVehicles() {
    try {
        const response = await fetch('/api/vehicles');
        if (response.ok) {
            vehicles = await response.json();
            displayVehicles();
        }
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

function displayVehicles() {
    const vehicleList = document.getElementById('vehicle-list');
    vehicleList.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const vehicleItem = document.createElement('div');
        vehicleItem.className = 'vehicle-item bg-gray-50 p-3 rounded-lg mb-2';
        vehicleItem.innerHTML = `
            <div><strong>Modelo:</strong> ${vehicle.model}</div>
            <div><strong>Placa:</strong> ${vehicle.plate}</div>
            <div><strong>Data:</strong> ${vehicle.date}</div>
        `;
        vehicleList.appendChild(vehicleItem);
    });
}

// Funções de controle climático
function updateTemperature(value) {
    temperature = parseInt(value);
    document.getElementById('temperature').textContent = `${temperature}°C`;
    logActivity(`Temperatura ajustada para ${temperature}°C`, 'Sucesso');
}

function increaseTemp() {
    if (temperature < 35) {
        temperature++;
        updateTemperature(temperature);
    }
}

function decreaseTemp() {
    if (temperature > 10) {
        temperature--;
        updateTemperature(temperature);
    }
}

// Funções de log
function logActivity(event, status) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR');
    const timestamp = `${dateStr} ${timeStr}`;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${timestamp}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${event}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm ${status === 'Sucesso' ? 'text-green-600' : 'text-red-600'}">${status}</td>
    `;
    
    document.getElementById('activity-log-body').insertBefore(newRow, document.getElementById('activity-log-body').firstChild);
}

// Sistema de Alarme
function toggleAlarm() {
    alarmActive = !alarmActive;
    const alarmToggle = document.getElementById('alarm-toggle');
    const alarmStatus = document.getElementById('alarm-status');
    
    if (alarmActive) {
        alarmStatus.innerHTML = '<i class="fas fa-shield-alt mr-2"></i>Alarme Ativado';
        alarmStatus.className = 'text-center p-3 rounded-lg bg-red-100 text-red-800';
        logActivity('Alarme ativado', 'Sucesso');
        
        // Solicitar permissão para notificações
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    } else {
        alarmStatus.innerHTML = '<i class="fas fa-shield-alt mr-2"></i>Alarme Desativado';
        alarmStatus.className = 'text-center p-3 rounded-lg bg-green-100 text-green-800';
        logActivity('Alarme desativado', 'Sucesso');
    }
}

function testAlarm() {
    if (!alarmActive) {
        alert('Por favor, ative o alarme primeiro!');
        return;
    }
    
    // Simular disparo de alarme
    playAlarmSound();
    showNotification('Teste de Alarme', 'Sistema de alarme testado com sucesso!');
    logActivity('Teste de alarme realizado', 'Sucesso');
}

function resetAlarm() {
    if (alarmActive) {
        stopAlarmSound();
        logActivity('Alarme resetado', 'Sucesso');
    }
}

function playAlarmSound() {
    // Criar som de alarme usando Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

function stopAlarmSound() {
    // Parar som de alarme
    console.log('Alarme silenciado');
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png'
        });
    }
}

// Sistema de Emergência
function triggerEmergency() {
    emergencyActive = true;
    
    // Mostrar modal de emergência
    const emergencyModal = document.createElement('div');
    emergencyModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    emergencyModal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md mx-4">
            <h3 class="text-xl font-bold mb-4 text-red-600">🆘 EMERGÊNCIA ATIVADA</h3>
            <p class="mb-4">Sistema de emergência foi ativado. As autoridades foram notificadas.</p>
            <div class="space-y-2">
                <button onclick="callSecurity()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
                    <i class="fas fa-phone mr-2"></i>Ligar Segurança
                </button>
                <button onclick="callPolice()" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg">
                    <i class="fas fa-shield-alt mr-2"></i>Ligar Polícia
                </button>
                <button onclick="closeEmergencyModal()" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg">
                    Fechar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(emergencyModal);
    logActivity('Emergência ativada', 'Alerta');
}

function closeEmergencyModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
    emergencyActive = false;
}

function callSecurity() {
    // Simular ligação para segurança
    logActivity('Contato segurança realizado', 'Emergência');
    alert('Ligando para segurança... Número: 190');
}

function callPolice() {
    // Simular ligação para polícia
    logActivity('Contato polícia realizado', 'Emergência');
    alert('Ligando para polícia... Número: 190');
}

// Gerenciamento de Múltiplos Carros
function addFleetCar() {
    const model = document.getElementById('fleet-car-model').value;
    const plate = document.getElementById('fleet-car-plate').value;
    const owner = document.getElementById('fleet-car-owner').value;
    const group = document.getElementById('fleet-car-group').value;
    
    if (!model || !plate || !owner) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const newCar = {
        id: Date.now(),
        model: model,
        plate: plate,
        owner: owner,
        group: group,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'estacionado'
    };
    
    fleetCars.push(newCar);
    displayFleetCars();
    logActivity(`Carro ${model} adicionado à frota`, 'Sucesso');
    
    // Limpar campos
    document.getElementById('fleet-car-model').value = '';
    document.getElementById('fleet-car-plate').value = '';
    document.getElementById('fleet-car-owner').value = '';
}

function displayFleetCars() {
    const fleetList = document.getElementById('fleet-cars-list');
    fleetList.innerHTML = '';
    
    if (fleetCars.length === 0) {
        fleetList.innerHTML = '<p class="text-gray-500 text-center">Nenhum carro cadastrado</p>';
        return;
    }
    
    fleetCars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'fleet-car-item bg-gray-50 p-3 rounded-lg';
        carItem.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <div><strong>${car.model}</strong></div>
                    <div class="text-sm text-gray-600">Placa: ${car.plate}</div>
                    <div class="text-sm text-gray-600">Dono: ${car.owner}</div>
                    <div class="text-sm text-gray-600">Grupo: ${car.group}</div>
                </div>
                <div class="flex space-x-1">
                    <button onclick="removeFleetCar(${car.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="toggleCarStatus(${car.id})" class="text-blue-500 hover:text-blue-700">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
            <div class="mt-2">
                <span class="px-2 py-1 text-xs rounded-full ${car.status === 'estacionado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${car.status}
                </span>
            </div>
        `;
        fleetList.appendChild(carItem);
    });
}

function removeFleetCar(carId) {
    fleetCars = fleetCars.filter(car => car.id !== carId);
    displayFleetCars();
    logActivity('Carro removido da frota', 'Sucesso');
}

function toggleCarStatus(carId) {
    const car = fleetCars.find(c => c.id === carId);
    if (car) {
        car.status = car.status === 'estacionado' ? 'em uso' : 'estacionado';
        displayFleetCars();
        logActivity(`Status do carro ${car.model} alterado para ${car.status}`, 'Sucesso');
    }
}

function loadFleetCars() {
    // Carregar carros do localStorage ou API
    const savedCars = localStorage.getItem('fleetCars');
    if (savedCars) {
        fleetCars = JSON.parse(savedCars);
        displayFleetCars();
    }
}

function saveFleetCars() {
    localStorage.setItem('fleetCars', JSON.stringify(fleetCars));
}

// Event listeners
document.getElementById('open-btn').addEventListener('click', openDoor);
document.getElementById('close-btn').addEventListener('click', closeDoor);

// Salvar estado ao sair
window.addEventListener('beforeunload', () => {
    saveFleetCars();
});
