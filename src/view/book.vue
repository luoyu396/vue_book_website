<!--图书展示列表-->
<template>
  <div class="info">
    <div class="wrap">
      <div class="home-search">
        <el-input placeholder="图书名称/出版社/作者/ISBN" v-model="search" class="input-with-select">
          <el-button type="primary" @click="searchForm" class="el-icon-search btn" slot="append"></el-button>
        </el-input>
        <el-button class="my-card" @click="myCard">
          我的购物车
          <i class="el-icon-information"></i>
        </el-button>
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
          <p class="header-title">商品筛选
          </p>
          <ul class="search-body-wrap">
            <li class="parent-node">
              <p class="title-text">
                分类:
              </p>
              <div>
                <select-tree
                  ref="typeIdTree"
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
            <li class="parent-node">
              <p class="title-text">
                出版社:
              </p>
              <div>
                  <span
                    v-for="(publisher, valueIndex) in publisherList"
                    :key="valueIndex"
                    :class="searchParams.publisher == publisher ? 'selected search-btn' : 'search-btn'"
                    @click="changePublisher(publisher)"
                  >{{publisher}}</span>
              </div>
            </li>
            <li class="parent-node">
              <p class="title-text">
                作者:
              </p>
              <div>
                  <span
                    v-for="(author, valueIndex) in authorList"
                    :key="valueIndex"
                    :class="searchParams.author == author ? 'selected search-btn' : 'search-btn'"
                    @click="changeAuthor(author)"
                  >{{author}}</span>
              </div>
            </li>
            <li class="parent-node">
              <p class="title-text">
                价格:
              </p>
              <div>
                  <el-input
                    v-model="searchParams.sprice"
                    style="width: 100px"
                  ></el-input>&nbsp;&nbsp;&nbsp;&nbsp;- <el-input
                    v-model="searchParams.eprice"
                    style="width: 100px"
                  ></el-input>
                  <el-button type="primary" size="small" @click="confirmPrice">
                    确定
                  </el-button>
              </div>
            </li>
          </ul>
          <div style="min-height: 500px;margin-top:20px;">
            <v-book-list 
              :pageable="pageable" 
              :bookInfos="bookInfos"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              @handleViewBookDetil="handleViewBookDetil">
            </v-book-list>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="我的购物车" :visible.sync="dialogTableVisible" width="950px">
      <el-table :data="myCardList" class="dialog-grid-table-data" stripe border>
        <el-table-column prop="cardId" label="图书" width="250" align="center">
          <template slot-scope="scope">
            <img style="width:100px;height:100px;" :src="$imgUrl+scope.row.downloadUrl" alt />
            {{scope.row.bookName}}
          </template>
        </el-table-column>
        <el-table-column prop="bookPrice" label="图书价格" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.bookPrice}}
          </template>
        </el-table-column>
        <el-table-column prop="bookCount" label="数量" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.bookCount"
              @change="handleCountChange(scope.row)"
              :min="1"
              label="数量"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="subTotal" label="小计" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.bookPrice*scope.row.bookCount}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleRemoveClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:left;height: 40px;">
        <p >
          共
          <span>{{myBookCount}}</span>本图书, 总计金额：
          <span>{{myBookTotal}}</span>元
          <span v-if="myBookCount == 0" style="float:right;color:red">请添加图书</span>
          <el-button v-if="myBookCount != 0" type="primary" size="small" style="float:right;" @click="submitMyCard">提交订单</el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeSelect from "@/components/tree-select.vue";
