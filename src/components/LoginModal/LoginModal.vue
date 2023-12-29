<template>
  <div class="modal" v-if="$store.state.openModal">
    <div :class="(!isValidEmail && isTouched) || invalid ? 'error' : ''">
      <div>
        <div>
          <ExitSVG @click="closeModal" />
        </div>
        <ApprovedSvg v-if="valid" />
        <h1 v-if="!valid">შესვლა</h1>
        <h2 v-if="valid">წარმატებული ავტორიზაცია</h2>
        <div class="input-container" v-if="!valid">
          <label>ელ-ფოსტა</label>
          <input v-model="email" placeholder="Email" @input="resetError" />
          <div v-if="(!isValidEmail && isTouched) || invalid">
            <AlertSvg />
            <p v-if="invalid">ლ-ფოსტა არ მოიძებნა</p>
            <p v-if="!invalid">ელ-ფოსტა უნდა მთავრდებოდეს @redberry.ge-ით</p>
          </div>
        </div>
        <button v-if="!valid" @click="login" :disabled="!isValidForm">
          შესვლა
        </button>
        <button v-if="valid" @click="closeModal">კარგი</button>
      </div>
    </div>
  </div>
</template>

<script>
import ApprovedSvg from "@/assets/svg/ApprovedSvg.vue";
import ExitSVG from "@/assets/svg/ExitSvg";
import AlertSvg from "@/assets/svg/AlertSvg";
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      error: "",
      isTouched: false,
      valid: false,
      invalid: false,
    };
  },

  components: {
    ApprovedSvg: ApprovedSvg,
    ExitSVG: ExitSVG,
    AlertSvg: AlertSvg,
  },

  computed: {
    isValidEmail() {
      return this.email.match(/^.*[^@\s]@redberry\.ge$/);
    },
    isValidForm() {
      return this.email && this.isValidEmail;
    },
  },

  methods: {
    resetError() {
      this.isTouched = true;
      this.error = "";
    },
    login() {
      console.log(this.email);
      const data = { email: this.email };

      axios
        .post("https://api.blog.redberryinternship.ge/api/login", data, {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer 4fb36d478dd2c9832443d9cd1fe3f43236ab40fab7f1f7bc63e16635dc065151",
          },
        })
        .then((response) => {
          console.log(response.data);
          this.valid = true;
          localStorage.setItem("user", true);
          this.$store.commit("updateUser", true);
        })
        .catch((error) => {
          console.log(error);
          this.invalid = true;
        });
    },
    closeModal() {
      this.$store.commit("updateModal", false);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./LoginModal.scss";
/* Add your component styles here */
</style>
