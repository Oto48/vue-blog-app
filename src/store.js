import { createStore } from "vuex";

export default createStore({
  state: {
    openModal: false,
  },
  mutations: {
    updateModal(state, data) {
      state.openModal = data;
    },
  },
});
