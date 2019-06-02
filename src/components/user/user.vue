<!--  -->
<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input v-model="searchValue"
                  class="searchInput"
                  clearable
                  placeholder="请输入内容">
          <el-button @click="handleSearch"
                     slot="append"
                     icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success"
                   @click="addUserDialogFormVisible = true"
                   plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="list"
              style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index"
                       width="50">
      </el-table-column>

      <el-table-column prop="username"
                       label="姓名"
                       width="180">
      </el-table-column>
      <el-table-column prop="email"
                       label="邮箱"
                       width="180">
      </el-table-column>
      <el-table-column prop="mobile"
                       label="电话"
                       width="300">
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <!-- scope.row就是当前绑定的数据对象 -->
          <el-switch v-model="scope.row.mg_state"
                     @change="handleSwitchChange(scope.row)"
                     active-color="#13ce66"
                     inactive-color="#ff4949">
          </el-switch>
        </template>

      </el-table-column>

      <el-table-column label="创建日期">
        <template slot-scope="scope">
          {{scope.row.create_time | filterTime('-')}}
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       width="300">
        <template slot-scope="scope">
          <el-button plain
                     size="mini"
                     type="primary"
                     @click="handleEdit(scope.row)"
                     icon="el-icon-edit"
                     circle></el-button>
          <el-button plain
                     size="mini"
                     type="danger"
                     @click="handleDelete(scope.row.id)"
                     icon="el-icon-delete"
                     circle></el-button>
          <el-button plain
                     size="mini"
                     type="success"
                     icon="el-icon-check"
                     @click="showRoleForm(scope.row)"
                     circle></el-button>
        </template>

      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pagenum"
                   :page-sizes="[1,2,3,4]"
                   :page-size="pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <!-- 添加用户 -->
    <el-dialog title="添加用户"
               :visible.sync="addUserDialogFormVisible">
      <el-form label-width="100px"
               :model="formData">
        <el-form-item label="用户名">
          <el-input v-model="formData.username"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.password"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.mobile"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户"
               :visible.sync="editUserDialogFormVisible">
      <el-form label-width="100px"
               :model="formData">
        <el-form-item label="用户名"
                      prop="username">
          <el-input disabled
                    v-model="formData.username"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.mobile"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
        <el-button @click='UserUpdate()'
                   type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色"
               :visible.sync="setRoleDialogFormVisible">
      <el-form label-width="100px">
        <el-form-item label="用户名"
                      prop="username">
          {{ formData.username }}
          <!-- <el-input disabled
                    auto-complete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="角色"
                      v-model="currentRoleId">
          <el-select v-model="currentRoleId">
            <el-option disabled
                       label="---请选择---"
                       :value="-1">
            </el-option>
            <el-option v-for="item in roles"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
        <el-button @click="handleSetRole()"
                   type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>

</template>

<script>
export default {
  data () {
    return {
      list: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 搜索参数
      searchValue: '',
      // 控制添加用户的对话框显示与隐藏
      addUserDialogFormVisible: false,
      editUserDialogFormVisible: false,
      setRoleDialogFormVisible: false,
      currentRolename: '',
      currentRoleId: -1,
      roles: [],
      // 绑定表单数据
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        id: '',
        role_name: ''
      },
      // form_rules: {
      //   username: [
      //     { required: true, message: "用户名描述不能为空！", trigger: "blur" }
      //   ],
      //   password: [
      //     { required: true, message: "密码不能为空！", trigger: "blur" }
      //   ],
      //   email: [
      //     { required: true, message: "邮箱不能为空！", trigger: "blur" }
      //   ],
      // }
    };
  },
  created () {
    this.loadData();

  },
  components: {},

  computed: {},

  mounted: {},

  methods: {
    async handleSetRole () {
      console.log(22)
      console.log(this.formData.id)
      console.log(this.currentRoleId)
      const res = await this.$http.put(`users/${this.formData.id}/role`, {
        rid: this.currentRoleId
      })
      const data = res.data
      console.log(data)
      const { meta: { status, msg } } = data
      if (status === 200) {
        this.setRoleDialogFormVisible = false
        this.$message.success(msg)
        // 重置数据
        this.currentUsername = ''
        this.currentRoleId = -1
        this.currentUserId = -1
      } else {
        this.$message.error(msg)
      }
    },


    async showRoleForm (user) {
      this.setRoleDialogFormVisible = true
      const res = await this.$http.get('roles')
      this.roles = res.data.data
      this.formData = user
      const res1 = await this.$http.get(`users/${user.id}`)
      this.currentRoleId = res1.data.data.rid



    },
    async  UserUpdate () {
      console.log(11)
      const res = await this.$http.put(`users/${this.formData.id}`, {
        mobile: this.formData.mobile,
        email: this.formData.email
      })
      const data = res.data
      const { meta: { status, msg } } = data
      if (status === 200) {
        this.$message.success(msg)
        this.editUserDialogFormVisible = false
        this.loadData()
        for (const key in this.formData) {
          this.formData[key] = ''
        }
      } else {
        this.$message.error(msg)
      }
    },
    handleEdit (user) {
      this.editUserDialogFormVisible = true;
      this.formData = user
    },
    async addUser () {
      // this.addUserDialogFormVisible = true
      const res = await this.$http.post('users', this.formData)
      const data = res.data
      const { meta: { status, msg } } = data
      if (status === 201) {
        // 添加成功
        // 隐藏对话框
        this.addUserDialogFormVisible = false
        // 提示成功
        this.$message.success(msg)
        // 重新加载数据
        this.loadData()
        // 清空文本输入框的值
        for (const key in this.formData) {
          this.formData[key] = ''
        }
      } else {
        this.$message.error(msg)
      }
    },

    handleDelete (userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`)
          const data = res.data
          // console.log(data)
          const { meta: { status, msg } } = data

          if (status === 200) {
            // 删除成功 重新加载数据
            this.pagenum = 1
            this.loadData()
          } else {
            this.$message({
              type: 'success',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: msg
          })
        })

    },

    async handleSwitchChange (row) {
      const res = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      const data = res.data
      // console.log(data)
      const { meta: { status, msg } } = data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }

    },
    handleSearch () {
      this.loadData();
    },


    handleSizeChange (val) {
      // size发生变化
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1
      this.loadData();
    },
    handleCurrentChange (val) {
      // 页码发生变化
      console.log(`当前页: ${val}`);
      this.pagenum = val
      this.loadData();
    },



    async loadData () {
      const res = await this.$http.get('users', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.searchValue
        }      })

      console.log(res);
      const data = res.data
      const { meta: { msg, status } } = data
      if (status === 200) {
        const { data: { users } } = data
        this.list = users
        this.$message.success(msg)
        console.log(data.data.total + "hhhhhhhhhhhhhhhhhhhhhhhhhhhh")
        this.total = data.data.total
        console.log(this.total + "nnnnnnnnnnnnnnnnnnnnnn")
      } else {
        this.$message.error(msg)
      }
    }
  }
}

</script>
<style  scoped>
.box-card {
  height: 100%;
}
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>