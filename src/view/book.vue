<template>
  <div class="info">
    <div class="wrap">
      <div class="home-search">
        <el-input placeholder="请输入查询关键字" v-model="search" class="input-with-select">
          <el-button type="primary" @click="searchForm" class="el-icon-search btn" slot="append"></el-button>
        </el-input>
        <el-button class="my-card">我的购物车<i class="el-icon-information"></i></el-button>
      </div>
      <div class="rank">
        <div class="sidebar" v-for="(item, index) in rankBookList" :key="index">
          <p>{{item.typeName}}</p>
          <dl
            class="rank-list"
            v-for="data in item.dataList"
            :key="data.bookId"
            @click="handleViewBookDetil(data)"
          >
            <dd>
              <img :src="data.img" alt />
            </dd>
            <dt>
              <p class="title" :title="data.bookName">{{data.author}}.{{data.bookName}}</p>
              <p>
                <em style="color:red">¥ {{data.salePrice * data.discount}}</em>
              </p>
            </dt>
          </dl>
        </div>
      </div>
      <div class="info-box">
        <div class="breadcrumb">
          <em>您的位置：</em>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>书籍列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询总销量URL
      statSaleCountUrl: this.$url + "statistics/statisticses",
      //查询新书URL
      newBookListUrl: this.$url + "book/queryListPage2",
      //类型ID
      typeId: "",
      //搜索内容
      search: "",
      rankBookList: [
        {
          typeName: "畅销榜",
          dataList: []
        },
        {
          typeName: "新品上市",
          dataList: []
        }
      ]
    };
  },
  mounted: function() {
    this.typeId = this.$route.params.typeId;
    this.search = this.$route.params.search;
    //查询畅销榜
    this.initStatisticsList(0);
    //查询新品上市
    this.initNewBookList(1);
  },
  computed: {},
  methods: {
    //查询畅销榜
    initStatisticsList(index) {
      var _this = this;
      var params = Object.assign(
        {
          statisticsType: "1",
        }
      );
      _this.$ajax.post(_this.statSaleCountUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.rankBookList[index].dataList = res.data.list;
        } else {
          _this.rankBookList[index].dataList = [];
        }
      });
    },
    //查询新品上市
    initNewBookList(index) {
      var _this = this;
      _this.$ajax.post(_this.newBookListUrl, null).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.rankBookList[index].dataList = res.data.list;
        } else {
          _this.rankBookList[index].dataList = [];
        }
      });
    },
    //查看图书详情
    handleViewBookDetil(data){

    }
  }
};
</script>