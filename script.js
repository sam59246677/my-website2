// دریافت المنت‌ها
const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskDate = document.querySelector('#task-date');
const taskTime = document.querySelector('#task-time');
const taskTableBody = document.querySelector('#task-table tbody');
const clearBtn = document.querySelector('#clear-btn');
const sortBtn = document.querySelector('#sort-btn');

// راه اندازی تقویم شمسی با persian-datepicker
$(document).ready(function() {
  $("#task-date").persianDatepicker({
    format: 'YYYY/MM/DD',
    autoClose: true,
    initialValue: false,
  });
});

// حذف یا نمایش متن تگ <p> با توجه به حالت صفحه (افقی/عمودی)
function handleOrientation() {
  const pTag = document.querySelector('p');
  if (window.innerWidth > window.innerHeight) {
    // حالت افقی -> حذف متن
    pTag.textContent = '';
  } else {
    // حالت عمودی -> نمایش متن
    pTag.textContent = 'نمایش موبایل را درحالت افقی تنظیم نمایید';
  }
}

// اجرا در شروع و هنگام تغییر اندازه صفحه
handleOrientation();
window.addEventListener('resize', handleOrientation);

form.addEventListener('submit', e => {
  e.preventDefault();

  const text = taskInput.value.trim();
  const persianDateStr = taskDate.value; // تاریخ شمسی
  const time = taskTime.value;

  if (!text || !persianDateStr || !time) {
    alert('لطفا همه فیلدها را پر کنید!');
    return;
  }

  // تبدیل تاریخ شمسی به میلادی
  const pDate = new persianDate(persianDateStr.replace(/-/g, '/')); // اگر - بود به / تبدیل کن
  const gregorianDate = pDate.toCalendar('gregorian').format('YYYY-MM-DD');

  const datetime = new Date(`${gregorianDate}T${time}`);
  if (datetime < new Date()) {
    alert("زمان واردشده نمی‌تواند قبل از الان باشد!");
    return;
  }

  addTask(text, gregorianDate, time);

  taskInput.value = '';
  taskDate.value = '';
  taskTime.value = '';
});

clearBtn.addEventListener('click', () => {
  if (confirm('آیا مطمئن هستید همه یادداشت ها پاک شوند؟')) {
    localStorage.removeItem('tasks');
    renderTasks();
  }
});

sortBtn.addEventListener('click', () => {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.sort((a, b) => {
    return (a.completed === b.completed) ? 0 : (a.completed ? 1 : -1);
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
});

function addTask(text, date, time) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, date, time, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  scheduleAlarm({ text, date, time });
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

    // تبدیل تاریخ میلادی به شمسی برای نمایش
    const pd = new persianDate(new Date(`${task.date}T${task.time}`));
    const shamsiDate = pd.format('YYYY/MM/DD HH:mm');
    tdDate.textContent = toPersianNumber(shamsiDate);

    const tdDone = document.createElement('td');
    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.completed ? 'لغو انجام' : 'انجام شد';
    doneBtn.className = 'done-btn';
    doneBtn.addEventListener('click', () => toggleComplete(index));
    tdDone.appendChild(doneBtn);

    const tdDelete = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      if (confirm('آیا مطمئن هستید این کار حذف شود؟')) {
        deleteTask(index);
      }
    });
    tdDelete.appendChild(deleteBtn);

    tr.append(tdIndex, tdText, tdDate, tdDone, tdDelete);
    taskTableBody.appendChild(tr);
  });
}

// هشدار رسیدن زمان تسک
function scheduleAlarm(task) {
  const datetime = new Date(`${task.date}T${task.time}`);
  const now = new Date();
  const delay = datetime - now;
  if (delay <= 0) return;

  setTimeout(() => {
    alert(`زمان انجام کار "${task.text}" رسید!`);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('یادآوری کار', { body: `زمان: "${task.text}" رسیده!` });
    }
  }, delay);
}

// درخواست دسترسی نوتیفیکیشن
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

requestNotificationPermission();
renderTasks();

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => {
  if (!task.completed) scheduleAlarm(task);
});

function toPersianNumber(number) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return number.toString().replace(/\d/g, d => persianDigits[d]);
}
