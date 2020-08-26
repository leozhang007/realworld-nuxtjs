<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>Welcome Young Man</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                >
                  Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  :to="{
                    name: 'home',
                  }"
                >
                  Global Feed
                </nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  exact
                  :class="{
                    active: tab === 'tag'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                >
                  # {{ tag }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <article-list :articles="articles" :onFavorite="onFavorite"  />
          
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li 
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"
                >
                <nuxt-link
                class="page-link" 
                :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab: tab
                  }
                }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link :to="{
                name: 'home',
                query: {
                  tag: item,
                  tab: 'tag'
                }
              }" v-for="item in tags" :key="item" class="tag-pill tag-default">
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getArticles, getYourFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
import ArticleList from '@/components/articleList'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  async asyncData ({ query, error }) {
    try {
      console.log(error);
      const page = Number.parseInt(query.page || 1)
      const limit = 20
      const tab = query.tab || 'global_feed'
      const tag = query.tag
      const loadArticles = tab === 'your_feed' ? getYourFeedArticles : getArticles
      const [ data = {}, tagData ] = await Promise.all([
        loadArticles({
          limit,
          offset: (page - 1) * 2,
          tag
        }),
        getTags()
      ])

      const { articles, articlesCount } = data
      const { tags } = tagData

      articles.forEach(article => article.favoriteDisabled = false)

      return {
        articles, // 文章列表
        articlesCount, // 文章总数
        tags, // 标签列表
        limit, // 每页大小
        page, // 页码
        tab, // 选项卡
        tag // 数据标签
      }
    } catch (err) {
      console.log(err);
      console.log('=====================');
      error(err)
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite (article) {

      if (!this.user) {
        this.$router.push('/login')
        return
      }

      article.favoriteDisabled = true

      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style>

</style>