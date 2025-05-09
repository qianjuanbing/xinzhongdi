const fsPromises = require('fs/promises');

(async function () {
  let name = await fsPromises.readFile('./name.txt', 'utf-8')
  let age = await fsPromises.readFile(name, 'utf-8')
  let money = await fsPromises.readFile(age, 'utf-8')
  console.log(money)

})();