<!--普通用户注册页面-->
<template>
  <div class="header">
    <div
      class="header-content"
      :style="{background:'transparent url(' + headerImage + ') center center no-repeat', backgroundSize:'100% 100%'}"
    >
      <div class="nav">
        <div class="wrap wrap-header">
          <span class="other">
            <el-button type="primary" @click="toLogin">登录</el-button>
          </span>
        </div>
      </div>
    </div>
    <p class="register-title">
      账号注册
    </p>
    <el-form :model="userFormData" ref="userFormData" :rules="rules" class="formCss">
      <el-form-item label="登录名:" :label-width="formLabelWidth" prop="loginName">
        <el-input v-model="userFormData.loginName" autocomplete="off" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="用户名:" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="userFormData.userName" autocomplete="off" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item
        v-if="userFormData.userId == ''"
        label="密码:"
        :label-width="formLabelWidth"
        prop="password"
      >
        <el-input
          v-model="userFormData.password"
          autocomplete="off"
          show-password
          style="width: 300px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="移动电话:" :label-width="formLabelWidth" prop="telphone">
        <el-input v-model="userFormData.telphone" autocomplete="off" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
        <el-input v-model="userFormData.email" autocomplete="off" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="地址:" :label-width="formLabelWidth" prop="address">
        <el-input v-model="userFormData.address" autocomplete="off" style="width: 300px;"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" @click="registerUser('userFormData')" :loading="loading">注册</el-button>
      <el-button type="primary" @click="reset('userFormData')" >重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      //保存URL
      saveUrl: this.$url + "user/save",
      headerImage: require('@/assets/img/banner.png'),
      loading: false,
      //宽度
      formLabelWidth: "150px",
      //表单
      userFormData: {
        userId: "",
        loginName: "",
        userName: "",
        userType: "1",
        password: "",
        telphone: "",
        email: "",
        address: "",
        createTime: new Date(),
        remark: ""
      },
      //规则
      rules: {
        loginName: [
          { required: true, message: "请输入登录名", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "change" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    //登录
    toLogin() {
      this.$router.push({
        name: "login"
      });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    //注册用户
    registerUser(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          _this.userFormData.password = _this.$md5(_this.userFormData.password);
          _this.$ajax.post(_this.saveUrl, _this.userFormData).then(res => {
            res = res.data;
            _this.loading = false;
            if (res.code == 200) {
              _this.$message({
                message: "注册成功",
                type: "success"
              });
              setTimeout(function() {
                //登录
                _this.toLogin();
              },1000);
              //调转
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        }
      });
    }
  },
  mounted() {}
};
</script>
<style scoped>
.formCss {
  width: 60%;
  margin-left: 35%;
}
.register-title {
  height: 2.75rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #438aff;
  line-height: 2.75rem;
  border-bottom: 1px solid #438AFF;
  text-align: center;
  margin-bottom: 1.5rem;
  width: 30%;
  margin-left: 35%;
}
</style>