import BookList from './components/book-list.vue';
import { mapState } from "vuex";
export default {
  components: {
    "select-tree": treeSelect,
    'v-book-list': BookList
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
      //高级搜索图书
      customBookListUrl: this.$url + "book/customBookList",
      //我的购物车URL
      myCardUrl: this.$url + "myCard/queryList",
      //更新我的购物车URL
      myCardUpdateUrl: this.$url + "myCard/update",
      //删除我的购物车URL
      myCardDeleteUrl: this.$url + "myCard/delete",
      //提交购物车
      submitMyCardUrl: this.$url + "myCard/submitMyCard",
      //搜索内容
      search: "",
      //当前页
      page: 1,
      //页面大小
      rows: 8,
      //查询参数
      searchParams: {
        typeId: "",
        publisher: "",
        author: "",
        sprice: "",
        eprice: ""
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
      authorList: [],
      //图书信息
      bookInfos: {},
      //显示分页
      pageable: false,
      //我的购物车
      myCardList: [],
      //总图书数量
      myBookCount: 0,
      //总图书金额
      myBookTotal: 0,
      dialogTableVisible: false
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
    //获取我的购物车
    this.getMyCard();
  },
  computed: {
    ...mapState({
      sysData(state) {
        return state;
      }
    })
  },
  mounted: function() {
    let _this = this;
    _this.search = _this.$route.params.search;
    setTimeout(function() {
      _this.searchParams.typeId = _this.$route.query.typeId;
      //查询图书
      _this.initSearchBookList();
    }, 500);
  },
  methods: {
    //查询畅销榜
    initStatisticsList(index) {
      var _this = this;
      var params = Object.assign({
        statisticsType: "1"
      });
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
        } else {
          _this.treeNodeList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    // 下拉切换 取值
    getvalue(value) {
      this.searchParams.typeId = value == null ? "" : value;
      this.page = 1;
      this.initSearchBookList();
    },
    //获取出版社
    selectPublishers() {
      let _this = this;
      _this.$ajax.get(_this.publishersUrl).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.publisherList = res.data;
          _this.publisherList.unshift("不限");
        } else {
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
          _this.authorList.unshift("不限");
        } else {
          _this.authorList = [];
          _this.$message({
            message: "列表初始化失败",
            type: "error"
          });
        }
      });
    },
    //切换出版社
    changePublisher(publisher) {
      this.searchParams.publisher = publisher;
      this.page = 1;
      this.initSearchBookList();
    },
    //切换作者
    changeAuthor(author) {
      this.searchParams.author = author;
      this.page = 1;
      this.initSearchBookList();
    },
    //创建实例
    getInstance() {
      return {
        typeId: "",
        publisher: "",
        author: "",
        sprice: "",
        eprice: ""
      }
    },
    //查询
    searchForm() {
      //清空高级搜索条件
      this.searchParams = this.getInstance();
      this.page = 1;
      this.initSearchBookList();
    },
    //确定价格
    confirmPrice() {
      let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
      if(this.searchParams.sprice != null && this.searchParams.sprice != "") {
        if(!reg.test(this.searchParams.sprice)) {
          this.$message({
            message: "请输入正确的开始价格",
            type: "error"
          });
          return;
        }
      }
      if(this.searchParams.eprice != null && this.searchParams.eprice != "") {
        if(!reg.test(this.searchParams.eprice)) {
          this.$message({
            message: "请输入正确的结束价格",
            type: "error"
          });
          return;
        }
      }
      this.page = 1;
      this.initSearchBookList();      
    },
    handleSizeChange(val) {
      this.rows = val;
      this.initSearchBookList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.initSearchBookList();
    },
    //查询图书
    initSearchBookList() {
      let _this = this;
      let params = Object.assign({
        search: _this.search,
        page: _this.page,
        rows: _this.rows
      },_this.searchParams);
      _this.$ajax.post(_this.customBookListUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.bookInfos = res.data;
          if(res.data.list.length>0) {
            _this.pageable = true;
          }
          else {
            _this.pageable = false;
          }
        } else {
          _this.pageable = false;
          _this.bookInfos = {};
        }
      });
    },
    //获取我的购物车
    getMyCard() {
      var _this = this;
      if (_this.sysData.userId != undefined && _this.sysData.userId != null) {
        let params = new URLSearchParams();
        params.append("userId", _this.sysData.userId);
        params.append("contentType", 1);
        _this.$ajax.get(_this.myCardUrl, params).then(res => {
          res = res.data;
          if (res.code == 200) {
            _this.myCardList = res.data;
            _this.myBookCount = 0;
            _this.myBookTotal = 0;
            if(_this.myCardList.length >0) {
              _this.myCardList.forEach(card=>{
                _this.myBookCount += card.bookCount;
                _this.myBookTotal += card.bookPrice * card.bookCount;
              })
            }
          } else {
            _this.myCardList = [];
          }
        });
      }
    },
    //我的购物车
    myCard() {
      if (this.sysData.userId == undefined || this.sysData.userId == null) {
        this.$confirm("您还未登录，请确认是否登录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$router.push({
            name: "login"
          });
        });
      }
      else {
        //获取我的购物车
        this.getMyCard();
        this.dialogTableVisible = true;
      }
    },
    //删除购物车
    handleRemoveClick(row){
      var _this = this;
      _this
        .$confirm("确认删除记录吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          //执行删除操作
          _this.$ajax.delete(_this.myCardDeleteUrl + "/" + row.cardId).then(res => {
            res = res.data;
            if (res.code == 200) {
              //获取我的购物车
              _this.getMyCard();
            } else {
              _this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        });
    },
    //修改图书数量
    handleCountChange(row){
      var _this = this;
      _this.$ajax.put(_this.myCardUpdateUrl, row).then(res => {
        res = res.data;
        if (res.code == 200) {
          //获取我的购物车
          _this.getMyCard();
        } else {
          _this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //提交我的订单
    submitMyCard() {
      let _this = this;
      _this.$ajax.post(_this.submitMyCardUrl, _this.myCardList).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.$message({
            message: "提交成功",
            type: "success"
          });
          _this.dialogTableVisible = false;
        } else {
          _this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //查看图书详情
    handleViewBookDetil(data) {
      this.$router.push({
        name: "book_detail",
        params: {
          bookId: data.bookId
        }
      })
    }
  }
};
</script>
<style scoped>
</style>