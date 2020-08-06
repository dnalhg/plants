const cellToIndex = {
    "A1" : 0,
    "A2" : 1,
    "A3" : 2,
    "B1" : 3,
    "B2" : 4,
    "B3" : 5,
    "C1" : 6,
    "C2" : 7,
    "C3" : 8
}

const indexToCell = {
    0 : "A1",
    1 : "A2",
    2 : "A3",
    3 : "B1",
    4 : "B2",
    5 : "B3",
    6 : "C1",
    7 : "C2",
    8 : "C3"
}

const commandToFunc = {
    "HELP" : help,
    "REST" : rest,
    "PLANT" : plant,
    "WATER" : water,
    "HARVEST" : harvest,
    "INSPECT" : inspect
}

var stamina = 10;
var plants = new Array(9);
var flowersCollected = 0;

function updateStamina(amount) {
    stamina = amount;
    var staminaBar = document.getElementById("stamina");
    var staminaTxt = document.getElementById("stamina-info");

    staminaTxt.textContent = "Stamina: " + stamina + "/10";
    staminaBar.style.width = stamina*10 + "%";
}

function updateFlowerCount(amount) {
    flowersCollected += amount;
    var flowerCount = document.getElementById("flower-count");
    flowerCount.textContent = "x " + flowersCollected;
}

function plant(slot) {
    if (stamina < 3) {
        return 2;
    }
    if (plants[cellToIndex[slot]] == null) {
        plants[cellToIndex[slot]] = new Plant("Basic Plant");
        document.getElementById(slot).src = plants[cellToIndex[slot]].getPlantSprite();
        updateStamina(stamina-3);
        return true;
    }
    return false;
}

function water(slot) {
    if (stamina < 1) {
        return 2;
    }
    if (plants[cellToIndex[slot]] == null) {
        return false;
    }
    var result = plants[cellToIndex[slot]].water();
    if (result) {
        document.getElementById(slot).src = plants[cellToIndex[slot]].getPlantSprite();
    }
    updateStamina(stamina-1);
    return true;
}

function inspect(slot) {
    if (plants[cellToIndex[slot]] == null) {
        return "Nothing planted here";
    } else {
        return plants[cellToIndex[slot]].info();
    }
}

function harvest(slot) {
    if (stamina < 1) {
        return 2;
    }
    if (plants[cellToIndex[slot]] == null) {
        return false;
    }
    updateFlowerCount(plants[cellToIndex[slot]].harvest());
    plants[cellToIndex[slot]] = null;
    document.getElementById(slot).src = "img/blank.png"
    updateStamina(stamina-1);
    return true;

}

function rest() {
    updateStamina(10);
    for(i=0; i<9; i++) {
        var p = plants[i];
        var slot = indexToCell[i];
        if (p == null) {
            continue;
        }
        if (p.watered) {
            p.watered = false;
            if (p.daysWatered < p.growthTime) {
                p.daysWatered += 1;
            }
            document.getElementById(slot).src = plants[cellToIndex[slot]].getPlantSprite();
        }
    }
}

function help () {
    const helpString = "Plant and care for your plants with the following commands:\n" +
                       "\nHELP: Displays a list of all commands.\n" +
                       "Usage: HELP\n" +
                       "\nREST: Rest a day to restore stamina and let plants grow.\n" + 
                       "Usage: REST\n" +
                       "\nPLANT: Plants a new plant at a given slot. Uses 3 stamina.\n" + 
                       "Usage: PLANT <SLOT>\n" + 
                       "Example usage: PLANT A1\n" +
                       "\nWATER: Waters the plant at a specified slot. Uses 1 stamina.\n" + 
                       "Usage: WATER <SLOT>\n" +
                       "Example usage: WATER A1\n" +
                       "\nHARVEST: Harvest the plant at a specified slot. Uses 1 stamina.\n" +
                       "Usage: HARVEST <SLOT>\n" +
                       "Example usage: HARVEST A1\n" +
                       "\nINSPECT: Get more information about the plant at a specified slow.\n" +
                       "Usage: INSPECT <SLOT>\n" +
                       "Example usage: INSPECT A1\n";
    
    return helpString;
}