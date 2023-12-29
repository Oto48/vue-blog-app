<template>
  <form @submit.prevent="submitForm">
    <h1>ბლოგის დამატება</h1>
    <div
      v-if="!formData.image"
      @dragover.prevent="dragging = true"
      @dragenter.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="handleDrop"
      class="file"
      :class="{ file_drag_over: dragging }"
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
        @change="uploadFile"
      />
    </div>
    <div v-if="formData.image" class="file_output">
      <div>
        <img :src="GalleryImg" alt="GalleryImg" />
        <p>{{ formData.image.name }}</p>
      </div>
      <ExitSVG @click="removeImage" />
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
          :class="authorError ? 'error' : authorError !== null ? 'valid' : ''"
        />
        <ul>
          <li
            v-for="validation in authorValidation"
            :key="validation.text"
            :style="{ color: validation.color }"
          >
            {{ validation.text }}
          </li>
        </ul>
      </div>
      <div>
        <label for="title">სათაური *</label>
        <input
          type="text"
          name="title"
          v-model="formData.title"
          @input="validateTitle"
          @blur="updateTitleBorder"
          :class="titleError ? 'error' : titleError !== null ? 'valid' : ''"
        />
        <ul>
          <li
            v-for="validation in titleValidation"
            :key="validation.text"
            :style="{ color: validation.color }"
          >
            {{ validation.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="input_container">
      <div>
        <label for="description">აღწერა *</label>
        <textarea
          name="description"
          v-model="formData.description"
          @input="validateDescription"
          @blur="updateDescriptionBorder"
          :class="
            descriptionError
              ? 'error'
              : descriptionError !== null
              ? 'valid'
              : ''
          "
        ></textarea>
        <ul>
          <li
            v-for="validation in descriptionValidation"
            :key="validation.text"
            :style="{ color: validation.color }"
          >
            {{ validation.text }}
          </li>
        </ul>
      </div>
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
          :class="dateError ? 'error' : dateError !== null ? 'valid' : ''"
        />
      </div>
      <div class="input_container">
        <div class="multi_select" ref="multiSelectRef">
          <label for="categories">კატეგორია *</label>
          <div class="multi_select_container" @click="toggleDropdown">
            <div v-if="selectedCategories.length === 0" class="placeholder">
              <p>აირჩიეთ კატეგორია</p>
              <p class="arrow"></p>
            </div>
            <div v-else class="selected_items">
              <div class="selected_items_container">
                <div
                  v-for="category in selectedCategories"
                  :key="category"
                  class="selected-item"
                  :style="{
                    background: category.background_color,
                    color: category.text_color,
                  }"
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
                :style="{
                  background: category.background_color,
                  color: category.text_color,
                }"
              >
                {{ category.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input_container">
      <div>
        <label for="email">ელ-ფოსტა</label>
        <input
          type="text"
          name="email"
          v-model="formData.email"
          @input="validateEmail"
          @blur="updateEmailBorder"
          :class="
            emailError
              ? 'error'
              : emailError !== null && formData.email
              ? 'valid'
              : ''
          "
        />
        <div class="alert" v-if="emailError">
          <AlertSvg />
          <p :style="{ color: emailValidation.color }">
            {{ emailValidation.text }}
          </p>
        </div>
      </div>
      <div></div>
    </div>
    <div class="input_container">
      <div></div>
      <div>
        <button type="submit" :disabled="hasErrors" class="btn">submit</button>
      </div>
    </div>
  </form>
  <blog-modal
    text="ჩანაწი წარმატებით დაემატა"
    buttonText="მთავარ გვერდზე დაბრუნება"
  />
</template>

<script>
import axios from "axios";
import FileSvg from "@/assets/svg/FolderSvg";
import ExitSVG from "@/assets/svg/ExitSvg";
import AlertSvg from "@/assets/svg/AlertSvg";
import GalleryImg from "@/assets/images/GalleryImg.png";
import BlogModal from "@/components/BlogModal/BlogModal.vue";

export default {
  name: "AddBlog",

  components: {
    FileSvg: FileSvg,
    ExitSVG: ExitSVG,
    AlertSvg: AlertSvg,
    BlogModal: BlogModal,
  },

  data() {
    return {
      formData: {
        author: "",
        title: "",
        image: "",
        description: "",
        publish_date: "",
        categories: [],
        email: "",
      },

      categories: [],
      selectedCategories: [],
      dropdownOpen: false,
      GalleryImg: GalleryImg,

      authorValidation: [
        { text: "მინიმუმ 4 სიმბოლო" },
        { text: "მინიმუმ ორი სიტყვა" },
        { text: "მხოლოდ ქართული სიმბოლოები" },
      ],
      titleValidation: [{ text: "მინიმუმ 2 სიმბოლო" }],
      descriptionValidation: [{ text: "მინიმუმ 2 სიმბოლო" }],
      dateValidation: [{ text: "გთხოვთ აირჩიოთ თარიღი" }],
      emailValidation: { text: "მეილი უნდა მთავრდებოდეს @redberry.ge-ით" },

      dragging: false,
      authorError: null,
      titleError: null,
      descriptionError: null,
      dateError: null,
      emailError: null,
    };
  },

  methods: {
    submitForm() {
      const formData = new FormData();

      this.formData.categories = JSON.stringify(
        this.selectedCategories.map((item) => item.id).sort()
      );

      this.formData.image = this.convertUrlToBlob(this.formData.image.url);

      Object.keys(this.formData).forEach((key) => {
        formData.append(key, this.formData[key]);
      });

      axios
        .post("https://api.blog.redberryinternship.ge/api/blogs", formData, {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer ba70b939c3f19299963fc2f60faf10d361c50d172bbc4a0457adda9ffcb29986",
          },
        })
        .then((response) => {
          console.log(response.data);
          this.resetForm();
          this.$store.commit("updateModal", true);
          localStorage.removeItem("formData");
        });
    },

    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleDrop(event) {
      this.dragging = false;
      const files = event.dataTransfer.files[0];
      this.uploadFile(files);
    },

    uploadFile(event) {
      const file = event.target?.files[0] || event;
      const imageName = file.name;

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result;

          if (result) {
            this.formData.image = result;
            localStorage.setItem("formData", JSON.stringify(this.formData));
            this.formData.image = { name: imageName, url: result };
          }
        };

        reader.readAsDataURL(file);
      }
    },

    convertUrlToBlob(dataURL) {
      const arr = dataURL.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], { type: mime });
    },

    removeImage() {
      this.formData.image = "";
    },

    validateAuthor() {
      const author = this.formData.author.trim();
      const words = author.split(/\s+/);
      const nonSpaceAuthor = author.replace(/\s+/g, "");
      const georgianCharsRegex = /^[ა-ჰ\s]+$/;

      const isLengthValid = nonSpaceAuthor.length >= 4;
      const isWordCountValid = words.length >= 2;
      const isGeorgianCharsValid = georgianCharsRegex.test(author);

      this.authorValidation[0].color = isLengthValid ? "#14D81C" : "#ea1919";
      this.authorValidation[1].color = isWordCountValid ? "#14D81C" : "#ea1919";
      this.authorValidation[2].color = isGeorgianCharsValid
        ? "#14D81C"
        : "#ea1919";

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

      this.titleValidation[0].color = isTitleValid ? "#14D81C" : "#ea1919";
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
        ? "#14D81C"
        : "#ea1919";
      this.descriptionError = !isDescriptionValid;
    },

    updateDescriptionBorder() {
      const isDescriptionValid = this.formData.description.trim().length >= 2;
      this.descriptionError = !isDescriptionValid;
      this.validateDescription();
    },

    validateDate() {
      const date = this.formData.publish_date;

      this.dateValidation[0].color = date ? "#14D81C" : "#ea1919";
      this.dateError = !date;
    },

    updateDateBorder() {
      this.dateError = !this.formData.publish_date;
    },

    validateEmail() {
      const email = this.formData.email.trim();
      const isEmailValid = !email || email.endsWith("@redberry.ge");

      this.emailValidation.color = isEmailValid ? "#14D81C" : "#ea1919";
      this.emailError = !isEmailValid;
    },

    updateEmailBorder() {
      const email = this.formData.email.trim();
      this.emailError = email && !email.endsWith("@redberry.ge");
      this.validateEmail();
    },

    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    closeDropdown(event) {
      const isMultiSelect = this.$refs.multiSelectRef?.contains(event.target);
      if (!isMultiSelect) {
        this.dropdownOpen = false;
      }
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

    resetForm() {
      this.formData = {
        author: "",
        title: "",
        image: "",
        description: "",
        publish_date: "",
        categories: [],
        email: "",
      };
      this.selectedCategories = [];
      this.dropdownOpen = false;

      this.authorError = null;
      this.titleError = null;
      this.descriptionError = null;
      this.dateError = null;
      this.emailError = null;
    },

    updateModal() {
      this.$store.commit("updateModal", true);
    },
  },

  computed: {
    hasErrors() {
      return (
        this.titleError ||
        this.titleError === null ||
        this.authorError ||
        this.authorError === null ||
        this.descriptionError ||
        this.descriptionError === null ||
        this.dateError ||
        this.dateError === null ||
        this.emailError ||
        !this.selectedCategories.length ||
        !this.formData.image
      );
    },
  },

  mounted() {
    const storedData = localStorage.getItem("formData");

    if (storedData) {
      this.formData = JSON.parse(storedData);
    }

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

    document.body.addEventListener("click", this.closeDropdown);
  },

  watch: {
    formData: {
      handler(newValue) {
        localStorage.setItem("formData", JSON.stringify(newValue));
      },
      deep: true,
    },
  },

  beforeUnmount() {
    localStorage.removeItem("formData");
  },
};
</script>

<style scoped lang="scss">
@import "./AddBlog.scss";
</style>
