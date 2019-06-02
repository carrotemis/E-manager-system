<!--  -->
<template>
  <div>
    <h1>用户信息登陆页面</h1>
    <div class="login">

      <el-form status-icon
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-input type="text"
                    v-model="ruleForm.username"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password"
                    v-model="ruleForm.password"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     style="width:100%"
                     @click="login">登陆</el-button>
          <!-- <el-button @click="resetForm">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: "",
        password: ""

      }
    }
  },
  methods: {
    async login () {
      const res = await this.$http.post('/login', this.ruleForm)
      const data = res.data
      const { meta: { status, msg } } = data
      if (status === 200) {
        const token = data.data.token
        sessionStorage.setItem('token', token)
        this.$message.success(msg)
        this.$router.push({ name: "Home" })
      } else {
        this.$message.error(msg)
      }

    }
  }
}
</script>
<style  scoped>
h1 {
  margin: 100px auto;
  margin-left: 3%;
  text-align: center;
}
.login {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>