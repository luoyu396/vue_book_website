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
      //树形节点集合
      treeNodeList: [],
      checkindex: 0,
      search: "",
      tabList: []
    };
  },
  mounted: function() {
    //获取分类树形节点集合
    this.getTreeNodeList();
    //初始化右侧标签
    this.initTabList();
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
          nodeRouter: "",
          list: []
        },
        {
          nodeId: "newBook",
          nodeName: "新品上市",
          nodeRouter: "",
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
    },
    //点击标签行
    handleClick(tab) {
      console.log(tab);
    }
  }
};
</script>
