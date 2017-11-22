<template>
    <div class="main-box">
        <div class="page-container">
            <shop-header :headerTitle="headerTitle"
                         :newTips="newTips"
                         :showShopInfo="showShopInfo"
                         :shopInfo="shopInfo"
                         @changeShop="changeShopReload">
            </shop-header>
            <div class="content">
                <div class="cont-item" v-if=" menuShowStatus.isShow ">
                    <input class="bee-icon" :class="{ 'bee-icon-checkbox-checked' : menuShowStatus.value, 'bee-icon-checkbox' : !menuShowStatus.value }" type="checkbox" :checked="menuShowStatus.value" @click="updateMenuShowStatus"/>
                    <span class="item-title">顾客在线看菜单</span>
                    <div class="item-detail">
                        <p class="item-info">启用该功能时，顾客可在大众点评app直接看店里的菜单</p>
                        <p class="intro-title">功能介绍</p>
                        <p class="intro-detail">菜单在线展示，告别纸质菜单</p>
                        <p class="intro-detail">大众点评平台引流，提升品牌曝光率</p>
                        <p class="intro-detail">玩转菜品营销，自主管理菜品推荐和排序</p>
                    </div>
                    <div class="desc-img">
                        <div class="show-img-one">
                        </div>
                        <div class="show-img-two">
                        </div>
                    </div>
                </div>
                <div class="cont-item" v-if=" realTimeTableStatus.isShow ">
                    <input class="bee-icon" :class="{ 'bee-icon-checkbox-checked' : realTimeTableStatus.value===1, 'bee-icon-checkbox' : realTimeTableStatus.value===0 }" type="checkbox" :checked="realTimeTableStatus.value ? true : false" @click="updateRealTimeTableStatus"/>
                    <span class="item-title">展示桌台实时信息</span>
                    <div class="item-detail">
                        <p class="item-info">启用该功能时，门店桌台信息将实时展示在美团app商家列表页及商家详情页上。</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    /* eslint-disable import/no-unresolved */
    import Vue from 'vue';
    import ShopHeader from '@/components/shared/shop-header/shop-header.vue';
    import { Pagination, Button } from '@dp/bee-ui';
    import { Ajax } from '../../../lib/utils.js';
    import { login } from '../../../lib/auth.js'; // 登录接口
    import getPath from '../../../lib/path.js';

    export default {
        data() {
            return {
                headerTitle: '菜品管理',
                newTips: false, // 头部是否展示限时免费新功能
                showShopInfo: true, // 头部是否展示商户信息
                shopInfo: { // 商户信息
                    shopName: '',
                    shopId: '',
                    isIntellShop: 0,
                },
                menuShowStatus: {
                    isShow: false,
                    value: 1,
                },
                realTimeTableStatus: {
                    isShow: false,
                    value: 1,
                },
            };
        },
        components: {
            pagination: Pagination,
            'bee-button': Button,
            'shop-header': ShopHeader,
        },
        methods: {
            changeShopReload() {
                const pageUrl = `${getPath().oldDomain}/shop/config`;
                window.location = pageUrl;
                // console.log('test');
                // window.location.reload();
            },
            getMenuShowStatus() {
                return new Promise((resolve) => {
                    Ajax.get({
                        url: 'config/isViewMenuOpen',
                        params: {},
                        success: (res) => {
                            if (res.code.toString() === '200') {
                                this.menuShowStatus = res.data;
                                resolve(res.data);
                            } else {
                                this.showToast('网络异常，请稍后重试！');
                            }
                        },
                        error: () => {
                            this.showToast('网络异常，请稍后重试！');
                        },
                    });
                });
            },
            updateMenuShowStatus() {
                this.menuShowStatus.value = !this.menuShowStatus.value;
                Ajax.post({
                    url: 'config/isViewMenuOpen',
                    params: { value: this.menuShowStatus.value },
                    success: (res) => {
                        if (res.code.toString() === '200') {
                            this.showToast('操作成功');
                        } else {
                            this.menuShowStatus.value = !this.menuShowStatus.value;
                            this.$toast({
                                text: res.msg,
                                duration: 2000,
                            });
                        }
                    },
                    error: () => {
                        this.showToast('网络异常，请稍后重试！');
                    },
                });
            },
            getRealTimeTableStatus() {
                return new Promise((resolve) => {
                    Ajax.get({
                        url: 'config/realTimeTableStatus',
                        params: {},
                        success: (res) => {
                            if (res.code.toString() === '200') {
                                this.realTimeTableStatus = res.data;
                                resolve(res.data);
                            } else {
                                this.showToast('网络异常，请稍后重试！');
                            }
                        },
                        error: () => {
                            this.showToast('网络异常，请稍后重试！');
                        },
                    });
                });
            },
            updateRealTimeTableStatus() {
                this.realTimeTableStatus.value = this.realTimeTableStatus.value === 0 ? 1 : 0;
                Ajax.post({
                    url: 'config/realTimeTableStatus',
                    params: { value: this.realTimeTableStatus.value },
                    success: (res) => {
                        if (res.code.toString() === '200') {
                            this.showToast('操作成功');
                        } else {
                            this.realTimeTableStatus.value =
                            this.realTimeTableStatus.value === 0 ? 1 : 0;
                            this.$toast({
                                text: res.msg,
                                duration: 2000,
                            });
                        }
                    },
                    error: () => {
                        this.showToast('网络异常，请稍后重试！');
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
            document.domain = 'meituan.com';
            if (window.self !== window.top) {
                if (window.top && window.top.updateSidebar) {
                    window.top.updateSidebar('diancai_mendian_config');
                }
            }
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
                if (this.shopInfo.shopId > 0) {
                    Promise.all([
                        this.getMenuShowStatus(), this.getRealTimeTableStatus()],
                    ).then(() => {
                        if (this.menuShowStatus.isShow === false &&
                                this.realTimeTableStatus.isShow === false) {
                            sessionStorage.setItem('pageName', 'e-config');
                            const pageUrl = `${location.origin}${location.pathname}#/shop/menudescribe`;
                            window.location = pageUrl;
                        }
                    });
                }
            });
            document.documentElement.scrollTop = 0;
            window.pageYOffset = 0;
            document.body.scrollTop = 0;
        },
    };
</script>
<style lang="less">
    @import '~@dp/bee-ui/dist/styles/theme/ecom/index.css';
    .page-container {
        width: 960px;
        margin: 0 auto;

        .content {
            margin-top: 20px;
            color: #999999;

            .cont-item {
                margin: 10px 0;
                font-size: 12px;

                .item-title {
                    color: #666666;
                }

                .item-detail {
                    margin-left: 16px;

                    .intro-title {
                        color: #666666;
                        margin-top: 10px;
                    }

                    .intro-detail {
                        margin-top: 5px;
                    }
                }

                .desc-img {
                    margin-left: 15px;
                    margin-top: 5px;
                    margin-bottom: 20px;
                    .show-img-one {
                        display: inline-block;
                        width: 138px;
                        height: 246px;
                        background: url('../../../assets/img/scene1.png') no-repeat;
                        background-size: 138px 246px;
                    }

                    .show-img-two {
                        display: inline-block;
                        position: relative;
                        margin-left: -74px;
                        margin-bottom: -2px;
                        width: 149px;
                        height: 264px;
                        background: url('../../../assets/img/scene2.png') no-repeat;
                        background-size: 149px 264px;
                        z-index: 1;
                    }
                }
            }
        }
    }
</style>
