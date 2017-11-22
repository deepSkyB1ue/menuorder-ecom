<template>
<div class="coupon-edit">
    <h2>{{currentPromotion.id ? '编辑优惠活动' : '创建优惠活动'}}</h2>
    <div class="form-line">
        <div class="item-key">
            <span class="key-txt">活动名称</span>
        </div>
        <div class="item-value">
            <input placeholder="请输入活动名称" :class="validateResult['name'].fail ? 'name-input warning': 'name-input'" v-model="currentPromotion.name" maxlength="15" @blur="reValidate('name')" />
            <span class="error-msg" v-show="validateResult['name'].fail">{{validateResult['name'].msg}}</span>
        </div>
    </div>
    <div class="form-line">
        <div class="item-key">
            <span class="key-txt">优惠类型</span>
        </div>
        <div class="item-value">
            <ul class="core-select">
                <li v-for="promotionType in typeList" class="core-select-item">
                    <a :class="currentPromotion.promotionType == promotionType.code ? 'switchable-tag tag-selected' : 'switchable-tag'" @click="selectType(promotionType.code)">{{promotionType.text}}</a>
                </li>
            </ul>
            <div v-if="currentPromotion.promotionType === 2" class="mt-5">
                <span>每满</span>
                <input @keydown="inputFloatLimit($event)" placeholder="" v-model="currentPromotion.reductionVO.step" :class="validateResult['reductionVO.step'].fail ? 'step-input warning': 'step-input'" @blur="() => {reValidate('reductionVO.step');reValidate('reductionVO.reduce', 'custom')}"
                />
                <span>减</span>
                <input @keydown="inputFloatLimit($event)" placeholder="" :class="validateResult['reductionVO.reduce'].fail ? 'step-input warning': 'step-input'" v-model="currentPromotion.reductionVO.reduce" @blur="reValidate('reductionVO.reduce')" />
                <label v-if="!currentPromotion.reductionVO.hasOverlay">
                    <input v-model="currentPromotion.reductionVO.hasOverlay" @click="reValidate('reductionVO.additionCount')" type="checkbox">
                            限制叠加次数
                </label>
                <span v-if="currentPromotion.reductionVO.hasOverlay">
                    <label>
                        <input v-model="currentPromotion.reductionVO.hasOverlay" @click="reValidate('reductionVO.additionCount')" type="checkbox">
                                最多叠加
                    </label>
                    <input
                        @keydown="inputNumberLimit($event)"
                        placeholder=""
                        :class="validateResult['reductionVO.additionCount'].fail ? 'step-input warning': 'step-input'"
                        v-model="currentPromotion.reductionVO.additionCount"
                        @blur="reValidate('reductionVO.additionCount')"/>
                        次
                </span>
                <span class="error-msg" v-show="validateResult['reductionVO.step'].fail || validateResult['reductionVO.reduce'].fail || validateResult['reductionVO.additionCount'].fail">{{validateResult['reductionVO.step'].msg || validateResult['reductionVO.reduce'].msg || validateResult['reductionVO.additionCount'].msg}}</span>
            </div>
            <div v-if="currentPromotion.promotionType === 1" class="mt-5">
                <input @keydown="inputFloatLimit($event)" maxlength="3" placeholder="" v-model="currentPromotion.discountVO.discount" :class="validateResult['discountVO.discount'].fail ? 'step-input warning': 'step-input'" @blur="reValidate('discountVO.discount')" />
                <span>折</span>
                <label v-if="!currentPromotion.discountVO.hasDiscountLimit">
                    <input v-model="currentPromotion.discountVO.hasDiscountLimit" @click="reValidate('discountVO.maxDiscount')" type="checkbox">
                        限制减免金额
                </label>
                <span v-if="currentPromotion.discountVO.hasDiscountLimit">
                    <label>
                        <input v-model="currentPromotion.discountVO.hasDiscountLimit" @click="reValidate('discountVO.maxDiscount')" type="checkbox">
                                最高减
                    </label>
                    <input
                        @keydown="inputFloatLimit($event)"
                        placeholder=""
                        :class="validateResult['discountVO.maxDiscount'].fail ? 'step-input warning': 'step-input'"
                        v-model="currentPromotion.discountVO.maxDiscount"
                        @blur="reValidate('discountVO.maxDiscount')"/>
                        元
                </span>
                <span class="error-msg" v-show="validateResult['discountVO.discount'].fail || validateResult['discountVO.maxDiscount'].fail">{{validateResult['discountVO.discount'].msg || validateResult['discountVO.maxDiscount'].msg}}</span>
                <p class="color-gray">85折请输入8.5</p>
            </div>
        </div>
    </div>
    <div class="form-line">
        <div class="item-key">
            <span class="key-txt">适用门店</span>
        </div>
        <div class="item-value">
            <ui-button v-if="shopList.length > 1" :text="currentPromotion.selectedShopIds.length > 0 ? '添加/编辑' : '添加'" type="btn-solid-small-green-normal" @click="selectShop" />
            <span v-if="validateResult['selectedShopIds'].fail" class="error-msg">{{validateResult['selectedShopIds'].msg}}</span>
            <div v-if="currentPromotion.selectedShopIds.length > 0" class="background-area select-shop-list">
                <p>已选门店:</p>
                <p>{{selectedShopNames}}</p>
                <div class='shop-promotion-tips'>
                    <p v-if='partPromotionShopList.length === 0'>当前所选门店暂不支持部分菜品不参与优惠（如酒水饮料不参与折扣）</p> 
                    <p v-else-if='currentPromotion.selectedShopIds.length === partPromotionShopList.length'>
                        当前所选门店支持部分菜品不参与优惠（如酒水饮料不参与折扣），请在门店收银中进行不参与优惠菜品设置（该项设置如有困难，请联系收银厂商）。<br>
                        设置完成后请进行测试，如有问题，请联系业务员。
                    </p>
                    <p v-else>
                        <template v-if='partPromotionShopList.length <=3'>
                            <span v-for='(item,index) in partPromotionShopList'>
                                <span v-if='index === partPromotionShopList.length-1'>{{item.shopName}}</span>
                                <span v-else>{{item.shopName}}、</span>
                            </span>
                            门店支持部分菜品不参与优惠（如酒水饮料不参与折扣），请在门店收银中进行不参与优惠菜品设置（该项设置如有困难，请联系收银厂商）。<br>
                            设置完成后请进行测试，如有问题，请联系业务员。<br>
                        </template>
                        <template v-else>
                            <span>{{partPromotionShopList[0].shopName}}、</span>
                            <span>{{partPromotionShopList[1].shopName}}、</span>
                            <span>{{partPromotionShopList[2].shopName}}</span>
                            <span class='all-blue' @click='lookAllshops()'>等{{partPromotionShopList.length}}家（查看全部）</span>门店支持部分菜品不参与优惠（如酒水饮料不参与折扣），请在门店收银中进行不参与优惠菜品设置（该项设置如有困难，请联系收银厂商）。<br>
                            设置完成后请进行测试，如有问题，请联系业务员。<br>
                        </template>
                        <template v-if='notPartPromotionShopList.length <=3'>
                            <span v-for='(item,index) in notPartPromotionShopList'>
                                <span v-if='index === notPartPromotionShopList.length-1'>{{item.shopName}}</span>
                                <span v-else>{{item.shopName}}、</span>
                            </span>
                            门店暂不支持部分优惠。
                        </template>
                         <template v-else>
                            <span>{{notPartPromotionShopList[0].shopName}}、</span>
                            <span>{{notPartPromotionShopList[1].shopName}}、</span>
                            <span>{{notPartPromotionShopList[2].shopName}}</span>
                            <span class='all-blue' @click='lookAllshops(false)'>等{{notPartPromotionShopList.length}}家（查看全部）</span>
                            门店暂不支持部分优惠。
                        </template>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="form-line">
        <div class="item-key">
            <span class="key-txt">优惠日期</span>
        </div>
        <div class="item-value">
            <custom-date-filter :customValidateRules="validateRules.normalRangeRules" :duration="currentPromotion.durationVO" :maxCustomLength="1" @selectCallback="selectGiveDuration">
            </custom-date-filter>
            <div class="coupon-time-limit">
                <div class="usual-select">
                    <label>
                        <input v-model="currentPromotion.durationVO.hasExcludeHoliday" type="checkbox">
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
                        <input v-model="currentPromotion.durationVO.hasExcludeDateInterval" type="checkbox">
                        指定日期不参与优惠
                    </label>
                <div v-if="currentPromotion.durationVO.hasExcludeDateInterval" class="background-area">
                    <custom-date-range :customValidateRules="validateRules.excludeDateRangeRules" :intervals="currentPromotion.durationVO.excludeDateIntervals">
                        @selectCallback="selectUseDurationExclude"
                    </custom-date-range>
                </div>
            </div>
            <div class="usual-select">
                <label>
                        <input type="checkbox" value="true" v-model="currentPromotion.durationVO.hasExcludeWeekdays">
                        不参与优惠星期设置
                    </label>
                <div v-if="currentPromotion.durationVO.hasExcludeWeekdays">
                    <custom-week-filter :weekdays="currentPromotion.durationVO.excludeWeekdays" :defaultWeekdays="[0,6]" @selectCallback="selectUseDurationWeekdays">
                    </custom-week-filter>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="form-line">
    <div class="item-key">
        <span class="key-txt">时段选择</span>
    </div>
    <div class="item-value">
        <custom-time-filter :duration="currentPromotion.usePeriodVO" :maxCustomLength="-1" @selectCallback="selectUsePeriod">
        </custom-time-filter>
    </div>
