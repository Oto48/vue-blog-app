<template>
  <form @submit.prevent="send">
    <div>
      <input type="file" name="image" @change="handleFileChange" />
    </div>
    <div>
      <label for="author">ავტორი</label>
      <input type="text" name="author" v-model="formData.author" />
    </div>
    <div>
      <label for="title">სათაური</label>
      <input type="text" name="title" v-model="formData.title" />
    </div>
    <div>
      <label for="description">აღწერა</label>
      <input type="text" name="description" v-model="formData.description" />
    </div>
    <div>
      <label for="publish_date">გამოქვეყნების თარიღი</label>
      <input type="date" name="publish_date" v-model="formData.publish_date" />
    </div>
    <div>
      <label for="categories">კატეგორია</label>
      <input type="text" name="categories" v-model="formData.categories" />
    </div>
    <div>
      <label for="email">ელ-ფოსტა</label>
      <input type="text" name="email" v-model="formData.email" />
    </div>
    <button type="submit">submit</button>
  </form>
</template>

<script>
import axios from "axios";

export default {
  name: "AddBlog",
  props: {
    msg: String,
  },

  data() {
    return {
      formData: {
        title: "test test",
        description: "test test",
        image: null,
        author: "გელა გელაშვილი",
        publish_date: "2023-11-19",
        categories: "[1,2,3,4,5]",
        email: "gigagiorgadze@redberry.ge",
      },
    };
  },

  methods: {
    send() {
      const formData = new FormData();

      Object.keys(this.formData).forEach((key) => {
        formData.append(key, this.formData[key]);
      });

      axios
        .post("https://api.blog.redberryinternship.ge/api/blogs", formData, {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer e9ec8ffb6a7df90c3eba1e6c906ca9c00df7e20b097aa217078d50421ec75daa",
          },
        })
        .then((response) => {
          console.log(response.data);
        });
    },
    handleFileChange(event) {
      this.formData.image = event.target.files[0];
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
        console.log(response.data);
      });
  },
};
</script>

<style scoped></style>
