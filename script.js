const API = "https://script.google.com/macros/s/AKfycbxrvPTUxVjZ985PNsggrNS64E4dtQx7WdhVny0TKi3M9CQyiImAcp_PcgGuGDA_a5kntQ/exec";
const USER = "Lumina";
const HABITS = 5;

const body = document.getElementById("tableBody");
const doneEl = document.getElementById("done");
const leftEl = document.getElementById("left");
const monthPicker = document.getElementById("monthPicker");

monthPicker.value = new Date().toISOString().slice(0,7);
monthPicker.onchange = load;

function load() {
  fetch(API, {
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
  body.innerHTML = "";
  let totalDone = 0;

  const [y, m] = monthPicker.value.split("-");
  const days = new Date(y, m, 0).getDate();

  for (let d = 1; d <= days; d++) {
    const date = `${monthPicker.value}-${String(d).padStart(2,"0")}`;
    const row = data[date] || Array(HABITS).fill(false);
    const done = row.filter(Boolean).length;
    totalDone += done;

    body.innerHTML += `
      <tr>
        <td>${d}</td>
        ${row.map((v,i)=>`
          <td>
            <input type="checkbox" ${v?"checked":""}
            onchange="save('${date}')"
            id="${date}-${i}">
          </td>
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

  doneEl.textContent = totalDone;
  leftEl.textContent = days * HABITS - totalDone;
}

function save(date) {
  const habits = [];
  for (let i=0;i<HABITS;i++) {
    habits.push(document.getElementById(`${date}-${i}`).checked);
  }

  fetch(API, {
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
