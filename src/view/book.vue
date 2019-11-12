<template>
  <div class="info-box">
    <div class="breadcrumb">
      <em>您的位置：</em>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>ddd</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-box">
      <h3 class="search-title">ddd</h3>
      <div class="search-content">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      typeObject: {
        TEXT: "type-text",
        NUMBER: "type-text",
        RADIO: "type-radio",
        CHECKBOX: "type-radio",
        SELECTED: "type-radio",
        MORE: "type-more"
      },
      bookInfos: {
        page: 1, //当前页
        pageSize: 8, //当前页显示记录数
        count: 0, //取得查询总条数,
        bookSortObject: [
          {
            //数据默认都以升序排列
            propName: "salePrice",
            orderRule: "asc",
            orderName: "价格",
            orderCode: "salePrice"
          },
          {
            propName: "amount",
            orderRule: "",
            orderName: "销量",
            orderCode: "amount"
          }
        ],
        bookList: []
      }
    };
  },
  created() {
  },
  watch: {
  },
  mounted: function() {
    let _this = this;
    _this.initSearchBookList();
  },
  components: {
  },
  computed: {
  },
  methods: {
    //获取图书列表数据
    initSearchBookList() {

    },
  }
};
</script>