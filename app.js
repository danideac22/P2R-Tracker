const floors = [
  { id: "P2", start: 201, end: 216 },
  { id: "P3", start: 301, end: 316 },
  { id: "P4", start: 401, end: 416 },
];

const stationPriority = [5, 6, 7, 8, 3, 4, 9, 10, 1, 2, 11, 12, 13, 14, 15, 16];
const leaveTimes = buildLeaveTimes();

const samplePeople = [
  { login: "aadam", name: "Adam", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P2", station: 204, role: "pick" },
  { login: "gursharan", name: "Gursharan", pick: false, pack: false, restriction: "Any", leave: "01:30", floor: "P2", station: 204, role: "pack1" },
  { login: "anthony", name: "Anthony", pick: false, pack: false, restriction: "P2", leave: "02:30", floor: "P2", station: 205, role: "pick" },
  { login: "somesh", name: "Somesh", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P2", station: 205, role: "pack1" },
  { login: "juviera", name: "Juviera", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P2", station: 206, role: "pick" },
  { login: "dimitra", name: "Dimitra", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P2", station: 206, role: "pack1" },
  { login: "mihai", name: "Mihai", pick: false, pack: false, restriction: "Any", leave: "01:30", floor: "P2", station: 207, role: "pick" },
  { login: "suresh", name: "Suresh", pick: false, pack: false, restriction: "Any", leave: "02:30", floor: "P2", station: 207, role: "pack1" },
  { login: "john", name: "John", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P2", station: 208, role: "pick" },
  { login: "blessing", name: "Blessing", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P2", station: 208, role: "pack1" },
  { login: "mohamed", name: "Mohamed", pick: false, pack: false, restriction: "Any", leave: "01:30", floor: "P3", station: 304, role: "pick" },
  { login: "alice", name: "Alice", pick: false, pack: false, restriction: "Any", leave: "02:30", floor: "P3", station: 304, role: "pack1" },
  { login: "ahmed", name: "Ahmed", pick: false, pack: false, restriction: "P3", leave: "full", floor: "P3", station: 305, role: "pick" },
  { login: "samson", name: "Samson", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P3", station: 305, role: "pack1" },
  { login: "bobby", name: "Bobby", pick: false, pack: false, restriction: "Any", leave: "02:30", floor: "P3", station: 306, role: "pick" },
  { login: "dokechuc", name: "Dokechuc", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P3", station: 306, role: "pack1" },
  { login: "wiktor", name: "Wiktor", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P3", station: 307, role: "pick" },
  { login: "liam", name: "Liam", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P3", station: 307, role: "pack1" },
  { login: "mani", name: "Mani", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P3", station: 308, role: "pack1" },
  { login: "lewis", name: "Lewis", pick: false, pack: false, restriction: "Any", leave: "01:30", floor: "P4", station: 404, role: "pick" },
  { login: "finn", name: "Finn", pick: false, pack: false, restriction: "Any", leave: "02:30", floor: "P4", station: 404, role: "pack1" },
  { login: "martin", name: "Martin", pick: false, pack: false, restriction: "P4", leave: "full", floor: "P4", station: 405, role: "pick" },
  { login: "adek", name: "Adek", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P4", station: 405, role: "pack1" },
  { login: "steward", name: "Steward", pick: false, pack: false, restriction: "Any", leave: "02:30", floor: "P4", station: 406, role: "pick" },
  { login: "busayo", name: "Busayo", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P4", station: 406, role: "pack1" },
  { login: "mathew", name: "Mathew", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P4", station: 407, role: "pick" },
  { login: "aasritha", name: "Aasritha", pick: false, pack: false, restriction: "Any", leave: "full", floor: "P4", station: 407, role: "pack1" },
];

let people = loadPeople();
let rates = loadRates();
let criticalRoles = loadCriticalRoles();
let draggedLogin = null;
let futurePeople = null;
let showRates = false;

// Highlight mode state
let activeHighlightMode = null; // "vto" | "lnd" | "highlighted" | null
let highlights = loadHighlights(); // { vto: [], lnd: [], highlighted: [], trainees: [] }

const board = document.querySelector("#floorBoard");
const futureBoard = document.querySelector("#futureBoard");
const peopleTable = document.querySelector("#peopleTable");
const ratioSelect = document.querySelector("#ratioSelect");
const snapshotSelect = document.querySelector("#snapshotSelect");
const planTime = document.querySelector("#planTime");
const planRatio = document.querySelector("#planRatio");
const addPeopleDialog = document.querySelector("#addPeopleDialog");
const bulkPeopleInput = document.querySelector("#bulkPeopleInput");
const pickRatesInput = document.querySelector("#pickRatesInput");
const packRatesInput = document.querySelector("#packRatesInput");
const toggleRatesBtn = document.querySelector("#toggleRatesBtn");
const criticalRolesEl = document.querySelector("#criticalRoles");
const earlyLeaversSummary = document.querySelector("#earlyLeaversSummary");

function buildLeaveTimes() {
  const times = [];
  let minutes = 21 * 60;
  const end = 28 * 60 + 30;
  while (minutes <= end) {
    const displayHour = Math.floor(minutes / 60) % 24;
    const displayMinutes = minutes % 60;
    times.push(`${String(displayHour).padStart(2, "0")}:${String(displayMinutes).padStart(2, "0")}`);
    minutes += 30;
  }
  return times;
}

function loadPeople() {
  const stored = localStorage.getItem("hc-planner-people");
  const loaded = stored ? JSON.parse(stored) : structuredClone(samplePeople);
  return loaded.map((person) => ({
    name: "",
    manager: "",
    pick: false,
    pack: false,
    stow: false,
    decant: false,
    arsaw: false,
    vendors: false,
    restriction: "Any",
    leave: "full",
    floor: "",
    station: "",
    role: "offplan",
    ...person,
  }));
}

function savePeople() {
  localStorage.setItem("hc-planner-people", JSON.stringify(people));
  FireSync.savePeople(people);
}

function loadRates() {
  const stored = localStorage.getItem("hc-planner-rates");
  return stored ? JSON.parse(stored) : { pick: {}, pack: {} };
}

function saveRates() {
  localStorage.setItem("hc-planner-rates", JSON.stringify(rates));
  FireSync.saveRates(rates);
}

function loadCriticalRoles() {
  const stored = localStorage.getItem("hc-planner-critical-roles");
  const fallback = Object.fromEntries(
    floors.map((floor) => [
      floor.id,
      {
        fp: ["", "", "", "", "", "", ""],
        ps: ["", "", "", "", "", "", ""],
        pg: ["", "", "", "", "", "", ""],
        other: ["", "", "", "", "", "", ""],
      },
    ])
  );
  const loaded = stored ? JSON.parse(stored) : fallback;
  if (!loaded.P2) return fallback;
  floors.forEach((floor) => {
    loaded[floor.id] = {
      fp: ["", "", "", "", "", "", ""],
      ps: ["", "", "", "", "", "", ""],
      pg: ["", "", "", "", "", "", ""],
      other: ["", "", "", "", "", "", ""],
      ...(loaded[floor.id] || {}),
    };
  });
  return loaded;
}

function saveCriticalRoles() {
  localStorage.setItem("hc-planner-critical-roles", JSON.stringify(criticalRoles));
  FireSync.saveCriticalRoles(criticalRoles);
}

function loadHighlights() {
  const stored = localStorage.getItem("hc-planner-highlights");
  const data = stored ? JSON.parse(stored) : { vto: [], lnd: [], highlighted: [], trainees: [] };
  if (!data.trainees) data.trainees = [];
  return data;
}

function saveHighlights() {
  localStorage.setItem("hc-planner-highlights", JSON.stringify(highlights));
  FireSync.saveHighlights(highlights);
}

function roleGroup(role) {
  if (role === "pick") return "pick";
  if (role === "waterspider") return "waterspider";
  return "pack";
}

function roleLabel(role) {
  if (role === "waterspider") return "waterspider";
  return roleGroup(role);
}

function timeRank(value) {
  if (value === "full") return Infinity;
  if (value === "absent") return -Infinity;
  if (!value || value === "18:30") return 18 * 60 + 30;
  const [hourText, minuteText] = value.split(":");
  let hour = Number(hourText);
  const minute = Number(minuteText);
  if (hour < 18) hour += 24;
  return hour * 60 + minute;
}

function isAvailable(person, snapshot) {
  if (person.leave === "absent") return false;
  if (person.leave === "full") return true;
  return timeRank(person.leave) > timeRank(snapshot);
}

function isStaffedOnBoard(person) {
  return floors.some((floor) => floor.id === person.floor) && Number(person.station) > 0 && person.role !== "offplan";
}

function render() {
  if (typeof pushUndo === "function") pushUndo();
  renderBoard(board, people, { editable: true, boardName: "live" });
  renderCriticalRoles();
  renderEarlyLeaversSummary();
  renderPeopleTable();
  renderRatesInputs();
  renderForecast();
  savePeople();
  saveCriticalRoles();
}

function renderOnly() {
  renderBoard(board, people, { editable: true, boardName: "live" });
  renderCriticalRoles();
  renderEarlyLeaversSummary();
  renderPeopleTable();
  renderRatesInputs();
  renderForecast();
}

function invalidateFuturePlan() {
  futurePeople = null;
}

function renderBoard(target, sourcePeople, options = {}) {
  target.innerHTML = "";
  floors.forEach((floor) => {
    const summary = summarizeFloor(floor.id, snapshotSelect.value, sourcePeople);
    const floorEl = document.createElement("section");
    floorEl.className = "floor";
    floorEl.dataset.floor = floor.id;
    floorEl.innerHTML = `
      <div class="floor-title">
        <strong>${floor.id}</strong>
        <span class="hc-pill">Pick/Pack (${summary.pick}/${summary.pack})</span>
        <span class="floor-range">${floor.start}-${floor.end}</span>
        ${options.editable ? `<button class="floor-reset" data-floor="${floor.id}">Reset ${floor.id}</button>` : ""}
      </div>
      <div class="station-grid">
        <div class="grid-head">Station</div>
        <div class="grid-head">Pick</div>
        <div class="grid-head">Pack 1</div>
        <div class="grid-head">Pack 2</div>
        <div class="grid-head">Waterspider</div>
      </div>
    `;
    const grid = floorEl.querySelector(".station-grid");
    const resetButton = floorEl.querySelector(".floor-reset");
    if (resetButton) resetButton.addEventListener("click", () => resetFloor(floor.id));

    for (let station = floor.start; station <= floor.end; station += 1) {
      grid.appendChild(cell("station", station));
      ["pick", "pack1", "pack2", "waterspider"].forEach((role) => {
        const slot = cell("slot", "");
        slot.dataset.floor = floor.id;
        slot.dataset.station = station;
        slot.dataset.role = role;
        if (options.editable) {
          slot.addEventListener("dragover", onDragOver);
          slot.addEventListener("dragleave", () => slot.classList.remove("is-over"));
          slot.addEventListener("drop", onDrop);
          slot.addEventListener("dblclick", () => editSlot(slot));
        }
        const assigned = sourcePeople.find((person) => person.floor === floor.id && person.station === station && person.role === role);
        if (assigned) {
          const snapshot = snapshotSelect.value;
          const hidden = !isAvailable(assigned, snapshot);
          slot.appendChild(createTile(assigned, options.editable, hidden));
        }
        grid.appendChild(slot);
      });
    }

    target.appendChild(floorEl);
  });
}

function cell(className, text) {
  const el = document.createElement("div");
  el.className = className;
  el.textContent = text;
  return el;
}

function createTile(person, editable, hidden = false) {
  const tile = document.querySelector("#tileTemplate").content.firstElementChild.cloneNode(true);
  const leaveSelect = tile.querySelector(".leave-select");
  tile.dataset.login = person.login;
  tile.classList.add(leaveClass(person.leave));
  tile.draggable = editable;
  if (hidden) tile.classList.add("tile-hidden");

  // Apply highlight classes
  if (highlights.vto.includes(person.login)) tile.classList.add("hl-vto");
  if (highlights.lnd.includes(person.login)) tile.classList.add("hl-lnd");
  if (highlights.highlighted.includes(person.login)) tile.classList.add("hl-highlighted");
  if (highlights.trainees.includes(person.login)) tile.classList.add("hl-trainees");
  // Training filter highlight
  if (typeof activeTrainingFilter !== "undefined" && activeTrainingFilter && person[activeTrainingFilter]) {
    tile.classList.add("hl-training");
  }

  const rate = getRateForRole(person);
  tile.querySelector(".login").textContent = person.login;
  tile.querySelector(".meta").textContent = `${roleLabel(person.role)} - ${person.leave === "full" ? "full shift" : person.leave}`;
  tile.querySelector(".meta").insertAdjacentHTML("afterend", `<span class="rate">${rate ? `${rate}/h` : "no rate"}</span>`);
  hydrateLeaveOptions(leaveSelect, person.leave);

  if (!editable) {
    tile.querySelector(".tile-menu").remove();
    leaveSelect.remove();
    return tile;
  }

  tile.addEventListener("dragstart", () => {
    draggedLogin = person.login;
  });
  // Highlight mode click handler
  tile.addEventListener("click", (event) => {
    if (!activeHighlightMode) return;
    event.stopPropagation();
    const login = person.login;
    const list = highlights[activeHighlightMode];
    const idx = list.indexOf(login);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(login);
    }
    saveHighlights();
    renderOnly();
  });
  tile.querySelector(".tile-menu").addEventListener("click", (event) => {
    event.stopPropagation();
    tile.classList.add("menu-open");
    leaveSelect.focus();
  });
  leaveSelect.addEventListener("change", (event) => {
    invalidateFuturePlan();
    person.leave = event.target.value;
    tile.classList.remove("menu-open");
    render();
  });
  leaveSelect.addEventListener("blur", () => {
    tile.classList.remove("menu-open");
  });
  return tile;
}

function getRateForRole(person) {
  const login = person.login.toLowerCase();
  if (person.role === "pick") return rates.pick[login] || "";
  if (roleGroup(person.role) === "pack") return rates.pack[login] || "";
  return "";
}

function hydrateLeaveOptions(select, value) {
  const options = [
    `<option value="full">Full</option>`,
    ...leaveTimes.map((time) => {
      let style = "";
      if (time === "01:30") style = 'style="background:#bad7a8;font-weight:700"';
      else if (time === "02:30") style = 'style="background:#ffe59a;font-weight:700"';
      return `<option value="${time}" ${style}>${time}</option>`;
    }),
    `<option value="absent">Absent</option>`,
  ];
  select.innerHTML = options.join("");
  select.value = value;
}

function leaveClass(leave) {
  if (leave === "01:30") return "leave-0130";
  if (leave === "02:30") return "leave-0230";
  if (leave === "absent") return "leave-absent";
  if (leave && leave !== "full") return "leave-other";
  return "leave-full";
}

function onDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("is-over");
}

function onDrop(event) {
  event.preventDefault();
  const slot = event.currentTarget;
  slot.classList.remove("is-over");
  const person = people.find((item) => item.login === draggedLogin);
  if (!person) return;
  invalidateFuturePlan();
  assignPersonToSlot(person, slot.dataset.floor, Number(slot.dataset.station), slot.dataset.role, true);
  render();
}

function editSlot(slot) {
  const existing = people.find((person) => person.floor === slot.dataset.floor && String(person.station) === slot.dataset.station && person.role === slot.dataset.role);
  slot.innerHTML = "";
  const input = document.createElement("input");
  input.className = "slot-editor";
  input.value = existing?.login || "";
  input.placeholder = "Type or paste login(s)";
  slot.appendChild(input);
  input.focus();
  input.select();

  let committed = false;

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { committed = true; commitSlotEdit(slot, input.value); }
    if (event.key === "Escape") { committed = true; render(); }
  });
  input.addEventListener("paste", (event) => {
    event.preventDefault();
    const pastedText = (event.clipboardData || window.clipboardData).getData("text");
    committed = true;
    commitSlotEdit(slot, pastedText);
  });
  input.addEventListener("blur", () => {
    if (!committed) { committed = true; commitSlotEdit(slot, input.value); }
  });
}

function commitSlotEdit(slot, rawValue) {
  const tokens = parsePastedPeople(rawValue).map((item) => item.login);
  const old = people.find((person) => person.floor === slot.dataset.floor && String(person.station) === slot.dataset.station && person.role === slot.dataset.role);
  if (!tokens.length) {
    if (old) {
      invalidateFuturePlan();
      old.floor = "";
      old.station = "";
      old.role = "offplan";
    }
    render();
    return;
  }

  const slots = orderedSlotsFrom(slot.dataset.floor, Number(slot.dataset.station), slot.dataset.role);
  tokens.forEach((login, index) => {
    const target = slots[index];
    if (!target) return;
    const person = getOrCreatePerson(login);
    person.leave = "full"; // Always reset leave to full shift when adding/pasting
    invalidateFuturePlan();
    assignPersonToSlot(person, target.floor, target.station, target.role, false);
  });
  render();
}

function orderedSlotsFrom(floorId, station, role) {
  const floor = floors.find((item) => item.id === floorId);
  const stations = [];
  for (let current = station; current <= floor.end; current += 1) stations.push(current);
  return stations.map((item) => ({ floor: floorId, station: item, role }));
}

function assignPersonToSlot(person, floor, station, role, swap) {
  const occupied = people.find((item) => item.floor === floor && item.station === station && item.role === role);
  if (occupied && occupied.login !== person.login) {
    if (swap) {
      occupied.floor = person.floor;
      occupied.station = person.station;
      occupied.role = person.role;
    } else {
      occupied.floor = "";
      occupied.station = "";
      occupied.role = "offplan";
    }
  }

  people.forEach((item) => {
    if (item.login === person.login) return;
    if (item.floor === person.floor && item.station === person.station && item.role === person.role) return;
  });
  person.floor = floor;
  person.station = station;
  person.role = role;
}

function getOrCreatePerson(login, name = "") {
  const cleanLogin = login.trim();
  let person = people.find((item) => item.login.toLowerCase() === cleanLogin.toLowerCase());
  if (!person) {
    person = {
      login: cleanLogin,
      name,
      manager: "",
      pick: false,
      pack: false,
      stow: false,
      decant: false,
      arsaw: false,
      vendors: false,
      restriction: "Any",
      leave: "full",
      floor: "",
      station: "",
      role: "offplan",
      inDirectory: false,
    };
    people.push(person);
  }
  return person;
}

function summarizeFloor(floorId, snapshot, sourcePeople = people) {
  const active = sourcePeople.filter((person) => person.floor === floorId && isAvailable(person, snapshot));
  const pick = active.filter((person) => person.role === "pick").length;
  const pack = active.filter((person) => roleGroup(person.role) === "pack").length;
  const waterspider = active.filter((person) => person.role === "waterspider").length;
  return { floor: floorId, pick, pack, waterspider };
}

// --- Early Leavers Summary ---
function countEarlyLeavers(floorId, leaveTime, sourcePeople = people) {
  const staffed = sourcePeople.filter((person) => person.floor === floorId && person.leave === leaveTime && isStaffedOnBoard(person));
  const pick = staffed.filter((person) => person.role === "pick").length;
  const pack = staffed.filter((person) => roleGroup(person.role) === "pack").length;
  return { pick, pack, total: pick + pack };
}

function renderEarlyLeaversSummary() {
  if (!earlyLeaversSummary) return;

  // Gather data per floor
  const data = floors.map((floor) => ({
    id: floor.id,
    pick0130: countEarlyLeavers(floor.id, "01:30").pick,
    pack0130: countEarlyLeavers(floor.id, "01:30").pack,
    pick0230: countEarlyLeavers(floor.id, "02:30").pick,
    pack0230: countEarlyLeavers(floor.id, "02:30").pack,
  }));

  const totalPick0130 = data.reduce((sum, f) => sum + f.pick0130, 0);
  const totalPack0130 = data.reduce((sum, f) => sum + f.pack0130, 0);
  const totalPick0230 = data.reduce((sum, f) => sum + f.pick0230, 0);
  const totalPack0230 = data.reduce((sum, f) => sum + f.pack0230, 0);

  // Build floor header cells
  const floorHeaders = data.map((f) => `<th colspan="2" class="el-floor-header">${f.id} Early Leavers</th>`).join("");

  // Sub-headers (Pick / Pack per floor + total)
  const subHeaders = data.map(() => `<th class="el-sub">Pick</th><th class="el-sub">Pack</th>`).join("") +
    `<th class="el-sub">Pick</th><th class="el-sub">Pack</th>`;

  // Row for 1:30
  const row0130 = data.map((f) => `<td class="el-val el-0130-cell">${f.pick0130}</td><td class="el-val el-0130-cell">${f.pack0130}</td>`).join("") +
    `<td class="el-val el-total-cell el-0130-cell"><strong>${totalPick0130}</strong></td><td class="el-val el-total-cell el-0130-cell"><strong>${totalPack0130}</strong></td>`;

  // Row for 2:30
  const row0230 = data.map((f) => `<td class="el-val el-0230-cell">${f.pick0230}</td><td class="el-val el-0230-cell">${f.pack0230}</td>`).join("") +
    `<td class="el-val el-total-cell el-0230-cell"><strong>${totalPick0230}</strong></td><td class="el-val el-total-cell el-0230-cell"><strong>${totalPack0230}</strong></td>`;

  earlyLeaversSummary.innerHTML = `
    <table class="el-table">
      <thead>
        <tr class="el-top-header">
          ${floorHeaders}
          <th colspan="2" class="el-floor-header el-total-header">Early Leavers Total</th>
        </tr>
        <tr class="el-sub-header">
          ${subHeaders}
        </tr>
      </thead>
      <tbody>
        <tr class="el-time-row">
          <td colspan="${data.length * 2 + 2}" class="el-time-label">1:30</td>
        </tr>
        <tr>
          ${row0130}
        </tr>
        <tr class="el-time-row">
          <td colspan="${data.length * 2 + 2}" class="el-time-label">2:30</td>
        </tr>
        <tr>
          ${row0230}
        </tr>
      </tbody>
    </table>
  `;
}

function renderPeopleTable() {
  peopleTable.innerHTML = "";
  people
    .slice()
    .filter((person) => person.inDirectory !== false)
    .sort((a, b) => a.login.localeCompare(b.login))
    .forEach((person) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="text" value="${escapeHtml(person.login)}" data-field="login" /></td>
        <td><input type="text" value="${escapeHtml(person.name || "")}" data-field="name" /></td>
        <td><input type="text" value="${escapeHtml(person.manager || "")}" data-field="manager" /></td>
        <td><input type="checkbox" data-field="pick" ${person.pick ? "checked" : ""} /></td>
        <td><input type="checkbox" data-field="pack" ${person.pack ? "checked" : ""} /></td>
        <td><input type="checkbox" data-field="stow" ${person.stow ? "checked" : ""} /></td>
        <td><input type="checkbox" data-field="decant" ${person.decant ? "checked" : ""} /></td>
        <td><input type="checkbox" data-field="arsaw" ${person.arsaw ? "checked" : ""} /></td>
        <td><input type="checkbox" data-field="vendors" ${person.vendors ? "checked" : ""} /></td>
        <td>
          <select data-field="restriction">
            ${["Any", "P2", "P3", "P4"].map((value) => `<option ${person.restriction === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </td>
        <td><button class="remove-row">Remove</button></td>
      `;
      row.querySelectorAll("input, select").forEach((control) => {
        control.addEventListener("change", () => {
          const field = control.dataset.field;
          invalidateFuturePlan();
          person[field] = control.type === "checkbox" ? control.checked : control.value;
          render();
        });
      });
      row.querySelector(".remove-row").addEventListener("click", () => {
        invalidateFuturePlan();
        people = people.filter((item) => item !== person);
        render();
      });
      peopleTable.appendChild(row);
    });
}

function renderCriticalRoles() {
  criticalRolesEl.innerHTML = "";
  floors.forEach((floor) => {
    const section = document.createElement("section");
    section.className = "critical-floor";
    section.dataset.floor = floor.id;
    section.innerHTML = `
      <div class="critical-floor-head">
        <strong>${floor.id}</strong>
        <span>Critical Role & indirects</span>
      </div>
      <div class="critical-grid"></div>
    `;
    const grid = section.querySelector(".critical-grid");
    [
      ["fp", "FP"],
      ["ps", "PS"],
      ["pg", "PG"],
      ["other", "Other"],
    ].forEach(([role, label]) => {
      const col = document.createElement("div");
      col.className = "critical-col";
      if (role === "other") {
        col.classList.add("critical-col-wide");
      } else {
        col.classList.add("critical-col-narrow");
      }
      col.innerHTML = `<h3>${label}</h3><div class="critical-slots"></div>`;
      const slots = col.querySelector(".critical-slots");
      criticalRoles[floor.id][role].forEach((value, index) => {
        const input = document.createElement("input");
        input.value = value;
        input.placeholder = role === "other" ? "Role / login" : "Login";
        input.addEventListener("input", () => {
          criticalRoles[floor.id][role][index] = input.value;
          saveCriticalRoles();
        });
        // Drag-drop support for critical role inputs
        input.addEventListener("dragover", (event) => {
          event.preventDefault();
          input.classList.add("critical-drag-over");
        });
        input.addEventListener("dragleave", () => {
          input.classList.remove("critical-drag-over");
        });
        input.addEventListener("drop", (event) => {
          event.preventDefault();
          input.classList.remove("critical-drag-over");
          if (draggedLogin) {
            input.value = draggedLogin;
            criticalRoles[floor.id][role][index] = draggedLogin;
            // Remove the person from the station board
            const person = people.find((item) => item.login === draggedLogin);
            if (person) {
              person.floor = "";
              person.station = "";
              person.role = "offplan";
              invalidateFuturePlan();
            }
            saveCriticalRoles();
            render();
          }
        });
        slots.appendChild(input);
      });
      grid.appendChild(col);
    });
    criticalRolesEl.appendChild(section);
  });
}

function resetFloor(floorId) {
  const confirmed = window.confirm(`Clear all pick, pack, waterspider and critical-role entries for ${floorId}?`);
  if (!confirmed) return;
  people.forEach((person) => {
    if (person.floor === floorId) {
      person.floor = "";
      person.station = "";
      person.role = "offplan";
    }
  });
  criticalRoles[floorId] = {
    fp: ["", "", "", "", "", "", ""],
    ps: ["", "", "", "", "", "", ""],
    pg: ["", "", "", "", "", "", ""],
    other: ["", "", "", "", "", "", ""],
  };
  futurePeople = null;
  render();
}

function openAddPeopleDialog() {
  bulkPeopleInput.value = "";
  addPeopleDialog.showModal();
  bulkPeopleInput.focus();
}

function saveBulkPeople(event) {
  event.preventDefault();
  parseBulkDirectory(bulkPeopleInput.value).forEach((item) => {
    const person = getOrCreatePerson(item.login, item.name);
    if (item.name) person.name = item.name;
    if (item.manager) person.manager = item.manager;
    person.inDirectory = true;
  });
  addPeopleDialog.close();
  render();
}

function parseBulkDirectory(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.includes("\t") ? line.split(/\t+/) : line.split(/[,]+/);
      const login = (parts[0] || "").trim();
      const name = (parts[1] || "").trim();
      const manager = (parts[2] || "").trim();
      return { login, name, manager };
    })
    .filter((item) => item.login);
}

function renderRatesInputs() {
  pickRatesInput.value = ratesToText(rates.pick);
  packRatesInput.value = ratesToText(rates.pack);
}

function ratesToText(rateMap) {
  return Object.entries(rateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([login, rate]) => `${login}\t${rate}`)
    .join("\n");
}

function updateRates() {
  rates = {
    pick: parseRates(pickRatesInput.value),
    pack: parseRates(packRatesInput.value),
  };
  saveRates();
  render();
}

function resetRates() {
  rates = { pick: {}, pack: {} };
  saveRates();
  render();
}

function parseRates(value) {
  const parsed = {};
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const parts = line.includes(",") || line.includes("\t") ? line.split(/[,\t]+/) : line.split(/\s+/);
      const login = parts.shift()?.trim().toLowerCase();
      const rate = parts.filter((part) => /^\d+(\.\d+)?$/.test(part.trim())).pop() || parts.pop();
      if (login && rate) parsed[login] = rate.trim();
    });
  return parsed;
}

function parsePastedPeople(value) {
  return value
    .split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.includes(",") || line.includes("\t") ? line.split(/[,\t]+/) : line.split(/\s+/);
      const login = parts.shift()?.trim() || "";
      const name = parts.join(" ").trim();
      return { login, name };
    })
    .filter((item) => item.login);
}

function renderForecast() {
  const time = planTime.value;
  const ratio = Number(planRatio.value);
  const staffed = people.filter(isStaffedOnBoard);
  const available = staffed.filter((person) => isAvailable(person, time));
  const unavailable = staffed.filter((person) => !isAvailable(person, time));

  document.querySelector("#forecastResult").innerHTML = `
    <p class="eyebrow">Ready to generate</p>
    <strong>${available.length} available HC</strong>
    <p>${staffed.length} AAs are currently staffed on the board. ${unavailable.length} will be removed from the plan at ${time}.</p>
    <p>Target: ${ratio} packers per picker. The tool will not auto-staff waterspiders.</p>
    <p class="plan-note">Press Suggest Plan to reallocate only the AAs already staffed on the board. Directory-only AAs are not pulled into the plan automatically.</p>
  `;

  if (futurePeople) renderBoard(futureBoard, futurePeople, { editable: false, boardName: "future" });
  else renderBoard(futureBoard, staffed.filter((person) => isAvailable(person, time)), { editable: false, boardName: "future" });
}

function suggestPlan() {
  const time = planTime.value;
  const ratio = Number(planRatio.value);
  const staffed = people.filter(isStaffedOnBoard);
  const available = staffed.filter((person) => isAvailable(person, time));
  const unavailable = staffed.filter((person) => !isAvailable(person, time));
  if (!staffed.length) {
    futurePeople = people.map((person) => ({ ...person, floor: "", station: "", role: "offplan" }));
    document.querySelector("#forecastResult").innerHTML = `
      <p class="eyebrow">No staffed AAs</p>
      <strong>No plan generated</strong>
      <p class="plan-note">Add or paste logins onto the Board first. Suggested Staffing only works from AAs currently staffed on the board, not from the AA Directory.</p>
    `;
    renderBoard(futureBoard, futurePeople, { editable: false, boardName: "future" });
    return;
  }
  const assignments = buildAssignments(available, ratio);

  const planned = people.map((person) => ({ ...person, floor: "", station: "", role: "offplan" }));
  assignments.assigned.forEach((assignment) => {
    const plannedPerson = planned.find((person) => person.login === assignment.person.login);
    plannedPerson.floor = assignment.floor;
    plannedPerson.station = assignment.station;
    plannedPerson.role = assignment.role;
  });
  futurePeople = planned;

  renderBoard(futureBoard, futurePeople, { editable: true, boardName: "future" });
  renderPlanResult(assignments, available.length, unavailable.length, time, ratio);
}

function buildAssignments(available, ratio) {
  const buckets = Object.fromEntries(floors.map((floor) => [floor.id, []]));
  const unassigned = [];
  const assigned = [];
  const restricted = available.filter((person) => person.restriction !== "Any");
  const flexible = available.filter((person) => person.restriction === "Any");

  restricted.forEach((person) => {
    if (buckets[person.restriction]) buckets[person.restriction].push(person);
    else unassigned.push({ person, reason: "Unknown floor restriction" });
  });

  flexible.forEach((person) => {
    const targetFloor = floors.map((floor) => floor.id).sort((a, b) => buckets[a].length - buckets[b].length)[0];
    buckets[targetFloor].push(person);
  });

  floors.forEach((floor) => {
    const floorPeople = buckets[floor.id];
    const workCount = floorPeople.length;
    const pickTarget = Math.min(floor.end - floor.start + 1, Math.max(0, Math.floor(workCount / (1 + ratio))));
    const packTarget = Math.min(pickTarget * 2, workCount - pickTarget);
    const floorAssigned = new Set();

    const picks = takePeople(floorPeople, floorAssigned, (person) => person.pick, pickTarget);
    const packs = takePeople(floorPeople, floorAssigned, (person) => person.pack, packTarget);
    const extras = floorPeople.filter((person) => !floorAssigned.has(person.login));
    const extraPackers = takePeople(extras, floorAssigned, (person) => person.pack, Math.max(0, floor.end - floor.start + 1) * 2);

    placePeople(assigned, picks, floor, "pick");
    placePeople(assigned, [...packs, ...extraPackers], floor, "pack");
    extras
      .filter((person) => !floorAssigned.has(person.login))
      .forEach((person) => unassigned.push({ person, reason: "Not pack trained for extra pack slot" }));
  });

  assigned
    .filter((item) => item.station === "")
    .forEach((item) => {
      unassigned.push({ person: item.person, reason: "No free station slot" });
    });

  return { assigned: assigned.filter((item) => item.station !== ""), unassigned };
}

function takePeople(floorPeople, floorAssigned, predicate, count) {
  const taken = [];
  floorPeople.forEach((person) => {
    if (taken.length >= count) return;
    if (!floorAssigned.has(person.login) && predicate(person)) {
      floorAssigned.add(person.login);
      taken.push(person);
    }
  });
  return taken;
}

function priorityStations(floor) {
  return stationPriority.map((position) => floor.start + position - 1).filter((station) => station >= floor.start && station <= floor.end);
}

function placePeople(assigned, group, floor, roleGroupName) {
  const roles = roleGroupName === "pack" ? ["pack1", "pack2"] : [roleGroupName];
  const stations = priorityStations(floor);
  let cursor = 0;
  let roleIndex = 0;

  group.forEach((person) => {
    let placed = false;
    let attempts = 0;
    while (attempts < stations.length * roles.length && !placed) {
      const station = stations[cursor];
      const role = roles[roleIndex];
      const taken = assigned.some((item) => item.floor === floor.id && item.station === station && item.role === role);
      if (!taken) {
        assigned.push({ person, floor: floor.id, station, role });
        placed = true;
      }
      roleIndex += 1;
      if (roleIndex >= roles.length) {
        roleIndex = 0;
        cursor = (cursor + 1) % stations.length;
      }
      attempts += 1;
    }
    if (!placed) assigned.push({ person, floor: floor.id, station: "", role: roleGroupName });
  });
}

function renderPlanResult(assignments, availableCount, unavailableCount, time, ratio) {
  const summaries = floors.map((floor) => summarizeFloor(floor.id, time, futurePeople || people));
  const cards = summaries
    .map((item) => {
      const actualRatio = item.pick ? (item.pack / item.pick).toFixed(2) : "0.00";
      const target = Math.ceil(item.pick * ratio);
      return `
        <article class="plan-card">
          <h3>${item.floor}</h3>
          <p>Pick: ${item.pick} | Pack: ${item.pack} | Waterspider: ${item.waterspider}</p>
          <p>Ratio: ${actualRatio}x | Target pack: ${target}</p>
        </article>
      `;
    })
    .join("");
  const unassigned = assignments.unassigned.length
    ? `<p class="plan-note">Not placed: ${assignments.unassigned.map((item) => `${escapeHtml(item.person.login)} (${escapeHtml(item.reason)})`).join(", ")}</p>`
    : `<p class="plan-note">All available AAs were placed. Early leavers remain in the directory but are removed from this plan.</p>`;

  document.querySelector("#forecastResult").innerHTML = `
    <p class="eyebrow">Suggested plan applied</p>
    <strong>${availableCount} planned HC at ${time}</strong>
    <p>${unavailableCount} removed because they leave at or before the selected time, or are absent.</p>
    <section class="plan-list">${cards}</section>
    ${unassigned}
  `;
  renderBoard(futureBoard, futurePeople || people, { editable: false, boardName: "future" });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`#${tab.dataset.view}`).classList.add("is-active");
    renderForecast();
  });
});

document.querySelector("#addPersonBtn").addEventListener("click", openAddPeopleDialog);
document.querySelector("#saveBulkPeopleBtn").addEventListener("click", saveBulkPeople);
document.querySelector("#saveRatesBtn").addEventListener("click", updateRates);
document.querySelector("#resetRatesBtn").addEventListener("click", resetRates);

// --- Undo ---
const undoStack = [];
const MAX_UNDO = 20;
let skipNextUndo = false;

function pushUndo() {
  if (skipNextUndo) { skipNextUndo = false; return; }
  const snapshot = JSON.stringify(people);
  if (undoStack[undoStack.length - 1] !== snapshot) {
    undoStack.push(snapshot);
    if (undoStack.length > MAX_UNDO) undoStack.shift();
  }
}

document.querySelector("#undoBtn").addEventListener("click", () => {
  if (!undoStack.length) return;
  skipNextUndo = true;
  people = JSON.parse(undoStack.pop());
  render();
});

toggleRatesBtn.addEventListener("click", () => {
  showRates = !showRates;
  document.body.classList.toggle("show-rates", showRates);
  toggleRatesBtn.textContent = showRates ? "Hide Rates" : "Show Rates";
});
document.querySelector("#suggestPlanBtn").addEventListener("click", () => suggestPlan());

// Highlight mode buttons
document.querySelectorAll(".highlight-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.highlight;
    if (activeHighlightMode === mode) {
      // Deactivate
      activeHighlightMode = null;
      btn.classList.remove("highlight-active");
    } else {
      // Activate this mode, deactivate others
      activeHighlightMode = mode;
      document.querySelectorAll(".highlight-btn").forEach((b) => b.classList.remove("highlight-active"));
      btn.classList.add("highlight-active");
    }
  });
});

