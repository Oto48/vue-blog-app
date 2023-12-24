<template>
  <nav>
    <router-link to="/"><img :src="NavImg" alt="" /></router-link>
    <router-link to="/add"><button>დაამატე ბლოგი</button></router-link>
  </nav>
  <router-view />
</template>

<script>
import NavImg from "./assets/NavImg.png";

export default {
  name: "App",

  data() {
    return {
      NavImg: NavImg,
    };
  },
};
</script>

<style lang="scss">
@import "./assets/css/style.scss";
</style>
