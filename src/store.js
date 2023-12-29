import { createStore } from "vuex";

export default createStore({
  state: {
    openModal: false,
    user: localStorage.getItem("user"),
  },
  mutations: {
    updateModal(state, data) {
      state.openModal = data;
    },

    updateUser(state, data) {
      console.log(data);
      state.user = data;
    },
  },
});
