// ==========================
// HARDWARE IDLE
// ==========================

let bits = 0;
let heat = 0;
let hackProgress = 0;

let inventoryLimit = 20;

let cpuGlobal = 1;
let gpuGlobal = 1;
let ramGlobal = 1;
let coolingGlobal = 1;

let currentHackIndex = 0;
let currentDrop = null;
let attributeOffer = null;

// ==========================
// ATRIBUTOS
// ==========================

let attributeRollLevel = 1;
let attributeRollCost = 50;

const attributes = {
  fanSpeed: 0,
  overclock: 0,
  dropRate: 0,
  rgbEfficiency: 0,
  thermalPaste: 0,
};

// ==========================
// INVENTÁRIO / SETUP
// ==========================

const inventory = [];

const equipped = {
  cpu: null,
  gpu: null,
  ram1: null,
  ram2: null,
  ram3: null,
  ram4: null,
  ssd: null,
  cooler: null,
  fonte: null,
};

// ==========================
// FASES AUTOMÁTICAS
// ==========================

const hacks = [
  {
    name: "Wi-Fi Público",
    description: "Rede vulnerável encontrada.",
    requiredPower: 0,
    reward: 40,
  },
  {
    name: "Lan House",
    description: "Infraestrutura antiga detectada.",
    requiredPower: 50,
    reward: 90,
  },
  {
    name: "Empresa Local",
    description: "Servidor corporativo vulnerável.",
    requiredPower: 180,
    reward: 220,
  },
  {
    name: "Servidor Gamer",
    description: "Rede gamer com tráfego intenso.",
    requiredPower: 400,
    reward: 500,
  },
  {
    name: "Data Center",
    description: "Infraestrutura comercial avançada.",
    requiredPower: 900,
    reward: 1200,
  },
  {
    name: "Quantum Lab",
    description: "Tecnologia quântica detectada.",
    requiredPower: 1800,
    reward: 3000,
  },
];

// ==========================
// ITENS
// ==========================

const itemTypes = ["CPU", "GPU", "RAM", "SSD", "Cooler", "Fonte"];

const rarities = [
  {
    name: "Comum",
    color: "#9ca3af",
    multiplier: 1,
  },
  {
    name: "Raro",
    color: "#3b82f6",
    multiplier: 1.5,
  },
  {
    name: "Gamer",
    color: "#a855f7",
    multiplier: 2.5,
  },
  {
    name: "Quântico",
    color: "#f59e0b",
    multiplier: 4,
  },
];

// ==========================
// ELEMENTOS
// ==========================

const bitsValue = document.getElementById("bitsValue");
const heatValue = document.getElementById("heatValue");

const cpuPower = document.getElementById("cpuPower");
const gpuPower = document.getElementById("gpuPower");
const ramPower = document.getElementById("ramPower");
const coolingPower = document.getElementById("coolingPower");

const hackBtn = document.getElementById("hackBtn");
const mineBtn = document.getElementById("mineBtn");

const hackName = document.getElementById("hackName");
const hackDescription = document.getElementById("hackDescription");
const targetLevel = document.getElementById("targetLevel");
const setupPowerText = document.getElementById("setupPowerText");

const hackProgressText = document.getElementById("hackProgressText");
const hackProgressBar = document.getElementById("hackProgressBar");

const inventoryList = document.getElementById("inventoryList");
const inventorySlots = document.getElementById("inventorySlots");

const gameLog = document.getElementById("gameLog");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const attributesList = document.getElementById("attributesList");

const rollAttributeBtn = document.getElementById("rollAttributeBtn");
const attributeOfferBox = document.getElementById("attributeOffer");
const newAttributeText = document.getElementById("newAttributeText");

const applyAttributeBtn = document.getElementById("applyAttributeBtn");
const keepAttributeBtn = document.getElementById("keepAttributeBtn");

const attributeRollLevelText = document.getElementById("attributeRollLevel");
const attributeCostText = document.getElementById("attributeCost");

const dropModal = document.getElementById("dropModal");
const dropComparison = document.getElementById("dropComparison");

const equipDropBtn = document.getElementById("equipDropBtn");
const keepDropBtn = document.getElementById("keepDropBtn");
const scrapDropBtn = document.getElementById("scrapDropBtn");

// ==========================
// TABS
// ==========================

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    tabButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    button.classList.add("active");

    document.getElementById(`tab-${tab}`).classList.add("active");
  });
});

// ==========================
// CÁLCULOS
// ==========================

function getTotalPower() {
  return cpuGlobal + gpuGlobal + ramGlobal + coolingGlobal;
}

function getCurrentHack() {
  return hacks[currentHackIndex];
}

