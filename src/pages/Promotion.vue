<template>
    <div class="main-box">
        <div class="main">
            <div class="colmain">
                <shop-header :headerTitle="headerTitle"
                    :newTips="newTips"
                    :showShopInfo="showShopInfo"
                    :shopInfo="shopInfo">
                </shop-header>
                <page-error
                v-if="pageError"
            :msg="pageError.msg"></page-error>
                <div class="promotion-container" v-if="!pageError">
                    <p class="shop-tip" v-if="shopTips">{{shopTips}}</p>
                    <ui-button text="添加优惠活动" v-if="shopAuthentified" type="btn-medium-normal-orange" @click="addPromotion" />
                    <promotion-edit v-if="editMode && currentPromotion.id === null"
                        :shopList="shopList"
                        :holidays="holidays"
                        :currentPromotion="currentPromotion"
                        :promoLimitHackShopIds = "promoLimitHackShopIds"
                        @submitPromotion="submitPromotion"
                        @cancelPromotion="cancelAddPromotion">
                    </promotion-edit>
                    <div class="promotion-list">
                        <!-- 容器 -->
                        <div v-for="item in activityParamsVOs">
                            <promotion-item
                                v-if="!currentPromotion || currentPromotion.id !== item.id"
                                @editPromotion="editPromotion(item.id)"
                                :item="item"
                                :shopList="shopList"
                                :key="item.id">
                            </promotion-item>
                            <promotion-edit v-else-if="editMode && currentPromotion.id === item.id"
                                :shopList="shopList"
                                :holidays="holidays"
                                :currentPromotion="currentPromotion"
                                :promoLimitHackShopIds = "promoLimitHackShopIds"
                                @submitPromotion="submitPromotion"
                                @cancelPromotion="cancelAddPromotion">
                            </promotion-edit>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ui-confirm v-if="confirm.visible"
            :mode="confirm.mode"
            :visible="confirm.visible"
            :title="confirm.title"
            :content="confirm.content"
            :confirmText="confirm.confirmText"
            :cancelText="confirm.cancelText"
            @close="closeConfirm"
            @confirm="confirm.confirmCallback">
        </ui-confirm>
        <ui-loading
            :visible="loading.visible"
            :text="loading.text">
        </ui-loading>
    </div>
</template>

