<template>
  <h1>ბლოგის დამატება</h1>
  <form @submit.prevent="send">
    <div
      @dragover.prevent="dragging = true"
      @dragenter.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="handleDrop"
      class="file"
      :class="{ 'drag-over': dragging }"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="vuesax/bulk/folder-add">
          <g id="folder-add">
            <path
              id="Vector"
              opacity="0.4"
              d="M36.233 15.7333H3.33301V10.7C3.33301 6.63333 6.63301 3.33333 10.6997 3.33333H14.583C17.2997 3.33333 18.1497 4.21667 19.233 5.66667L21.5663 8.76667C22.083 9.45 22.1497 9.55 23.1163 9.55H27.7663C31.7163 9.53333 35.083 12.1333 36.233 15.7333Z"
              fill="#5D37F3"
            />
            <path
              id="Vector_2"
              d="M36.6497 18.0667C36.6163 17.25 36.483 16.4833 36.233 15.7333H3.33301V27.75C3.33301 32.6667 7.33301 36.6667 12.2497 36.6667H27.7497C32.6663 36.6667 36.6663 32.6667 36.6663 27.75V18.45C36.6663 18.3333 36.6663 18.1833 36.6497 18.0667ZM24.1663 27.0833H21.3497V30C21.3497 30.6833 20.783 31.25 20.0997 31.25C19.4163 31.25 18.8497 30.6833 18.8497 30V27.0833H15.833C15.1497 27.0833 14.583 26.5167 14.583 25.8333C14.583 25.15 15.1497 24.5833 15.833 24.5833H18.8497V21.6667C18.8497 20.9833 19.4163 20.4167 20.0997 20.4167C20.783 20.4167 21.3497 20.9833 21.3497 21.6667V24.5833H24.1663C24.8497 24.5833 25.4163 25.15 25.4163 25.8333C25.4163 26.5167 24.8497 27.0833 24.1663 27.0833Z"
              fill="#5D37F3"
            />
          </g>
        </g>
      </svg>

      <p>
        ჩააგდეთ ფაილი აქ ან
        <span @click="openFileInput" class="text-bold">აირჩიეთ ფაილი</span>
      </p>
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
    <div class="input_container">
      <div>
        <label for="author">ავტორი *</label>
        <input type="text" name="author" v-model="formData.author" />
      </div>
      <div>
        <label for="title">სათაური *</label>
        <input type="text" name="title" v-model="formData.title" />
      </div>
    </div>
    <div>
      <label for="description">აღწერა *</label>
      <input type="text" name="description" v-model="formData.description" />
    </div>
    <div class="input_container">
      <div>
        <label for="publish_date">გამოქვეყნების თარიღი *</label>
        <input
          type="date"
          name="publish_date"
          v-model="formData.publish_date"
        />
      </div>
      <div>
        <label for="categories">კატეგორია *</label>
        <input type="text" name="categories" v-model="formData.categories" />
      </div>
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

      dragging: false,
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

    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleDrop(event) {
      this.dragging = false;
      const files = event.dataTransfer.files[0];
      this.handleFileChange(files);
    },
    handleFileChange(event) {
      console.log(event);
      this.formData.image = event;
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

<style scoped lang="scss">
@import "./AddBlog.scss";
</style>
