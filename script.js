// ========================================
// HARDWARE IDLE — ALPHA PREMIUM
// ========================================

let bits = 0;
let cores = 0;
let heat = 0;
let hackProgress = 0;

let inventoryLimit = 20;
let autoHackEnabled = false;
let currentHackIndex = 0;
let selectedFilter = "ALL";

let cpuGlobal = 1;
let gpuGlobal = 1;
let ramGlobal = 1;
let coolingGlobal = 1;

let attributeRollLevel = 1;
let attributeRollCost = 50;

let attributeOffer = null;
let pendingRareDrop = null;

const attributes = {
  fanSpeed: 0,
  overclock: 0,
  dropRate: 0,
  rgbEfficiency: 0,
  thermalPaste: 0,
};

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

// ========================================
// FASES
// ========================================

const hacks = [
  { name: "Wi-Fi Público", description: "Rede aberta e vulnerável. Ideal para começar.", requiredPower: 0, reward: 40 },
  { name: "Lan House", description: "Rede local antiga com máquinas fracas.", requiredPower: 80, reward: 120 },
  { name: "Loja de Informática", description: "Sistema simples com estoque digital.", requiredPower: 180, reward: 260 },
  { name: "Empresa Local", description: "Servidor corporativo básico.", requiredPower: 420, reward: 650 },
  { name: "Servidor Gamer", description: "Infraestrutura gamer com tráfego alto.", requiredPower: 900, reward: 1400 },
  { name: "Data Center", description: "Racks comerciais e firewall pesado.", requiredPower: 1800, reward: 3200 },
  { name: "Cloud Global", description: "Ambiente mundial com proteção automatizada.", requiredPower: 3600, reward: 7000 },
  { name: "Quantum Lab", description: "Laboratório quântico experimental.", requiredPower: 7200, reward: 16000 },
  { name: "AI Consciousness Grid", description: "Rede neural autônoma de altíssimo risco.", requiredPower: 15000, reward: 40000 },
];

// ========================================
// RARIDADES
// ========================================

const rarities = {
  Comum: { name: "Comum", class: "common", color: "#8b8b8b", multiplier: 1 },
  Raro: { name: "Raro", class: "rare", color: "#3b82f6", multiplier: 1.45 },
  Gamer: { name: "Gamer", class: "gamer", color: "#a855f7", multiplier: 2.25 },
  Quântico: { name: "Quântico", class: "quantum", color: "#f59e0b", multiplier: 3.8 },
};

// ========================================
// HARDWARE DATABASE
// ========================================

