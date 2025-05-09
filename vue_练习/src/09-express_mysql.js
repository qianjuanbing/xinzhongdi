const mysql = require('mysql')

const con = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'sys'
})

con.connect()

con.query('select * from student', (err, data) => {
  if (err) throw err
  console.log(data)
})

con.end()