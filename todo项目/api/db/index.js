// 连接数据库
// 1. 导入mysql的包
const mysql = require('mysql')

const config = require('../config/config.default')
// 2. 创建连接
const con = mysql.createConnection(config.mysql)
// 3. 连接
con.connect()

// 4. 执行sql con.query
// function getAll(sql, callback) {
//   con.query(sql, function (err, data) {
//     if (err) throw err

//     callback(data)
//   })
// }
function getAll(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, function (err, data) {
      if (err) reject(err)

      resolve(data)
    })
  })
}

function getById(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, function (err, data) {
      if (err) reject(err)

      if (Array.isArray(data)) {
        data[0] ? resolve(data[0]) : resolve(null)
      } else {
        reject(new TypeError('data must be an array'))
      }
    })
  })
}
function exec(sql, params = []) {
  return new Promise((resolve, reject) => {
    // Use parameterized queries to prevent SQL injection
    con.query(sql, params, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

// 对外暴露一些方法
module.exports = {
  getAll,
  getById,
  exec,
}