const hardwareDatabase = [
  { type: "CPU", brand: "INTEL", name: "Celeron G5905", tier: 1, minLevel: 1, power: [5, 10], rarityPool: ["Comum"], image: "assets/items/celeron.png" },
  { type: "CPU", brand: "INTEL", name: "Pentium Gold G6400", tier: 1, minLevel: 1, power: [8, 15], rarityPool: ["Comum"], image: "assets/items/pentium.png" },
  { type: "CPU", brand: "AMD", name: "Athlon 3000G", tier: 1, minLevel: 1, power: [9, 16], rarityPool: ["Comum"], image: "assets/items/athlon3000g.png" },
  { type: "CPU", brand: "AMD", name: "FX-8350", tier: 2, minLevel: 2, power: [16, 28], rarityPool: ["Comum", "Raro"], image: "assets/items/fx8350.png" },
  { type: "CPU", brand: "AMD", name: "Ryzen 3 3200G", tier: 2, minLevel: 3, power: [22, 36], rarityPool: ["Comum", "Raro"], image: "assets/items/ryzen3200g.png" },
  { type: "CPU", brand: "INTEL", name: "Core i3-10100F", tier: 3, minLevel: 4, power: [32, 48], rarityPool: ["Comum", "Raro"], image: "assets/items/i310100f.png" },

  { type: "CPU", brand: "AMD", name: "Ryzen 5 3600", tier: 4, minLevel: 6, power: [52, 76], rarityPool: ["Raro"], image: "assets/items/ryzen3600.png" },
  { type: "CPU", brand: "AMD", name: "Ryzen 5 5600", tier: 5, minLevel: 8, power: [72, 105], rarityPool: ["Raro", "Gamer"], image: "assets/items/ryzen5600.png" },
  { type: "CPU", brand: "INTEL", name: "Core i5-12400F", tier: 5, minLevel: 9, power: [80, 115], rarityPool: ["Raro", "Gamer"], image: "assets/items/i512400f.png" },
  { type: "CPU", brand: "AMD", name: "Ryzen 7 5700X", tier: 6, minLevel: 12, power: [110, 155], rarityPool: ["Gamer"], image: "assets/items/ryzen5700x.png" },
  { type: "CPU", brand: "AMD", name: "Ryzen 7 5800X3D", tier: 7, minLevel: 16, power: [150, 220], rarityPool: ["Gamer"], image: "assets/items/5800x3d.png" },
  { type: "CPU", brand: "INTEL", name: "Core i7-13700K", tier: 7, minLevel: 18, power: [170, 240], rarityPool: ["Gamer"], image: "assets/items/i713700k.png" },
  { type: "CPU", brand: "AMD", name: "Ryzen 9 5900X", tier: 8, minLevel: 22, power: [230, 320], rarityPool: ["Gamer", "Quântico"], image: "assets/items/ryzen5900x.png" },
  { type: "CPU", brand: "INTEL", name: "Core i9-14900K", tier: 9, minLevel: 28, power: [330, 460], rarityPool: ["Gamer", "Quântico"], image: "assets/items/i914900k.png" },
  { type: "CPU", brand: "AMD", name: "Ryzen 9 7950X3D", tier: 10, minLevel: 35, power: [460, 650], rarityPool: ["Gamer", "Quântico"], image: "assets/items/7950x3d.png" },

  { type: "GPU", brand: "NVIDIA", name: "GeForce GT 210", tier: 1, minLevel: 1, power: [4, 9], rarityPool: ["Comum"], image: "assets/items/gt210.png" },
  { type: "GPU", brand: "NVIDIA", name: "GTX 550 Ti", tier: 1, minLevel: 1, power: [8, 16], rarityPool: ["Comum"], image: "assets/items/gtx550ti.png" },
  { type: "GPU", brand: "NVIDIA", name: "GTX 750 Ti", tier: 2, minLevel: 2, power: [16, 30], rarityPool: ["Comum", "Raro"], image: "assets/items/750ti.png" },
  { type: "GPU", brand: "AMD", name: "RX 560", tier: 2, minLevel: 3, power: [22, 38], rarityPool: ["Comum", "Raro"], image: "assets/items/rx560.png" },
  { type: "GPU", brand: "AMD", name: "RX 570", tier: 3, minLevel: 4, power: [35, 55], rarityPool: ["Raro"], image: "assets/items/rx570.png" },
  { type: "GPU", brand: "AMD", name: "RX 580", tier: 3, minLevel: 5, power: [42, 68], rarityPool: ["Raro"], image: "assets/items/rx580.png" },
  { type: "GPU", brand: "NVIDIA", name: "GTX 1060", tier: 4, minLevel: 7, power: [70, 105], rarityPool: ["Raro"], image: "assets/items/gtx1060.png" },
  { type: "GPU", brand: "NVIDIA", name: "GTX 1660 Super", tier: 5, minLevel: 9, power: [95, 140], rarityPool: ["Raro", "Gamer"], image: "assets/items/gtx1660s.png" },
  { type: "GPU", brand: "NVIDIA", name: "RTX 2060", tier: 6, minLevel: 12, power: [130, 190], rarityPool: ["Gamer"], image: "assets/items/rtx2060.png" },
  { type: "GPU", brand: "NVIDIA", name: "RTX 3060", tier: 7, minLevel: 16, power: [185, 270], rarityPool: ["Gamer"], image: "assets/items/rtx3060.png" },
  { type: "GPU", brand: "AMD", name: "RX 6700 XT", tier: 7, minLevel: 17, power: [205, 300], rarityPool: ["Gamer"], image: "assets/items/rx6700xt.png" },
  { type: "GPU", brand: "NVIDIA", name: "RTX 4070", tier: 8, minLevel: 22, power: [320, 450], rarityPool: ["Gamer", "Quântico"], image: "assets/items/rtx4070.png" },
  { type: "GPU", brand: "NVIDIA", name: "RTX 4080", tier: 9, minLevel: 30, power: [480, 680], rarityPool: ["Gamer", "Quântico"], image: "assets/items/rtx4080.png" },
  { type: "GPU", brand: "AMD", name: "RX 7900 XTX", tier: 9, minLevel: 32, power: [520, 720], rarityPool: ["Gamer", "Quântico"], image: "assets/items/rx7900xtx.png" },
  { type: "GPU", brand: "NVIDIA", name: "RTX 4090", tier: 10, minLevel: 42, power: [750, 1050], rarityPool: ["Quântico"], image: "assets/items/rtx4090.png" },

  { type: "RAM", brand: "KINGSTON", name: "ValueRAM 4GB DDR3", tier: 1, minLevel: 1, power: [4, 8], rarityPool: ["Comum"], image: "assets/items/valueram.png" },
  { type: "RAM", brand: "HYPERX", name: "HyperX Fury 8GB DDR4", tier: 2, minLevel: 2, power: [10, 20], rarityPool: ["Comum", "Raro"], image: "assets/items/hyperxfury.png" },
  { type: "RAM", brand: "KINGSTON", name: "Fury Beast 16GB DDR4", tier: 4, minLevel: 8, power: [40, 65], rarityPool: ["Raro"], image: "assets/items/furybeast.png" },
  { type: "RAM", brand: "CORSAIR", name: "Vengeance RGB Pro 16GB", tier: 5, minLevel: 12, power: [65, 100], rarityPool: ["Raro", "Gamer"], image: "assets/items/corsairrgb.png" },
  { type: "RAM", brand: "G.SKILL", name: "Trident Z RGB 32GB", tier: 7, minLevel: 20, power: [140, 210], rarityPool: ["Gamer"], image: "assets/items/tridentz.png" },
  { type: "RAM", brand: "CORSAIR", name: "Dominator Platinum RGB 32GB DDR5", tier: 9, minLevel: 35, power: [300, 440], rarityPool: ["Gamer", "Quântico"], image: "assets/items/dominator.png" },

  { type: "SSD", brand: "KINGSTON", name: "A400 240GB", tier: 1, minLevel: 1, power: [5, 10], rarityPool: ["Comum"], image: "assets/items/a400.png" },
  { type: "SSD", brand: "CRUCIAL", name: "BX500 480GB", tier: 2, minLevel: 3, power: [14, 24], rarityPool: ["Comum", "Raro"], image: "assets/items/bx500.png" },
  { type: "SSD", brand: "KINGSTON", name: "NV2 1TB", tier: 4, minLevel: 8, power: [45, 70], rarityPool: ["Raro"], image: "assets/items/nv2.png" },
  { type: "SSD", brand: "SAMSUNG", name: "970 EVO Plus 1TB", tier: 5, minLevel: 12, power: [70, 105], rarityPool: ["Raro", "Gamer"], image: "assets/items/970evo.png" },
  { type: "SSD", brand: "WD BLACK", name: "SN850X 2TB", tier: 8, minLevel: 26, power: [210, 320], rarityPool: ["Gamer"], image: "assets/items/sn850x.png" },
  { type: "SSD", brand: "SAMSUNG", name: "990 Pro 2TB", tier: 9, minLevel: 34, power: [300, 430], rarityPool: ["Gamer", "Quântico"], image: "assets/items/990pro.png" },

  { type: "Cooler", brand: "INTEL", name: "Cooler Box Intel", tier: 1, minLevel: 1, power: [4, 9], rarityPool: ["Comum"], image: "assets/items/coolerboxintel.png" },
  { type: "Cooler", brand: "AMD", name: "Wraith Stealth", tier: 1, minLevel: 2, power: [8, 15], rarityPool: ["Comum"], image: "assets/items/wraith.png" },
  { type: "Cooler", brand: "COOLER MASTER", name: "Hyper 212", tier: 3, minLevel: 6, power: [32, 52], rarityPool: ["Raro"], image: "assets/items/hyper212.png" },
  { type: "Cooler", brand: "DEEPCOOL", name: "AK400", tier: 4, minLevel: 10, power: [55, 85], rarityPool: ["Raro"], image: "assets/items/ak400.png" },
  { type: "Cooler", brand: "NOCTUA", name: "NH-D15", tier: 6, minLevel: 18, power: [130, 190], rarityPool: ["Gamer"], image: "assets/items/nhd15.png" },
  { type: "Cooler", brand: "NZXT", name: "Kraken X53", tier: 7, minLevel: 24, power: [180, 260], rarityPool: ["Gamer"], image: "assets/items/krakenx53.png" },
  { type: "Cooler", brand: "CORSAIR", name: "H150i Elite", tier: 9, minLevel: 36, power: [330, 470], rarityPool: ["Gamer", "Quântico"], image: "assets/items/h150i.png" },

  { type: "Fonte", brand: "EVGA", name: "EVGA 450W", tier: 1, minLevel: 1, power: [4, 8], rarityPool: ["Comum"], image: "assets/items/evga450.png" },
  { type: "Fonte", brand: "CORSAIR", name: "CX550", tier: 3, minLevel: 5, power: [25, 42], rarityPool: ["Comum", "Raro"], image: "assets/items/cx550.png" },
  { type: "Fonte", brand: "XPG", name: "Core Reactor 650W", tier: 5, minLevel: 14, power: [80, 125], rarityPool: ["Raro", "Gamer"], image: "assets/items/xpg650.png" },
  { type: "Fonte", brand: "CORSAIR", name: "RM850x", tier: 8, minLevel: 28, power: [240, 340], rarityPool: ["Gamer"], image: "assets/items/rm850x.png" },
  { type: "Fonte", brand: "SEASONIC", name: "Prime TX-1000", tier: 9, minLevel: 38, power: [360, 520], rarityPool: ["Gamer", "Quântico"], image: "assets/items/seasonic1000.png" },

  { type: "CPU", brand: "NEURAL", name: "Neural Core X", tier: 12, minLevel: 55, power: [1200, 1800], rarityPool: ["Quântico"], image: "assets/items/neuralcore.png" },
  { type: "GPU", brand: "QUANTUM", name: "Quantum RTX Matrix", tier: 13, minLevel: 60, power: [1500, 2300], rarityPool: ["Quântico"], image: "assets/items/quantumgpu.png" },
  { type: "RAM", brand: "SINGULARITY", name: "Infinite Memory Array", tier: 14, minLevel: 65, power: [1800, 2800], rarityPool: ["Quântico"], image: "assets/items/infiniteram.png" },
  { type: "SSD", brand: "TEMPORAL", name: "Temporal SSD Matrix", tier: 15, minLevel: 70, power: [2200, 3300], rarityPool: ["Quântico"], image: "assets/items/temporalssd.png" },
  { type: "Cooler", brand: "CRYO", name: "Absolute Zero Reactor", tier: 16, minLevel: 75, power: [2600, 3800], rarityPool: ["Quântico"], image: "assets/items/cryoreactor.png" },
  { type: "Fonte", brand: "DARK MATTER", name: "Dark Matter Reactor", tier: 17, minLevel: 80, power: [3000, 4600], rarityPool: ["Quântico"], image: "assets/items/darkmatter.png" },
];

