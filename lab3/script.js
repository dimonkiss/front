
// -----------------------------
// 1) Дані та операції для новин
// -----------------------------

const news = [
  { id: 1, title: "Економіка зростає", author: "Іваненко", shortMsgLength: 120, readDay1: 350, readDay2: 410, publishedAt: "2025-10-01T11:30:00" },
  { id: 2, title: "Спорт: перемога команди", author: "Петренко", shortMsgLength: 95, readDay1: 520, readDay2: 480, publishedAt: "2025-10-01T19:45:00" },
  { id: 3, title: "Погода: теплі дні", author: "Сидоренко", shortMsgLength: 80, readDay1: 210, readDay2: 260, publishedAt: "2025-10-01T09:10:00" },
  { id: 4, title: "Технології: новий смартфон", author: "Іваненко", shortMsgLength: 140, readDay1: 610, readDay2: 590, publishedAt: "2025-10-01T15:05:00" },
  { id: 5, title: "Культура: фестиваль", author: "Коваленко", shortMsgLength: 110, readDay1: 330, readDay2: 300, publishedAt: "2025-10-01T22:20:00" },
  { id: 6, title: "Освіта: реформа", author: "Петренко", shortMsgLength: 130, readDay1: 410, readDay2: 405, publishedAt: "2025-10-01T10:00:00" },
  { id: 7, title: "Медицина: вакцина", author: "Сидоренко", shortMsgLength: 150, readDay1: 450, readDay2: 470, publishedAt: "2025-10-01T17:59:00" },
  { id: 8, title: "Логістика: нові маршрути", author: "Іваненко", shortMsgLength: 100, readDay1: 280, readDay2: 310, publishedAt: "2025-10-01T05:55:00" },
  { id: 9, title: "Наука: відкриття", author: "Коваленко", shortMsgLength: 160, readDay1: 710, readDay2: 720, publishedAt: "2025-10-01T13:40:00" },
  { id: 10, title: "Політика: зустріч", author: "Петренко", shortMsgLength: 90, readDay1: 380, readDay2: 365, publishedAt: "2025-10-01T00:35:00" },
];

const newsSortedByAuthor = [...news].sort((a, b) => a.author.localeCompare(b.author, "uk"));

const averageLengthByAuthor = (() => {
  const sumCountByAuthor = new Map();
  for (const n of news) {
    const entry = sumCountByAuthor.get(n.author) || { sum: 0, count: 0 };
    entry.sum += n.shortMsgLength;
    entry.count += 1;
    sumCountByAuthor.set(n.author, entry);
  }
  const result = {};
  for (const [author, { sum, count }] of sumCountByAuthor.entries()) {
    result[author] = +(sum / count).toFixed(2);
  }
  return result;
})();

const maxReadDay1News = news.reduce((maxItem, item) => (item.readDay1 > maxItem.readDay1 ? item : maxItem), news[0]);
const maxReadDay1NewsId = maxReadDay1News.id;

function addNewsRecord(list, record) {
  const requiredKeys = ["id", "title", "author", "shortMsgLength", "readDay1", "readDay2", "publishedAt"];
  const hasAll = requiredKeys.every((k) => record[k] !== undefined && record[k] !== null);
  if (hasAll) {
    list.unshift(record);
  } else {
    list.push(record);
  }
}

// Оплата роботи автора за добу: 10:00–18:00 => 0.5 грн/символ, інакше 0.8 грн/символ
function calculateAuthorDailyPay(list) {
  const payByAuthor = new Map();
  for (const n of list) {
    const date = new Date(n.publishedAt);
    const hour = date.getHours();
    const isWorkHours = hour >= 10 && hour < 18; // [10:00, 18:00)
    const rate = isWorkHours ? 0.5 : 0.8;
    const add = n.shortMsgLength * rate;
    payByAuthor.set(n.author, (payByAuthor.get(n.author) || 0) + add);
  }
  const obj = {};
  for (const [author, pay] of payByAuthor.entries()) obj[author] = +pay.toFixed(2);
  return obj;
}

const authorPay = calculateAuthorDailyPay(news);

// Демонстраційне додавання новини
addNewsRecord(news, { id: 11, title: "Ринок праці", author: "Коваленко", shortMsgLength: 105, readDay1: 200, readDay2: 190, publishedAt: "2025-10-01T10:15:00" });
addNewsRecord(news, { id: 12, title: "Без автора" }); // неповний запис — в кінець

console.log("[Новини] Відсортовано за автором:", newsSortedByAuthor.map(n => ({ id: n.id, author: n.author, title: n.title })));
console.log("[Новини] Середня довжина за автором:", averageLengthByAuthor);
console.log("[Новини] ID з максимумом readDay1:", maxReadDay1NewsId);
console.log("[Новини] Оплата за добу (грн):", authorPay);

