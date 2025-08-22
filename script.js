// const form = document.querySelector('#task-form');
// const taskInput = document.querySelector('#task-input');
// const taskDate = document.querySelector('#task-date');
// const taskTime = document.querySelector('#task-time');
// const taskTableBody = document.querySelector('#task-table tbody');
// const clearBtn = document.querySelector('#clear-btn');
// const sortBtn = document.querySelector('#sort-btn');

// // راه‌اندازی تاریخ‌شمسی
// $(document).ready(function () {
//   $("#task-date").persianDatepicker({
//     format: 'YYYY/MM/DD',
//     autoClose: true,
//     initialValue: false
//   });
// });

// // نمایش پیام چرخش صفحه
// function handleOrientation() {
//   const pTag = document.querySelector('p');
//   pTag.textContent = window.innerWidth > window.innerHeight
//     ? ''
//     : 'نمایش موبایل را درحالت افقی تنظیم نمایید';
// }
// handleOrientation();
// window.addEventListener('resize', handleOrientation);

// form.addEventListener('submit', e => {
//   e.preventDefault();

//   const text = taskInput.value.trim();
//   const persianDateStr = taskDate.value.trim();
//   const time = taskTime.value.trim();

//   if (!text || !persianDateStr || !time) {
//     alert('لطفا همه فیلدها را پر کنید!');
//     return;
//   }
//   const pDate = new persianDate(persianDateStr.replace(/-/g, '/'));
//   const gregorianDate = pDate.toCalendar('gregorian').format('YYYY-MM-DD');

//   const [year, month, day] = gregorianDate.split('-').map(Number);
//   const [hour, minute] = time.split(':').map(Number);
//   const datetime = new Date(year, month - 1, day, hour, minute);





//   if (datetime < new Date()) {
//     alert("زمان واردشده نمی‌تواند قبل از الان باشد!");
//     return;
//   }

//   addTask(text, gregorianDate, time, persianDateStr);

//   taskInput.value = '';
//   taskDate.value = '';
//   taskTime.value = '';
// });

// clearBtn.addEventListener('click', () => {
//   if (confirm('آیا مطمئن هستید همه یادداشت‌ها پاک شوند؟')) {
//     localStorage.removeItem('tasks');
//     renderTasks();
//   }
// });

// sortBtn.addEventListener('click', () => {
//   let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//   tasks.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
//   localStorage.setItem('tasks', JSON.stringify(tasks));
//   renderTasks();
// });

// function addTask(text, date, time, persianDate) {
//   const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//   tasks.push({ text, date, time, persianDate, completed: false });
//   localStorage.setItem('tasks', JSON.stringify(tasks));
//   renderTasks(); // فقط نمایش بده، هشدار در renderTasks برنامه‌ریزی می‌شود
// }

// function deleteTask(index) {
//   const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//   tasks.splice(index, 1);
//   localStorage.setItem('tasks', JSON.stringify(tasks));
//   renderTasks();
// }

// function toggleComplete(index) {
//   const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//   tasks[index].completed = !tasks[index].completed;
//   localStorage.setItem('tasks', JSON.stringify(tasks));
//   renderTasks();
// }

// function renderTasks() {
//   const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//   taskTableBody.innerHTML = '';

//   tasks.forEach((task, index) => {
//     const tr = document.createElement('tr');
//     if (task.completed) tr.classList.add('completed');

//     const tdIndex = document.createElement('td');
//     tdIndex.textContent = toPersianNumber(index + 1);

//     const tdText = document.createElement('td');
//     tdText.textContent = task.text;

//     const tdDate = document.createElement('td');

//     // برای نمایش تاریخ، از همان مقدار تاریخ شمسی ذخیره شده استفاده کنیم
//     const shamsiDateTime = `${task.persianDate} ${task.time}`;
//     tdDate.textContent = toPersianNumber(shamsiDateTime);

//     const tdDone = document.createElement('td');
//     const doneBtn = document.createElement('button');
//     doneBtn.textContent = task.completed ? '\u2714' : '\u{1F6AB}';
//     doneBtn.className = 'done-btn';
//     doneBtn.addEventListener('click', () => toggleComplete(index));
//     tdDone.appendChild(doneBtn);

