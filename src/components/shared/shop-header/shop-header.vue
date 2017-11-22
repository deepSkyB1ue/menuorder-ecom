<template>
<!-- <ShopCloseTip></ShopCloseTip> -->
<div class="shop-header">
    <span class="page-theme">{{headerTitle}}</span>
    <span class="page-newtips" v-if="newTips"><i></i>限时免费</span>
    <span class="shop-title" v-if="showShopInfo">{{shopInfo.shopName}}</span>
    <span class="shop-number" v-if="showShopInfo">商户号：{{shopInfo.shopId}}</span>
    <a v-if="showShopInfo && shopInfo.hasMultiShops == 1" class="switchAccount" href="javascript:;" @click='changeShop'>切换账号</a>
    <select-shop @close='close' @ok='chooseShop' v-if='showChooseShopPanel && shopInfos.length' :shopInfos="shopInfos" :shopInfo='shopInfo'></select-shop>
    <ui-toast :visible="toast.visible" :text="toast.text" :duration="toast.duration"></ui-toast>
</div>
</template>

<script>
/* eslint-disable import/no-unresolved */
import UIToast from '@/components/ui-base/toast/toast.vue';
import {
    Ajax,
} from '@/lib/utils.js';
import cookie from '@/lib/cookie.js';

import ShopCloseTip from '../shop-close-tip/shop-close-tip.vue';
import SelectShop from '../select-shop/select-shop.vue';


export default {
    name: 'shop-header',
    props: {
        headerTitle: String,
        shopInfo: {
            type: Object,
            required: true,
        },
        newTips: {
            type: Boolean,
            required: false,
        },
        showShopInfo: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data() {
        return {
            showChooseShopPanel: false,
            toast: {
                visible: false,
                text: '',
            },
            shopInfos: [],
        };
    },
    methods: {
        chooseShop(shopInfo) {
            cookie.setCookie('orderdish_shopId', shopInfo.shopId, 86400);
            this.$emit('changeShop');
        },
        changeShop() {
            this.getShopInfos();
        },
        close() {
            this.showChooseShopPanel = false;
        },
        showToastMsg(msg) {
            this.toast = {
                visible: true,
                text: msg,
            };
            setTimeout(() => {
                this.toast.visible = false;
            }, 2000);
        },
        getShopInfos() {
            Ajax.get({
                url: '',
                params: { pageName: 'e-menuManage' },
                success: (res) => {
                    if (res.code.toString() === '200') {
                        this.shopInfos = res.data;
                        if (this.shopInfos.length) {
                            this.showChooseShopPanel = true;
                        }
                    } else {
                        this.showToastMsg(res.msg);
                    }
                },
                error: () => {
                    this.showToastMsg('网络错误，请重试');
                },
            });
        },
    },
    components: {
        ShopCloseTip,
        'select-shop': SelectShop,
        'ui-toast': UIToast,
    },
};
</script>

<style lang="less">@import './shop-header.less';</style>
