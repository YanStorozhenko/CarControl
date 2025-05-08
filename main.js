class Vehicle {
    constructor(brand, model, year) {
        this.brand = brand
        this.model = model
        this.year = year
        this.speed = 0
        this.engine = false
    }

    startEngine() {
        throw new Error("Метод должен быть в подклассе");
    }

    stopEngine() {
        this.engine = false;
        console.log(`${this.getInfo()} двигатель выключен`)
    }

    // Метод ускорения
    acceleration(amount) {
        if (!this.engine) {
            console.log("Сначала запустите двигатель");
            return;
        }
        this.speed += amount;
        console.log(`${this.getInfo()} ускоряется до ${this.speed} км/ч`)
    }

    // Метод торможения
    brake(amount) {
        this.speed = Math.max(0, this.speed - amount);
        console.log(`${this.getInfo()} замедляется до ${this.speed} км/ч`)
    }

    // Получение инфы об авто
    getInfo() {
        return `${this.brand} ${this.model} ${this.year}`
    }
}

class GasolineCar extends Vehicle {
    constructor(brand, model, year, fuelCapacity) {
        super(brand, model, year);
        this.fuelCapacity = fuelCapacity; // Объем топливного бака;
        this.currentFuel = fuelCapacity; // Текущий уровень топлива;
    }

    startEngine() {
        if (this.currentFuel <= 0) {
            console.log("Нет топлива! Едь на росНефть");
            return false;
        }
        this.engine = true;
        console.log(`${this.getInfo()} двигатель запущен (бензин)`);
        return true;
    }

    // Это уникальный метод для бенз. двигателя
    refuel(liters) {
        this.currentFuel = Math.min(this.fuelCapacity, this.currentFuel + liters); // Исправлено Math.max на Math.min
        console.log(`Заправлено. Топлива ${this.currentFuel} литров. ${this.fuelCapacity}`)
    }

    acceleration(amount) {
        if (!this.startEngine()) return; // Изменено с super.startEngine() на this.startEngine()
        let fuelConsumption = amount * 0.1; // Примерный расход топлива
        if (this.currentFuel < fuelConsumption) {
            console.log("Недостаточно топлива")
            return;
        }
        this.currentFuel -= fuelConsumption;
        super.acceleration(amount);
        console.log(`Остаток топлива ${this.currentFuel.toFixed(1)}литра`)
    }
}

class ElecrticCar extends Vehicle {
    constructor(brand, model, year, batteryCapacity) {
        super(brand, model, year);
        this.batteryCapacity = batteryCapacity // Емкость батареи кВт . ч
        this.currentCharge = batteryCapacity // Текущий заряд
    }

    // Полиморфизм, переопределяем метод запуска двигателя для электромобиля
    startEngine() {
        if (this.currentCharge <= 0) {
            console.log("Батарея разряжена")
            return false;
        }
        this.engine = true;
        console.log(`${this.getInfo()} двигатель запущен`)
        return true;
    }

    charge(kwh) {
        this.currentCharge = Math.min(this.batteryCapacity, this.currentCharge + kwh);
        console.log(`Заряжено. Батарея: ${this.currentCharge.toFixed(1)} кВт * ч. из ${this.batteryCapacity} кВч`);

    }

    // Полиморфизм переопределяем ускорение с учетом расхода энергии.
    acceleration(amount) {
        if (!this.startEngine()) return; // Изменено с super.startEngine() на this.startEngine()
        let energyConsumption = amount * 0.05 // Расход примерный
        if (this.currentCharge < energyConsumption) {
            console.log("Недостаточно заряда, едь на станцию")
            return;
        }
        this.currentCharge -= energyConsumption;
        super.acceleration(amount);
        console.log(`Остаток заряда: ${this.currentCharge.toFixed(1)} кВт Ч.`)
    }
}

class HybridCar extends GasolineCar {
    constructor(brand, model, year, fuelCapacity, batteryCapacity) {
        super(brand, model, year, fuelCapacity);
        this.batteryCapacity = batteryCapacity;
        this.currentCharge = batteryCapacity;
        this.electricMode = false;
    }

    startEngine() {
        // Пытаемся запустить в электро режиме двигатель.
        if (this.currentCharge > 0) {
            this.engine = true;
            this.electricMode = true;
            console.log(`${this.getInfo()} двигатель запущен (электрический режим)`);
            return true;
        }

        else if (this.currentFuel > 0) {
            this.engine = true;
            this.electricMode = false;
            console.log(`${this.getInfo()} двигатель запущен (бензиновый режим)`)
            return true;
        }
        console.log("Нет заряда и топлива")
        return false;
    }

    // Полиморфизм. Переопределяем ускорение для гибрида
    acceleration(amount) {
        if (this.electricMode) { // Добавлено условие для электрического режима
            let energyConsumption = amount * 0.04
            if (this.currentCharge < energyConsumption) {
                console.log(`Переключаемся на бензин`);
                this.electricMode = false;
                if (this.currentFuel <= 0) {
                    console.log("Бензин закончился");
                    return;
                }
            } else {
                this.currentCharge -= energyConsumption;
                super.acceleration(amount);
                console.log(`(Электро) остаток заряда: ${this.currentCharge.toFixed(1)} кВт Ч.`);
                return;
            }
        }
        
        // Бензиновый режим
        let fuelConsumption = amount * 0.1; // Добавлено определение fuelConsumption
        if (this.currentFuel <= 0) {
            console.log("Бензин закончился");
            return;
        }
        this.currentFuel -= fuelConsumption;
        super.acceleration(amount);
        console.log(`(Бензин) Остаток топлива ${this.currentFuel.toFixed(1)} литров.`)
    }
}

// Демонстрация полиморфизма.
function testDrive(vehicle) {
    console.log('Тест драйв для:', vehicle.getInfo())
    
    vehicle.startEngine();
    vehicle.acceleration(20);
    vehicle.acceleration(30);
    vehicle.brake(15);
    vehicle.acceleration(25);
    vehicle.startEngine();
}

let gasolineCar = new GasolineCar("Opel", "Zafira", 2007, 60)
let electricCar = new ElecrticCar("Tesla", "Model X",  2020, 75)
let hybridCar = new HybridCar("Toyota", "Prius", 2021, 45, 5)

testDrive(gasolineCar)
testDrive(electricCar)
testDrive(hybridCar)