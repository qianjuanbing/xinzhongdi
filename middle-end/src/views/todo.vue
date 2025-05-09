<template>
  <div>
    <el-container class="page">
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <el-row class="btns" :span="24">
            <el-button type="danger" size="mini">删除</el-button>
            <el-button type="primary" size="mini" @click="handleAdd"
              >添加文章</el-button
            >
          </el-row>

          <!-- 添加表格 -->
          <el-table
            border
            stripe
            :data="articles"
            style="width: 100%"
            id="article-table"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="点击数" prop="click"></el-table-column>
            <el-table-column label="日期" prop="publish_time"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <!-- 添加作用域插槽 -->
                <el-button
                  type="danger"
                  size="mini"
                  @click="handleDelete(scope.row.id)"
                  >删除</el-button
                >

                <el-button
                  type="primary"
                  size="mini"
                  @click="handleEdit(scope.row.id)"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.page"
            :page-sizes="[5, 10, 20]"
            :page-size="queryInfo.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>

          <!-- 添加弹窗 -->
          <el-dialog title="提示" v-model="dialogVisible" width="50%">
            <el-from :model="formData" label-width="100px">
              <el-form-item label="标题">
                <el-input v-model="formData.title"></el-input>
              </el-form-item>
            </el-from>
            <el-form-item label="日期">
              <el-date-picker
                placeholder="选择日期"
                v-model="formData.publish_time"
                type="date"
                value-format="YYYY-MM-DD"
                format="YYYY/MM/DD"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                type="textarea"
                :rows="10"
                v-model="formData.content"
              ></el-input>
            </el-form-item>

            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
              </span>
            </template>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Todo",

  data() {
    return {
      articles: [
        // {
        //   id: "1",
        //   title: "test1",
        //   click: 0,
        //   publish_time: "2021-03-30",
        //   content: "123",
        // },
      ],
      // Add pagination data
      queryInfo: {
        page: 1,
        limit: 5,
      },
      total: 0,
      dialogVisible: false, // 控制弹窗的显示与隐藏
      formData: {
        title: "",
        content: "",
        publish_time: "",
      },
    };
  },
  created() {
    this.getTotal();
    this.getArticles();
  },
  methods: {
    getData() {
      this.$axios({
        method: "get",
        url: "http://localhost:3000/api/articles", // 添加 /api 前缀
        params: this.queryInfo,
      }).then((res) => {
        this.articles = res.data.result; // 根据后端响应结构调整
      });
    },
    getTotal() {
      this.$axios({
        method: "get",
        url: "http://localhost:3000/api/articles", // 添加 /api 前缀
        params: { count: 1 },
      }).then((res) => {
        this.total = res.data.result.num; // 根据后端响应结构调整
      });
    },
    // Add this missing method
    getArticles() {
      this.$axios
        .get("http://localhost:3000/api/articles") // 添加 /api 前缀
        .then((res) => {
          this.articles = res.data.result;
          this.total = res.data.result.length;
        })
        .catch((error) => {
          console.error("API Error:", error);
          this.$message.error(error.message);
        });
    },

    // Keep existing methods below
    handleSizeChange(newSize) {
      this.queryInfo.limit = newSize;
      this.getData();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getData();
    },

    // 添加文章
    handleAdd() {
      // 显示弹出框
      this.dialogVisible = true;
    },

    // 添加提交方法
    submit() {
      if (
        !this.formData.title ||
        !this.formData.content ||
        !this.formData.publish_time
      ) {
        return this.$message.warning("请填写完整的文章信息");
      }

      const url = this.isEdit
        ? `http://localhost:3000/api/articles/${this.formData.id}`
        : "http://localhost:3000/api/articles";

      const method = this.isEdit ? "put" : "post";

      this.$axios[method](url, this.formData)
        .then(() => {
          this.dialogVisible = false;
          this.getData();
        })
        .catch((error) => {
          console.error("Submit error:", error);
          this.$message.error(this.isEdit ? "更新失败" : "添加失败");
        });
    },

    handleDelete(id) {
      this.$axios
        .delete(`http://localhost:3000/api/articles/${id}`)
        .then(() => {
          this.getData();
        })
        .catch((error) => {
          console.error("Delete error:", error);
          this.$message.error("删除失败");
        });
    },
    handleEdit(id) {
      // 显示对话框
      this.dialogVisible = true;
      this.$axios
        .get("http://localhost:3000/api/articles/" + id)
        .then((res) => {
          this.formData = res.data;
        });
      this.isEdit = true;
    },
  },
};
</script>

<style>
.page {
  height: 100vh; /* 修改1：设置容器高度为视口高度 */
}
.el-header {
  background-color: #666;
}
.el-aside {
  background-color: #ccc;
}
.el-main {
  /* 修改2：修正拼写错误 mian -> main */
  background-color: #fff;
}
.btns {
  background-color: #f0f0f0;
  padding: 10px 0 10px 10px;
}
</style>