<!--首页-图书分类展示-->
<template>
  <div class="home">
    <div class="wrap clear">
      <div class="home-search">
        <el-input placeholder="图书名称/出版社/作者/ISBN" v-model="search" class="input-with-select">
          <el-button type="primary" @click="searchForm" class="el-icon-search btn" slot="append"></el-button>
        </el-input>
        <el-button class="my-card" @click="myCard">
          我的购物车
          <i class="el-icon-information"></i>
        </el-button>
      </div>
      <div class="home-left">
        <div class="menu">
          <div class="menu-item">
            <div class="menu-left menu-title">
              <i class="el-icon-list"></i> 分类
            </div>
          </div>
          <div class="menu-item" :key="item.id" v-for="(item , index) in treeNodeList">
            <div
              class="menu-left"
              :class="{'active':index ==checkindex }"
              @mousemove="toggle(index,item.label)"
            >
              <span @click="goTo(item.id)">{{item.label}}</span>
            </div>
            <div class="menu-right-container" :class="{'active':index == checkindex }">
              <div class="menu-right">
                <dl :key="child.id" v-for="child in item.children">
                  <dd>
                    <span @click="goTo(child.id)">
                      <i>{{child.label}}</i>
                    </span>
                  </dd>
                  <dt v-if="child.children != ''">
                    <span @click="goTo(list.id)" :key="list.id" v-for="list in child.children">
                      <i>{{list.label}}</i>
                    </span>
                  </dt>
                  <dt v-else>
                    <span @click="goTo(child.id)">
                      <i>{{child.label}}</i>
                    </span>
                  </dt>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-right">
        <v-tab-bar @handleClick="handleClick" :data="tabList" :height="470" :liWarpHeight="360"></v-tab-bar>
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
import TabBarComponent from "@/components/tab-bar";
import { mapState } from "vuex";
export default {
  data() {
    return {
      //树形节点URL
      treeNodeUrl: this.$url + "type/treeNodes",
      //查询总销量URL
      statSaleCountUrl: this.$url + "statistics/statisticses",
      //查询新书URL
      bookListUrl: this.$url + "book/queryListPage2",
      //我的购物车URL
      myCardUrl: this.$url + "myCard/queryList",
      //更新我的购物车URL
      myCardUpdateUrl: this.$url + "myCard/update",
      //删除我的购物车URL
      myCardDeleteUrl: this.$url + "myCard/delete",
      //提交购物车
      submitMyCardUrl: this.$url + "myCard/submitMyCard",
      //树形节点集合
      treeNodeList: [],
      checkindex: 0,
      search: "",
      //右侧标签
      tabList: [],
      //我的购物车
      myCardList: [],
      //总图书数量
      myBookCount: 0,
      //总图书金额
      myBookTotal: 0,
      dialogTableVisible: false
    };
  },
  mounted: function() {
    //获取分类树形节点集合
    this.getTreeNodeList();
    //初始化右侧标签
    this.initTabList();
    //获取我的购物车
    this.getMyCard();
  },
  components: {
    "v-tab-bar": TabBarComponent
  },
  computed: {
    ...mapState({
      sysData(state) {
        return state;
      }
    })
  },
  methods: {
    //获取分类树形节点集合
    getTreeNodeList() {
      let _this = this;
      _this.$ajax.get(_this.treeNodeUrl).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.treeNodeList = res.data;
        } else {
          _this.treeNodeList = [];
        }
      });
    },
    //展示子集
    toggle(index, groupName) {
      this.checkindex = index;
      this.groupName = groupName;
    },
    //跳转图书列表
    goTo(typeId) {
      this.$router.push({
        name: "book",
        query: {
          typeId: typeId
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
    //初始化右侧标签
    initTabList() {
      this.tabList.push(
        {
          nodeId: "totalCount",
          nodeName: "畅销榜",
          nodeRouter: "book_detail",
          list: []
        },
        {
          nodeId: "newBook",
          nodeName: "新品上市",
          nodeRouter: "book_detail",
          list: []
        }
      );
      //查询畅销榜
      this.initStatisticsList(0);
      //查询新品上市
      this.initNewBookList(1);
    },
    //查询畅销榜
    initStatisticsList(index) {
      var _this = this;
      var params = Object.assign({
        statisticsType: "1"
      });
      _this.$ajax.post(_this.statSaleCountUrl, params).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.tabList[index].list = res.data.list;
        } else {
          _this.tabList[index].list = [];
        }
      });
    },
    //查询新品上市
    initNewBookList(index) {
      var _this = this;
      _this.$ajax.post(_this.bookListUrl, null).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.tabList[index].list = res.data.list;
        } else {
          _this.tabList[index].list = [];
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
    //点击标签行
    handleClick(tab) {
      if (tab.name == "0") {
        //查询畅销榜
        this.initStatisticsList(0);
      } else {
        //查询新品上市
        this.initNewBookList(1);
      }
    }
  }
};
</script>