function checkHackProgression() {
  const power = getTotalPower();

  hacks.forEach((hack, index) => {
    if (power >= hack.requiredPower && index > currentHackIndex) {
      currentHackIndex = index;
      hackProgress = 0;
      addLog(`Nova fase desbloqueada: ${hack.name}`);
    }
  });
}

function getEquippedPowerByType(type) {
  let total = 0;

  Object.values(equipped).forEach((item) => {
    if (item && item.type === type) {
      total += item.power;
    }
  });

  return total;
}

// ==========================
// UPDATE UI
// ==========================

function updateUI() {
  checkHackProgression();

  const currentHack = getCurrentHack();

  bitsValue.innerText = Math.floor(bits);
  heatValue.innerText = `${Math.floor(heat)}°C`;

  cpuPower.innerText = cpuGlobal;
  gpuPower.innerText = gpuGlobal;
  ramPower.innerText = ramGlobal;
  coolingPower.innerText = coolingGlobal;

  hackName.innerText = currentHack.name;
  hackDescription.innerText = currentHack.description;

  targetLevel.innerText = `Nível ${currentHackIndex + 1}`;
  setupPowerText.innerText = `Power ${getTotalPower()}`;

  hackProgressText.innerText = `${Math.floor(hackProgress)}%`;
  hackProgressBar.style.width = `${Math.min(hackProgress, 100)}%`;

  inventorySlots.innerText = `${inventory.length}/${inventoryLimit}`;

  attributeRollLevelText.innerText = attributeRollLevel;
  attributeCostText.innerText = `Custo: ${attributeRollCost} Bits`;

  renderInventory();
  renderAttributes();
  renderSetup();
}

// ==========================
// LOG
// ==========================

function addLog(text) {
  const line = document.createElement("div");

  line.classList.add("log-message");
  line.innerText = text;

  gameLog.appendChild(line);
  gameLog.scrollTop = gameLog.scrollHeight;
}

// ==========================
// MINERAR
// ==========================

mineBtn.addEventListener("click", () => {
  const gain = 1 + cpuGlobal + attributes.overclock;

  bits += gain;

  heat += Math.max(0.2, 1.5 - attributes.thermalPaste * 0.1);

  addLog(`+${Math.floor(gain)} Bits minerados`);

  updateUI();
});

// ==========================
// HACK
// ==========================

hackBtn.addEventListener("click", () => {
  if (heat >= 100) {
    addLog("PC superaquecido! Espere resfriar.");
    return;
  }

  const progressGain = 5 + gpuGlobal * 0.8 + attributes.overclock;
  const bitGain = 3 + gpuGlobal + currentHackIndex * 2;

  hackProgress += progressGain;
  bits += bitGain;

  heat += Math.max(1, 4 - attributes.thermalPaste * 0.2);

  addLog(`Hack executado: +${Math.floor(bitGain)} Bits`);

  const dropChance = 0.22 + attributes.dropRate * 0.01;

  if (Math.random() < dropChance) {
    generateDrop();
  }

  if (hackProgress >= 100) {
    completeHack();
  }

  updateUI();
});

// ==========================
// COMPLETAR HACK
// ==========================

function completeHack() {
  const currentHack = getCurrentHack();

  hackProgress = 0;

  const reward = currentHack.reward + gpuGlobal * 5;

  bits += reward;

  addLog(`Hack concluído em ${currentHack.name}`);
  addLog(`+${Math.floor(reward)} Bits`);

  generateDrop();
}

// ==========================
// COOLER
// ==========================

setInterval(() => {
  const coolingAmount = 1 + coolingGlobal * 0.35 + attributes.fanSpeed * 0.5;

  heat -= coolingAmount;

  if (heat < 0) {
    heat = 0;
  }

  updateUI();
}, 120);

// ==========================
// DROPS
// ==========================

function generateDrop() {
  if (dropModal && !dropModal.classList.contains("hidden")) {
    return;
  }

  const rarity = rollRarity();
  const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  const stageBonus = currentHackIndex + 1;

  const power = Math.floor(
    (Math.random() * 10 + 5 + stageBonus * 2) * rarity.multiplier
  );

  const rgbChance = 0.12 + attributes.rgbEfficiency * 0.01;
  const rgb = Math.random() < rgbChance;

  const item = {
    type,
    rarity,
    power,
    rgb,
  };

  currentDrop = item;

  openDropModal(item);
}

function rollRarity() {
  const roll = Math.random();

  if (roll < 0.6) return rarities[0];
  if (roll < 0.85) return rarities[1];
  if (roll < 0.97) return rarities[2];

  return rarities[3];
}

// ==========================
// MODAL DE DROP
// ==========================

