<template>
  <div class="body books">
    <v-header :user="sysData"/>
    <div class="home">
      <router-view></router-view>
    </div>
    <v-footer/>
  </div>
</template>

<script>
import Header from '@/components/header';
import Footer from '@/components/footer';
import { mapState } from "vuex";
 export default {
   data () {
     return {
     }
   },
   mounted: function() {
   },
   components: {
    'v-header': Header,
    'v-footer': Footer
   },
   computed: {
    ...mapState({
      sysData(state) {
        return state;
      }
    })
   },
   methods: {
   },
 }
</script>
