var express = require('express');
var router = express.Router();
const { getAll, getById, exec } = require('../db')

/* GET users listing. */
router.get('/', async (req, res) => {
  const { page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;

  // Add parameter validation
  if (isNaN(page) || isNaN(size) || size > 100) {
    return res.status(400).json({
      code: 1,
      message: 'Invalid pagination parameters'
    });
  }

  try {
    // Use Promise.all for parallel queries
    const [totalResult, dataResult] = await Promise.all([
      getById('SELECT COUNT(*) AS total FROM vue_users'),
      getAll(`SELECT id, username FROM vue_users LIMIT ${offset},${size}`)
    ]);

    res.json({
      code: 0,
      result: {
        total: totalResult.total,
        page: Number(page),
        size: Number(size),
        data: dataResult
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      code: 2,
      message: 'Database operation failed'
    });
  }
});

router.get('/:id', async (req, res) => {
  let { id } = req.params
  let sql = `select * from vue_users where id=${id}`
  const user = await getById(sql)
  res.send({
    code: 0,
    message: '获取用户信息成功',
    result: user
  })
})

router.post('/', async (req, res) => {
  const { username, password } = req.body
  let sql = `insert into vue_users values (null,'${username}', '${password}')`
  await exec(sql)

  res.send({
    code: 0,
    message: '添加用户成功',
    result: ''
  })

})

router.put('/:id', async (req, res) => {
  let { id } = req.params
  let { username, password } = req.body

  let sql = `update vue_users set username='${username}',password='${password}' where id=${id}`
  await exec(sql)
  res.send({
    code: 0,
    message: '修改用户成功',
    result: ''
  })
})

router.delete('/:id', async (req, res) => {
  let { id } = req.params
  let sql = `delete from vue_users where id=${id}`
  await exec(sql)
  res.send({
    code: 0,
    message: '删除用户成功',
    result: ''
  })
})

module.exports = router;