function openDropModal(item) {
  const equippedPower = getEquippedPowerByType(item.type);
  const difference = item.power - equippedPower;

  let comparisonText = "Mesmo poder do equipado";

  if (difference > 0) {
    comparisonText = `+${difference} melhor que o equipado`;
  }

  if (difference < 0) {
    comparisonText = `${difference} pior que o equipado`;
  }

  dropModal.classList.remove("hidden");

  dropComparison.innerHTML = `
    <div style="
      background:#0f0f0f;
      border:1px solid ${item.rarity.color};
      border-radius:14px;
      padding:18px;
      box-shadow:0 0 18px ${item.rgb ? item.rarity.color : "transparent"};
    ">
      <h3 style="
        color:${item.rarity.color};
        margin-bottom:10px;
      ">
        ${item.type} ${item.rarity.name} ${item.rgb ? "RGB" : ""}
      </h3>

      <p>Power: ${item.power}</p>
      <p>Equipado atual: ${equippedPower}</p>
      <p>${comparisonText}</p>
      <p>RGB: ${item.rgb ? "SIM" : "NÃO"}</p>
    </div>
  `;
}

function closeDropModal() {
  dropModal.classList.add("hidden");
  currentDrop = null;
}

// ==========================
// DROP: EQUIPAR / GUARDAR / DESMONTAR
// ==========================

equipDropBtn.addEventListener("click", () => {
  if (!currentDrop) return;

  equipItem(currentDrop);

  addLog(`${currentDrop.type} equipado`);

  closeDropModal();
  updateUI();
});

keepDropBtn.addEventListener("click", () => {
  if (!currentDrop) return;

  if (inventory.length >= inventoryLimit) {
    addLog("Inventário cheio!");
    return;
  }

  inventory.push(currentDrop);

  addLog(`${currentDrop.type} guardado`);

  closeDropModal();
  updateUI();
});

scrapDropBtn.addEventListener("click", () => {
  if (!currentDrop) return;

  const gain = currentDrop.power * 3;

  bits += gain;

  addLog(`${currentDrop.type} desmontado`);
  addLog(`+${gain} Bits`);

  closeDropModal();
  updateUI();
});

// ==========================
// EQUIPAR ITEM
// ==========================

function equipItem(item) {
  const type = item.type.toLowerCase();

  if (type === "cpu") {
    if (equipped.cpu) {
      cpuGlobal -= equipped.cpu.power;
    }

    equipped.cpu = item;
    cpuGlobal += item.power;
  }

  if (type === "gpu") {
    if (equipped.gpu) {
      gpuGlobal -= equipped.gpu.power;
    }

    equipped.gpu = item;
    gpuGlobal += item.power;
  }

  if (type === "ram") {
    equipRam(item);
  }

  if (type === "cooler") {
    if (equipped.cooler) {
      coolingGlobal -= equipped.cooler.power;
    }

    equipped.cooler = item;
    coolingGlobal += item.power;
  }

  if (type === "ssd") {
    if (equipped.ssd) {
      inventoryLimit -= equipped.ssd.extraSlots || 5;
    }

    item.extraSlots = 5;
    equipped.ssd = item;
    inventoryLimit += item.extraSlots;
  }

  if (type === "fonte") {
    equipped.fonte = item;
  }
}

function equipRam(item) {
  const slots = ["ram1", "ram2", "ram3", "ram4"];

  let targetSlot = null;

  for (const slot of slots) {
    if (!equipped[slot]) {
      targetSlot = slot;
      break;
    }
  }

  if (!targetSlot) {
    targetSlot = slots[0];

    slots.forEach((slot) => {
      if (equipped[slot].power < equipped[targetSlot].power) {
        targetSlot = slot;
      }
    });
  }

  if (equipped[targetSlot]) {
    ramGlobal -= equipped[targetSlot].power;
  }

  equipped[targetSlot] = item;
  ramGlobal += item.power;
}

// ==========================
// INVENTÁRIO
// ==========================

function renderInventory() {
  inventoryList.innerHTML = "";

  if (inventory.length === 0) {
    inventoryList.innerHTML = `<p>Inventário vazio.</p>`;
    return;
  }

  inventory.forEach((item, index) => {
    const div = document.createElement("div");

    div.classList.add("inventory-item");

    div.innerHTML = `
      <h3 style="color:${item.rarity.color}; margin-bottom:10px;">
        ${item.type} ${item.rgb ? "RGB" : ""}
      </h3>

      <p>${item.rarity.name}</p>
      <p>Power: ${item.power}</p>

      <div class="inventory-actions">
        <button class="primary-btn equip-inventory-btn" data-index="${index}">
          Equipar
        </button>

        <button class="danger-btn scrap-inventory-btn" data-index="${index}">
          Desmontar
        </button>
      </div>
    `;

    inventoryList.appendChild(div);
  });
}