// ========================================
// DOM
// ========================================

const $ = (id) => document.getElementById(id);

const bitsValue = $("bitsValue");
const coresValue = $("coresValue");
const pcPowerValue = $("pcPowerValue");
const dpsValue = $("dpsValue");
const cpuPower = $("cpuPower");
const gpuPower = $("gpuPower");
const heatValue = $("heatValue");

const inventoryList = $("inventoryList");
const inventorySlots = $("inventorySlots");
const mainInventoryHud = $("mainInventoryHud");
const mainInventoryHudText = $("mainInventoryHudText");

const gameLog = $("gameLog");

const hackBtn = $("hackBtn");
const mineBtn = $("mineBtn");
const autoHackBtn = $("autoHackBtn");

const hackName = $("hackName");
const hackDescription = $("hackDescription");
const targetLevel = $("targetLevel");
const setupPowerText = $("setupPowerText");
const enemyStatus = $("enemyStatus");

const hackProgressBar = $("hackProgressBar");
const hackProgressText = $("hackProgressText");

const idleGainText = $("idleGainText");
const autoHackStatus = $("autoHackStatus");

const thermalStatus = $("thermalStatus");
const thermalEfficiency = $("thermalEfficiency");

const dataStream = $("dataStream");
const enemyServer = $("enemyServer");
const battlePcTower = $("battlePcTower");
const roomPcCase = $("roomPcCase");
const gamerRoom = $("gamerRoom");
const setupTierBadge = $("setupTierBadge");

