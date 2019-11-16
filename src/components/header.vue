<template>
  <div class="header">
    <div class="header-content" :style="{background:'transparent url(' + headerImage + ') center center no-repeat', backgroundSize:'100% 100%'}">
      <div class="nav">
        <div class="wrap wrap-header">
          <span class="other">
              <template v-if="user != null && user.userId != null">
                <span class="userNameCss" @click="toUserInfo('user')">您好，{{user.userName}}</span>
                <el-button type="primary" @click="toUserInfo('order')">我的订单</el-button>
                <el-button type="primary" @click="toLogout">退出</el-button>
              </template>
              <template v-else>
                <el-button type="primary" @click="toLogin">登录</el-button>
                <el-button type="primary" @click="toRegister">注册</el-button>
              </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    user:{type:Object}
  },
  data() {
    return {
      headerImage: require('@/assets/img/banner.png'),
    };
  },
  methods: {
    //登录
    toLogin() {
      this.$router.push({
        name: "login"
      });
    },
    //退出
    toLogout(){
      window.localStorage.clear();
      window.sessionStorage.clear();
      this.$store.commit("clearSysData",this.user);
      this.$router.push({
        name: "login"
      });
    },
    //注册
    toRegister() {
      this.$router.push({
        name: "register"
      });
    },
    //用户信息页面
    toUserInfo(type) {
      this.$router.push({
        name: "user_info",
        params: {type: type}
      });
    }
  }
};
</script>
<style scoped>
.userNameCss {
  cursor: pointer;
  color: red;
  font-size: 16px;
  margin-right: 10px;
}
</style>