// Clique dos botões do inventário
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("equip-inventory-btn")) {
    const index = Number(event.target.dataset.index);
    const item = inventory[index];

    if (!item) return;

    equipItem(item);

    inventory.splice(index, 1);

    addLog(`${item.type} equipado do inventário`);

    updateUI();
  }

  if (event.target.classList.contains("scrap-inventory-btn")) {
    const index = Number(event.target.dataset.index);
    const item = inventory[index];

    if (!item) return;

    const gain = item.power * 3;

    bits += gain;

    inventory.splice(index, 1);

    addLog(`${item.type} desmontado`);
    addLog(`+${gain} Bits`);

    updateUI();
  }
});

// ==========================
// SETUP
// ==========================

function renderSetup() {
  setSlotText("slotCPU", equipped.cpu);
  setSlotText("slotGPU", equipped.gpu);
  setSlotText("slotRAM1", equipped.ram1);
  setSlotText("slotCooler", equipped.cooler);
  setSlotText("slotSSD", equipped.ssd);
}

function setSlotText(id, item) {
  const el = document.getElementById(id);

  if (!el) return;

  el.innerText = item
    ? `${item.type} ${item.rarity.name}${item.rgb ? " RGB" : ""} (${item.power})`
    : "Vazio";
}

// ==========================
// ATRIBUTOS
// ==========================

function renderAttributes() {
  attributesList.innerHTML = "";

  Object.entries(attributes).forEach(([name, value]) => {
    const div = document.createElement("div");

    div.classList.add("attribute-card");

    div.innerHTML = `
      <h3>${formatAttribute(name)}</h3>
      <p>Level ${value}</p>
      <small>${getAttributeDescription(name)}</small>
    `;

    attributesList.appendChild(div);
  });
}

function formatAttribute(name) {
  const names = {
    fanSpeed: "Fan Speed",
    overclock: "Overclock",
    dropRate: "Drop Rate",
    rgbEfficiency: "RGB Efficiency",
    thermalPaste: "Thermal Paste",
  };

  return names[name] || name;
}

function getAttributeDescription(name) {
  const descriptions = {
    fanSpeed: "Resfria o PC mais rápido.",
    overclock: "Aumenta Bits e progresso do hack.",
    dropRate: "Aumenta chance de drop.",
    rgbEfficiency: "Aumenta chance de itens RGB.",
    thermalPaste: "Reduz aquecimento.",
  };

  return descriptions[name] || "";
}

rollAttributeBtn.addEventListener("click", () => {
  if (bits < attributeRollCost) {
    addLog("Bits insuficientes!");
    return;
  }

  bits -= attributeRollCost;

  const keys = Object.keys(attributes);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  const gain = Math.floor(Math.random() * 3 + 1 + attributeRollLevel * 0.15);

  attributeOffer = {
    key: randomKey,
    gain,
  };

  newAttributeText.innerText = `${formatAttribute(randomKey)} +${gain}`;

  attributeOfferBox.classList.remove("hidden");

  attributeRollCost += 25 + attributeRollLevel * 5;

  updateUI();
});

applyAttributeBtn.addEventListener("click", () => {
  if (!attributeOffer) return;

  attributes[attributeOffer.key] += attributeOffer.gain;

  attributeRollLevel++;

  addLog(`${formatAttribute(attributeOffer.key)} melhorado`);

  attributeOffer = null;
  attributeOfferBox.classList.add("hidden");

  updateUI();
});

keepAttributeBtn.addEventListener("click", () => {
  attributeOffer = null;

  attributeOfferBox.classList.add("hidden");

  addLog("Atributo descartado");

  updateUI();
});

// ==========================
// UPGRADES
// ==========================

document.getElementById("upgradeCpuBtn").addEventListener("click", () => {
  const cost = cpuGlobal * 25;

  if (bits < cost) {
    addLog("Bits insuficientes para CPU.");
    return;
  }

  bits -= cost;
  cpuGlobal++;

  addLog("CPU melhorada");

  updateUI();
});

document.getElementById("upgradeGpuBtn").addEventListener("click", () => {
  const cost = gpuGlobal * 25;

  if (bits < cost) {
    addLog("Bits insuficientes para GPU.");
    return;
  }

  bits -= cost;
  gpuGlobal++;

  addLog("GPU melhorada");

  updateUI();
});

document.getElementById("upgradeCoolingBtn").addEventListener("click", () => {
  const cost = coolingGlobal * 25;

  if (bits < cost) {
    addLog("Bits insuficientes para Cooling.");
    return;
  }

  bits -= cost;
  coolingGlobal++;

  addLog("Cooling melhorado");

  updateUI();
});

// ==========================
// START
// ==========================

updateUI();