// Training filter dropdown
let activeTrainingFilter = "";
document.querySelector("#trainingSelect").addEventListener("change", (event) => {
  activeTrainingFilter = event.target.value;
  renderOnly();
});

[ratioSelect, snapshotSelect, planTime, planRatio].forEach((control) => {
  control.addEventListener("input", () => {
    futurePeople = null;
    render();
  });
  control.addEventListener("change", () => {
    futurePeople = null;
    render();
  });
});

render();

// --- Firebase Real-Time Listeners ---
// Use a flag to suppress Firebase callbacks triggered by our own writes
let isSaving = false;

const _origSavePeople = savePeople;
savePeople = function () {
  isSaving = true;
  _origSavePeople();
  setTimeout(() => { isSaving = false; }, 50);
};
const _origSaveRates = saveRates;
saveRates = function () {
  isSaving = true;
  _origSaveRates();
  setTimeout(() => { isSaving = false; }, 50);
};
const _origSaveCriticalRoles = saveCriticalRoles;
saveCriticalRoles = function () {
  isSaving = true;
  _origSaveCriticalRoles();
  setTimeout(() => { isSaving = false; }, 50);
};
const _origSaveHighlights = saveHighlights;
saveHighlights = function () {
  isSaving = true;
  _origSaveHighlights();
  setTimeout(() => { isSaving = false; }, 50);
};