const rareDropModal = $("rareDropModal");
const rareModalCard = $("rareModalCard");
const rareDropKicker = $("rareDropKicker");
const rareDropTitle = $("rareDropTitle");
const rareDropSubtitle = $("rareDropSubtitle");
const rareDropPreview = $("rareDropPreview");
const collectRareDropBtn = $("collectRareDropBtn");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const inventoryFilters = document.querySelectorAll(".inventory-filter");

const attributesList = $("attributesList");
const rollAttributeBtn = $("rollAttributeBtn");
const attributeOfferBox = $("attributeOffer");
const newAttributeText = $("newAttributeText");
const applyAttributeBtn = $("applyAttributeBtn");
const keepAttributeBtn = $("keepAttributeBtn");
const attributeRollLevelText = $("attributeRollLevel");
const attributeCostText = $("attributeCost");

const upgradeCpuBtn = $("upgradeCpuBtn");
const upgradeGpuBtn = $("upgradeGpuBtn");
const upgradeCoolingBtn = $("upgradeCoolingBtn");
const premiumBoostBtn = $("premiumBoostBtn");
const cpuUpgradeCost = $("cpuUpgradeCost");
const gpuUpgradeCost = $("gpuUpgradeCost");
const coolingUpgradeCost = $("coolingUpgradeCost");

// ========================================
// TABS / FILTROS
// ========================================

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    $(`tab-${tab}`).classList.add("active");
  });
});

inventoryFilters.forEach((button) => {
  button.addEventListener("click", () => {
    inventoryFilters.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");
    selectedFilter = button.dataset.filter;

    renderInventory();
  });
});

// ========================================
// CÁLCULOS
// ========================================

function getTotalPower() {
  return Math.floor(cpuGlobal + gpuGlobal + ramGlobal + coolingGlobal);
}

function getComputerLevel() {
  return Math.max(1, Math.floor(getTotalPower() / 100) + 1);
}

function getRgbCount() {
  return Object.values(equipped).filter((item) => item && item.rgb).length;
}

function getRgbMultiplier() {
  return 1 + getRgbCount() * 0.04;
}

function getThermalEfficiency() {
  if (heat < 70) return 1;
  if (heat < 85) return 0.75;
  if (heat < 100) return 0.45;
  return 0.15;
}

function getDps() {
  const base = gpuGlobal * 0.6 + cpuGlobal * 0.3 + ramGlobal * 0.12 + attributes.overclock * 0.5;
  return Math.max(1, Math.floor(base * getThermalEfficiency() * getRgbMultiplier()));
}

function getUpgradeCost(stat) {
  if (stat === "cpu") return Math.floor(cpuGlobal * 22 + getComputerLevel() * 15);
  if (stat === "gpu") return Math.floor(gpuGlobal * 25 + getComputerLevel() * 18);
  if (stat === "cooling") return Math.floor(coolingGlobal * 20 + getComputerLevel() * 12);
  return 25;
}

function getAvailableHardware() {
  const level = getComputerLevel();
  return hardwareDatabase.filter((item) => item.minLevel <= level);
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
    if (item && item.type === type) total += item.power;
  });

  return total;
}

// ========================================
// UI
// ========================================

