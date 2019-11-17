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
            <el-breadcrumb-item :to="{ name: 'book' }">书籍列表</el-breadcrumb-item>
            <el-breadcrumb-item>{{bookInfo.bookName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="base-box">
          <dl>
            <dd>
              <img :src="bookImgUrl" alt />
            </dd>
            <dt>
              <p>
                <span>图书名称：</span>
                <em>{{bookInfo.bookName}}</em>
              </p>
              <p>
                <span>作者：</span>
                <em>{{bookInfo.author}}</em>
              </p>
              <p>
                <span>图书价格：</span>
                <em>{{bookInfo.salePrice * bookInfo.discount}}</em>
                <em style="font-size: 14px;">[{{bookInfo.discount*10}} 折]</em>
                <em style="font-size: 14px;">
                  [定价：
                  <span style="text-decoration:line-through">￥{{bookInfo.salePrice}}</span>]
                </em>
              </p>
              <p>
                <span>出版社：</span>
                <em>{{bookInfo.publisher}}</em>
              </p>
              <p>
                <span>ISBN：</span>
                <em>{{bookInfo.isbn}}</em>
              </p>
              <div class="handle-btn-wrap">
                <el-button type="primary" @click="addMyCard">加入购物车</el-button>
              </div>
            </dt>
          </dl>
           <div class="detail">
            <p class="detail-title">图书介绍
            </p>
            <p class="detail-content">
              {{bookInfo.introduction}}
            </p>
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      //查询总销量URL
      statSaleCountUrl: this.$url + "statistics/statisticses",
      //查询新书URL
      newBookListUrl: this.$url + "book/queryListPage2",
      //获取图书信息
      bookUrl: this.$url + "book/selectOne",
      //我的购物车URL
      myCardUrl: this.$url + "myCard/queryList",
      //更新我的购物车URL
      myCardUpdateUrl: this.$url + "myCard/update",
      //删除我的购物车URL
      myCardDeleteUrl: this.$url + "myCard/delete",
      //添加购物车
      saveMyCardUrl: this.$url + "myCard/save",
      //提交购物车
      submitMyCardUrl: this.$url + "myCard/submitMyCard",
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
      ],
      //图书ID
      bookId: "",
      //图片路径
      bookImgUrl: "",
      //图书信息
      bookInfo: {},
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
    //查询畅销榜
    this.initStatisticsList(0);
    //查询新品上市
    this.initNewBookList(1);
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
    this.bookId = this.$route.params.bookId;
    //获取图书
    this.getBook();
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
    //查询
    searchForm() {
      this.$router.push({
        name: "book",
        params: {
          search: this.search
        }
      });
    },
    //获取图书
    getBook() {
      let _this = this;
      _this.$ajax.get(_this.bookUrl + "/" + _this.bookId).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.bookInfo = res.data;
          _this.bookImgUrl = _this.$imgUrl+_this.bookInfo.downloadUrl;
        } else {
          _this.$message({
            message: "获取图书失败",
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
      });
      this.bookId = data.bookId;
      //获取图书
      this.getBook();
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
    //添加购物车
    addMyCard(){
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
        let _this = this;
        let card = _this.myCardList.find(item=>item.bookId == _this.bookInfo.bookId);
        if(card) {
          card.bookCount += 1;
          _this.$ajax.put(_this.myCardUpdateUrl, card).then(res => {
            res = res.data;
            if (res.code == 200) {
              _this.$message({
                message: "添加成功",
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
        else {
          let params = Object.assign({
            cardId: "",
            bookId: _this.bookInfo.bookId,
            bookCount: 1,
            userId: this.sysData.userId,
            createTime: new Date()
          });
          _this.$ajax.post(_this.saveMyCardUrl, params).then(res => {
            res = res.data;
            if (res.code == 200) {
              _this.$message({
                message: "添加成功",
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
      }
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
    }
  }
};
</script>
<style scoped>
</style>