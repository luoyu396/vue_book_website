<!--图书列表组件-->
<template>
 <div class="book-list-container">
    <div class="list-container">
      <dl class="info-list" 
        v-for="item in bookInfos.list" 
        :key="item.bookId"
        @click="handleViewBookDetil(item)">
        <dd><img :src="$imgUrl+item.downloadUrl" alt=""></dd>
        <dt>
          <p class="price"><span>¥ {{item.salePrice * item.discount}}</span></p>
          <p>
            <span :title="item.author+'.'+item.bookName+'.'+item.publisher">
              {{item.author}}.{{item.bookName}}.{{item.publisher}}
            </span>
          </p>
        </dt>
      </dl>
      <template v-if="this.pageable">
        <div class="info-page">
          <el-pagination
            class="pagination"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="bookInfos.pageNum"
            :page-size="bookInfos.pageSize"
            layout="prev, pager, next, total"
            :total="bookInfos.total">
          </el-pagination>
          <span class="total-page">
            共{{isNaN(Math.ceil(bookInfos.total/bookInfos.pageSize)) ? 0 : Math.ceil(bookInfos.total/bookInfos.pageSize)}}页
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
 export default {
   props: {
     "pageable": Boolean, 
     "bookInfos": Object
   },
   data () {
     return {}
   },
   mounted: function() {
   },
   methods: {
     handleSizeChange(val) {
        this.$emit("handleSizeChange", val);
     },
     handleCurrentChange(val) {
        this.$emit("handleCurrentChange", val);
     },
     handleViewBookDetil(item) {
       this.$emit("handleViewBookDetil", item);
     }
   },
 }
</script>

<style scoped lang="scss" >
.book-list-container {
  .num {
    color: rgba(62,130,255,1);
  }
}
.info-page {
  text-align: center;
  clear: both;
}
.book-list-container {
  overflow: hidden;
}
.total-page {
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    box-sizing: border-box;
    color: #999999;
    padding: 10px 0px;
}
  .pagination {
    display: inline-block;
  }
  .info-list {
    color: rgba(85, 85, 85, 1);
    font-family:PingFangSC-Regular;
    font-size: 14px;
    float: left;
    width: 232px;
    margin: 0px 10px 10px auto;
    background-color: #F3F3F3;
    border-radius: 2px;
    box-sizing: border-box;
    background: rgba(255,255,255,1);
    border:1px solid transparent;
    &:hover {
      border: 1px solid rgba(65, 120, 219, 1);
    }
    img {
      border:1px solid rgba(217,217,217,1);
      box-sizing: border-box;
      width: 100%;
      height: 250px;
      border-radius:  2px;
      object-fit: cover;
      margin-bottom: 10px;
    }
    dt {
      border-radius: 2px;
      height: 75px;
      padding-left: 13px;

      p {
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        line-height: 20px;
        font-size: 14px;
        padding-right: 4px;
        &.price span {
          font-size: 18px;
          font-weight: bolder;
          color: #E71E1E;
        }
        &:last-child:hover span{
          color: rgba(62,130,255,1);
          border-bottom: 1px solid rgba(62,130,255,1);
        }
      }
    }
  }
  .info-list p{
    cursor: pointer;
  }
</style>