function updateUI() {
  checkHackProgression();

  const currentHack = hacks[currentHackIndex];

  bitsValue.innerText = formatNumber(bits);
  coresValue.innerText = formatNumber(cores);

  pcPowerValue.innerText = `${formatNumber(getTotalPower())} / NV ${getComputerLevel()}`;
  dpsValue.innerText = formatNumber(getDps());

  cpuPower.innerText = formatNumber(cpuGlobal);
  gpuPower.innerText = formatNumber(gpuGlobal);
  heatValue.innerText = `${Math.floor(heat)}°C`;

  hackName.innerText = currentHack.name;
  hackDescription.innerText = currentHack.description;
  targetLevel.innerText = `Nível ${currentHackIndex + 1}`;
  setupPowerText.innerText = `Power ${formatNumber(getTotalPower())}`;

  enemyStatus.innerText = autoHackEnabled ? "Sob Ataque" : "Vulnerável";

  hackProgressBar.style.width = `${Math.min(hackProgress, 100)}%`;
  hackProgressText.innerText = `${Math.floor(hackProgress)}%`;

  autoHackStatus.innerText = autoHackEnabled ? "ON" : "OFF";
  autoHackBtn.innerText = autoHackEnabled ? "Auto Hack: ON" : "Auto Hack: OFF";
  idleGainText.innerText = `${formatNumber(getDps())} Bits/s`;

  inventorySlots.innerText = `${inventory.length}/${inventoryLimit}`;
  mainInventoryHudText.innerText = `${inventory.length}/${inventoryLimit}`;

  updateInventoryHud();
  updateThermalUI();
  updateSetupVisual();

  if (cpuUpgradeCost) cpuUpgradeCost.innerText = `${formatNumber(getUpgradeCost("cpu"))} Bits`;
  if (gpuUpgradeCost) gpuUpgradeCost.innerText = `${formatNumber(getUpgradeCost("gpu"))} Bits`;
  if (coolingUpgradeCost) coolingUpgradeCost.innerText = `${formatNumber(getUpgradeCost("cooling"))} Bits`;

  if (attributeRollLevelText) attributeRollLevelText.innerText = attributeRollLevel;
  if (attributeCostText) attributeCostText.innerText = `Custo: ${formatNumber(attributeRollCost)} Bits`;

  renderInventory();
  renderAttributes();
  renderSetup();
}

function updateInventoryHud() {
  const ratio = inventory.length / inventoryLimit;

  mainInventoryHud.classList.remove("warning", "full");

  if (ratio >= 1) {
    mainInventoryHud.classList.add("full");
  } else if (ratio >= 0.75) {
    mainInventoryHud.classList.add("warning");
  }
}

function updateThermalUI() {
  const efficiency = Math.floor(getThermalEfficiency() * 100);
  thermalEfficiency.innerText = `${efficiency}%`;

  if (heat < 70) {
    thermalStatus.innerText = "Estável";
  } else if (heat < 85) {
    thermalStatus.innerText = "Quente";
  } else if (heat < 100) {
    thermalStatus.innerText = "Throttling";
  } else {
    thermalStatus.innerText = "Superaquecido";
  }
}

function updateSetupVisual() {
  const level = getComputerLevel();
  const rgbActive = getRgbCount() > 0;

  gamerRoom.classList.remove("mid", "late", "quantum", "rgb-active");
  battlePcTower.classList.remove("rgb-active");
  roomPcCase.classList.remove("rgb-active");

  if (level >= 10) gamerRoom.classList.add("mid");
  if (level >= 25) gamerRoom.classList.add("late");
  if (level >= 55) gamerRoom.classList.add("quantum");

  if (rgbActive) {
    gamerRoom.classList.add("rgb-active");
    battlePcTower.classList.add("rgb-active");
    roomPcCase.classList.add("rgb-active");
  }

  if (level < 10) setupTierBadge.innerText = "Starter Setup";
  else if (level < 25) setupTierBadge.innerText = "Gamer Setup";
  else if (level < 55) setupTierBadge.innerText = "Cyberpunk Setup";
  else setupTierBadge.innerText = "Quantum Lab";
}

function formatNumber(value) {
  const number = Math.floor(value);

  if (number >= 1000000000) return `${(number / 1000000000).toFixed(1)}B`;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;

  return number;
}

// ========================================
// LOG / ANIMAÇÃO
// ========================================

function addLog(text) {
  const line = document.createElement("div");
  line.classList.add("log-message");
  line.innerText = text;

  gameLog.appendChild(line);
  gameLog.scrollTop = gameLog.scrollHeight;

  while (gameLog.children.length > 60) {
    gameLog.removeChild(gameLog.firstChild);
  }
}

function playHackAnimation() {
  if (dataStream) dataStream.classList.add("attack");
  if (enemyServer) enemyServer.classList.add("hit");

  setTimeout(() => {
    if (dataStream) dataStream.classList.remove("attack");
    if (enemyServer) enemyServer.classList.remove("hit");
  }, 300);
}

// ========================================
// BOTÕES
// ========================================

mineBtn.addEventListener("click", () => {
  const gain = (1 + cpuGlobal * 0.7) * getThermalEfficiency();

  bits += gain;
  heat += Math.max(0.5, 2 - attributes.thermalPaste * 0.1);

  addLog(`+${formatNumber(gain)} Bits minerados`);

  updateUI();
  saveGame();
});

hackBtn.addEventListener("click", () => {
  runHack(false);
});

autoHackBtn.addEventListener("click", () => {
  autoHackEnabled = !autoHackEnabled;
  addLog(autoHackEnabled ? "Auto Hack ativado." : "Auto Hack desativado.");

  updateUI();
  saveGame();
});

