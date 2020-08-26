<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p v-html="profile.bio" ></p>
            <nuxt-link
              v-if="user.username === profile.username"
              to="/settings"
            >
              <i class="ion-gear-a"></i>Edit Profile Settings
            </nuxt-link>
            <button 
              class="btn btn-sm action-btn"
              v-else
              @click="toggleFollow(profile)"
              :class="[profile.following ? 'btn-secondary':'btn-outline-secondary']"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  :to="{path: `${username}`}"
                  class="nav-link"
                  exact
                  :class="{
                    active: !feed
                  }"
                >
                  My Acticles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :to="{
                    path: `${username}`,
                    query: {
                      feed: 'favorites'
                    }
                  }"
                  exact
                  :class="{active: feed}"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <article-list :articles="articles" :onFavorite="onFavorite"  />

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getProfile, followUser, unFollowUser } from '@/api/user'
import { mapState } from 'vuex'
import { getArticles, deleteFavorite, addFavorite } from '@/api/article'
import ArticleList from '@/components/articleList'

export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  components: {
    ArticleList
  },
  async asyncData ({ params, store, query }) {
    const { feed } = query
    const { username } = params
    let profile = {}
    const initProfile = store.state.getProfile
    if (initProfile && initProfile.username === username) {
      profile = initProfile
    } else {
      const { data } = await getProfile(username)
      store.commit('setProfile', data.profile)
      profile = data.profile
    }

    const pageQuery = { limit: 5, offset: 0 }
    if (feed) {
      pageQuery.favorited = username
    } else {
      pageQuery.author = username
    }

    const { data } = await getArticles(pageQuery)
    const { articles, articlesCount } = data

    articles.forEach(article => article.favoriteDisabled = false)

    return {
      username,
      feed,
      profile,
      articles, 
      articlesCount
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watchQuery: ['feed', 'p'],
  methods: {
    async toggleFollow (profile) {
      const follow = profile.following ? unFollowUser : followUser
      const { data } = await follow(profile.username)
      this.profile = data.profile
      this.$store.commit('setProfile', data.profile)
    },
    async onFavorite (article) {
    
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