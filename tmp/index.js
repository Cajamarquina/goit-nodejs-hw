const now = new Date();

console.log(` today ${now.getFullYear()} year.`);

const { getCurrentMonth } = require("./DateFunctions");
const currentMonth = getCurrentMonth();

console.log(currentMonth);