// Each listener skips its first fire (initial load), then listens for remote changes
let peopleReady = false;
let ratesReady = false;
let criticalReady = false;

FireSync.onPeopleChange((data) => {
  if (!peopleReady) { peopleReady = true; return; }
  if (isSaving) return;
  people = Array.isArray(data) ? data : Object.values(data);
  localStorage.setItem("hc-planner-people", JSON.stringify(people));
  renderOnly();
});

FireSync.onRatesChange((data) => {
  if (!ratesReady) { ratesReady = true; return; }
  if (isSaving) return;
  rates = data;
  localStorage.setItem("hc-planner-rates", JSON.stringify(rates));
  renderOnly();
});

FireSync.onCriticalRolesChange((data) => {
  if (!criticalReady) { criticalReady = true; return; }
  if (isSaving) return;
  criticalRoles = data;
  localStorage.setItem("hc-planner-critical-roles", JSON.stringify(criticalRoles));
  renderOnly();
});

let highlightsReady = false;

FireSync.onHighlightsChange((data) => {
  if (!highlightsReady) { highlightsReady = true; return; }
  if (isSaving) return;
  highlights = data;
  if (!highlights.vto) highlights.vto = [];
  if (!highlights.lnd) highlights.lnd = [];
  if (!highlights.highlighted) highlights.highlighted = [];
  localStorage.setItem("hc-planner-highlights", JSON.stringify(highlights));
  renderOnly();
});

// Apply HC Input to board
document.querySelector("#applyHcInputBtn").addEventListener("click", () => {
  floors.forEach((floor) => {
    const resultArea = document.querySelector(`#hcResult${floor.id}`);
    const text = resultArea.value.trim();
    if (!text) return;

    // Parse lines: expect "login station role" or "login station" format
    // Also handles tab-separated SCC output like: login  201  Pick
    text.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const parts = trimmed.split(/[\t,]+|\s{2,}/).map((p) => p.trim()).filter(Boolean);
      if (parts.length < 2) return;

      const login = parts[0].toLowerCase();
      const stationRaw = parts.find((p) => /^\d{3}$/.test(p));
      const roleRaw = parts.find((p) => /pick|pack|waterspider/i.test(p));

      if (!stationRaw) return;
      const station = Number(stationRaw);
      let role = "pick";
      if (roleRaw) {
        const r = roleRaw.toLowerCase();
        if (r.includes("pack")) role = "pack1";
        else if (r.includes("water") || r.includes("spider")) role = "waterspider";
        else role = "pick";
      }

      const person = getOrCreatePerson(login);
      person.leave = "full";
      assignPersonToSlot(person, floor.id, station, role, false);
    });
  });
  invalidateFuturePlan();
  render();
});
