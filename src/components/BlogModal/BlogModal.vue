<template>
  <div class="modal" v-if="$store.state.openModal">
    <div ref="modalRef">
      <div>
        <span @click="closeModal"></span>
      </div>
      <approved-svg />
      <p>{{ text }}</p>
      <button @click="redirect">{{ buttonText }}</button>
    </div>
  </div>
</template>

<script>
import ApprovedSvg from "@/assets/svg/ApprovedSvg.vue";

export default {
  name: "BlodModal",

  props: {
    text: String,
    buttonText: String,
  },

  components: {
    ApprovedSvg: ApprovedSvg,
  },

  methods: {
    closeModal() {
      this.$store.commit("updateModal", false);
    },

    redirect() {
      this.$router.push({ name: "BlogList" });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./BlogModal.scss";
</style>
