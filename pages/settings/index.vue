<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="user.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input required v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">Or click here to logout.</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from '@/api/user'

export default {
  middleware: 'authenticated',
  name: 'Settings',
  async asyncData ({ params, query }) {
    const { user } = await getUser()
    return {
      user: {
        bio: user.bio,
        email: user.email,
        image: user.image,
        username: user.username,
        password: ''
      }
    }
  },
  methods: {
    async onSubmit () {
      const {user} = await updateUser(this.user)
      this.$router.push(`profile/${user.username}`)
    },
    logout () {
      this.$store.commit('logoutUser', () => {
        this.$router.push({
          path: '/',
          query: {
            page: 1
          }
        })
      })
    }
  }
}
</script>

<style>

</style>