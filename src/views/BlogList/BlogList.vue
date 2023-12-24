<template>
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
          color: category.text_color,
          backgroundColor: category.background_color,
        }"
        @click="filter(category.id)"
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
            color: category.text_color,
            backgroundColor: category.background_color,
          }"
          class="text-small text-bold"
        >
          {{ category.title }}
        </p>
      </div>
      <p class="BlogList_card_description">{{ item.description }}</p>
      <p>სრულად ნახვა</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BlogImg from "../../assets/Blog.png";

export default {
  name: "BlogList",

  data() {
    return {
      blogs: [],
      filteredBlogs: null,
      categories: [],
      BlogImg: BlogImg,
    };
  },

  methods: {
    filter(id) {
      this.filteredBlogs = this.blogs.filter((blog) =>
        blog.categories.some((category) => category.id === id)
      );
    },
  },

  mounted() {
    axios
      .get("https://api.blog.redberryinternship.ge/api/blogs", {
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer e9ec8ffb6a7df90c3eba1e6c906ca9c00df7e20b097aa217078d50421ec75daa",
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
            "Bearer e9ec8ffb6a7df90c3eba1e6c906ca9c00df7e20b097aa217078d50421ec75daa",
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
