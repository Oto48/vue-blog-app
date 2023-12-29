<template>
  <nav class="p-1">
    <router-link to="/"><img :src="NavImg" alt="" /></router-link>
    <router-link v-if="$store.state.user" to="/add"
      ><button>დაამატე ბლოგი</button></router-link
    >
    <button v-if="!$store.state.user" @click="login">შესვლა</button>
  </nav>
  <router-view />
</template>

<script>
import NavImg from "./assets/images/NavImg.png";

export default {
  name: "App",

  data() {
    return {
      NavImg: NavImg,
    };
  },

  methods: {
    logOut() {
      localStorage.removeItem("user");
      this.$store.commit("updateUser", false);
    },

    login() {
      this.$store.commit("updateModal", true);
    },
  },
};
</script>

<style lang="scss">
@import "./assets/css/style.scss";
</style>
