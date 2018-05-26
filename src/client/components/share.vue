<template>
    <div alt="share" class="details__share share-button">
        <img :src="share" class="share-button__image" alt="Partager ce lieu avec vos amis" @click="isDialogOpen = !isDialogOpen">
        <transition name="fade">
            <social-sharing url="http://google.com"
                            :title="title + ', toutes les infos sur OYSTR'"
                            :description="description"
                            hashtags="oystr,culture,nantes"
                            twitter-user="oystrapp"
                            v-cloak inline-template
                            v-show="isDialogOpen === true">
                <div class="share__dialog" >
                    <network network="facebook" class="share-dialog__link">
                        <i class="fa fa-facebook"></i> Facebook
                    </network>
                    <network network="twitter" class="share-dialog__link">
                        <i class="fa fa-twitter"></i> Twitter
                    </network>
                    <network network="email" class="share-dialog__link">
                        <i class="fa fa-envelope"></i> Email
                    </network>
                    <network network="sms" class="share-dialog__link">
                        <i class="fa fa-commenting-o"></i> SMS
                    </network>
                    <network network="whatsapp" class="share-dialog__link">
                        <i class="fa fa-whatsapp"></i> Whatsapp
                    </network>
                </div>
            </social-sharing>
        </transition>
    </div>
</template>
<script>
import share from '~/assets/img/share.svg'
export default {
  props: ['title', 'description'],
  data () {
    return {
      share,
      url: document.URL,
      isDialogOpen: false
    }
  }
}
</script>`
<style>
    .share-button{
        position: relative;
        cursor: pointer;
    }
    .share__dialog{
        background: white;
        position: absolute;
        z-index:1;
        right: 0;
        text-align: center;
        padding: .5rem 0;
        box-shadow: 1px 2px 8px 0 rgba(0,0,0,0.1);
        border-radius: 2px;
    }
    .share-dialog__link{
        padding: 0.25rem 2rem;
        margin:0.2rem 0;
        display: block;
        cursor: pointer;
    }
    .share-dialog__link:hover,
    .share-dialog__link:active{
        background: #e1e1e1;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>