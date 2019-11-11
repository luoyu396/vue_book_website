<template>
  <div class="home">
    <div class="wrap clear">
      <div class="home-search">
        <el-input placeholder="请输入查询关键字" v-model="search" class="input-with-select">
          <el-button type="primary" @click="searchForm" class="el-icon-search btn" slot="append"></el-button>
        </el-input>
        <el-button class="my-card">我的购物车<i class="el-icon-information"></i></el-button>
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
            ><span @click="goTo(item.id)">{{item.label}}</span></div>
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
        <v-tab-bar 
          @handleClick="handleClick"
          @handleMoreClick="handleMoreClick"
          :data="tabList"
          :height="470"
          :liWarpHeight="360"
        >
      </v-tab-bar>
      </div>
    </div>
  </div>
</template>

<script>
import TabBarComponent from '@/components/tab-bar'

export default {
  data() {
    return {
      //树形节点URL
      treeNodeUrl: this.$url + "type/treeNodes",
      //树形节点集合
      treeNodeList: [],
      checkindex:0,
      search: '',
      tabList: [],
    };
  },
  mounted: function() {
    //获取分类树形节点集合
    this.getTreeNodeList();
    //初始化右侧标签
    this.initTabList();
  },
  components: {
    'v-tab-bar': TabBarComponent,
  },
  methods: {
    //获取分类树形节点集合
    getTreeNodeList() {
      let _this = this;
      _this.$ajax.get(_this.treeNodeUrl).then(res => {
        res = res.data;
        if (res.code == 200) {
          _this.treeNodeList = res.data;
          console.log(_this.treeNodeList);
        }else {
          _this.treeNodeList = [];
        }
      });
    },
    toggle (index,groupName) {
      this.checkindex = index;
      this.groupName = groupName;
    },
    goTo (typeId) {
      alert(typeId);
    },
    searchForm(){

    },
    //初始化右侧标签
    initTabList() {
      this.tabList.push({
        nodeId: "totalCount",
        nodeName: "畅销榜",
        nodeRouter: "",
        list: []
      },{
        nodeId: "newBook",
        nodeName: "新品上市",
        nodeRouter: "",
        list: []
      });
    },
    handleClick(tab) {
      console.log(tab);
    },
    //点击更多事件
    handleMoreClick(tabItemData) {
      console.log(tabItemData);
    },
  }
};
</script>