//     const tdDelete = document.createElement('td');
//     const deleteBtn = document.createElement('button');
//     deleteBtn.textContent = '\u274C';
//     deleteBtn.className = 'delete-btn';
//     deleteBtn.addEventListener('click', () => {
//       if (confirm('آیا مطمئن هستید این کار حذف شود؟')) {
//         deleteTask(index);
//       }
//     });
//     tdDelete.appendChild(deleteBtn);

//     tr.append(tdIndex, tdText, tdDate, tdDone, tdDelete);
//     taskTableBody.appendChild(tr);
//   });

//   scheduleAlarms(tasks);
// }

// function scheduleAlarms(tasks) {
//   // پاک کردن تایمرهای قبلی (اگر نیاز به اینکار بود، باید ساختار تایمرها ذخیره شود)
//   // اینجا فقط تایمرهای جدید ایجاد می‌کنیم

//   tasks.forEach(task => {
//     if (!task.completed) {
//       const [year, month, day] = task.date.split('-').map(Number);
//       const [hour, minute] = task.time.split(':').map(Number);
//       const datetime = new Date(year, month - 1, day, hour, minute);
//       const now = new Date();
//       const delay = datetime - now;
//       if (delay > 0) {
//         setTimeout(() => {
//           alert(`زمان انجام کار "${task.text}" رسید!`);
//           if ('Notification' in window && Notification.permission === 'granted') {
//             new Notification('یادآوری کار', { body: `زمان: "${task.text}" رسیده!` });
//           }
//         }, delay);
//       }
//     }
//   });
// }

// // درخواست دسترسی نوتیفیکیشن
// function requestNotificationPermission() {
//   if ('Notification' in window && Notification.permission !== 'granted') {
//     Notification.requestPermission();
//   }
// }

// requestNotificationPermission();
// renderTasks();

// function toPersianNumber(number) {
//   const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
//   return number.toString().replace(/\d/g, d => persianDigits[d]);
// }
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

  // تبدیل تاریخ شمسی به میلادی بدون شیفت روز:
  const pDate = new persianDate(persianDateStr.replace(/-/g, '/')).startOf('day');
  const gDateObj = pDate.toCalendar('gregorian').toDate();

  const [hour, minute] = time.split(':').map(Number);

  // ساخت شیء تاریخ میلادی با ساعت و دقیقه دقیق (بدون شیفت روز)
  const datetime = new Date(
    gDateObj.getFullYear(),
    gDateObj.getMonth(),
    gDateObj.getDate(),
    hour,
    minute,
    0,
    0
  );

  if (datetime < new Date()) {
    alert("زمان واردشده نمی‌تواند قبل از الان باشد!");
    return;
  }

  // ذخیره تاریخ شمسی برای نمایش + تاریخ میلادی برای هشدار
  addTask(text, persianDateStr, time, gDateObj.getFullYear() + '-' + 
    String(gDateObj.getMonth()+1).padStart(2,'0') + '-' + 
    String(gDateObj.getDate()).padStart(2,'0'));

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

    // نمایش تاریخ شمسی ذخیره شده + زمان
    const shamsiDateTime = `${task.persianDate} ${task.time}`;
    tdDate.textContent = toPersianNumber(shamsiDateTime);

    const tdDone = document.createElement('td');
    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.completed ? '\u2714' : '\u{1F6AB}';
    doneBtn.className = 'done-btn';
    doneBtn.addEventListener('click', () => toggleComplete(index));
    tdDone.appendChild(doneBtn);

    const tdDelete = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '\u274C';
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

  scheduleAlarms(tasks);
}

// برنامه‌ریزی هشدارها فقط برای تسک‌های آینده
function scheduleAlarms(tasks) {
  tasks.forEach(task => {
    if (!task.completed) {
      const [year, month, day] = task.date.split('-').map(Number);
      const [hour, minute] = task.time.split(':').map(Number);
      const datetime = new Date(year, month - 1, day, hour, minute);
      const now = new Date();
      const delay = datetime - now;
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







// درخواست دسترسی نوتیفیکیشن
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

requestNotificationPermission();
renderTasks();

function toPersianNumber(number) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return number.toString().replace(/\d/g, d => persianDigits[d]);
}

