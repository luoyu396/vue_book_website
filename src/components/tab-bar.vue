<template>
  <el-tabs
    v-model="activeName"
    type="card"
    @tab-click="handleClick"
    class="tab-bar-wrap"
    :stretch="true"
    ref="elTabs"
  >
    <el-tab-pane
      :label="tabItem.nodeName"
      :name="index.toString()"
      v-for="(tabItem, index) of data"
      :key="tabItem.nodeId"
    >
      <p slot="label" :style="`width:${tabWidth}px;`">{{tabItem.nodeName}}</p>
      <div :style="`height: ${height}px;`">
        <ul class="tab-bar-content-wrap" :style="`height: ${liWarpHeight}px;`">
          <li
            class="list-item"
            @click="handleRowItemClick(tabItem, rowData)"
            v-for="(rowData, index) of tabItem.list"
            :key="index"
          >
           {{index+1}} &nbsp;&nbsp;&nbsp;&nbsp;{{rowData.author}}.{{rowData.bookName}}.{{rowData.publisher}}
            <span class="right-item">￥ {{rowData.salePrice * rowData.discount}}</span>
          </li>
        </ul>
        <!-- 更多， 由父组件控制显隐 -->
        <a class="link-more" @click="handleMoreClick(tabItem)">更多</a>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  props: {
    // 数据
		data: {
			type: Array,
			required: true,
    },
    // 容器总高度，不包括header
    height: {
      type: Number | String,
      default: 400
    },
    // 列表数据总高度
    liWarpHeight: {
      type: Number | String,
      default: 360
    },
    // 当前活跃项名称
    active_name: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
			activeName: this.active_name,
      tabWidth: 0,
    };
	},
	mounted() {
    this.buildtabWidth();
  },
  methods: {
    buildtabWidth() {
      let tabCount = this.data.length;
      this.tabWidth = (this.$el.clientWidth - (tabCount - 1) * 10) / tabCount;
    },
    //表头点击事件
    handleClick(tab, event) {
      this.$emit('handleClick', tab)
    },
    // 列表项点击事件
    handleRowItemClick(tabItem, rowData) {
      this.$router.push({
        name: tabItem.nodeRouter,
        params: {
          ...rowData
        }
      })
    },
    //点击更多
		handleMoreClick(tabItem) {
			this.$emit('handleMoreClick', tabItem)
		}
  }
};
</script>

<style lang="scss" scoped>
.tab-bar-wrap {
  width: 100%;
  .el-tabs__content {
    position: relative;
    ul.tab-bar-content-wrap {
			overflow: hidden;
      li {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        box-sizing: border-box;
        border-bottom: 1px solid #d9d9d9;
        cursor: pointer;
        &:hover {
          color: #3e82ff;
          border-bottom: 1px solid #3e82ff;
        }
        &.list-item {
          &::before {
            font-family: "icon" !important;
            font-size: 14px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            content: "\e6f0";
            margin-right: 10px;
            color: #4178db;
          }
          .right-item {
            float: right;
          }
        }
      }
    }
    .link-more {
      cursor: pointer;
      position: absolute;
      bottom: 10px;
      right: 25px;
      float: right;
      font-size: 14px;
      color: #4178db;
    }
  }
}
</style>