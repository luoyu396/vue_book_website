<!--普通用户注册页面-->
<template>
  <div class="register">
    <el-form :model="userFormData" ref="userFormData" :rules="rules">
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
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      //查询列表URL
      initListUrl: this.$url + "user/queryListPage2",
      //保存URL
      saveUrl: this.$url + "user/save",
      //更新URL
      updateUrl: this.$url + "user/update",
      //删除URL
      deleteUrl: this.$url + "user/delete",
      //更新密码
      updatePasswordUrl: this.$url + "user/updatePassword",
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 1,
      //宽度
      formLabelWidth: "150px",
      //查询参数
      searchParams: {
        loginName: "",
        userName: "",
        userType: "",
        telphone: "",
        email: ""
      },
      //列表数据
      userList: [],
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
      },
      //弹框
      userDialogVisible: false,
      //表单名
      userTitle: "",
      //修改密码
      userPassDialogVisible: false
    };
  },
  methods: {
    //查询
    onSearch() {
      this.currentPage = 1;
      this.initList();
    },
    //初始化列表
    initList() {
      var _this = this;
      let params = new URLSearchParams();
      params.append("page", _this.currentPage);
      params.append("rows", _this.pageSize);
      params.append("loginName", _this.searchParams.loginName);
      params.append("userName", _this.searchParams.userName);
      params.append("userType", _this.searchParams.userType);
      params.append("telphone", _this.searchParams.telphone);
      params.append("email", _this.searchParams.email);
      params.append("contentType", 1);
      _this.$ajax.post(_this.initListUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.userList = res.data.list;
          _this.total = res.data.total;
          _this.currentPage = res.data.pageNum;
          _this.pageSize = res.data.pageSize;
        } else {
          _this.userList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    //创建实例
    getInstance() {
        return {
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
        }
    },
    //添加用户
    addUser() {
      this.userTitle = "添加用户";
      this.loading = false;
      this.userFormData = this.getInstance();
      this.userDialogVisible = true;
    },
    //编辑用户
    toEdit(row) {
      this.userTitle = "修改用户";
      this.loading = false;
      this.userFormData = Object.assign({}, row);
      this.userDialogVisible = true;
    },
    //删除用户
    toDelete(row) {
      var _this = this;
      _this
        .$confirm("确认删除记录吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          //执行删除操作
          _this.$ajax.delete(_this.deleteUrl + "/" + row.userId).then(res => {
            res = res.data;
            if (res.code == 200) {
              _this.$message({
                message: "删除成功",
                type: "success"
              });
              _this.initList();
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initList();
    },
    //关闭弹框
    handleClose(formName) {
      this.resetForm(formName);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //保存或更新用户
    saveOrUpdateUser(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
            _this.loading = true;
            _this.userFormData.password = _this.$md5(
                _this.userFormData.password
            );
            _this.$ajax.post(_this.saveUrl, _this.userFormData).then(res => {
                res = res.data;
                _this.loading = false;
                if (res.code == 200) {
                    _this.$message({
                        message: "注册成功",
                        type: "success"
                    });
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
    },
  },
  mounted() {
  }
};
</script>