// ========================================
// HACK
// ========================================

function runHack(isAuto) {
  if (heat >= 100) {
    addLog("PC superaquecido! Aguarde resfriar.");
    updateUI();
    return;
  }

  const gain = (5 + gpuGlobal + currentHackIndex * 3) * getThermalEfficiency();

  bits += gain;
  hackProgress += 4 + getDps() * 0.22;
  heat += isAuto ? 1.2 : 5;

  playHackAnimation();

  if (!isAuto) {
    addLog(`Hack executado: +${formatNumber(gain)} Bits`);
  }

  const dropChance = isAuto ? 0.035 + attributes.dropRate * 0.002 : 0.16 + attributes.dropRate * 0.01;

  if (Math.random() < dropChance) {
    generateDrop();
  }

  if (hackProgress >= 100) {
    completeHack();
  }

  updateUI();
  saveGame();
}

function completeHack() {
  hackProgress = 0;

  const currentHack = hacks[currentHackIndex];
  const reward = currentHack.reward + getTotalPower() * 0.15;

  bits += reward;

  const coreChance = 0.03 + currentHackIndex * 0.01;

  if (Math.random() < coreChance) {
    cores++;
    addLog("+1 Quantum Core encontrado!");
  }

  addLog(`Hack concluído: ${currentHack.name}`);
  addLog(`+${formatNumber(reward)} Bits`);

  generateDrop();
}

// ========================================
// LOOPS
// ========================================

setInterval(() => {
  if (autoHackEnabled) {
    bits += getDps();
    hackProgress += getDps() * 0.25;
    heat += Math.max(0.4, 1 - attributes.thermalPaste * 0.08);

    playHackAnimation();

    if (Math.random() < 0.025 + attributes.dropRate * 0.002) {
      generateDrop();
    }

    if (hackProgress >= 100) {
      completeHack();
    }
  }

  heat -= 1 + coolingGlobal * 0.18 + attributes.fanSpeed * 0.25;

  if (heat < 0) heat = 0;
  if (heat > 115) heat = 115;

  updateUI();
}, 1000);

setInterval(saveGame, 5000);

// ========================================
// DROPS
// ========================================

function generateDrop() {
  if (inventory.length >= inventoryLimit) {
    const converted = 100 + getComputerLevel() * 10;
    bits += converted;

    addLog("Inventário cheio! Drop desmontado automaticamente.");
    addLog(`+${formatNumber(converted)} Bits`);

    return;
  }

  const availableItems = getAvailableHardware();
  const baseItem = availableItems[Math.floor(Math.random() * availableItems.length)];

  const rarityName = rollRarity(baseItem);
  const rarity = rarities[rarityName];

  const rawPower = Math.random() * (baseItem.power[1] - baseItem.power[0]) + baseItem.power[0];

  let power = Math.floor(rawPower * rarity.multiplier);
  let modifier = "";

  const rollQuality = Math.random();

  if (rollQuality > 0.92) {
    power = Math.floor(power * 1.18);
    modifier = "OC";
  }

  if (rollQuality > 0.985) {
    power = Math.floor(power * 1.35);
    modifier = "PERFECT";
  }

  const rgb = Math.random() < getRgbChance(rarityName);

  if (rgb) {
    power = Math.floor(power * 1.12);
  }

  const item = {
    type: baseItem.type,
    brand: baseItem.brand,
    name: modifier ? `${baseItem.name} ${modifier}` : baseItem.name,
    tier: baseItem.tier,
    minLevel: baseItem.minLevel,
    power,
    image: baseItem.image,
    rarity,
    rgb,
    id: Date.now() + Math.random(),
  };

  inventory.push(item);

  addLog(`${item.name} ${item.rgb ? "RGB " : ""}${item.rarity.name} dropado`);

  if (item.rarity.name === "Gamer" || item.rarity.name === "Quântico") {
    openRareDropModal(item);
  }

  updateUI();
  saveGame();
}

function rollRarity(baseItem) {
  const level = getComputerLevel();
  const pool = baseItem.rarityPool;

  let chances = { Comum: 0.8, Raro: 0.18, Gamer: 0.02, Quântico: 0 };

  if (level >= 8) chances = { Comum: 0.55, Raro: 0.35, Gamer: 0.1, Quântico: 0 };
  if (level >= 18) chances = { Comum: 0.32, Raro: 0.43, Gamer: 0.23, Quântico: 0.02 };
  if (level >= 35) chances = { Comum: 0.15, Raro: 0.35, Gamer: 0.42, Quântico: 0.08 };
  if (level >= 55) chances = { Comum: 0.05, Raro: 0.25, Gamer: 0.45, Quântico: 0.25 };

  const allowed = pool.filter((name) => rarities[name]);
  let total = 0;

  allowed.forEach((name) => {
    total += chances[name] || 0;
  });

  if (total <= 0) return allowed[0] || "Comum";

  let roll = Math.random() * total;

  for (const name of allowed) {
    roll -= chances[name] || 0;

    if (roll <= 0) return name;
  }

  return allowed[0] || "Comum";
}

