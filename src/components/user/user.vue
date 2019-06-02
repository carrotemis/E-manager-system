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
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input class="searchInput"
                  clearable
                  placeholder="请输入内容">
          <el-button slot="append"
                     icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success"
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
                     icon="el-icon-edit"
                     circle></el-button>
          <el-button plain
                     size="mini"
                     type="danger"
                     icon="el-icon-delete"
                     circle></el-button>
          <el-button plain
                     size="mini"
                     type="success"
                     icon="el-icon-check"
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

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      pagenum: 1,
      pagesize: 2,
      total: -1

    };
  },
  created () {
    this.loadData();

  },
  components: {},

  computed: {},

  mounted: {},

  methods: {
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
          pagesize: this.pagesize
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