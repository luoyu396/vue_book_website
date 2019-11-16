<!--普通用户信息页面-->
<template>
  <div>
    <div class="header">
      <div
        class="header-content"
        :style="{background:'transparent url(' + headerImage + ') center center no-repeat', backgroundSize:'100% 100%'}"
      >
        <div class="nav">
          <div class="wrap wrap-header">
            <span class="toIndexCss" @click="toHome">首页</span>
            <span class="other">
              <template v-if="userInfo != null && userInfo.userId != null">
                <span class="userNameCss">您好，{{userInfo.userName}}</span>
                <el-button type="primary" @click="toLogout">退出</el-button>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="user-wrap wrap">
      <div class="search-box">
        <el-tabs
          v-model="activeName"
          tab-position="left"
          class="menu-list-tab"
          @tab-click="changeTab"
        >
          <el-tab-pane
            :label="element.label"
            :name="element.id"
            v-for="(element, index) of tabList"
            :key="index"
          >
            <div slot="label">
              <span :title="element.label">{{element.label}}</span>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="el-tabs-content">
          <template v-if="activeName == 'user'">
            <el-form :model="userFormData" ref="userFormData" :rules="rules">
              <el-form-item
                label="登录名:"
                :label-width="formLabelWidth"
                prop="loginName"
              >{{userFormData.loginName}}</el-form-item>
              <el-form-item label="用户名:" :label-width="formLabelWidth" prop="userName">
                <el-input v-model="userFormData.userName" autocomplete="off" style="width: 300px;"></el-input>
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
              <div style="padding-left: 200px;">
                <el-button type="primary" @click="updateUser('userFormData')" :loading="loading">保存</el-button>
              </div>
            </el-form>
          </template>
          <template v-else-if="activeName == 'password'">
            <el-form :model="userPassFormData" ref="userPassFormData" :rules="rules">
              <el-form-item label="原始密码:" :label-width="formLabelWidth" prop="oldPassword">
                <el-input
                  v-model="userPassFormData.oldPassword"
                  autocomplete="off"
                  show-password
                  style="width: 300px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="新密码:" :label-width="formLabelWidth" prop="newPassword">
                <el-input
                  v-model="userPassFormData.newPassword"
                  autocomplete="off"
                  show-password
                  style="width: 300px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码:" :label-width="formLabelWidth" prop="confirmPassword">
                <el-input
                  v-model="userPassFormData.confirmPassword"
                  autocomplete="off"
                  show-password
                  style="width: 300px;"
                ></el-input>
              </el-form-item>
            </el-form>
            <div style="padding-left: 200px;">
              <el-button
                type="primary"
                @click="updatePassword('userPassFormData')"
                :loading="loading"
              >保存</el-button>
            </div>
          </template>
          <template v-else-if="activeName == 'order'">
            <el-tabs v-model="orderStatus" @tab-click="changeOrderStatusTab">
              <el-tab-pane
                :label="element.label"
                :name="element.id"
                v-for="(element, index) of orderStatusList"
                :key="index"
              ></el-tab-pane>
            </el-tabs>
            <div v-for="(item, index) in orderInfoList" :key="index" style="min-height: 100px;">
              <div class="el-card box-card text is-always-shadow">
                <div class="el-card__header">
                  <div class="clearfix">
                    <span>{{item.createTime | formaterTime}}</span>
                    <span>订单号：{{item.orderId}}</span>
                    <span>总额：￥{{item.totalMoney}}</span>
                    <span>状态：{{orderStatusList.find(status=>status.id === item.orderStatus).label}}</span>
                  </div>
                </div>
                <div class="el-card__body">
                  <el-table
                    :data="item.orderItemInfoList"
                    border
                    style="width: 100%;min-height: 100px;"
                    stripe
                  >
                    <el-table-column prop="itemId" label="订单详情" align="left">
                      <template slot-scope="scope">
                          <img
                            style="width:100px;height:100px;"
                            :src="$imgUrl+scope.row.downloadUrl"
                          />
                          {{scope.row.bookName}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="bookPrice" label="图书价格" align="center">
                      <template slot-scope="scope">
                        ￥{{scope.row.bookPrice}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="bookCount" label="数量" align="center"></el-table-column>
                    <el-table-column prop="subTotal" label="小计" align="center">
                      <template slot-scope="scope">
                        ￥{{scope.row.subTotal}}
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="收货人" width="200">
                      {{userInfo.userName}}
                    </el-table-column>
                  </el-table>
                  <div style="text-align: right; margin-top: 10px;">
                    <template v-if="item.orderStatus == '1'">
                      <el-button type="primary" @click="cancelOrder(item)">取消订单</el-button>
                    </template>
                    <template v-if="item.orderStatus == '2'">
                      <el-button type="primary" @click="confirmOrder(item)">确认收货</el-button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
var moment = require("moment");

export default {
  data() {
    let oldValid = (rule, value, callback) => {
      let _this = this;
      if (_this.userInfo.password != _this.$md5(value)) {
        callback(new Error("原始密码错误"));
      } else {
        callback();
      }
    };
    let newValid = (rule, value, callback) => {
      let _this = this;
      if (_this.userPassFormData.confirmPassword != "") {
        if (
          _this.userPassFormData.confirmPassword !=
          _this.userPassFormData.newPassword
        ) {
          callback(new Error("新密码与确认密码错误"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let confirmValid = (rule, value, callback) => {
      let _this = this;
      if (_this.userPassFormData.newPassword != "") {
        if (
          _this.userPassFormData.confirmPassword !=
          _this.userPassFormData.newPassword
        ) {
          callback(new Error("新密码与确认密码错误"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      //更新URL
      updateUrl: this.$url + "user/update",
      //更新密码
      updatePasswordUrl: this.$url + "user/updatePassword",
      //更新当前会话用户信息
      updateSessionUserUrl: this.$url + "user/updateSessionUser",
      //订单条目
      orderItemUrl: this.$url + "orderInfo/orderInfoAndItemList",
      //更新URL
      updateOrderUrl: this.$url + "orderInfo/update",
      currentPage: 1,
      pageSize: 10,
      total: 1,
      //订单状态
      orderStatus: "",
      //订单状态集合
      orderStatusList: [
        {
          id: "",
          label: "全部订单"
        },
        {
          id: "1",
          label: "已提交"
        },
        {
          id: "2",
          label: "待收货"
        },
        {
          id: "3",
          label: "已完成"
        },
        {
          id: "4",
          label: "已取消"
        }
      ],
      loading: false,
      headerImage: require("@/assets/img/banner.png"),
      userInfo: {},
      activeName: "user",
      tabList: [
        {
          id: "user",
          label: "用户信息"
        },
        {
          id: "password",
          label: "修改密码"
        },
        {
          id: "order",
          label: "我的订单"
        }
      ],
      formLabelWidth: "150px",
      //用户信息
      userFormData: {},
      //规则
      rules: {
        oldPassword: [
          { required: true, message: "请输入原始密码", trigger: "blur" },
          { validator: oldValid, trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: newValid, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: confirmValid, trigger: "blur" }
        ],
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      },
      //修改密码表单
      userPassFormData: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      //订单集合
      orderInfoList: []
    };
  },
  mounted: function() {
    this.userInfo = this.sysData;
    this.userFormData = Object.assign({}, this.sysData);
  },
  filters: {
    //格式化时间
    formaterTime(value) {
      return moment(value).format("YYYY-MM-DD H:m:s");
    }
  },
  components: {},
  computed: {
    ...mapState({
      sysData(state) {
        return state;
      }
    })
  },
  methods: {
    //退出
    toLogout() {
      window.localStorage.clear();
      window.sessionStorage.clear();
      this.$store.commit("clearSysData", this.userInfo);
      this.$router.push({
        name: "login"
      });
    },
    //首页
    toHome() {
      this.$router.push({
        name: "index"
      });
    },
    //切换标签
    changeTab(tab) {
      this.activeName = tab.name;
      if (tab.name == "order") {
        //查询订单
        this.orderInfoAndItemList();
      }
    },
    //修改密码
    updatePassword(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          let params = new URLSearchParams();
          params.append("userId", _this.userInfo.userId);
          params.append(
            "password",
            _this.$md5(_this.userPassFormData.newPassword)
          );
          params.append("contentType", 1);
          _this.$ajax.put(_this.updatePasswordUrl, params).then(res => {
            res = res.data;
            _this.loading = false;
            if (res.code == 200) {
              //更新当前会话用户信息
              _this.updateSessionUser(_this.userInfo.userId);
              _this.$refs[formName].resetFields();
              _this.$message({
                message: "更新成功",
                type: "success"
              });
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
    //修改信息
    updateUser(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.loading = true;
          _this.$ajax.put(_this.updateUrl, _this.userFormData).then(res => {
            res = res.data;
            _this.loading = false;
            if (res.code == 200) {
              //更新当前会话用户信息
              _this.updateSessionUser(_this.userFormData.userId);
              _this.$message({
                message: "更新成功",
                type: "success"
              });
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
    //更新当前会话用户信息
    updateSessionUser(userId) {
      let _this = this;
      _this.$ajax.get(_this.updateSessionUserUrl + "/" + userId).then(res => {
        if (res.data.code == 200) {
          _this.userInfo = res.data.data;
          _this.$store.commit("setSysData", _this.userInfo);
        }
      });
    },
    //切换状态标签
    changeOrderStatusTab(tab) {
      this.orderStatus = tab.name;
      //查询订单
      this.orderInfoAndItemList();
    },
    //查询订单
    orderInfoAndItemList() {
      var _this = this;
      let params = Object.assign({
        currentPage: _this.currentPage,
        pageSize: _this.pageSize,
        userId: _this.userInfo.userId,
        orderStatus: _this.orderStatus == 0 ? "" : _this.orderStatus
      });
      _this.$ajax.post(_this.orderItemUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.orderInfoList = res.data.list;
          _this.total = res.data.total;
          _this.currentPage = res.data.pageNum;
          _this.pageSize = res.data.pageSize;
        } else {
          _this.orderInfoList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    //确认收货
    confirmOrder(orderInfo) {
      var _this = this;
      _this.$confirm("确认收货吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          _this.orderInfoFormData = Object.assign({}, orderInfo);
          _this.orderInfoFormData.orderStatus = "3";
          _this.$ajax.put(_this.updateOrderUrl, _this.orderInfoFormData).then(res => {
            res = res.data;
            if (res.code == 200) {
              _this.$message({
                message: "确认成功",
                type: "success"
              });
              //查询订单
              _this.orderInfoAndItemList();
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
      });
    },
    //取消订单
    cancelOrder(orderInfo) {
      var _this = this;
      _this.$confirm("确认取消订单吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          _this.orderInfoFormData = Object.assign({}, orderInfo);
          _this.orderInfoFormData.orderStatus = "4";
          _this.$ajax.put(_this.updateOrderUrl, _this.orderInfoFormData).then(res => {
            res = res.data;
            if (res.code == 200) {
              _this.$message({
                message: "取消成功",
                type: "success"
              });
              //查询订单
              _this.orderInfoAndItemList();
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
      });
    }
  }
};
</script>
<style scoped>
.toIndexCss {
  cursor: pointer;
  color: red;
  font-size: 16px;
  position: absolute;
  top: 12px;
  left: 20px;
}
.userNameCss {
  cursor: pointer;
  color: red;
  font-size: 16px;
  margin-right: 10px;
}
.text {
  font-size: 14px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}

.box-card .el-form-item {
  margin-bottom: 0px;
}

.el-card__header {
  height: 40px;
  padding: 0px 10px;
  line-height: 40px;
  background: #e5e5e5;
}

.el-card__header span {
  margin-right: 20px;
}

.el-card__body {
  padding-top: 10px;
}
.el-card__body p {
  height: 30px;
  line-height: 30px;
}
</style>
<style lang="scss">
.user-wrap {
  .search-box {
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(217, 217, 217, 1);
    box-sizing: border-box;
    .el-tabs.menu-list-tab {
      height: calc(100% - 220px);
      float: left;
      position: absolute;
      background: rgba(243, 245, 248, 1);
      border-right: none;
      .el-tabs__header {
        margin-right: 0px;
        .el-tabs__nav-wrap::after {
          background: transparent;
        }
        .el-tabs__nav {
          width: 200px;
          background: rgba(243, 245, 248, 1);
          border-radius: 2px 0px 0px 2px;
          .el-tabs__active-bar {
            display: none;
          }
          .el-tabs__item {
            height: 40px;
            line-height: 40px;
            border-radius: 2px 0px 0px 2px;
            font-size: 15px;
            font-weight: 400;
            text-align: center;
            color: rgba(85, 85, 85, 1);
            > div {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            &:hover {
              color: #295fbf;
            }
            &.is-active {
              background: rgba(41, 95, 191, 1);
              color: rgba(255, 255, 255, 1);
            }
          }
        }
      }
    }
    .el-tabs-content {
      float: left;
      padding: 15px 10px;
      box-sizing: border-box;
      width: calc(100% - 200px);
      height: 100%;
      margin-left: 200px;
    }
  }
}
</style>