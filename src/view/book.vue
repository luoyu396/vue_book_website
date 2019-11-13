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
              <img :src="$imgUrl+data.downloadUrl" alt />
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
        <div class="search-box">
      <h3 class="search-title">商品筛选</h3>
      <div class="search-content">
        <ul>
          <li class="search-content-container">
            <ul class="left">
              <li class="">
                <div>
                  <label class="title">分类:</label>
                  <select-tree ref="typeIdTree"
                    class="input_item"
                    :props="props"
                    :options="treeNodeList"
                    :value="searchParams.typeId"
                    :clearable="isClearable"
                    :accordion="isAccordion"
                    @getvalue="getvalue($event)"
                  ></select-tree>
                </div>
              </li>
              <li class="type-radio">
                <div>
                  <label class="title">出版社:</label>
                  <el-radio-group v-model="searchParams.publisher">
                    <el-radio 
                      v-for="item in publisherList" 
                      :key="item"
                      :label="item"
                      >
                      {{item}}
                    </el-radio>
                  </el-radio-group>
                </div>
              </li>
            </ul>
            <div class="right">
              <el-button class="search-btn" type="primary">搜索</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>



      </div>
      
    </div>
  </div>
</template>

<script>
import treeSelect from "@/components/tree-select.vue";

export default {
  components: {
    "select-tree": treeSelect
  },
  data() {
    return {
      //查询总销量URL
      statSaleCountUrl: this.$url + "statistics/statisticses",
      //查询新书URL
      newBookListUrl: this.$url + "book/queryListPage2",
      //树形节点URL
      treeNodeUrl: this.$url + "type/treeNodes",
      //获取出版社
      publishersUrl: this.$url + "book/publishers",
      //获取作者
      selectAuthorsUrl: this.$url + "book/authors",
      //搜索内容
      search: "",
      //分类id
      typeId: "",
      //查询参数
      searchParams: {
        typeId: "",
        publisher: "",
        author: ""
      },
      rankBookList: [
        {
          typeName: "畅销榜",
          dataList: []
        },
        {
          typeName: "新品上市",
          dataList: []
        }
      ],
      //树形节点集合
      treeNodeList: [],
      // 可清空（可选）
      isClearable: true,
      // 可收起（可选）
      isAccordion: true,
      // 配置项（必选）
      props: {
        value: "id",
        label: "label",
        children: "children"
      },
      //出版社
      publisherList: [],
      //作者
      authorList: []
    };
  },
  created: function() {
    //获取分类树形节点集合
    this.getTreeNodeList();
    //查询畅销榜
    this.initStatisticsList(0);
    //查询新品上市
    this.initNewBookList(1);
    //获取出版社
    this.selectPublishers();
    //获取作者
    this.selectAuthors();
  },
  mounted: function() {
    let _this = this;
    _this.search = _this.$route.params.search;
    _this.typeId = _this.$route.query.typeId;
    setTimeout(function() {
      _this.searchParams.typeId = _this.$route.query.typeId;
    }, 500);
  },
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
    //获取分类树形节点集合
    getTreeNodeList() {
      let _this = this;
      _this.$ajax.get(_this.treeNodeUrl).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.treeNodeList = res.data;
        }else {
          _this.treeNodeList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    // 下拉切换 取值
    getvalue(value){
      this.typeId = value == null ? "" : value;
    },
    //获取出版社
    selectPublishers() {
      let _this = this;
      _this.$ajax.get(_this.publishersUrl).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.publisherList = res.data;
        }else {
          _this.publisherList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    //获取作者
    selectAuthors() {
      let _this = this;
      _this.$ajax.get(_this.selectAuthorsUrl).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.authorList = res.data;
        }else {
          _this.authorList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },

    //查询
    searchForm(){
      let _this = this;
      _this.$ajax.get(_this.treeNodeUrl).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.treeNodeList = res.data;
        }else {
          _this.treeNodeList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    //查看图书详情
    handleViewBookDetil(data){

    }
  }
};
</script>