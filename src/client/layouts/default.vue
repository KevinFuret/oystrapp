<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      enable-resize-watcher
      disable-route-watcher
      persistent
      v-model="drawer"
      app>
      <v-list class="main-list account">
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar class="account__avatar">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="account__username">
              {{username}}
              </v-list-tile-title>
            <span class="account__email">
              {{email}}
            </span>
          </v-list-tile-content>
          <v-list-tile-action icon>
            <v-btn icon light @click.stop="drawer = !drawer">
              <v-icon light>clear</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list>
        <filters></filters>
        <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
          <v-list-tile slot="item" :ripple="!item.items" :router="!item.items" :to="item.to ? item.to : ''">
            <v-list-tile-action icon light>
              <v-icon icon light>{{ item.action }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="item.items">
              <v-icon light>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" ripple>
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>{{ subItem.action }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed>
      <v-toolbar-side-icon light @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title >{{name}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <v-btn icon="icon" slot="activator" light>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile ripple router to="/users/auth/sign-in" v-if="!$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign In</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users/auth/sign-up" v-if="!$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign Up</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users/auth/sign-out" v-if="$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users">
            <v-list-tile-title>Users</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/admin" v-if="$store.state.user.admin">
            <v-list-tile-title>Admin</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content app clipped-left>
      <v-container fluid>
          <nuxt></nuxt>
      </v-container>
    </v-content>
    <v-snackbar
      :timeout="3000"
      :bottom="true"
      :right="true"
      :multi-line="true"
      :color="snackbarColor"
      v-model="snackbar">
      {{ $store.state.notification.text }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
// search icons: https://material.io/icons/ asd
import filters from '../components/filters.vue'

export default {
  props: {
    source: String
  },
  components: {
    filters
  },
  data () {
    return {
      drawer: null,
      items: [
        {
          action: 'android',
          title: 'Something',
          items: [
            { title: 'First' },
            { title: 'Second' },
            { title: 'Third' }
          ]
        },
        {
          action: 'settings',
          title: 'Settings',
          items: [
            { title: 'Payment' },
            { title: 'Account' },
            { title: 'Privacy' }
          ]
        }
      ],
      name: 'OYSTR',
      username: 'John Doe',
      email: 'johndoe@gmail.com',
      mini: false,
      right: null
    }
  },
  computed: {
    snackbar: {
      get () {
        return this.$store.state.notification.snackbar
      },
      set (value) {
        this.$store.commit('notification/UPDATE_SNACKBAR', value)
      }
    },
    snackbarColor () {
      return this.$store.state.notification.context
    }
  }
}
</script>
<style>
  .overlay:before{
    background-color: white;
  }
  .overlay--active:before{
    opacity:0.9;
  }
  .navigation-drawer--is-mobile:not(.navigation-drawer--close),
  .navigation-drawer--temporary:not(.navigation-drawer--close){
    box-shadow: 3px 5px 10px 0 rgba(0, 0, 0, 0.11);
  }
  .navigation-drawer__border{
    width:0;
  }
  .application{
    overflow-y: hidden;
  }
  .account{
    border-bottom: 1px solid #eee;
  }
  .account__email{
    font-weight:normal;
    color: #b5b5b5;
  }
</style>