function getRgbChance(rarityName) {
  const level = getComputerLevel();

  let chance = 0.02 + level * 0.002 + attributes.rgbEfficiency * 0.01;

  if (rarityName === "Raro") chance += 0.03;
  if (rarityName === "Gamer") chance += 0.08;
  if (rarityName === "Quântico") chance += 0.18;

  return Math.min(chance, 0.45);
}

// ========================================
// MODAL RARO / QUÂNTICO
// ========================================

function openRareDropModal(item) {
  pendingRareDrop = item;

  rareDropModal.classList.remove("hidden");
  rareModalCard.classList.toggle("quantum", item.rarity.name === "Quântico");

  rareDropKicker.innerText = item.rarity.name === "Quântico" ? "QUANTUM BREACH" : "ACCESS GRANTED";
  rareDropTitle.innerText = `${item.rarity.name} DROP`;
  rareDropSubtitle.innerText = `${item.brand} ${item.name}${item.rgb ? " RGB" : ""}`;

  rareDropPreview.innerHTML = `
    <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none';">
    <h3 style="color:${item.rarity.color};">${item.name}</h3>
    <p>${item.type} • Tier ${item.tier}</p>
    <p>Power: ${item.power}</p>
    ${item.rgb ? "<p style='color:#70ffb2;'>RGB ENABLED</p>" : ""}
  `;
}

collectRareDropBtn.addEventListener("click", () => {
  pendingRareDrop = null;
  rareDropModal.classList.add("hidden");
});

// ========================================
// INVENTÁRIO
// ========================================

function renderInventory() {
  inventoryList.innerHTML = "";

  let filteredItems = inventory;

  if (selectedFilter !== "ALL") {
    filteredItems = inventory.filter((item) => item.type === selectedFilter);
  }

  if (filteredItems.length === 0) {
    inventoryList.innerHTML = `<p>Nenhum item encontrado.</p>`;
    return;
  }

  filteredItems.forEach((item) => {
    const div = document.createElement("div");
    div.className = `inventory-item ${item.rarity.class}`;

    div.innerHTML = `
      <div class="item-rarity-tag">
        ${item.rarity.name}${item.rgb ? " RGB" : ""}
      </div>

      <div class="item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=&quot;font-size:54px&quot;>🧩</div>';">
      </div>

      <div class="item-brand">${item.brand}</div>
      <div class="item-name">${item.name}</div>

      <div class="item-stats">
        <div class="item-stat">
          <span>POWER</span>
          <strong>${item.power}</strong>
        </div>

        <div class="item-stat">
          <span>TYPE</span>
          <strong>${item.type}</strong>
        </div>

        <div class="item-stat">
          <span>TIER</span>
          <strong>${item.tier}</strong>
        </div>

        <div class="item-stat">
          <span>REQ NV</span>
          <strong>${item.minLevel}</strong>
        </div>
      </div>

      ${item.rgb ? `<div class="item-rgb">RGB ENABLED</div>` : ""}

      <div class="inventory-actions">
        <button class="primary-btn equip-btn" data-id="${item.id}">
          Equipar
        </button>

        <button class="danger-btn scrap-btn" data-id="${item.id}">
          Desmontar
        </button>
      </div>
    `;

    inventoryList.appendChild(div);
  });
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("equip-btn")) {
    const id = Number(event.target.dataset.id);
    const index = inventory.findIndex((item) => item.id === id);

    if (index === -1) return;

    const item = inventory[index];

    equipItem(item);
    inventory.splice(index, 1);

    addLog(`${item.name} equipado`);

    updateUI();
    saveGame();
  }

  if (event.target.classList.contains("scrap-btn")) {
    const id = Number(event.target.dataset.id);
    const index = inventory.findIndex((item) => item.id === id);

    if (index === -1) return;

    const item = inventory[index];
    const gain = item.power * 3;

    bits += gain;
    inventory.splice(index, 1);

    addLog(`${item.name} desmontado`);
    addLog(`+${formatNumber(gain)} Bits`);

    updateUI();
    saveGame();
  }
});

// ========================================
// EQUIPAR ITEM
// ========================================

