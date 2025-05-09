// 一. 导入express
const express = require('express')
// 二. 实例化router对象
const router = express.Router()

const { DEBUG } = require('../config/config.default')

// 导入db模块
const { getAll, getById, exec } = require('../db')

/**
 * 提供分页的接口和总数的接口
 * GET /articles
 */
router.get('/articles', async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      // 返回分页数量
      const { page, limit } = req.query
      const offset = (page - 1) * limit

      const sql = `select * from zd_article limit ${offset}, ${limit}`
      const data = await getAll(sql)
      res.send({
        code: 0,
        message: '成功',
        result: data
      })
    } else if (req.query.count) {
      // 返回总记录数
      const sql = `select count(*) as num from zd_article`
      const data = await getById(sql)
      res.send({
        code: 0,
        message: '成功',
        result: data.num
      })
    } else {
      const sql = `select * from zd_article`
      const data = await getAll(sql)
      res.send({
        code: 0,
        message: '成功',
        result: data
      })
    }
  } catch (err) {
    res.status(500).send({
      code: 100105,
      message: '查询文章失败',
      result: DEBUG ? err : '',
    })
  }

})

router.get('/articles/:id', async (req, res) => {
  try {
    const sql = `select * from zd_article where id=${req.params.id}`
    const data = await getById(sql)
    res.send({
      code: 0,
      message: '成功',
      result: data
    })
  } catch (err) {
    res.status(500).send({
      code: 100106,
      message: '查询文章失败',
      result: DEBUG ? err : '',
    })
  }
})

router.post('/articles', async (req, res) => {
  try {
    let { title, publish_time, content } = req.body

    // Validate date format using regex
    if (!publish_time) {
      const now = new Date();
      publish_time = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ` +
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }

    // Use parameterized query with correct value types
    let sql = `INSERT INTO zd_article (title, publish_time, content) 
               VALUES (?, ?, ?)`

    const { insertId } = await exec(sql, [title, publish_time, content])
    const newArticle = await getById(`SELECT * FROM zd_article WHERE id=${insertId}`)

    res.send({
      code: 0,
      message: '添加成功',
      result: newArticle
    })
  } catch (err) {
    console.error('POST Error:', err)
    res.status(500).send({
      code: 100107,
      message: '添加失败: ' + err.message,
      result: DEBUG ? err : ''
    })
  }
})

router.put('/articles/:id', async (req, res) => {
  let { id } = req.params
  let { title, publish_time, content } = req.body

  // 修复1：添加缺失的引号
  let sql = `update zd_article 
    set title='${title}', 
    publish_time='${publish_time}',
    content='${content}' 
    where id=${id}`

  // 修复2：添加错误处理
  try {
    await exec(sql)
    // 获取更新后的数据
    const updatedData = await getById(`SELECT * FROM zd_article WHERE id=${id}`)

    res.send({
      code: 0,
      message: '更新成功',
      result: updatedData  // 返回数据库中的实际数据
    })
  } catch (err) {
    console.error('UPDATE Error:', err)
    res.status(500).send({
      code: 100109,
      message: '更新失败',
      result: DEBUG ? err.message : ''
    })
  }
})



router.delete('/articles/:id', async (req, res) => {
  const id = req.params.id
  const sql = `delete from zd_article where id=${id}`
  await exec(sql)
  res.send({
    code: 0,
    message: '删除成功',
    result: '',
  })
})


// 四. 导出router对象
module.exports = router
