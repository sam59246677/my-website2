const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskDate = document.querySelector('#task-date');
const taskTime = document.querySelector('#task-time');
const taskTableBody = document.querySelector('#task-table tbody');
const clearBtn = document.querySelector('#clear-btn');
const sortBtn = document.querySelector('#sort-btn');

// راه اندازی تقویم شمسی
$(document).ready(function() {
  $("#task-date").persianDatepicker({
    format: 'YYYY/MM/DD',
    autoClose: true,
    initialValue: false,
  });
});

// متن حالت صفحه
function handleOrientation() {
  const pTag = document.querySelector('p');
  if (window.innerWidth > window.innerHeight) {
    pTag.textContent = '';
  } else {
    pTag.textContent = 'نمایش موبایل را درحالت افقی تنظیم نمایید';
  }
}
handleOrientation();
window.addEventListener('resize', handleOrientation);

// افزودن تسک
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const persianDateStr = taskDate.value;
  const time = taskTime.value;

  if (!text || !persianDateStr || !time) {
    alert('لطفا همه فیلدها را پر کنید!');
    return;
  }

  const [hour, minute] = time.split(':').map(Number);
  if (isNaN(hour) || isNaN(minute)) {
    alert('ساعت واردشده معتبر نیست!');
    return;
  }

  // تبدیل تاریخ شمسی به میلادی
  const pDate = new persianDate(persianDateStr.replace(/-/g,'/')).startOf('day');
  const gDateObj = pDate.toCalendar('gregorian').toDate();

  // --- محدودیت فقط روی تاریخ ---
  const today = new Date();
  today.setHours(0,0,0,0); // ساعت صفر امروز
  const selectedDate = new Date(gDateObj.getFullYear(), gDateObj.getMonth(), gDateObj.getDate());

  if (selectedDate < today) {
    alert("تاریخ واردشده نمی‌تواند قبل از امروز باشد!");
    return;
  }

  // ترکیب تاریخ و ساعت
  const datetime = new Date(
    gDateObj.getFullYear(),
    gDateObj.getMonth(),
    gDateObj.getDate(),
    hour,
    minute
  );

  addTask(
    text,
    persianDateStr,
    time,
    `${gDateObj.getFullYear()}-${String(gDateObj.getMonth()+1).padStart(2,'0')}-${String(gDateObj.getDate()).padStart(2,'0')}`
  );

  taskInput.value = '';
  taskDate.value = '';
  taskTime.value = '';
});

// پاک کردن همه
clearBtn.addEventListener('click', () => {
  if (confirm('آیا مطمئن هستید همه یادداشت ها پاک شوند؟')) {
    localStorage.removeItem('tasks');
    renderTasks();
  }
});

// مرتب‌سازی
sortBtn.addEventListener('click', () => {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.sort((a, b) => (a.completed === b.completed) ? 0 : (a.completed ? 1 : -1));
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
});

function addTask(text, persianDate, time, gregorianDate) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, persianDate, time, date: gregorianDate, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  scheduleAlarms(tasks);
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function toggleComplete(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskTableBody.innerHTML = '';

  tasks.forEach((task, index) => {
    const tr = document.createElement('tr');
    if (task.completed) tr.classList.add('completed');

    const tdIndex = document.createElement('td');
    tdIndex.textContent = toPersianNumber(index + 1);

    const tdText = document.createElement('td');
    tdText.textContent = task.text;

    const tdDate = document.createElement('td');
    tdDate.textContent = toPersianNumber(`${task.persianDate} ${task.time}`);

    const tdDone = document.createElement('td');
    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.completed ? '✔️' : '⛔';
    doneBtn.className = 'done-btn';
    doneBtn.addEventListener('click', () => toggleComplete(index));
    tdDone.appendChild(doneBtn);

    const tdDelete = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      if (confirm('آیا مطمئن هستید این کار حذف شود؟')) deleteTask(index);
    });
    tdDelete.appendChild(deleteBtn);

    tr.append(tdIndex, tdText, tdDate, tdDone, tdDelete);
    taskTableBody.appendChild(tr);
  });

  scheduleAlarms(tasks);
}

function scheduleAlarms(tasks) {
  tasks.forEach(task => {
    if (!task.completed) {
      const [year, month, day] = task.date.split('-').map(Number);
      const [hour, minute] = task.time.split(':').map(Number);
      const datetime = new Date(year, month-1, day, hour, minute);
      const delay = datetime - new Date();
      if (delay > 0) {
        setTimeout(() => {
          alert(`زمان انجام کار "${task.text}" رسید!`);
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('یادآوری کار', { body: `زمان: "${task.text}" رسیده!` });
          }
        }, delay);
      }
    }
  });
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') Notification.requestPermission();
}

requestNotificationPermission();
renderTasks();

function toPersianNumber(number) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return number.toString().replace(/\d/g, d => persianDigits[d]);
}
