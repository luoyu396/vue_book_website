<template>
  <div class="header">
    <div class="header-content" :style="{background:'transparent url(' + headerImage + ') center center no-repeat', backgroundSize:'100% 100%'}">
      <div class="nav">
        <div class="wrap wrap-header">
          <span class="other">
              <el-button type="primary">登录</el-button>
              <el-button type="primary">注册</el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headerImage: require('@/assets/img/banner.png'),
    };
  },
  mounted: function() {

  },
  components: {},
  computed:{

  },
  methods: {

  }
};
</script>

