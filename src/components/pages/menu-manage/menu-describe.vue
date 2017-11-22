<template>
    <div class="page-container">
        <shop-header :headerTitle="headerTitle"
                     :newTips="newTips"
                     :showShopInfo="showShopInfo"
                     :shopInfo="shopInfo"
                     @changeShop='changeShopCallBack'>
        </shop-header>
        <div class="guide-tip">
            门店尚未开通菜单管理功能，
            <span class="link-text" @click="join">现在开通</span>
            。
        </div>
        <div class="top-page">
            <div class="function-desc">
                <div class="title">
                    功能介绍
                </div>
                <div class="content">
                    <div class="item">
                        菜单在线展示，告别纸质菜单
                    </div>
                    <div class="item">
                        大众点评平台引流，提高品牌曝光率
                    </div>
                    <div class="item">
                        玩转菜品营销，自主管理菜品推荐和排序
                    </div>
                </div>

                <ui-button class='open' text="我要开通" type="btn-medium-normal-green" @click="join"></ui-button>
            </div>
            <div class="desc-img">
                <div class="show-img">
                </div>
            </div>
        </div>
        <div class="bottom-page">
            <div class="open-flow">
            </div>
        </div>
        <choose-shop-multi @chooseShop='chooseShop' :shopInfo="foodShopInfo" @close='closeShopsPanel' v-if='showShopPanel && foodShopInfo.length > 0'/>
        <ui-popup class='pop-panel' :visible="popupInfo.visible" :title="popupInfo.title" @close="hidePopInfo">
            <div slot='pop-content'>
                <div class="content">
                    {{popupInfo.content}}
                </div>
                <div class="ok">
                <ui-button text="知道了" type="btn-solid-small-green-normal" @click='hidePopInfo()'></ui-button>
                </div>
            </div>
        </ui-popup>

        <ui-confirm v-if="confirm.visible"
            :visible="confirm.visible"
            :title="confirm.title"
            :content="confirm.content"
            :confirmText="confirm.confirmText"
            :cancelText="confirm.cancelText"
            @close="closeConfirm"
            @confirm="confirmJoin">
        </ui-confirm>
    </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
import Vue from 'vue';
import { Button } from '@dp/bee-ui';
import Popup from '@/components/ui-base/popup/popup.vue';
import UIConfirm from '@/components/ui-base/confirm/confirm.vue';
import ChooseShopMulti from '@/components/shared/choose-shop-multi/choose-shop-multi.vue';
import cookie from '@/lib/cookie.js';
import ShopHeader from '../../../components/shared/shop-header/shop-header.vue';
import { Ajax, reportOperTime } from '../../../lib/utils.js';
import { login } from '../../../lib/auth.js'; // 登录接口
import getPath from '../../../lib/path.js';

// import cookie from '@/lib/cookie.js';
// import { getBackendCookieBSID, setOldDomainCookie } from '@/lib/auth.js'; // 登录接口
import whatever from '../../../lib/whatever-adaptor.js';

