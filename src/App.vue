<template>
  <blog-list />
</template>

<script>
import BlogList from "./views/BlogList/BlogList.vue";

export default {
  name: "App",
  components: {
    BlogList,
  },
};
</script>

<style lang="scss">
@import "./assets/css/style.scss";
</style>