</div>
<div class="form-line">
    <div class="item-key">
        <span class="key-txt">优惠限制</span>
    </div>
    <div class="item-value">
        <label v-if="promotionLimitHint">
                <span>{{promotionLimitHint}}</span>
            </label>
        <!--             <div>
                <label>
                    <input type="checkbox" value="true" v-model="currentPromotion.categoryLimitVO.hasSelected">
                    指定分类不参与优惠
                    <span>提示:特价菜、套餐默认不参与优惠</span>
                </label>
                <ul v-if="currentPromotion.categoryLimitVO.hasSelected" class="background-area core-select">
                    <li v-for="category in categoryList" class="core-select-item">
                        <a :class="currentPromotion.categoryLimitVO.hasSelected && currentPromotion.categoryLimitVO.categoryIds.indexOf(category.id) > 0 ? 'switchable-tag tag-selected' : 'switchable-tag'" @click="selectCategory(category)">{{category.name}}</a>
                    </li>
                </ul>
            </div> -->
        <div>
            <label>
                    <input type="checkbox" value="true" v-model="currentPromotion.countLimitVO.hasSelected">
                    限制参与活动次数
                </label>
            <span v-if="currentPromotion.countLimitVO.hasSelected">
                    <span>每人每天限</span>
            <input @keydown="inputNumberLimit($event)" placeholder="" v-model="currentPromotion.countLimitVO.limitCount" :class="validateResult['countLimitVO.limitCount'].fail ? 'step-input warning': 'step-input'" @blur="reValidate('countLimitVO.limitCount')" />            次
            <span class="error-msg" v-show="validateResult['countLimitVO.limitCount'].fail">{{validateResult['countLimitVO.limitCount'].msg}}</span>
            </span>

        </div>
    </div>