function equipItem(item) {
  const type = item.type.toLowerCase();

  if (type === "cpu") {
    if (equipped.cpu) cpuGlobal -= equipped.cpu.power;
    equipped.cpu = item;
    cpuGlobal += item.power;
  }

  if (type === "gpu") {
    if (equipped.gpu) gpuGlobal -= equipped.gpu.power;
    equipped.gpu = item;
    gpuGlobal += item.power;
  }

  if (type === "ram") {
    equipRam(item);
  }

  if (type === "cooler") {
    if (equipped.cooler) coolingGlobal -= equipped.cooler.power;
    equipped.cooler = item;
    coolingGlobal += item.power;
  }

  if (type === "ssd") {
    if (equipped.ssd) {
      inventoryLimit -= equipped.ssd.extraSlots || 5;
    }

    item.extraSlots = 5 + Math.floor(item.tier / 2);
    equipped.ssd = item;
    inventoryLimit += item.extraSlots;
  }

  if (type === "fonte") {
    equipped.fonte = item;
  }

  if (item.rgb) {
    const bonus = Math.floor(item.power * 0.25);
    bits += bonus;
    addLog(`Bônus RGB: +${formatNumber(bonus)} Bits`);
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

// ========================================
// SETUP
// ========================================

function renderSetup() {
  setSlotText("slotCPU", equipped.cpu);
  setSlotText("slotGPU", equipped.gpu);
  setSlotText("slotRAM1", equipped.ram1);
  setSlotText("slotCooler", equipped.cooler);
  setSlotText("slotSSD", equipped.ssd);
}

function setSlotText(id, item) {
  const el = $(id);

  if (!el) return;

  el.innerText = item
    ? `${item.name}${item.rgb ? " RGB" : ""} (${item.power})`
    : "Vazio";
}

// ========================================
// ATRIBUTOS
// ========================================

function renderAttributes() {
  if (!attributesList) return;

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
    overclock: "Aumenta progressão de hack.",
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
  saveGame();
});

applyAttributeBtn.addEventListener("click", () => {
  if (!attributeOffer) return;

  attributes[attributeOffer.key] += attributeOffer.gain;
  attributeRollLevel++;

  addLog(`${formatAttribute(attributeOffer.key)} melhorado`);

  attributeOffer = null;
  attributeOfferBox.classList.add("hidden");

  updateUI();
  saveGame();
});

keepAttributeBtn.addEventListener("click", () => {
  attributeOffer = null;
  attributeOfferBox.classList.add("hidden");

  addLog("Atributo descartado");

  updateUI();
  saveGame();
});

// ========================================
// UPGRADES
// ========================================

upgradeCpuBtn.addEventListener("click", () => buyUpgrade("cpu"));
upgradeGpuBtn.addEventListener("click", () => buyUpgrade("gpu"));
upgradeCoolingBtn.addEventListener("click", () => buyUpgrade("cooling"));

premiumBoostBtn.addEventListener("click", () => {
  if (cores < 1) {
    addLog("Você precisa de 1 Quantum Core.");
    return;
  }

  cores--;
  cpuGlobal += 50;
  gpuGlobal += 50;
  coolingGlobal += 50;

  addLog("Quantum Boost ativado: +50 CPU/GPU/Cooling");

  updateUI();
  saveGame();
});

function buyUpgrade(stat) {
  const cost = getUpgradeCost(stat);

  if (bits < cost) {
    addLog("Bits insuficientes.");
    return;
  }

  bits -= cost;

  if (stat === "cpu") {
    cpuGlobal++;
    addLog("CPU melhorada.");
  }

  if (stat === "gpu") {
    gpuGlobal++;
    addLog("GPU melhorada.");
  }

  if (stat === "cooling") {
    coolingGlobal++;
    addLog("Cooling melhorado.");
  }

  updateUI();
  saveGame();
}

// ========================================
// SAVE / LOAD
// ========================================

function saveGame() {
  const save = {
    bits,
    cores,
    heat,
    hackProgress,
    inventoryLimit,
    autoHackEnabled,
    currentHackIndex,
    selectedFilter,
    cpuGlobal,
    gpuGlobal,
    ramGlobal,
    coolingGlobal,
    attributeRollLevel,
    attributeRollCost,
    attributes,
    inventory,
    equipped,
    savedAt: Date.now(),
  };

  localStorage.setItem("hardwareIdleSave", JSON.stringify(save));
}

function loadGame() {
  const raw = localStorage.getItem("hardwareIdleSave");

  if (!raw) return;

  try {
    const save = JSON.parse(raw);

    bits = save.bits ?? bits;
    cores = save.cores ?? cores;
    heat = save.heat ?? heat;
    hackProgress = save.hackProgress ?? hackProgress;
    inventoryLimit = save.inventoryLimit ?? inventoryLimit;
    autoHackEnabled = save.autoHackEnabled ?? autoHackEnabled;
    currentHackIndex = save.currentHackIndex ?? currentHackIndex;
    selectedFilter = save.selectedFilter ?? selectedFilter;

    cpuGlobal = save.cpuGlobal ?? cpuGlobal;
    gpuGlobal = save.gpuGlobal ?? gpuGlobal;
    ramGlobal = save.ramGlobal ?? ramGlobal;
    coolingGlobal = save.coolingGlobal ?? coolingGlobal;

    attributeRollLevel = save.attributeRollLevel ?? attributeRollLevel;
    attributeRollCost = save.attributeRollCost ?? attributeRollCost;

    Object.assign(attributes, save.attributes || {});
    inventory.splice(0, inventory.length, ...(save.inventory || []));
    Object.assign(equipped, save.equipped || {});

    applyOfflineProgress(save.savedAt);

    addLog("Save carregado.");
  } catch (error) {
    console.error(error);
    addLog("Erro ao carregar save.");
  }
}

function applyOfflineProgress(savedAt) {
  if (!savedAt) return;

  const seconds = Math.min(Math.floor((Date.now() - savedAt) / 1000), 60 * 60 * 4);

  if (seconds < 10) return;

  const gain = getDps() * seconds * 0.25;

  bits += gain;

  addLog(`Retorno offline: +${formatNumber(gain)} Bits`);
}

// ========================================
// START
// ========================================

loadGame();
updateUI();
addLog("Sistema Hardware Idle iniciado.");