export default {
    data() {
        return {
            headerTitle: '菜品管理',
            newTips: false, // 头部是否展示限时免费新功能
            showShopInfo: true, // 头部是否展示商户信息
            shopInfo: { // 商户信息
                shopName: '',
                shopId: '',
            },
            showShopPanel: false,
            foodShopInfo: [],
            hasMultiShops: 0,
            popupInfo: {
                visible: false,
                title: '',
                content: '',
            },
            confirm: {
                visible: false,
                title: '开通确认',
                content: '确认开通 “菜单展示” 功能？',
                confirmText: '确定',
                cancelText: '取消',
            },
            loading: {},
        };
    },
    methods: {
        changeShopCallBack() {
            const pageName = sessionStorage.getItem('pageName');
            sessionStorage.setItem('pageName', '');
            const pageUrl = pageName === 'e-config' ? `${getPath().oldDomain}/shop/config` : `${getPath().oldDomain}/shop/menuManage`;
            window.location = pageUrl;
        },
        hidePopInfo() {
            this.popupInfo.visible = false;
        },
        chooseShop(shopInfo) {
            this.closeShopsPanel();
            if (shopInfo.length) {
                this.openLookMenu(shopInfo);
            }
        },
        openLookMenu(shopInfo) {
            Ajax.post({
                url: 'meishimenu/openMenuPage',
                params: JSON.stringify(shopInfo),
                success: (res) => {
                    if (res.code.toString() === '200') {
                        cookie.setCookie('orderdish_shopId', shopInfo[0].dpShopid, 86400);
                        document.domain = 'meituan.com';
                        if (window.self !== window.top) {
                            if (window.top && window.top.updateSidebar) {
                                window.top.updateSidebar('diancai_dish_all');
                            }
                        }
                        window.location = `${getPath().oldDomain}/shop/menuManage`;
                    } else if (res.code.toString() === '601') {
                        this.popupInfo = {
                            visible: true,
                            title: '提示',
                            content: '抱歉，只有开通过团购业务的门店可开通此服务',
                        };
                    } else {
                        this.popupInfo = {
                            visible: true,
                            title: '提示',
                            content: res.msg,
                        };
                    }
                },
                error: () => {
                    this.popupInfo = {
                        visible: true,
                        title: '提示',
                        content: '网络异常请重试',
                    };
                },
            });
        },
        closeShopsPanel() {
            this.showShopPanel = false;
        },
        join() {
            this.confirm.visible = true;
        },
        closeConfirm() {
            this.confirm.visible = false;
        },
        confirmJoin() {
            whatever.report({
                pageId: 'menuorder_ecom_menulist',
                action: 'click',
                module: 'menuorder_ecom_menulist_open_click',
                userId: this.userId,
                shopId: this.shopId,
            });
            if (this.foodShopInfo.length) {
                if (this.hasMultiShops === 1) {
                    this.showShopPanel = true;
                } else if (this.hasMultiShops === 0) {
                    this.openLookMenu(this.foodShopInfo.splice(0, 1));
                }
            } else {
                this.popupInfo = {
                    visible: true,
                    title: '提示',
                    content: '您没有可开通的门店',
                };
            }
        },
        getFoodShopInfo() {
            Ajax.get({
                url: 'meishiShopInfo',
                success: (res) => {
                    if (res.code.toString() === '200') {
                        this.foodShopInfo = (res.data && res.data.user
                            && res.data.user.openableMeishiShops) || [];
                        this.hasMultiShops = (res.data && res.data.user
                            && res.data.user.hasMultiShops) || 0;

                        this.shopId = res.data && res.data.shop && res.data.shop.shopId;
                        this.userId = res.data && res.data.user && res.data.user.userId;
                        whatever.sendPV({
                            pageId: 'menuorder_ecom_menulist',
                            shopId: this.shopId,
                            accountid: this.userId,
                        });
                        reportOperTime({
                            pageId: 'menuorder_ecom_menulist',
                            module: 'menudescribe_operate_time',
                        });
                    }
                },
                error: () => {
                    this.popupInfo = {
                        visible: true,
                        title: '提示',
                        content: '网络异常请重试',
                    };
                },
            });
        },
        showToast(msg) {
            this.$toast({
                text: msg,
                duration: 2000,
            });
        },
    },
    mounted() {
        this.loading = this.$loading();
        login().then((item) => {
            this.loading.$stopLoading();
            this.shopInfo = {
                shopName: item.shop.shopName,
                shopId: item.shop.shopId,
                hasMultiShops: item.user.hasMultiShops,
            };
            Vue.nextTick(() => {
                if (this.shopInfo.shopId <= 0) {
                    document.getElementsByClassName('switchAccount')[0].click();
                }
            });
            this.getFoodShopInfo();
        });

        //        getBackendCookieBSID().then((cookiedata) => {
        //         // 种cookie
        //         cookie.setCookie('orderdish_bsid', cookiedata.bsid, 86400);
        //         cookie.setCookie('orderdish_shopId', cookiedata.shopId, 86400);
        //         this.getshopInfo();
        //        }, () => {
        //         // 获取失败则重新登陆
        //         window.location.href = getPath().oldIndex;
        //        });
    },
    destroyed() {
        sessionStorage.setItem('pageName', '');
    },
    components: {
        'shop-header': ShopHeader,
        'choose-shop-multi': ChooseShopMulti,
        'ui-button': Button,
        'ui-popup': Popup,
        'ui-confirm': UIConfirm,
    },
};
</script>

<style lang="less">
@import '../../../assets/less/reset.less';
@import './menu-describe.less';
</style>
