<template>
  <div class="container p-1">
    <header>
      <div>
        <h1 class="text-xl">ბლოგი</h1>
        <img :src="BlogImg" alt="BlogImg" />
      </div>
      <div>
        <p
          v-for="(category, index) in categories"
          :key="index"
          :style="{
            background:
              'rgba(' + hexToRgb(category.background_color) + ', 0.08)',
            color: category.background_color,
            border: category.selected ? '1px solid #000' : '',
          }"
          @click="filter(category)"
        >
          {{ category.title }}
        </p>
      </div>
    </header>
    <div class="BlogList">
      <div
        v-for="(item, index) in filteredBlogs || blogs"
        :key="index"
        class="BlogList_card text-medium"
      >
        <img :src="item.image" />
        <p class="text-bold">{{ item.author }}</p>
        <p class="BlogList_card_date text-small">{{ item.publish_date }}</p>
        <p class="text-large text-bold">{{ item.title }}</p>
        <div class="BlogList_card_categories">
          <p
            v-for="(category, index) in item.categories"
            :key="index"
            :style="{
              background:
                'rgba(' + hexToRgb(category.background_color) + ', 0.08)',
              color: category.background_color,
            }"
            class="text-small text-bold"
          >
            {{ category.title }}
          </p>
        </div>
        <p class="BlogList_card_description">{{ item.description }}</p>
        <router-link :to="'/' + item.id">სრულად ნახვა</router-link>
      </div>
    </div>
  </div>
  <login-modal></login-modal>
</template>

<script>
import axios from "axios";
import BlogImg from "@/assets/images/Blog.png";
import LoginModal from "@/components/LoginModal/LoginModal.vue";

export default {
  name: "BlogList",

  data() {
    return {
      blogs: [],
      filteredBlogs: null,
      categories: [],
      BlogImg: BlogImg,
      selectedCategoryIds: [],
    };
  },

  components: {
    LoginModal: LoginModal,
  },

  methods: {
    filter(category) {
      if (!category.selected) {
        category.selected = true;
      } else {
        category.selected = false;
      }

      const selectedCategoryIds = this.categories
        .filter((cat) => cat.selected)
        .map((cat) => cat.id);

      if (selectedCategoryIds.length > 0) {
        this.filteredBlogs = this.blogs.filter((blog) =>
          blog.categories.some((category) =>
            selectedCategoryIds.includes(category.id)
          )
        );
      } else {
        this.filteredBlogs = null;
      }
    },

    hexToRgb(hex) {
      hex = hex.replace(/^#/, "");
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    },
  },

  mounted() {
    axios
      .get("https://api.blog.redberryinternship.ge/api/blogs", {
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer ba70b939c3f19299963fc2f60faf10d361c50d172bbc4a0457adda9ffcb29986",
        },
      })
      .then((response) => {
        const items = response.data;
        this.blogs = items.data;
        console.log(this.blogs);
      });

    axios
      .get("https://api.blog.redberryinternship.ge/api/categories", {
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer ba70b939c3f19299963fc2f60faf10d361c50d172bbc4a0457adda9ffcb29986",
        },
      })
      .then((response) => {
        const items = response.data;
        this.categories = items.data;
        console.log(this.categories);
      });
  },
};
</script>

<style scoped lang="scss">
@import "./BlogList.scss";
</style>
