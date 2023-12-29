<template>
  <nav class="p-1">
    <router-link to="/"><img :src="NavImg" alt="" /></router-link>
    <div v-if="$store.state.user">
      <router-link to="/add"><button>დაამატე ბლოგი</button></router-link>
      <button class="logOut" @click="logOut">გამოსვლა</button>
    </div>
    <button v-if="!$store.state.user" @click="logIn">შესვლა</button>
  </nav>
  <login-modal></login-modal>
  <router-view />
</template>

<script>
import NavImg from "./assets/images/NavImg.png";
import LoginModal from "@/components/LoginModal/LoginModal.vue";

export default {
  name: "App",

  data() {
    return {
      NavImg: NavImg,
    };
  },

  components: {
    LoginModal: LoginModal,
  },

  methods: {
    logOut() {
      localStorage.removeItem("user");
      this.$store.commit("updateUser", false);
    },

    logIn() {
      this.$store.commit("updateModal", true);
    },
  },
};
</script>

<style lang="scss">
@import "./assets/css/style.scss";
</style>
