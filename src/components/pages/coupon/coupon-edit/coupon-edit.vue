<template>
<div class="coupon-edit">
    <h2>{{currentCoupon.id ? '编辑优惠券活动' : '创建优惠券活动'}}</h2>
    <div class="form-line">
        <div class="item-key">
            <span class="key-txt">活动名称</span>
        </div>
        <div class="item-value">
            <input placeholder="请输入活动名称" :class="validateResult['name'].fail ? 'name-input warning': 'name-input'" v-model="currentCoupon.name" maxlength="15" @blur="reValidate('name')"/>
            <span class="error-msg" v-show="validateResult['name'].fail">{{validateResult['name'].msg}}</span>
        </div>
    </div>
    <div class="item-group">
        <p class="group-title">发券设置</p>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">发券条件</span>
            </div>
            <div class="item-value">
                <span>消费满</span>
                <input
                    @keydown="inputNumberLimit($event)"
                    placeholder=""
                    :class="validateResult['giveStep'].fail ? 'step-input warning': 'step-input'"
                    v-model="currentCoupon.giveStep"
                    @blur="reValidate('giveStep')"/>
                <span>元赠</span>
                <input
                    @keydown="inputNumberLimit($event)"
                    placeholder=""
                    :class="validateResult['giveCount'].fail ? 'step-input warning': 'step-input'"
                    v-model="currentCoupon.giveCount"
                    @blur="reValidate('giveCount')"/>
                <span>张券</span>

                </span>
                <span class="error-msg" v-show="validateResult['giveStep'].fail || validateResult['giveCount'].fail">{{validateResult['giveStep'].msg || validateResult['giveCount'].msg}}</span>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">发券门店</span>
            </div>
            <div class="item-value">
                <ui-button v-if="shopList.length > 1" :text="currentCoupon.selectedShopIds.length > 0 ? '添加/编辑' : '添加'"  type="btn-solid-small-green-normal" @click="selectShop"/>
                <span v-if="validateResult['selectedShopIds'].fail" class="error-msg">{{validateResult['selectedShopIds'].msg}}</span>
                <div v-if="currentCoupon.selectedShopIds.length > 0" class="background-area select-shop-list">
                    <p>已选门店:</p>
                    <p>{{selectedShopNames.join(',')}}</p>
                </div>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">发券时间</span>
            </div>
            <div class="item-value">
                <custom-date-filter
                    :customValidateRules="validateRules.normalRangeRules"
                    :duration="currentCoupon.giveDurationVO"
                    :maxCustomLength="1"
                    @selectCallback="selectGiveDuration"
                >
                </custom-date-filter>
             </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">领取限制</span>
            </div>
            <div class="item-value">
                <span>每人每天限参与一次活动</span>
            </div>
        </div>
    </div>
    <div class="item-group">
        <p class="group-title">用券设置</p>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">券有效期</span>
            </div>
            <div class="item-value">
                <label>
                    <input type="radio" :value="20" v-model="currentCoupon.useDurationVO.type"/><span>固定时长</span>
                </label>
                <label>
                    <input type="radio" :value="10" v-model="currentCoupon.useDurationVO.type"/><span>固定日期</span>
                </label>
                <div v-if="currentCoupon.useDurationVO.type === 20">
                    <span>领券后</span>
                    <input
                    @keydown="inputNumberLimit($event)"
                    placeholder=""
                    placeholder="天数"
                    :class="validateResult['useDurationVO.step'].fail ? 'step-input warning': 'step-input'"
                    v-model="currentCoupon.useDurationVO.step"
                    @blur="reValidate('useDurationVO.step')"/>
                    <span>天内有效（领券后第二天起）</span>
                    <span class="error-msg" v-show="validateResult['useDurationVO.step'].fail">{{validateResult['useDurationVO.step'].msg}}</span>
                </div>

                <div v-if="currentCoupon.useDurationVO.type === 10" class="use-duration-range">
                    <date-range-picker
                    :validateRules="this.validateRules.normalRangeRules"
                    :interval="currentCoupon.useDurationVO.dateIntervalVO"
                    @selectCallback="setUseDurationValidatePeriod">
                    </date-range-picker>
                </div>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">用券时间</span>
            </div>
            <div class="item-value">
                <custom-time-filter
                    :duration="currentCoupon.usePeriodVO"
                    :maxCustomLength="-1"
                    @selectCallback="selectUsePeriod"
                >
                </custom-time-filter>
                <div class="coupon-time-limit">
                    <div class="usual-select">
                        <label>
                            <input v-model="currentCoupon.useDurationVO.hasExcludeHoliday" type="checkbox">
                            节假日不参与优惠
                        </label>
                        <span class="tipsover">
                            <div class="tipsover-content">
                                <i></i>
                                <div class="title">节假日如下:</div>
                                <p>
                                <span v-for="holiday in holidays" class="holidy">{{holiday.name}}:{{holiday.dateDisplay}}</span>
                                </p>
                                <p>暂只展示今年的节假日</p>
                            </div>
                        </span>
                    </div>
                    <div class="usual-select">
                        <label>
                            <input v-model="currentCoupon.useDurationVO.hasExcludeDateInterval" type="checkbox">
                            指定日期不参与优惠
                        </label>
                        <div v-if="currentCoupon.useDurationVO.hasExcludeDateInterval" class="background-area">
                            <custom-date-range
                                :customValidateRules="validateRules.excludeDateRangeRules"
                                :intervals="currentCoupon.useDurationVO.excludeDateIntervals">
                                @selectCallback="selectUseDurationExclude"
                            </custom-date-range>
                        </div>
                    </div>
                    <div class="usual-select">
                        <label>
                            <input type="checkbox" value="true" v-model="currentCoupon.useDurationVO.hasExcludeWeekdays">
                            不参与优惠星期设置
                        </label>
                        <div v-if="currentCoupon.useDurationVO.hasExcludeWeekdays">
                            <custom-week-filter
                                :weekdays="currentCoupon.useDurationVO.excludeWeekdays"
                                :defaultWeekdays="[0,6]"
                                @selectCallback="selectUseDurationWeekdays">
                                </custom-week-filter>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">起用金额</span>
            </div>
            <div class="item-value">
                <span>消费满</span>
                <input
                @keydown="inputNumberLimit($event)"
                placeholder=""
                v-model="currentCoupon.useLimitVO.step"
                :class="validateResult['useLimitVO.step'].fail ? 'step-input warning': 'step-input'"
                @blur="() => {reValidate('useLimitVO.step');reValidate('useLimitVO.reduce', 'custom')}"/>
                <span>元可用</span>
                <span class="error-msg" v-show="validateResult['useLimitVO.step'].fail">{{validateResult['useLimitVO.step'].msg}}</span>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">减免金额</span>
            </div>
            <div class="item-value">
                <input
                @keydown="inputNumberLimit($event)"
                placeholder=""
                v-model="currentCoupon.useLimitVO.reduce"
                :class="validateResult['useLimitVO.reduce'].fail ? 'reduce-input warning': 'reduce-input'"
                @blur="reValidate('useLimitVO.reduce')"/>
                <span>元</span>
                <span>单次限用1张券</span>
                <span class="error-msg" v-show="validateResult['useLimitVO.reduce'].fail">{{validateResult['useLimitVO.reduce'].msg}}</span>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">适用门店</span>
            </div>
            <div class="item-value">
                <span>仅限发券门店可用</span>
            </div>
        </div>
    </div>
    <div class="btn-group">
        <ui-button text="确认提交" @click="submitCoupon" type="btn-solid-small-orange-normal"/>
        <ui-button text="取消" @click="cancelAddCoupon" type="btn-solid-small-grey-normal" />
    </div>
    <select-multishop-pop title="请选择门店" :visible="showSelectShopPop" :shopList="shopList" :selectedShopIds="this.currentCoupon.selectedShopIds" @close="closeSelectShop" @confirm="selectShopCallback"></select-multishop-pop>
    <keep-alive>
    <ui-toast
        :visible="toast.visible"
        :text="toast.text"
        :duration="toast.duration"
      >
        <!-- 非活动组件将被缓存！ -->
    </ui-toast>
    </keep-alive>
