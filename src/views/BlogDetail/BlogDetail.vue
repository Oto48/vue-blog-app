<template>
  <div class="container p-1">
    <div class="blog">
      <img :src="blog.image" alt="Blog Image" />
      <div class="blog_details">
        <h3>{{ blog.author }}</h3>
        <div>
          <p>{{ blog.publish_date }}</p>
          <div class="bullet"></div>
          <p>{{ blog.email }}</p>
        </div>
      </div>
      <h1>{{ blog.title }}</h1>
      <div class="categories">
        <p
          v-for="(category, index) in blog.categories"
          :key="index"
          :style="{
            background:
              'rgba(' + hexToRgb(category.background_color) + ', 0.08)',
            color: category.background_color,
          }"
        >
          {{ category.title }}
        </p>
      </div>
      <p>{{ blog.description }}</p>
    </div>
    <div class="list">
      <div class="header">
        <h1>მსგავსი სტატიები</h1>
        <div>
          <ArrowLeftSvg @click="prev" />
          <ArrowRightSvg @click="next" />
        </div>
      </div>

      <div class="BlogList">
        <div
          v-for="(item, index) in displayedItems"
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
  </div>
</template>

<script>
import axios from "axios";
import ArrowRightSvg from "@/assets/svg/ArrowRightSvg";
import ArrowLeftSvg from "@/assets/svg/ArrowLeftSvg";

export default {
  name: "BlogDetail",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      blogId: this.id,
      blog: "",
      blogs: [],
      filteredBlogs: [],
      itemsPerPage: 3,
      currentPage: 1,
    };
  },

  components: {
    ArrowRightSvg: ArrowRightSvg,
    ArrowLeftSvg,
  },

  methods: {
    hexToRgb(hex) {
      hex = hex.replace(/^#/, "");
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    },

    filter() {
      const dataA = this.blog;
      const dataB = this.blogs;

      const categoryIds = dataA.categories.map((category) => category.id);

      const filteredData = dataB.filter((item) =>
        item.categories.some((category) => categoryIds.includes(category.id))
      );

      this.filteredBlogs = filteredData;
    },

    prev() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    next() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },

  computed: {
    totalPages() {
      return Math.ceil(this.filteredBlogs.length / this.itemsPerPage);
    },
    displayedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredBlogs.slice(startIndex, endIndex);
    },
  },

  mounted() {
    axios
      .get(`https://api.blog.redberryinternship.ge/api/blogs/${this.id}`, {
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer ba70b939c3f19299963fc2f60faf10d361c50d172bbc4a0457adda9ffcb29986",
        },
      })
      .then((response) => {
        const item = response.data;
        this.blog = item;
        console.log(this.blog);
      });

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
        this.filter();
      });
  },
};
</script>

<style scoped lang="scss">
@import "./BlogDetail.scss";
</style>