</div>
<div class="btn-group">
    <ui-button text="确认提交" @click="submitPromotion" type="btn-solid-small-orange-normal" />
    <ui-button text="取消" @click="cancelAddPromotion" type="btn-solid-small-grey-normal" />
</div>
<select-multishop-pop title="请选择门店" :visible="showSelectShopPop" :shopList="shopList" :selectedShopIds="this.currentPromotion.selectedShopIds" @close="closeSelectShop" @confirm="selectShopCallback"></select-multishop-pop>
<ui-popup
    :visible="partShop.visible"
    @close="closePartShop"
    :title="partShop.title"
    @width="300">
    <div class="confirm-popup part-shop" slot="pop-content">
        <div class="shop-name" v-for='item in showpartPromotionShopList'>
            {{item.shopName}}
        </div>
    </div>
</ui-popup>
<keep-alive>
    <ui-toast :visible="toast.visible" :text="toast.text" :duration="toast.duration">
        <!-- 非活动组件将被缓存！ -->
    </ui-toast>
</keep-alive>
</div>
</template>

<script>
/* eslint-disable no-param-reassign */
import { Popup } from '@dp/bee-ui';
import SelectMultiShopPop from '../../../shared/select-multishop-pop/select-multishop-pop.vue';
import CustomWeekFilter from '../../../shared/custom-week-filter/custom-week-filter.vue';
import CustomDateFilter from '../../../shared/custom-date-filter/custom-date-filter.vue';
import CustomDateRange from '../../../shared/custom-date-range/custom-date-range.vue';
import CustomTimeFilter from '../../../shared/custom-time-filter/custom-time-filter.vue';
// import Popup from '../../../ui-base/popup/popup.vue';

import {
    promotionProcess,
} from '../../../../lib/coupon.js';
import {
    defaultValidateResult,
    promotionValidate,
} from './promotion-validate.js';
import {
    Ajax,
} from '../../../../lib/utils.js';
// import { categoryList } from '../../../../../data/promotion.mock.js'

