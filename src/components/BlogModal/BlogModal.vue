<template>
  <div class="modal" v-if="$store.state.openModal">
    <div ref="modalRef">
      <div>
        <ExitSVG @click="closeModal" />
      </div>
      <approved-svg />
      <p>{{ text }}</p>
      <button @click="redirect">{{ buttonText }}</button>
    </div>
  </div>
</template>

<script>
import ApprovedSvg from "@/assets/svg/ApprovedSvg.vue";
import ExitSVG from "@/assets/svg/ExitSvg";

export default {
  name: "BlogModal",

  props: {
    text: String,
    buttonText: String,
  },

  components: {
    ApprovedSvg: ApprovedSvg,
    ExitSVG: ExitSVG,
  },

  methods: {
    closeModal() {
      this.$store.commit("updateModal", false);
    },

    redirect() {
      this.closeModal();
      this.$router.push({ name: "BlogList" });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./BlogModal.scss";
</style>
