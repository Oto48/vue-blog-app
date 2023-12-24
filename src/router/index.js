import { createRouter, createWebHistory } from "vue-router";
import BlogList from "../views/BlogList/BlogList.vue";
import AddBlog from "../views/AddBlog/AddBlog.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
