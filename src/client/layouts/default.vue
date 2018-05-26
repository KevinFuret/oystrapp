<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      enable-resize-watcher
      disable-route-watcher
      temporary
      v-model="drawer"
      app>
      <v-list class="main-list account">
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar class="account__avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="account__username">
              </v-list-tile-title>
            <span class="account__email">
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
      <div @click.stop="drawer = !drawer" v-if="!isRevealed">
        <img :src="burgerIcon" alt="ouvrir le menu" class="burger-menu__icon">
      </div>
      <v-toolbar-title v-if="!isRevealed">
        <img :src="logo" alt="OYSTR" class="toolbar__logo">
      </v-toolbar-title>
      <v-spacer v-if="!isRevealed"></v-spacer>
      <v-btn icon @click="revealSearchBar">
        <v-icon v-if="isRevealed">arrow_back</v-icon>
        <v-icon v-if="!isRevealed">search</v-icon>
      </v-btn>
      <search-bar v-if="isRevealed"></search-bar>
      <!-- <v-menu bottom left>
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
      </v-menu> -->
    </v-toolbar>
    <v-content app clipped-left @click.stop="drawer = !drawer">
      <div class="app_menu">
        <nuxt-link class="app_menu__link" to="/selection">Sélections</nuxt-link>
        <nuxt-link class="app_menu__link" to="/">Liste</nuxt-link>
        <nuxt-link class="app_menu__link" to="/mapPlaces">Carte</nuxt-link>
      </div>
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
import searchBar from '../components/searchBar.vue'
import logo from '~/assets/img/logo.png'
import burgerIcon from '~/assets/img/menu_filter.png'

export default {
  props: {
    source: String
  },
  components: {
    filters,
    'search-bar': searchBar
  },
  data () {
    return {
      drawer: null,
      logo,
      burgerIcon,
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
      right: null,
      isRevealed: false
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
  },
  methods: {
    revealSearchBar () {
      this.isRevealed = !this.isRevealed
    }
  }
}
</script>
<style>
  .application .theme--light.toolbar,
  .theme--light .toolbar,
  .application.theme--light{
    background:white;
    box-shadow: none;
  }
  .toolbar__content {
    position: relative;
  }
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
  .toolbar__title{
    width: 100%;
    text-align: center;
    margin-left: 0;
  }
  .burger-menu__icon{
    width:24px;
    cursor: pointer;
  }
  .toolbar__logo{
    width:90px;
  }
  .application{
    overflow-y: hidden;
    overflow-x: hidden;
    width: 100vw;
  }
  .account{
    border-bottom: 1px solid #eee;
  }
  .account__email{
    font-weight:normal;
    color: #b5b5b5;
  }
  .app_menu{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .app_menu .app_menu__link{
    text-transform: uppercase;
    font-size:1rem;
    color: #C7C7CC;
    text-align: center;
    border-bottom:2px solid #C7C7CC;
    padding:0.5rem;
    text-decoration: none;
  }
  .app_menu .nuxt-link-exact-active{
    color: black;
    border-color: black;
  }

  .app_menu + .container {
    padding: 0;
  }
</style>