</div>
</template>

<script>
    /* eslint-disable no-param-reassign */
    import SelectMultiShopPop from '../../../shared/select-multishop-pop/select-multishop-pop.vue';
    import CustomWeekFilter from '../../../shared/custom-week-filter/custom-week-filter.vue';
    import CustomDateFilter from '../../../shared/custom-date-filter/custom-date-filter.vue';
    import CustomDateRange from '../../../shared/custom-date-range/custom-date-range.vue';
    import CustomTimeFilter from '../../../shared/custom-time-filter/custom-time-filter.vue';

    import { couponProcess } from '../../../../lib/coupon.js';
    import { defaultValidateResult, couponValidate } from './coupon-validate.js';
    import { Ajax } from '../../../../lib/utils.js';

    export default {
        name: 'coupon-edit',
        props: ['shopList', 'holidays', 'currentCoupon'],
        methods: {
        /**
             * [提交优惠券信息]
             * @return {[type]} [description]
             */
            submitCoupon() {
                if (this.posting) {
                    return;
                }
                this.validateResult = this.validate();

                const failField = Object.keys(this.validateResult)
                    .find(key => this.validateResult[key].fail === true);

                if (failField) {
                    this.showToast({
                        text: this.validateResult[failField].msg,
                    });
                } else {
                    this.posting = true;
                    Ajax.post({
                        url: 'confirmCouponActivity',
                        params: couponProcess(this.currentCoupon),
                        success: (response) => {
                            this.posting = false;
                            if (response.code.toString() === '200') {
                                this.currentCoupon.id = response.data.id;
                                this.showToast({
                                    text: '提交成功',
                                });
                                this.$emit('submitCoupon', this.currentCoupon);
                            } else {
                                this.showToast({
                                    text: response.msg,
                                });
                            }
                        },
                        error: () => {
                            this.posting = false;
                        },
                    });
                }
            },
            /**
             * [取消添加优惠券]
             * @return {[type]} [description]
             */
            cancelAddCoupon() {
                this.$emit('cancelCoupon');
                this.validateResult = defaultValidateResult;
            },
            /**
             * [选择门店]
             * @return {[type]} [description]
             */
            selectShop() {
                this.showSelectShopPop = true;
            },
            /**
             * [selectShopCallback description]
             * @return {[type]} [description]
             */
            selectShopCallback(shopIds) {
                this.showSelectShopPop = false;
                this.currentCoupon.selectedShopIds = shopIds;
                this.reValidate('selectedShopIds');
            },
            /**
             * [关闭选择门店弹窗]
             * @return {[type]} [description]
             */
            closeSelectShop() {
                this.showSelectShopPop = false;
            },
            /**
             * [选择发券时间]
             * @param  {[type]} duration [description]
             * @return {[type]}          [description]
             */
            selectGiveDuration(duration) {
                this.currentCoupon.giveDurationVO = duration;
            },
            /**
             * [设置券有效期]
             * @param {[type]} period [description]
             */
            setUseDurationValidatePeriod(dateInterval) {
                this.currentCoupon.useDurationVO.dateIntervalVO = dateInterval;
            },
            /**
             * 选择用券时间
             * @param  {[type]} period [description]
             * @return {[type]}        [description]
             */
            selectUsePeriod(period) {
                this.currentCoupon.usePeriodVO = period;
            },
            /**
             * [selectUseDurationWeekdays description]
             * @param  {[type]} weekdays [description]
             * @return {[type]}          [description]
             */
            selectUseDurationWeekdays(weekdays) {
                this.currentCoupon.useDurationVO.excludeWeekdays = weekdays;
            },
            /**
             * [selectUseDurationExclude description]
             * @param  {[type]} intervals [description]
             * @return {[type]}           [description]
             */
            selectUseDurationExclude(intervals) {
                this.currentCoupon.useDurationVO.excludeDateIntervals = intervals;
            },
            /**
             * [提交数据前数据校验]
             * @return {[type]} [description]
             */
            validate() {
                const rules = {
                    'useDurationVO.dateIntervalVO': this.validateRules.normalRangeRules.validate,
                    'giveDurationVO.dateIntervalVO': this.validateRules.normalRangeRules.validate,
                    'useDurationVO.excludeDateIntervals': this.validateRules.excludeDateRangeRules.validate,

                };
                const options = {
                    rules,
                };
                return couponValidate(this.currentCoupon, options);
            },
            reValidate(fieldName, mode) {
                const options = {
                    fieldName,
                    mode,
                };
                this.validateResult[fieldName] = couponValidate(this.currentCoupon, options);
            },
            showToast(options) {
                this.toast = {
                    visible: true,
                    text: options.text,
                };
                setTimeout(() => {
                    this.hideToast();
                }, options.duration || 2000);
            },
            hideToast() {
                this.toast.visible = false;
            },
            inputNumberLimit(event) {
                if (!(event.keyCode === 46)
                    && !(event.keyCode === 8)
                    && !(event.keyCode === 37)
                    && !(event.keyCode === 39)) {
                    if (!((event.keyCode >= 48
                && event.keyCode <= 57)
                || (event.keyCode >= 96
                && event.keyCode <= 105))) { event.returnValue = false; }
                }
            },
        },
        computed: {
            selectedShopNames() {
                return this.shopList.filter(
                    shop => this.currentCoupon.selectedShopIds.indexOf(shop.id) > -1)
                    .map(shop => shop.shopName);
            },
        },
        components: {
            'select-multishop-pop': SelectMultiShopPop, // 门店选择弹窗
            'custom-date-filter': CustomDateFilter, // 1个月3个月6个月自定义
            'custom-time-filter': CustomTimeFilter, // 早市午市晚市自定义
            'custom-date-range': CustomDateRange, // 指定日期不参与优惠
            'custom-week-filter': CustomWeekFilter, // 不参与优惠星期设置
        },
        data() {
            return {
                showSelectShopPop: false, // 门店选择弹窗是否展示
                validateResult: defaultValidateResult,
                toast: {
                    visible: false,
                    text: '',
                    duration: 2000,
                },
                posting: false,
                validateRules: { // 日期范围校验规则
                    normalRangeRules: { // 普通规则，校验为结束不小于当天，开始结束不能选择当天之前
                        select: [{
                            name: 'rangeLimit',
                            options: {
                                from: {
                                    name: '开始日期',
                                    min: 'today', // 当天可传入'today'
                                },
                            },
                        }],
                        validate: [{
                            name: 'rangeLimit',
                            options: {
                                to: {
                                    name: '结束日期',
                                    min: 'today', // 当天可传入'today'
                                },
                            },
                        }, {
                            name: 'fromToCompare',
                        }],
                    },
                    excludeDateRangeRules: { // 开始结束不能选择当天之前
                        select: [{
                            name: 'rangeLimit',
                            options: {
                                from: {
                                    name: '开始日期',
                                    min: 'today', // 当天可传入'today'
                                },
                            },
                        }],
                        validate: [{
                            name: 'fromToCompare',
                        }],
                    },
                },
            };
        },
        created() {
        },
    };
</script>

<style lang="less" src="../../../../assets/less/coupon.less">
</style>
