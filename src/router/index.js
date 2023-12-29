import { createRouter, createWebHistory } from "vue-router";
import BlogList from "../views/BlogList/BlogList.vue";
import AddBlog from "../views/AddBlog/AddBlog.vue";
import BlogDetail from "../views/BlogDetail/BlogDetail.vue";

const routes = [
  {
    path: "/",
    name: "BlogList",
    component: BlogList,
  },
  {
    path: "/add",
    name: "AddBlog",
    component: AddBlog,
  },
  {
    path: "/:id",
    name: "BlogDetail",
    component: BlogDetail,
    props: (route) => ({
      id: route.params.id,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
