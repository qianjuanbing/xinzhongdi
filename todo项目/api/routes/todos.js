// 一. 导入express
const express = require('express')
// 二. 实例化router对象
const router = express.Router()

const { DEBUG } = require('../config/config.default')

// 导入db模块
const { getAll, getById, exec } = require('../db')
// 三. 编写路由规则
/**
 * 获取所有todos
 * GET /todos
 */
router.get('/', async (req, res) => {
  // 操作数据库
  let sql = `select id, content, updated_time from todos where deleted_time is null order by updated_time desc`

  try {
    // 正常的情况
    const resData = await getAll(sql)
    res.send({
      code: 0,
      message: '获取所有待办成功',
      result: resData,
    })
  } catch (err) {
    // 异常的情况
    res.send({
      code: 100101,
      message: '获取所有待办失败',
      result: DEBUG ? err : '',
    })
  }
  // 返回结果
})

/**
 * 根据id获取todo
 * GET /todos/:id
 */
router.get('/:id', async (req, res) => {
  // 一. 解析id
  let { id } = req.params
  // 二. 操作数据库
  let sql = `select id, content, updated_time from todos where id = ${id} and deleted_time is null`
  try {
    // 三. 返回结果
    var resData = await getById(sql)
  } catch (err) {
    res.send({
      code: 100103,
      message: '查询单个待办失败',
      result: DEBUG ? err : '',
    })
  }

  if (resData) {
    res.send({
      code: 0,
      message: '获取待办成功',
      result: resData,
    })
  } else {
    res.status(404).send({
      code: 100102,
      message: 'id对应的数据不存在',
      result: '',
    })
  }
})





/**
 * 添加todo
 * POST /todos {content: 'test'}
 */
router.post('/', async (req, res) => {
  // 解析参数(可以做参数格式的校验)
  const { content } = req.body
  if (!content) {
    return res.send({
      code: 100104,
      message: '参数格式不对',
      result: '',
    })
  }
  // 操作数据库
  let sql = `insert into todos (content) values ('${content}')`
  let { insertId } = await exec(sql)
  sql = `select id, content, updated_time from todos where id=${insertId}`
  const resData = await getById(sql)
  // 返回结果
  res.send({
    code: 0,
    message: '添加成功',
    result: resData,
  })
})

/**
 * 修改todo
 * PUT /todos/:id {content: 'test-new'}
 */
router.put('/:id', async (req, res) => {
  // 解析参数
  let { id } = req.params
  let { content } = req.body

  // 操作数据库
  let sql = `update todos set content='${content}' where id=${id}`
  await exec(sql)
  res.send({
    code: 0,
    message: '更新成功',
    result: {
      id,
      content,
    },
  })
})

/**
 * 删除todo
 * Delete /todos/:id
 */
router.delete('/:id', async (req, res) => {
  // 解析参数
  let { id } = req.params
  // 操作数据库
  let sql = `update todos set deleted_time = NOW() where id=${id}`
  await exec(sql)
  res.send({
    code: 0,
    message: '删除成功',
    result: '',
  })
  // 返回结果
})
// 四. 导出router对象
module.exports = router
