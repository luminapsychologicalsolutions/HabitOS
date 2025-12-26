const API_URL = "https://script.google.com/macros/s/AKfycbxrvPTUxVjZ985PNsggrNS64E4dtQx7WdhVny0TKi3M9CQyiImAcp_PcgGuGDA_a5kntQ/exec";
const USER = "Lumina"; // later replace with login
const HABITS = 5;

const tbody = document.querySelector("tbody");
const doneEl = document.getElementById("done");
const leftEl = document.getElementById("left");
const monthPicker = document.getElementById("monthPicker");

monthPicker.value = new Date().toISOString().slice(0,7);
monthPicker.onchange = load;

function load() {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "load",
      user: USER,
      month: monthPicker.value
    })
  })
  .then(r => r.json())
  .then(render);
}

function render(data = {}) {
  tbody.innerHTML = "";
  let total = 0;

  const daysInMonth = new Date(
    monthPicker.value.split("-")[0],
    monthPicker.value.split("-")[1],
    0
  ).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${monthPicker.value}-${String(d).padStart(2,"0")}`;
    const row = data[date] || Array(HABITS).fill(false);
    const done = row.filter(Boolean).length;
    total += done;

    tbody.innerHTML += `
      <tr>
        <td>${date}</td>
        ${row.map((v,i)=>`
          <td><input type="checkbox" ${v?"checked":""}
          onchange="save('${date}')"
          id="${date}-${i}"></td>
        `).join("")}
        <td>${done}</td>
        <td>
          <div class="progress">
            <div style="width:${done*20}%"></div>
          </div>
        </td>
      </tr>
    `;
  }

  doneEl.textContent = total;
  leftEl.textContent = daysInMonth*HABITS - total;
}

function save(date) {
  const habits = [];
  for (let i=0;i<HABITS;i++) {
    habits.push(
      document.getElementById(`${date}-${i}`).checked
    );
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "save",
      user: USER,
      date,
      habits
    })
  });
}

load();
