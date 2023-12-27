<template>
  <h1>ბლოგის დამატება</h1>
  <form @submit.prevent="submitForm">
    <div
      @dragover.prevent="dragging = true"
      @dragenter.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="handleDrop"
      class="file"
      :class="{ 'drag-over': dragging }"
    >
      <FileSvg />
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
        <input
          type="text"
          name="author"
          v-model="formData.author"
          @input="validateAuthor"
          @blur="updateAuthorBorder"
          :class="authorError ? 'error' : ''"
        />
        <p
          v-for="validation in authorValidation"
          :key="validation.text"
          :style="{ color: validation.color }"
        >
          {{ validation.text }}
        </p>
      </div>
      <div>
        <label for="title">სათაური *</label>
        <input
          type="text"
          name="title"
          v-model="formData.title"
          @input="validateTitle"
          @blur="updateTitleBorder"
          :class="titleError ? 'error' : ''"
        />
        <p
          v-for="validation in titleValidation"
          :key="validation.text"
          :style="{ color: validation.color }"
        >
          {{ validation.text }}
        </p>
      </div>
    </div>
    <div>
      <label for="description">აღწერა *</label>
      <input
        type="text"
        name="description"
        v-model="formData.description"
        @input="validateDescription"
        @blur="updateDescriptionBorder"
        :class="descriptionError ? 'error' : ''"
      />
      <p
        v-for="validation in descriptionValidation"
        :key="validation.text"
        :style="{ color: validation.color }"
      >
        {{ validation.text }}
      </p>
    </div>
    <div class="input_container">
      <div>
        <label for="publish_date">გამოქვეყნების თარიღი *</label>
        <input
          type="date"
          name="publish_date"
          v-model="formData.publish_date"
          @input="validateDate"
          @blur="updateDateBorder"
          :class="dateError ? 'error' : ''"
        />
        <p
          v-for="validation in dateValidation"
          :key="validation.text"
          :style="{ color: validation.color }"
        >
          {{ validation.text }}
        </p>
      </div>
      <div>
        <div class="custom-multi-select">
          <label for="categories">კატეგორია *</label>
          <div class="select-container" @click="toggleDropdown">
            <div v-if="selectedCategories.length === 0" class="placeholder">
              <p>აირჩიეთ კატეგორია</p>
              <p class="arrow"></p>
            </div>
            <div v-else class="selected-items">
              <div class="selected-items-container">
                <div
                  v-for="category in selectedCategories"
                  :key="category"
                  class="selected-item"
                >
                  {{ category.title }}
                  <span
                    @click.stop="removeCategory(category)"
                    class="remove-icon"
                    >x</span
                  >
                </div>
              </div>
              <p class="arrow"></p>
            </div>
            <div v-if="dropdownOpen" class="dropdown">
              <div
                v-for="category in categories"
                :key="category.id"
                @click="toggleCategory(category)"
                :style="{ background: category.background_color }"
              >
                {{ category.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <label for="email">ელ-ფოსტა</label>
      <input type="text" name="email" v-model="formData.email" />
    </div>
    <button type="submit" :disabled="hasErrors">submit</button>
  </form>
</template>

<script>
import axios from "axios";
import FileSvg from "../../assets/svg/FolderSvg";

export default {
  name: "AddBlog",

  components: {
    FileSvg: FileSvg,
  },

  data() {
    return {
      formData: {
        author: "",
        title: "",
        image: null,
        description: "",
        publish_date: "",
        categories: [],
        email: "gigagiorgadze@redberry.ge",
      },

      categories: [],
      selectedCategories: [],
      dropdownOpen: false,

      authorValidation: [
        { text: "მინიმუმ 4 სიმბოლო" },
        { text: "მინიმუმ ორი სიტყვა" },
        { text: "მხოლოდ ქართული სიმბოლოები" },
      ],
      titleValidation: [{ text: "მინიმუმ 2 სიმბოლო" }],
      descriptionValidation: [{ text: "მინიმუმ 2 სიმბოლო" }],
      dateValidation: [{ text: "გთხოვთ აირჩიოთ თარიღი" }],

      dragging: false,
      authorError: null,
      titleError: null,
      descriptionError: null,
      dateError: null,
    };
  },

  methods: {
    submitForm() {
      const formData = new FormData();

      this.formData.categories = JSON.stringify(
        this.selectedCategories.map((item) => item.id).sort()
      );

      Object.keys(this.formData).forEach((key) => {
        formData.append(key, this.formData[key]);
      });

      console.log("!!!!!!!!", this.formData);

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
      this.formData.image = event.target?.files[0] || event;
    },

    validateAuthor() {
      const author = this.formData.author.trim();
      const words = author.split(/\s+/);
      const nonSpaceAuthor = author.replace(/\s+/g, "");
      const georgianCharsRegex = /^[ა-ჰ\s]+$/;

      const isLengthValid = nonSpaceAuthor.length >= 4;
      const isWordCountValid = words.length >= 2;
      const isGeorgianCharsValid = georgianCharsRegex.test(author);

      this.authorValidation[0].color = isLengthValid ? "green" : "red";
      this.authorValidation[1].color = isWordCountValid ? "green" : "red";
      this.authorValidation[2].color = isGeorgianCharsValid ? "green" : "red";

      this.authorError = !(
        isLengthValid &&
        isWordCountValid &&
        isGeorgianCharsValid
      );
    },

    updateAuthorBorder() {
      const author = this.formData.author.trim();
      this.authorError =
        author.length < 4 ||
        author.split(/\s+/).length < 2 ||
        !/^[ა-ჰ\s]+$/.test(author);
      this.validateAuthor();
    },

    validateTitle() {
      const title = this.formData.title.trim();
      const isTitleValid = title.length >= 2;

      this.titleValidation[0].color = isTitleValid ? "green" : "red";
      this.titleError = !isTitleValid;
    },

    updateTitleBorder() {
      const isTitleValid = this.formData.title.trim().length >= 2;
      this.titleError = !isTitleValid;
      this.validateTitle();
    },

    validateDescription() {
      const description = this.formData.description.trim();
      const isDescriptionValid = description.length >= 2;

      this.descriptionValidation[0].color = isDescriptionValid
        ? "green"
        : "red";
      this.descriptionError = !isDescriptionValid;
    },

    updateDescriptionBorder() {
      const isDescriptionValid = this.formData.description.trim().length >= 2;
      this.descriptionError = !isDescriptionValid;
      this.validateDescription();
    },

    validateDate() {
      const date = this.formData.publish_date;

      this.dateValidation[0].color = date ? "green" : "red";
      this.dateError = !date;
    },

    updateDateBorder() {
      this.dateError = !this.formData.publish_date;
    },

    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleCategory(category) {
      this.categories = this.categories.filter(
        (item) => item.id !== category.id
      );
      if (this.selectedCategories.includes(category)) {
        this.removeCategory(category.id);
      } else {
        this.selectedCategories.push(category);
      }
    },
    removeCategory(category) {
      this.selectedCategories = this.selectedCategories.filter(
        (item) => item.id !== category.id
      );
      this.categories.push(category);
      this.categories.sort((a, b) => a.id - b.id);
    },
  },

  computed: {
    hasErrors() {
      // console.log(this.selectedCategories);
      // console.log("image", this.formData.image)
      return (
        this.titleError ||
        this.titleError === null ||
        this.authorError ||
        this.authorError === null ||
        this.descriptionError ||
        this.descriptionError === null ||
        this.dateError ||
        this.dateError === null ||
        !this.selectedCategories.length ||
        !this.formData.image
      );
    },
  },

  mounted() {
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
@import "./AddBlog.scss";
</style>
