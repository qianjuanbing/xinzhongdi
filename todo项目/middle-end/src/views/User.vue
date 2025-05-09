<template>
  <div>
    <h2 class="title">用户管理</h2>
    <el-row class="btns">
      <el-button type="primary" size="mini" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon> 添加</el-button
      >
      <el-button type="danger" size="mini"
        ><el-icon><Delete /></el-icon> 删除选中</el-button
      >
    </el-row>
  </div>

  <el-card class="user-table">
    <el-table :data="userData" border stripe>
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="users">
          <el-button size="mini" @click="handleUpdate(users.row.id)"
            >编辑
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(users.row.id)"
            >删除
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page"
    :page-sizes="[1, 10, 20, 100]"
    :page-size="size"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
  <!-- 对话框 -->
  <el-dialog
    :title="isEdit ? '修改用户' : '添加用户'"
    v-model="dialogVisible"
    width="40%"
  >
    <el-form ref="userForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  name: "User",
  data() {
    return {
      isEdit: false, // Add this property
      userData: [],
      page: 1,
      size: 10,
      total: 0,
      dialogVisible: false,
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { len: 6, message: "密码长度为6位", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const users = await this.$http.get("/users", {
        params: { page: this.page, size: this.size },
      });
      this.total = users.result.total;
      this.userData = users.result.data;
    },
    handleSizeChange(val) {
      this.size = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    handleClick() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          this.$http.post("/users", this.from).then((data) => {
            const { code, message } = data;
            if (code == 0) {
              // 清空form表单旧的输入值
              this.$refs["user"].resetFields();

              this.$message.success(message);
              // 重新获取数据
              this.getUsers();
            } else {
              this.$message.error(message);
            }
          });
          // 关闭对话框
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // In handleUpdate method:
    async handleUpdate(id) {
      console.log("编辑用户", id);
      const user = await this.$http.get("/users/" + id);
      this.form = user.result; // Fix typo from 'from' to 'form'
      this.dialogVisible = true;
      this.isEdit = true;
    },

    submitForm() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          const url = this.isEdit ? `/users/${this.form.id}` : "/users";
          const method = this.isEdit ? "put" : "post";

          this.$http[method](url, this.form)
            .then((res) => {
              this.$message.success(this.isEdit ? "修改成功" : "添加成功");
              this.dialogVisible = false;
              this.isEdit = false; // Reset edit flag
              this.$refs.userForm.resetFields();
              this.getUsers();
            })
            .catch((error) => {
              this.$message.error(
                `${this.isEdit ? "修改" : "添加"}失败: ` + error.message
              );
            });
        }
      });
    },
    async handleDelete(id) {
      try {
        await this.$confirm("确认删除该用户吗？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        const res = await this.$http.delete(`/users/${id}`);
        if (res.code === 0) {
          this.$message.success("删除成功");
          this.getUsers();
        }
      } catch (error) {
        this.$message.info("已取消删除");
      }
    },
  },
};
</script>

<style>
.title {
  font-weight: 200;
  color: #333;
}
.btns {
  margin-top: 10px;
  padding: 10px;
  background-color: #ddd;
}
.user-table {
  margin-top: 20px;
}
</style>