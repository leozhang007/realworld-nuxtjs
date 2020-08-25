<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input @keyup.enter="addTag" v-model="articleTag" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
                <div class="tag-list">
                  <span class="tag-default tag-pill" v-for="tag in article.tagList" :key="tag">
                    <i class="ion-close-round" @click="removeTag(tag)"></i>
                    {{tag}}
                  </span>
                </div>
              </fieldset>
              <button 
                class="btn btn-lg pull-xs-right btn-primary" 
                type="button"
                @click="onSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, editArticle, updateArticle } from '@/api/article'

export default {
  middleware: 'authenticated',
  name: 'EditorIndex',
  async asyncData ({ store, env, params, query }) {
    if (params.slug) {
      const { article } = await editArticle(params.slug)
      return {
        article
      }
    } else {
      return {}
    }
  },
  data () {
    return {
      article: {
        slug: '',
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      articleTag: '',
      errors: {},
    }
  },
  methods: {
    async onSubmit () {
      const request = this.article.slug ? updateArticle : createArticle;
      const { article } = await request(this.article);
      if (article) {
        this.$router.push({
          name: "article",
          params: { slug: article.slug },
        });
      }
    },
    addTag () {
      if (!this.article.tagList.includes(this.articleTag)) {
        this.article.tagList.push(this.articleTag);
        this.articleTag = "";
      }
    },
    removeTag(tag) {
      this.article.tagList = this.article.tagList.filter(
        (vals) => vals !== tag
      );
    },
  }
}
</script>

<style>

</style>