<script>
    import Vue from 'vue';

    import UIButton from '../components/ui-base/button/button.vue';
    import UIConfirm from '../components/ui-base/confirm/confirm.vue';
    import UILoading from '../components/ui-base/loading/loading.vue';
    import UIToast from '../components/ui-base/toast/toast.vue';
    import DateRangePicker from '../components/ui-base/date-range-picker/date-range-picker.vue';
    import PageError from '../components/shared/page-error.vue';
    import ShopHeader from '../components/shared/shop-header/shop-header.vue';
    import PromotionEdit from '../components/pages/promotion/promotion-edit/promotion-edit.vue';
    import PromotionItem from '../components/pages/promotion/promotion-item/promotion-item.vue';
    import { login } from '../lib/auth'; // 登录接口
    import { Ajax, reportOperTime } from '../lib/utils.js';
    import { getCouponActivityStatus } from '../lib/coupon.js';
    import whatever from '../lib/whatever-adaptor.js';
    // 公共组件全局注册
    Vue.component('ui-button', UIButton);
    Vue.component('ui-confirm', UIConfirm);
    Vue.component('ui-loading', UILoading);
    Vue.component('ui-toast', UIToast);
    Vue.component('date-range-picker', DateRangePicker);
    Vue.component('page-error', PageError);

    export default {
        name: 'Promotion',
        methods: {
        /**
             * [获取优惠券列表]
             * @return {[type]} [description]
             */
            getPromotion() {
                Ajax.get({
                    url: 'promotions',
                    success: (res) => {
                        this.hideLoading();
                        if (res.code.toString() === '200') {
                            this.shopAuthentified = true;
                            this.shopList = res.data.shopList;
                            this.holidays = res.data.holidayVOs;
                            this.promoLimitHackShopIds = res.data.promoLimitHackShopIds;
                            if (res.data && res.data.promotionParamsVOs
                                && res.data.promotionParamsVOs.length > 0) {
                                this.activityParamsVOs =
                                this.sortPromotionActivity(res.data.promotionParamsVOs);
                            } else {
                                this.shopTips = '您还没有优惠活动，快去添加一个吧~';
                            }
                            reportOperTime({
                                pageId: 'menuorder_ecom_promotion',
                                module: 'promotion_operate_time',
                            });
                        } else if (res.code.toString() === '203') {
                            this.shopTips = res.msg;
                        } else if (res.code.toString() === '207') {
                            this.pageError = {
                                msg: res.msg || '',
                            };
                        } else {
                            this.shopTips = res.msg;
                        }
                    },
                    error: () => {
                        this.hideLoading();
                    },
                });
            },
            /**
             * [点击添加优惠券]
             */
            addPromotion() {
                if (!this.editMode) {
                    this.currentPromotion = {
                        name: '',
                        id: null,
                        viewId: null,
                        promotionType: 2, // 优惠类型 1折扣，2满减
                        reductionVO: { // 满减
                            step: null,
                            reduce: null,
                            hasOverlay: false, // 限制叠加次数
                            additionCount: null, // 限制叠加次数
                        },
                        discountVO: { // 折扣
                            discount: null,
                            hasDiscountLimit: false,
                            maxDiscount: null,
                        },
                        selectedShopIds: this.shopList.length === 1 &&
               this.userInfo.role === 1 ? [this.shopList[0].id] : [],
                        durationVO: { // 优惠日期
                            type: 2,
                            dateIntervalVO: null,
                            hasExcludeHoliday: false, // 节假日不参与优惠
                            hasExcludeDateInterval: false,
                            excludeDateIntervals: [], // 【字段修改】
                            hasExcludeWeekdays: false,
                            excludeWeekdays: [], // 【字段修改】
                        },
                        usePeriodVO: { // 时段选择【字段修改】
                            type: 1,
                            interval: null,
                        },
                        categoryLimitVO: {
                            hasSelected: false,
                            categoryIds: [],
                        },
                        countLimitVO: { // 优惠限制 - 限制参与活动次数
                            hasSelected: false,
                            limitCount: null,
                        },
                        status: 2, // 当前状体
                        categoryNames: [],
                    };
                    this.editMode = true;
                }
            },
            /**
             * [submitPromotion description]
             * @param  {[type]} newPromotion [description]
             * @return {[type]}           [description]
             */
            submitPromotion() {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            },
            cancelAddPromotion() {
                this.editMode = false;
                this.currentPromotion = null;
            },
            /**
             * [列表中点击编辑优惠券]
             * @return {[type]} [description]
             */
            editPromotion(promotionId) {
                const promotionItem = this.activityParamsVOs.find(item => item.id === promotionId);
                this.editMode = true;
                // tricky的深拷贝
                this.currentPromotion = JSON.parse(JSON.stringify(promotionItem));
                // 数据初始化处理
                if (this.currentPromotion.promotionType === 1) {
                    this.currentPromotion.reductionVO = { // 满减
                        step: null,
                        reduce: null,
                        hasOverlay: false, // 限制叠加次数
                        additionCount: null, // 限制叠加次数
                    };
                } else {
                    this.currentPromotion.discountVO = { // 满减
                        discount: null,
                        hasDiscountLimit: false,
                        maxDiscount: null,
                    };
                }
            },
            openConfirm(options) {
                this.confirm = {
                    mode: options.mode,
                    visible: true,
                    title: options.title,
                    content: options.content,
                    confirmText: options.confirmText,
                    cancelText: options.cancelText,
                    confirmCallback: options.confirmCallback,
                };
            },
            closeConfirm() {
                this.confirm.visible = false;
            },
            showLoading(text) {
                this.loading.visible = true;
                this.loading.text = text || '数据加载中……';
            },
            hideLoading() {
                this.loading.visible = false;
            },
            /**
             * [展示优先级：生效中>未开始>已过期，各部分按id从大到小排序]
             * @param  {[type]} activityParamsVOList [description]
             * @return {[type]}                      [description]
             */
            sortPromotionActivity(activityParamsVOList) {
                return activityParamsVOList.sort((a, b) => b.id - a.id)
                    .sort((a, b) => getCouponActivityStatus(b.durationVO.dateIntervalVO).status
            - getCouponActivityStatus(a.durationVO.dateIntervalVO).status);
            },
        },
        components: {
            'shop-header': ShopHeader,
            'promotion-edit': PromotionEdit,
            'promotion-item': PromotionItem,
        },
        created() {
            this.showLoading('加载中……');
            login().then((item) => {
                this.shopInfo = {
                    shopName: item.shop.shopName,
                    shopId: item.shop.shopId,
                    isIntellShop: item.shop.isIntellShop,
                };
                this.userInfo = {
                    hasMultiShops: item.user.hasMultiShops,
                    role: item.user.role,
                };
                this.getPromotion();
                whatever.sendPV({
                    pageId: 'menuorder_ecom_promotion',
                    shopId: item.shop.shopId,
                    accountid: item.user.userId,
                });
            });
        },
        data() {
            return {
                headerTitle: '优惠活动',
                newTips: false,
                showShopInfo: false, // 头部是否展示商户信息
                shopInfo: { // 商户信息
                    shopName: '',
                    shopId: '',
                    isIntellShop: 0,
                },
                userInfo: { // 用户信息
                    hasMultiShops: false,
                    role: 0,
                },
                shopList: [],
                holidays: [],
                activityParamsVOs: [],
                editMode: false,
                currentPromotion: null,
                shopAuthentified: false,
                shopTips: '',
                confirm: {
                    visible: false,
                },
                loading: {
                    visible: false,
                    text: '',
                },
                pageError: null,
                promoLimitHackShopIds: [],
            };
        },
    };
</script>

<style lang="less">
@import '../assets/less/layout.less';
.promotion-container {
    padding-top: 10px;
}
.promotion-list {

}
.shop-tip {
    color: #999;
    font-size: 12px;
    margin-bottom: 10px;
}
</style>