export default {
    name: 'promotion-edit',
    props: ['shopList', 'holidays', 'currentPromotion', 'promoLimitHackShopIds'],
    methods: {
    /**
         * 活动类型
         * @return {[type]} [description]
         */
        selectType(type) {
            this.currentPromotion.promotionType = type;
        },
        /**
         * [selectCategory description]
         * @param  {[type]} category [description]
         * @return {[type]}          [description]
         */
        selectCategory(category) {
            const index = this.currentPromotion.categoryLimitVO.categoryIds.indexOf(category.id);
            if (index > 0) {
                this.currentPromotion.categoryLimitVO.categoryIds.splice(index, 1);
                this.currentPromotion.categoryNames.push(index, 1);
            } else {
                this.currentPromotion.categoryLimitVO.categoryIds.push(category.id);
                this.currentPromotion.categoryNames.push(category.name);
            }
        },
        /** @argument
         *
         * 部分优惠的文案点击，查看所有门店
         */
        lookAllshops(part = true) {
            if (part) {
                this.showpartPromotionShopList = this.partPromotionShopList;
            } else {
                this.showpartPromotionShopList = this.notPartPromotionShopList;
            }
            this.partShop.visible = true;
        },
        /**
         * [提交优惠券信息]
         * @return {[type]} [description]
         */
        submitPromotion() {
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
                return;
            }
            this.posting = true;
            const ajaxConfig = {
                url: 'promotion',
                params: promotionProcess(this.currentPromotion),
                success: (response) => {
                    this.posting = false;
                    if (response.code.toString() === '200') {
                        this.showToast({
                            text: '提交成功',
                        });
                        this.currentPromotion.id = response.data.id;
                        this.$emit('submitPromotion', this.currentPromotion);
                    } else {
                        this.showToast({
                            text: response.msg,
                        });
                    }
                },
                error: () => {
                    this.posting = false;
                },
            };
            // 修改
            if (this.currentPromotion.id) {
                Ajax.put(ajaxConfig);
            } else { // 新增
                Ajax.post(ajaxConfig);
            }
        },
        /**
         * [取消添加优惠券]
         * @return {[type]} [description]
         */
        cancelAddPromotion() {
            this.$emit('cancelPromotion');
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
            this.currentPromotion.selectedShopIds = shopIds;
            this.reValidate('selectedShopIds');
            this.getPromotionLimitHint();
            // this.getCategoryList();
            // this.currentPromotion.categoryLimitVO.categoryIds = [];
            // this.currentPromotion.categoryNames = [];
        },
        /**
         * [关闭选择门店弹窗]
         * @return {[type]} [description]
         */
        closeSelectShop() {
            this.showSelectShopPop = false;
        },
        closePartShop() {
            this.partShop.visible = false;
        },
        /**
         * [获取优惠限制提示信息]
         * @return {[type]} [description]
         */
        getPromotionLimitHint() {
            const selectedShops = this.currentPromotion.selectedShopIds;
            const containShops = [];
            if (selectedShops && selectedShops.length > 0) {
                for (let i = 0; i < selectedShops.length; i += 1) {
                    if (this.inArray(selectedShops[i], this.promoLimitHackShopIds)) {
                        containShops.push(selectedShops[i]);
                    }
                }
                if (containShops.length > 0 && containShops.length === selectedShops.length) {
                    this.promotionLimitHint = '以读取到相应门店pos中设置的不参与优惠菜品为准';
                } else if (containShops.length > 0
                    && (containShops.length < selectedShops.length)) {
                    this.promotionLimitHint = `${this.containedShopNames(containShops)}以读取到pos中设置的不参与优惠菜品为准，其他门店暂不支持`;
                } else {
                    this.promotionLimitHint = '';
                }
            }
        },
        inArray(param, array) {
            for (let i = 0; i < array.length; i += 1) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },
        containedShopNames(containShops) {
            return this.shopList.filter(shop => containShops.indexOf(shop.id) > -1).map(shop => shop.shopName).join('、');
        },
        /**
         * [选择发券时间]
         * @param  {[type]} duration [description]
         * @return {[type]}          [description]
         */
        selectGiveDuration(duration) {
            this.currentPromotion.durationVO.type = duration.type;
            this.currentPromotion.durationVO.dateIntervalVO = duration.dateIntervalVO;
        },
        /**
         * [设置券有效期]
         * @param {[type]} period [description]
         */
        setUseDurationValidatePeriod(dateInterval) {
            this.currentPromotion.durationVO.dateIntervalVO = dateInterval;
        },
        /**
         * 选择用券时间
         * @param  {[type]} period [description]
         * @return {[type]}        [description]
         */
        selectUsePeriod(period) {
            this.currentPromotion.usePeriodVO = period;
        },
        /**
         * [selectUseDurationWeekdays description]
         * @param  {[type]} weekdays [description]
         * @return {[type]}          [description]
         */
        selectUseDurationWeekdays(weekdays) {
            this.currentPromotion.durationVO.excludeWeekdays = weekdays;
        },
        /**
         * [selectUseDurationExclude description]
         * @param  {[type]} intervals [description]
         * @return {[type]}           [description]
         */
        selectUseDurationExclude(intervals) {
            this.currentPromotion.durationVO.excludeDateIntervals = intervals;
        },
        /**
         * [提交数据前数据校验]
         * @return {[type]} [description]
         */
        validate() {
            const rules = {
                'durationVO.dateIntervalVO': this.validateRules.normalRangeRules.validate,
                'durationVO.excludeDateIntervals': this.validateRules.excludeDateRangeRules.validate,
            };
            const options = {
                rules,
            };
            return promotionValidate(this.currentPromotion, options);
        },
        reValidate(fieldName, mode) {
            const options = {
                fieldName,
                mode,
            };
            this.validateResult[fieldName] = promotionValidate(this.currentPromotion, options);
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
            if (!(event.keyCode === 46) &&
                !(event.keyCode === 8) &&
                !(event.keyCode === 37) &&
                !(event.keyCode === 39)) {
                if (!((event.keyCode >= 48 &&
                            event.keyCode <= 57) ||
                        (event.keyCode >= 96 &&
                            event.keyCode <= 105))) {
                    event.returnValue = false;
                }
            }
        },
        inputFloatLimit(event) {
            if (!(event.keyCode === 46) &&
                !(event.keyCode === 8) &&
                !(event.keyCode === 37) &&
                !(event.keyCode === 39)) {
                if (!((event.keyCode >= 48 && event.keyCode <= 57) ||
                        (event.keyCode >= 96 && event.keyCode <= 105) ||
                        (event.keyCode === 109 || event.keyCode === 189 ||
                             event.keyCode === 110 || event.keyCode === 190)
                )) {
                    event.returnValue = false;
                }
            }
        },
        /**
         * 获取当前选择门店下的分类信息
         * @return {[type]} [description]
         */
        getCategoryList() {
            Ajax.get({
                url: 'getCategoryNameIds',
                success: (res) => {
                    this.hideLoading();
                    if (res.code.toString() === '200') {
                        this.categoryList = res.data;
                    } else if (res.code.toString() === '203') {
                        this.shopTips = res.msg;
                    } else {
                        this.shopTips = res.msg;
                    }
                },
                error: () => {
                    this.hideLoading();
                },
            });
        },
    },
    computed: {
        selectedShopNames() {
            return this.shopList.filter(shop => this.currentPromotion.selectedShopIds.indexOf(shop.id) > -1).map(shop => shop.shopName).join(',');
        },
        partPromotionShopList() {
            return this.shopList.filter(
                shop => this.currentPromotion.selectedShopIds.indexOf(shop.id) > -1)
                .filter(shop => shop.partPromotion === true);
        },
        notPartPromotionShopList() {
            return this.shopList.filter(
                shop => this.currentPromotion.selectedShopIds.indexOf(shop.id) > -1)
                .filter(shop => shop.partPromotion === false);
        },

    },
    components: {
        'select-multishop-pop': SelectMultiShopPop, // 门店选择弹窗
        'custom-date-filter': CustomDateFilter, // 1个月3个月6个月自定义
        'custom-time-filter': CustomTimeFilter, // 早市午市晚市自定义
        'custom-date-range': CustomDateRange, // 指定日期不参与优惠
        'custom-week-filter': CustomWeekFilter, // 不参与优惠星期设置
        'ui-popup': Popup,
    },
    data() {
        return {
            partShop: {
                visible: false,
                title: '所有门店',
            },
            showpartPromotionShopList: [],
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
            categoryList: [],
            typeList: [{
                code: 2,
                text: '满减',
            }, {
                code: 1,
                text: '折扣',
            }],
            promotionLimitHint: '',
        };
    },
    created() {
    // this.getCategoryList();
    },
};
</script>

<style lang="less" src="../../../../assets/less/coupon.less" />
