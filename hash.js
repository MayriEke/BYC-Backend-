const bcrypt = require('bcrypt');


async function run() {
const password = '123456';
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);
console.log("Original password:", password);
console.log("hashed password:", hashed);
console.log("generated salt:", salt);
}

run();