// -----------------------------
// 2) ООП-модель та операції для користувачів
// -----------------------------

class User {
  constructor({ surname, name, age, education, feedbackPurpose, date, time, gender }) {
    this.surname = surname;
    this.name = name;
    this.age = age;
    this.education = education;
    this.feedbackPurpose = feedbackPurpose;
    this.date = date;
    this.time = time;
    this.gender = gender;
  }

  get month() {
    return new Date(this.date + "T00:00:00").getMonth() + 1;
  }

  static filterByMonthAndTime(users, monthNumber, time) {
    return users.filter(u => u.month === monthNumber && u.time === time);
  }

  static getMinAge(users) {
    return users.reduce((min, u) => Math.min(min, u.age), users[0]?.age ?? Infinity);
  }

  static getTypicalEducationForMinAge(users) {
    const minAge = User.getMinAge(users);
    const educations = users.filter(u => u.age === minAge).map(u => u.education);
    return { minAge, educations };
  }

  static classify(users) {
    let womenHigher = 0, menNoEdu = 0, others = 0;
    for (const u of users) {
      const isWoman = u.gender === "ж";
      const isMan = u.gender === "ч";
      const higher = (u.education || "").toLowerCase() === "вища";
      const noEdu = (u.education || "").toLowerCase() === "без освіти";
      if (isWoman && higher) womenHigher++;
      else if (isMan && noEdu) menNoEdu++;
      else others++;
    }
    return { womenHigher, menNoEdu, others };
  }

  static sortByAgeDescThenAlphabet(users) {
    return [...users].sort((a, b) => {
      if (b.age !== a.age) return b.age - a.age;
      const bySurname = a.surname.localeCompare(b.surname, "uk");
      if (bySurname !== 0) return bySurname;
      return a.name.localeCompare(b.name, "uk");
    });
  }
}

const users = [
  new User({ surname: "Коваленко", name: "Олена", age: 28, education: "вища", feedbackPurpose: "Скарга", date: "2025-09-15", time: "10:00", gender: "ж" }),
  new User({ surname: "Іванов", name: "Петро", age: 35, education: "без освіти", feedbackPurpose: "Питання", date: "2025-10-05", time: "14:30", gender: "ч" }),
  new User({ surname: "Сидорова", name: "Марія", age: 22, education: "вища", feedbackPurpose: "Подяка", date: "2025-10-05", time: "14:30", gender: "ж" }),
  new User({ surname: "Петренко", name: "Ігор", age: 41, education: "середня", feedbackPurpose: "Пропозиція", date: "2025-10-01", time: "09:00", gender: "ч" }),
  new User({ surname: "Шевченко", name: "Анна", age: 19, education: "вища", feedbackPurpose: "Питання", date: "2025-08-20", time: "16:45", gender: "ж" }),
  new User({ surname: "Мельник", name: "Тарас", age: 29, education: "середня", feedbackPurpose: "Скарга", date: "2025-10-12", time: "08:10", gender: "ч" }),
  new User({ surname: "Романюк", name: "Ніна", age: 33, education: "вища", feedbackPurpose: "Подяка", date: "2025-10-12", time: "08:10", gender: "ж" }),
  new User({ surname: "Захарченко", name: "Олег", age: 19, education: "без освіти", feedbackPurpose: "Питання", date: "2025-07-02", time: "12:00", gender: "ч" }),
  new User({ surname: "Бондар", name: "Ірина", age: 45, education: "середня", feedbackPurpose: "Пропозиція", date: "2025-10-21", time: "18:20", gender: "ж" }),
  new User({ surname: "Дмитрук", name: "Сергій", age: 27, education: "вища", feedbackPurpose: "Питання", date: "2025-10-21", time: "18:20", gender: "ч" }),
];

// Приклад: користувачі, що звернулись у жовтні (10-й місяць) о 14:30
const filteredUsers = User.filterByMonthAndTime(users, 10, "14:30");
const { minAge, educations } = User.getTypicalEducationForMinAge(users);
const classes = User.classify(users);
const sortedUsers = User.sortByAgeDescThenAlphabet(users);

console.log("[Користувачі] Фільтр за жовтень і час 14:30:", filteredUsers.map(u => ({ surname: u.surname, name: u.name, time: u.time })));
console.log("[Користувачі] Мінімальний вік:", minAge, "Типова(і) освіта для мінімального віку:", [...new Set(educations)]);
console.log("[Користувачі] Класифікація:", classes);
console.log("[Користувачі] Сортування (вік ↓, алфавіт):", sortedUsers.map(u => ({ surname: u.surname, name: u.name, age: u.age })));