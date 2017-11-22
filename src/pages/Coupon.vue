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
                <div class="coupon-container"
                v-if="!pageError">
                    <p class="shop-tip" v-if="shopTips">{{shopTips}}</p>
                    <ui-button text="添加发券活动" v-if="shopAuthentified" type="btn-medium-normal-orange" @click="addCoupon" />
                    <coupon-edit v-if="editMode && currentCoupon.id === null"
                        :shopList="shopList"
                        :holidays="holidays"
                        :currentCoupon="currentCoupon"
                        @submitCoupon="submitCoupon"
                        @cancelCoupon="cancelAddCoupon">
                    </coupon-edit>
                    <div class="coupon-list">
                        <!-- 容器 -->
                        <div v-for="item in activityParamsVOs">
                            <coupon-item
                                v-if="!currentCoupon || currentCoupon.id !== item.id"
                                @editCoupon="editCoupon(item.id)"
                                :item="item"
                                :shopList="shopList"
                                :key="item.id">
                            </coupon-item>
                            <coupon-edit v-else-if="editMode && currentCoupon.id === item.id"
                                :shopList="shopList"
                                :holidays="holidays"
                                :currentCoupon="currentCoupon"
                                @submitCoupon="submitCoupon"
                                @cancelCoupon="cancelAddCoupon">
                            </coupon-edit>
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
    import CouponEdit from '../components/pages/coupon/coupon-edit/coupon-edit.vue';
    import CouponItem from '../components/pages/coupon/coupon-item/coupon-item.vue';

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
        name: 'Coupon',
        methods: {
        /**
             * [获取优惠券列表]
             * @return {[type]} [description]
             */
            getCoupon() {
                Ajax.get({
                    url: 'couponActivity',
                    success: (res) => {
                        this.hideLoading();
                        if (res.code.toString() === '200') {
                            this.shopAuthentified = true;
                            this.shopList = res.data.shopList;
                            this.holidays = res.data.holidayVOs;
                            if (res.data && res.data.activityParamsVOList
                                && res.data.activityParamsVOList.length > 0) {
                                this.activityParamsVOs =
                                this.sortCouponActivity(res.data.activityParamsVOList);
                            } else {
                                this.shopTips = '您还没有优惠券活动，快去添加一个吧~';
                            }
                            reportOperTime({
                                pageId: 'menuorder_ecom_coupon',
                                module: 'coupon_operate_time',
                            });
                        } else if (res.code.toString() === '203') {
                            this.shopTips = res.msg;
                        } else if (res.code.toString() === '207') {
                            this.pageError = {
                                msg: res.msg,
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
            addCoupon() {
                if (!this.editMode) {
                    this.currentCoupon = {
                        id: null,
                        viewId: null,
                        name: '',
                        giveStep: '',
                        giveCount: 1,
                        selectedShopIds: this.shopList.length === 1 &&
              this.userInfo.role === 1 ? [this.shopList[0].id] : [], // 管理员下仅单店时默认选中，其他可手动多选
                        giveDurationVO: {
                            type: 2, // 默认3个月
                            dateIntervalVO: null,
                        },
                        giveLimitVO: { // 领取限制，新增时写死每人每天每店限1张
                            type: 1,
                            limitNum: '1',
                        },
                        useDurationVO: {
                            type: 20, // 券有效期 (1：固定时长(默认)，2:固定日期)
                            step: '',
                            dateIntervalVO: {
                                fromDate: '',
                                toDate: '',
                            },
                            hasExcludeHoliday: false,
                            hasExcludeDateInterval: false,
                            excludeDateIntervals: [],
                            hasExcludeWeekdays: false,
                            excludeWeekdays: [],
                        },
                        usePeriodVO: {
                            type: 1,
                            interval: [],
                        },
                        useLimitVO: {
                            step: null,
                            reduce: null,
                        },
                        useLimitType: 1,
                        status: 0,
                    };
                    this.editMode = true;
                }
            },
            /**
             * [submitCoupon description]
             * @param  {[type]} newCoupon [description]
             * @return {[type]}           [description]
             */
            submitCoupon() {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            },
            cancelAddCoupon() {
                this.editMode = false;
                this.currentCoupon = null;
            },
            /**
             * [列表中点击编辑优惠券]
             * @return {[type]} [description]
             */
            editCoupon(couponId) {
                const couponItem = this.activityParamsVOs.find(item => item.id === couponId);
                this.editMode = true;
                // tricky的深拷贝
                this.currentCoupon = JSON.parse(JSON.stringify(couponItem));
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
            sortCouponActivity(activityParamsVOList) {
                return activityParamsVOList.sort((a, b) => b.id - a.id)
                    .sort((a, b) => getCouponActivityStatus(b.giveDurationVO.dateIntervalVO).status
           - getCouponActivityStatus(a.giveDurationVO.dateIntervalVO).status);
            },
        },
        components: {
            'shop-header': ShopHeader,
            'coupon-edit': CouponEdit,
            'coupon-item': CouponItem,
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
                this.getCoupon();
                whatever.sendPV({
                    jsLoadTime: window.jsLoadTime,
                    pageId: 'menuorder_ecom_coupon',
                    shopId: item.shop.shopId,
                    accountid: item.user.userId,
                });
            });
        },
        mounted() {
            if (location.hash.indexOf('miaofu') < 0) {
                document.domain = 'meituan.com';
                if (window.self !== window.top) {
                    if (window.top && window.top.updateSidebar) {
                        window.top.updateSidebar('diancai_yingxiao_coupon');
                    }
                }
            }
        },
        data() {
            return {
                headerTitle: '优惠券',
                newTips: true, // 头部是否展示限时免费新功能
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
                currentCoupon: null,
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
            };
        },
    };
</script>

<style lang="less">
@import '../assets/less/layout.less';
.coupon-container {
    padding-top: 10px;
}
.coupon-list {

}
.shop-tip {
    color: #999;
    font-size: 12px;
    margin-bottom: 10px;
}
</style>
