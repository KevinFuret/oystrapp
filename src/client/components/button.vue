<template>
    <a :href="link" class="button" :class="style">
        <slot></slot>
    </a>
</template>
<script>
    export default {
      props: [
        'link',
        'large',
        'color' // blue (default), white, black
      ],
      data () {
        return {
          // color: 'blue'
        }
      },
      computed: {
        style () {
          if (this.large) return 'button--large button--' + this.color
          else return 'button--' + this.color
        }
      }
    }
</script>
<style>
    .application .button{
        background: #2e86de;
        color: white;
        border:1px solid #2e86de;
        padding:0.75rem 1.2rem;
        font-size:16px;
        text-decoration: none;
        font-weight:bold;
        margin:0.5rem 0;
    }
    .application .button--white{
        background: white;
        color: #2e86de;
    }
    .application .button-black{
        background: black;
        border:1px solid black;
    }
    .application .button--large{
        width: 75%;
        text-align:center;
        display: block;
        margin: 0.5rem auto;
    }
</style>