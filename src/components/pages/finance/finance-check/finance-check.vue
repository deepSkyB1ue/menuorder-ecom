<template>
    <div class="main">
        <div class="module-tab">
            <div class="ui-tab-rectangle tabline">
                <a class="tab-btn" @click="onClickTab('tradeIncome')" v-bind:class="{ 'on': (currentModule === 'tradeIncome') }">交易明细</a>
                <a class="tab-btn" @click="onClickTab('tradeRefund')" v-bind:class="{ 'on': (currentModule === 'tradeRefund') }">退款明细</a>
                <a class="tab-btn" @click="onClickTab('tradeSummary')" v-bind:class="{ 'on': (currentModule === 'tradeSummary') }">交易汇总</a>
            </div>
        </div>
        <div class="selection-tab" >
            <table class="tab-table" v-if=" currentModule==='tradeIncome' ">
                <tr>
                    <td v-for="item in dateItemList">
                        <input type="button" :value=item.title @click="onClickDateItemOfTradeIncome(item.dateType, false)" class="tab-button" :class="{ 'selected-button' : (tradeIncome.selectedDateType === item.dateType) }">
                    </td>
                    <td>
                        <date-picker style="margin-left: 5px;" :options="startDatePicker.fromOptions" :error="!(tradeIncome.dateValidation.isIntervalProper && tradeIncome.dateValidation.isAscendingOrder)" :input-calendar-icon="startDatePicker.inputCalendarIcon" :value="tradeIncome.filterParameters.startDate"></date-picker>
                        <span>至</span>
                        <date-picker :options="endDatePicker.fromOptions" :error="!(tradeIncome.dateValidation.isIntervalProper && tradeIncome.dateValidation.isAscendingOrder)" :input-calendar-icon="endDatePicker.inputCalendarIcon" :value="tradeIncome.filterParameters.endDate"></date-picker>
                        <bee-button text="确定" type="btn-solid-small-green-normal" :disabled="!(tradeIncome.dateValidation.isIntervalProper && tradeIncome.dateValidation.isAscendingOrder)" @click="handleClickToSearch"></bee-button>
                    </td>
                </tr>
            </table>
            <table class="tab-table" v-if=" currentModule==='tradeRefund' ">
                <tr>
                    <td v-for="item in dateItemList">
                        <input type="button" :value=item.title @click="onClickDateItemOfTradeRefund(item.dateType)" class="tab-button" :class="{ 'selected-button' : (tradeRefund.selectedDateType === item.dateType) }">
                    </td>
                    <td>
                        <date-picker style="margin-left: 5px;" :options="startDatePicker.fromOptions" :error="!(tradeRefund.dateValidation.isIntervalProper && tradeRefund.dateValidation.isAscendingOrder)" :input-calendar-icon="startDatePicker.inputCalendarIcon" :value="tradeRefund.filterParameters.startDate"></date-picker>
                        <span>至</span>
                        <date-picker :options="endDatePicker.fromOptions" :error="!(tradeRefund.dateValidation.isIntervalProper && tradeRefund.dateValidation.isAscendingOrder)" :input-calendar-icon="endDatePicker.inputCalendarIcon" :value="tradeRefund.filterParameters.endDate"></date-picker>
                        <bee-button text="确定" type="btn-solid-small-green-normal" :disabled="!(tradeRefund.dateValidation.isIntervalProper && tradeRefund.dateValidation.isAscendingOrder)" @click="handleClickToSearch"></bee-button>
                    </td>
                </tr>
            </table>
            <table class="tab-table" v-if=" currentModule==='tradeSummary' ">
                <tr>
                    <td v-for="item in dateItemList">
                        <input type="button" :value=item.title @click="onClickDateItemOfTradeSummary(item.dateType)" class="tab-button" :class="{ 'selected-button' : (tradeSummary.selectedDateType === item.dateType) }">
                    </td>
                    <td>
                        <date-picker style="margin-left: 5px;" :options="startDatePicker.fromOptions" :error="!(tradeSummary.dateValidation.isIntervalProper && tradeSummary.dateValidation.isAscendingOrder)" :input-calendar-icon="startDatePicker.inputCalendarIcon" :value="tradeSummary.filterParameters.startDate"></date-picker>
                        <span>至</span>
                        <date-picker :options="endDatePicker.fromOptions" :error="!(tradeSummary.dateValidation.isIntervalProper && tradeSummary.dateValidation.isAscendingOrder)" :input-calendar-icon="endDatePicker.inputCalendarIcon" :value="tradeSummary.filterParameters.endDate"></date-picker>
                        <bee-button text="确定" type="btn-solid-small-green-normal" :disabled="!(tradeSummary.dateValidation.isIntervalProper && tradeSummary.dateValidation.isAscendingOrder)" @click="handleClickToSearch"></bee-button>
                    </td>
                </tr>
            </table>
            <bee-select style="margin-left: 10px;" :options="itemList" filterable multiple :width="140" showSelectAll :all-checked="true" :show-result="showShopSelectResults" select-all-text="全部门店" @change="changeHandle" :selected-item="selectedItem" @submit="onClickSelectBtn"></bee-select>
        </div>
        <div class="dateErrMsg">
            <span v-if="(!tradeIncome.dateValidation.isAscendingOrder && currentModule==='tradeIncome') || (!tradeRefund.dateValidation.isAscendingOrder && currentModule==='tradeRefund') || (!tradeSummary.dateValidation.isAscendingOrder && currentModule==='tradeSummary')">结束日期不能早于起始日期</span>
            <span v-if="(!tradeIncome.dateValidation.isIntervalProper && currentModule==='tradeIncome') || (!tradeRefund.dateValidation.isIntervalProper && currentModule==='tradeRefund') || (!tradeSummary.dateValidation.isIntervalProper && currentModule==='tradeRefund')">时间跨度不能超过31天</span>
        </div>

        <div class="extra-info">
            <div class="query-result">
                <div v-if=" currentModule==='tradeIncome'">
                    共查询到
                    <span class="record-count">{{ tradeIncome.pagination.totalRecord }}</span>
                    笔记录
                </div>
                <div v-if=" currentModule==='tradeRefund'">
                    退款金额共
                    <span class="record-count">{{ tradeRefund.refundTotal.refundAmount }}</span>
                    元，退还服务费共
                    <span class="record-count">{{ tradeRefund.refundTotal.refundCommissionAmount }}</span>
                    元
                </div>
                <div v-if=" currentModule==='tradeSummary'">
                    共查询到
                    <span class="record-count">{{ tradeSummary.pagination.totalRecord }}</span>
                    笔记录
                </div>
            </div>
            <div class="download-button" @click="downloadDetail">
                <img class="download-icon" src="../../../../assets/img/download.png">
                <span class="download-text">下载明细</span>
            </div>
        </div>

        <div class="table-area">

            <fee-table class="fee-table" :configInfo="tradeIncome.shopTotalInfoVO" v-if="currentModule==='tradeIncome'"></fee-table>
            <fee-table class="fee-table" :configInfo="tradeSummary.shopTotalInfoVO" v-if="currentModule==='tradeSummary'"></fee-table>

            <table width="100%" class="table-body" v-if=" currentModule==='tradeIncome' ">
                <tbody>
                    <tr>
                        <th v-for="item in tradeIncome.tableHeadList">{{item.name}}</th>
                    </tr>

                    <tr v-for="item in tradeIncome.shopOrderIncomeVOList">
                        <td class="fee-table-item">{{item.recordId}}</td>
                        <td class="fee-table-item">{{item.payTime}}</td>
                        <td class="fee-table-item">{{item.payMode}}</td>
                        <td class="fee-table-item">{{item.shopName}}</td>
                        <td class="fee-table-item">{{item.merchantAmount}}</td>
                        <td class="fee-table-item">{{item.consumptionAmount}}</td>
                        <td class="fee-table-item">{{item.discountAmount}}</td>
                        <td class="fee-table-item">{{item.prePaidAmount}}</td>
                        <td class="fee-table-item">{{item.integralDeductionAmount}}</td>
                        <td class="fee-table-item">{{item.malingAmount}}</td>
                        <td class="fee-table-item">{{item.totalRefundAmount}}</td>
                        <td class="fee-table-item">{{item.commissionAmount}}</td>
                        <td class="fee-table-item">
                            <a class="link-text detail-link" @click='toDetail(item.orderId,item.orderType)' v-if='item.isOpenPay === false'>查看详情</a>
                            <span v-else>查看详情</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="13" class="fee-table-item" v-if="tradeIncome.shopOrderIncomeVOList.length === 0">暂无相关数据</td>
                    </tr>
                </tbody>
            </table>
            <table width="100%" class="table-body" v-if=" currentModule==='tradeRefund' ">
                <tbody>
                    <tr>
                        <th v-for="item in tradeRefund.tableHeadList">{{item.name}}</th>
                    </tr>

                    <tr v-for="item in tradeRefund.shopOrderRefundVOList">
                        <td class="fee-table-item">{{item.refundId}}</td>
                        <td class="fee-table-item">{{item.refundTime}}</td>
                        <td class="fee-table-item">{{item.recordId}}</td>
                        <td class="fee-table-item">{{item.shopName}}</td>
                        <td class="fee-table-item">{{item.refundAmount}}</td>
                        <td class="fee-table-item">{{item.refundCommissionAmount}}</td>
                        <td class="fee-table-item">
                            <a v-if='item.isOperationShow === true && item.isOpenPay === false' class="link-text detail-link" @click='toDetail(item.orderId,item.orderType)'>查看详情</a>
                            <div v-else>查看详情</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="10" class="fee-table-item" v-if="tradeRefund.shopOrderRefundVOList.length === 0">暂无相关数据</td>
                    </tr>
                </tbody>
            </table>
            <table width="100%" class="table-body" v-if=" currentModule==='tradeSummary' ">
                <tbody>
                    <tr>
                        <th v-for="item in tradeSummary.tableHeadList">{{item.name}}</th>
                    </tr>

                    <tr v-for="item in tradeSummary.shopDateInfoVOList">
                        <!--<td class="fee-table-item">{{item.shopId}}</td>-->
                        <td class="fee-table-item">{{item.shopName}}</td>
                        <td class="fee-table-item">{{item.totalCount}}</td>
                        <td class="fee-table-item">{{item.merchantAmount}}</td>
                        <td class="fee-table-item">{{item.consumptionAmount}}</td>
                        <td class="fee-table-item">{{item.discountAmount}}</td>
                        <td class="fee-table-item">{{item.prePaidAmount}}</td>
                        <td class="fee-table-item">{{item.integralDeductionAmount}}</td>
                        <td class="fee-table-item">{{item.malingAmount}}</td>
                        <td class="fee-table-item">{{item.refundAmount}}</td>
                        <td class="fee-table-item">{{item.commissionAmount}}</td>
                        <td class="fee-table-item">
                            <a class="link-text detail-link" @click="onClickDetailLinkOfTradeSummary({id: item.shopId, name: item.shopName,})">查看详情</a>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" class="fee-table-item" v-if="tradeSummary.shopDateInfoVOList.length === 0">暂无相关数据</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <pagination :given-page-count=this.tradeIncome.pagination.totalPages :given-current-page=this.tradeIncome.filterParameters.pn :did-change-page="didChangePageOfTradeIncome" :type="'small'" :show-arrow-text="true" v-if=" currentModule==='tradeIncome' && this.tradeIncome.pagination.totalPages > 1"></pagination>
                <pagination :given-page-count=this.tradeRefund.pagination.totalPages :given-current-page=this.tradeRefund.filterParameters.pn :did-change-page="didChangePageOfTradeRefund" :type="'small'" :show-arrow-text="true" v-if=" currentModule==='tradeRefund' && this.tradeRefund.pagination.totalPages > 1"></pagination>
                <pagination :given-page-count=this.tradeSummary.pagination.totalPages :given-current-page=this.tradeSummary.filterParameters.pn :did-change-page="didChangePageOfTradeSummary" :type="'small'" :show-arrow-text="true" v-if=" currentModule==='tradeSummary' && this.tradeSummary.pagination.totalPages > 1"></pagination>
            </div>

        </div>
    </div>
</template>

<script>


/* eslint-disable import/no-unresolved */
/* eslint-disable no-extend-native */
import Vue from 'vue';
import { Pagination, DatePicker, Button, Select } from '@dp/bee-ui';
import PageError from '../../../shared/page-error.vue';
import FeeTable from './finance-fee-table.vue';
import orderDetail from '../../order-list/order-detail.vue';

import { Ajax } from '../../../../lib/utils.js';
import { login } from '../../../../lib/auth.js'; // 登录接口
import getPath from '../../../../lib/path.js';


Array.prototype.unique = function () {
    // 利用对象的hash存储特性去重
    const object = {};
    const result = [];
    for (let i = 0, length = this.length; i < length; i += 1) {
        const temp = this[i];
        let key;
        if ((typeof temp) === 'object') {
            key = JSON.stringify(temp); // 若为对象类型，将对象序列化为字符串
        } else {
            key = typeof temp + temp;
        }
        if (!object[key]) {
            object[key] = true; // 若object中已经存在此键值，则证明此元素在数组中已经存在
            result.push(temp);
        }
    }
    return result;
};
export default {
    data() {
        return {
            shopInfo: {},
            userInfo: {},
            currentModule: 'tradeIncome',
            dateItemList: [
                {
                    title: '昨天',
                    dateType: 1,
                },
                {
                    title: '今天',
                    dateType: 0,
                },
                {
                    title: '近7天',
                    dateType: 6,
                },
                {
                    title: '近30天',
                    dateType: 29,
                },
            ],
            startDatePicker: {
                // 是否显示输入框icon
                inputCalendarIcon: false,
                // 是否样式外框标红
                // options参数是用来设置Flatpick.js的
                fromOptions: {
                    allowInput: true,
                    enableTime: true,
                    time_24hr: true,
                    enableConfirmButtons: true,
                    onValueUpdate: this.updateStartDate,
                    disable: [
                        function (date) {
                            const now = new Date();
                            return date > now;
                        },
                    ],
                },
            },
            endDatePicker: {
                // 是否显示输入框icon
                inputCalendarIcon: false,
                // 是否样式外框标红
                // options参数是用来设置Flatpick.js的
                fromOptions: {
                    allowInput: true,
                    enableTime: true,
                    time_24hr: true,
                    enableConfirmButtons: true,
                    onValueUpdate: this.updateEndDate,
                    disable: [
                        function (date) {
                            const now = new Date();
                            return date > now;
                        },
                    ],
                },
            },
            itemList: [],
            shopList: [],
            selectedItem: [],
            shopIdsString: '',
            tradeIncome: {
                selectedDateType: 0,
                filterParameters: {
                    shopIdList: [],
                    startDate: '',
                    endDate: '',
                    pn: 1,
                },
                dateValidation: {
                    isAscendingOrder: true,
                    isIntervalProper: true,
                },
                shopTotalInfoVO: {
                    settleAmount: '0.00', // 实收
                    consumptionAmount: '0.00', // 消费
                    discountAmount: '0.00', // 优惠
                    commissionAmount: '0.00', // 服务费
                    refundAmount: '0.00', // 退款
                    prePaidAmount: '0.00', // 储值
                    integralDeductionAmount: '0.00', // 积分抵扣
                    malingAmount: '0.00', // 抹零
                },
                tableHeadList: [
                    {
                        name: '订单编号',
                    },
                    {
                        name: '支付时间',
                    },
                    {
                        name: '支付渠道',
                    },
                    {
                        name: '门店',
                    },
                    {
                        name: '商户实收',
                    },
                    {
                        name: '消费金额',
                    },
                    {
                        name: '优惠金额',
                    },
                    {
                        name: '储值消费',
                    },
                    {
                        name: '积分折扣金额',
                    },
                    {
                        name: '抹零金额',
                    },
                    {
                        name: '累计退款金额',
                    },
                    {
                        name: '服务费',
                    },
                    {
                        name: '操作',
                    },
                ],
                shopOrderIncomeVOList: [],
                pagination: {
                    totalRecord: 0,
                    totalPages: 1,
                },
            },
            tradeRefund: {
                selectedDateType: 0,
                filterParameters: {
                    shopIdList: [],
                    startDate: '',
                    endDate: '',
                    pn: 1,
                },
                dateValidation: {
                    isAscendingOrder: true,
                    isIntervalProper: true,
                },
                refundTotal: {
                    refundAmount: 0,
                    refundCommissionAmount: 0,
                },
                tableHeadList: [
                    {
                        name: '退款编号',
                    },
                    {
                        name: '退款时间',
                    },
                    {
                        name: '订单编号',
                    },
                    {
                        name: '门店',
                    },
                    {
                        name: '退款金额',
                    },
                    {
                        name: '退还服务费',
                    },
                    {
                        name: '操作',
                    },
                ],
                shopOrderRefundVOList: [],
                pagination: {
                    totalRecord: 0,
                    totalPages: 1,
                },
            },
            tradeSummary: {
                selectedDateType: 0,
                filterParameters: {
                    shopIdList: [],
                    startDate: '',
                    endDate: '',
                    pn: 1,
                },
                dateValidation: {
                    isAscendingOrder: true,
                    isIntervalProper: true,
                },
                shopTotalInfoVO: {
                    merchantAmount: '0.00', // 实收
                    consumptionAmount: '0.00', // 消费
                    discountAmount: '0.00', // 优惠
                    commissionAmount: '0.00', // 服务费
                    refundAmount: '0.00', // 退款
                    prePaidAmount: '0.00', // 储值
                    integralDeductionAmount: '0.00', // 积分抵扣
                    malingAmount: '0.00', // 抹零
                },
                tableHeadList: [
                    {
                        name: '门店',
                    },
                    {
                        name: '交易笔数',
                    },
                    {
                        name: '商户实收',
                    },
                    {
                        name: '消费金额',
                    },
                    {
                        name: '优惠金额',
                    },
                    {
                        name: '储值消费',
                    },
                    {
                        name: '积分折扣金额',
                    },
                    {
                        name: '抹零金额',
                    },
                    {
                        name: '累计退款金额',
                    },
                    {
                        name: '服务费',
                    },
                    {
                        name: '操作',
                    },
                ],
                shopDateInfoVOList: [],
                pagination: {
                    totalRecord: 0,
                    totalPages: 1,
                },
            },
            loading: {},
            pageError: null,
        };
    },
    components: {
        'fee-table': FeeTable,
        'page-error': PageError,
        pagination: Pagination,
        'date-picker': DatePicker,
        'bee-button': Button,
        'bee-select': Select,
    },
    watch: {
        'tradeIncome.filterParameters.startDate': 'validateDate',
        'tradeIncome.filterParameters.endDate': 'validateDate',
        'tradeRefund.filterParameters.startDate': 'validateDate',
        'tradeRefund.filterParameters.endDate': 'validateDate',
        'tradeSummary.filterParameters.startDate': 'validateDate',
        'tradeSummary.filterParameters.endDate': 'validateDate',
        'tradeIncome.filterParameters.shopIdList': 'updateShopIdsString',
    },
    created() {
        this.loading = this.$loading();
        this.onClickDateItemOfTradeIncome(0, true);
        login().then((item) => {
            this.loading.$stopLoading();
            this.shopInfo = {
                shopName: item.shop.shopName,
                shopId: item.shop.shopId,
                isIntellShop: item.shop.isIntellShop,
            };
            this.userInfo = {
                hasMultiShops: item.user.hasMultiShops,
                role: item.user.role,
            };
            this.getShopList();
        });
    },
    mounted() {

    },
    methods: {
        toDetail(orderId, orderType) {
            const detail = new Vue(orderDetail);
            detail.viewId = orderId;
            detail.orderType = orderType;
            document.body.appendChild(detail.$mount().$el);
        },
        getShopList() {
            this.loading = this.$loading();
            Ajax.get({
                url: '',
                params: { pageName: 'e-settle' },
                success: (res) => {
                    //                        this.hideLoading();
                    this.loading.$stopLoading();
                    if (res.code.toString() === '200') {
                        this.shopList = res.data.unique();
                        //    let pShopList = this.shopList.uniqueArray();
                        const shopIds = this.shopList.map(item => item.shopId.toString());
                        this.tradeIncome.filterParameters.shopIdList = shopIds;
                        this.getTradeIncomeList(this.tradeIncome.filterParameters, true);
                        this.itemList = this.shopList.reduce((rv, x) => {
                            const item = {};
                            item.id = x.shopId.toString();
                            item.name = x.shopName.toString();
                            rv.push(item);
                            return rv;
                        }, []);
                    } else {
                        this.showToast(res.msg);
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.showToast('网络异常，请稍后重试！');
                },
            });
        },

        /**
           * [获取交易明细列表]
           */
        getTradeIncomeList(paramsData = this.tradeIncome.filterParameters, first) {
            if ((this.tradeIncome.filterParameters.shopIdList.length === 0) && !first) {
                this.showToast('请至少选择一家门店！');
                return;
            }
            this.loading = this.$loading();
            Ajax.get({
                url: 'finance/trade/income',
                params: paramsData,
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code.toString() === '200') {
                        this.tradeIncome.shopTotalInfoVO = res.data.shopTotalInfoVO;
                        this.tradeIncome.shopOrderIncomeVOList = res.data.shopOrderIncomeVOList;
                        this.tradeIncome.pagination = res.data.pagination;
                    } else if (res.code.toString() === '308') {
                        const url = res.data;
                        window.location = url;
                        //                        this.$router.push({ path: url });
                    } else {
                        this.showToast(res.msg);
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.showToast('网络异常，请稍后重试！');
                },
            });
        },
        /**
           *
           */
        getTradeRefundList() {
            if (this.tradeIncome.filterParameters.shopIdList.length === 0) {
                this.showToast('请至少选择一家门店！');
                return;
            }
            this.loading = this.$loading();
            Ajax.get({
                url: 'finance/trade/refund',
                params: this.tradeRefund.filterParameters,
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code.toString() === '200') {
                        this.tradeRefund.shopOrderRefundVOList = res.data.shopOrderRefundVOList;
                        this.tradeRefund.refundTotal = res.data.refundTotal;
                        this.tradeRefund.pagination = res.data.pagination;
                    } else if (res.code.toString() === '308') {
                        const url = res.data;
                        window.location = url;
                    } else {
                        this.showToast(res.msg);
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.showToast('网络异常，请稍后重试！');
                },
            });
        },
        getTradeSummaryList() {
            if (this.tradeIncome.filterParameters.shopIdList.length === 0) {
                this.showToast('请至少选择一家门店！');
                return;
            }
            this.loading = this.$loading();
            Ajax.get({
                url: 'finance/trade/summary',
                params: this.tradeSummary.filterParameters,
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code.toString() === '200') {
                        this.tradeSummary.shopTotalInfoVO = res.data.shopTotalInfoVO;
                        this.tradeSummary.shopDateInfoVOList = res.data.shopDateInfoVOList;
                        this.tradeSummary.pagination = res.data.pagination;
                    } else if (res.code.toString() === '308') {
                        const url = res.data;
                        window.location = url;
                    } else {
                        this.showToast(res.msg);
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.showToast('网络异常，请稍后重试！');
                },
            });
        },
        onClickTab(moduleName) {
            this.currentModule = moduleName;
            if (moduleName === 'tradeIncome') {
                if (this.tradeIncome.shopOrderIncomeVOList.length === 0) {
                    this.getTradeIncomeList();
                }
            } else if (moduleName === 'tradeRefund') {
                if (this.tradeRefund.shopOrderRefundVOList.length === 0) {
                    this.onClickDateItemOfTradeRefund(this.tradeRefund.selectedDateType);
                    //                        this.getTradeRefundList();
                }
            } else if (this.tradeSummary.shopDateInfoVOList.length === 0) {
                this.onClickDateItemOfTradeSummary(this.tradeSummary.selectedDateType);
                //                        this.getTradeSummaryList();
            }
        },
        updateStartDate(val, dateString) {
            if (this.currentModule === 'tradeIncome') {
                this.tradeIncome.filterParameters.startDate = dateString;
            } else if (this.currentModule === 'tradeRefund') {
                this.tradeRefund.filterParameters.startDate = dateString;
            } else {
                this.tradeSummary.filterParameters.startDate = dateString;
            }
        },
        updateEndDate(val, dateString) {
            if (this.currentModule === 'tradeIncome') {
                this.tradeIncome.filterParameters.endDate = dateString;
            } else if (this.currentModule === 'tradeRefund') {
                this.tradeRefund.filterParameters.endDate = dateString;
            } else {
                this.tradeSummary.filterParameters.endDate = dateString;
            }
        },

        /**
           * [根据特定的日期返回日历区间 ]
           * @param interval
           * @returns {{start: string, end: string}}
           */
        getDateRangeString(interval) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - (3600 * 1000 * 24 * interval));
            if (interval === 1) {
                end.setTime(end.getTime() - (3600 * 1000 * 24));
            }
            let monthS = start.getMonth() + 1;
            let dayS = start.getDate();
            if (monthS >= 1 && monthS <= 9) {
                monthS = `0${monthS}`;
            }
            if (dayS >= 0 && dayS <= 9) {
                dayS = `0${dayS}`;
            }
            let monthE = end.getMonth() + 1;
            let dayE = end.getDate();
            if (monthE >= 1 && monthE <= 9) {
                monthE = `0${monthE}`;
            }
            if (dayE >= 0 && dayE <= 9) {
                dayE = `0${dayE}`;
            }
            const startDate = `${start.getFullYear()}-${monthS}-${dayS} 00:00`;
            const endDate = `${end.getFullYear()}-${monthE}-${dayE} 23:59`;
            return {
                start: startDate,
                end: endDate,
            };
        },
        onClickDateItemOfTradeIncome(val, isInitial) {
            this.tradeIncome.selectedDateType = val;
            const dateRange = this.getDateRangeString(val);
            this.tradeIncome.filterParameters.startDate = dateRange.start;
            this.tradeIncome.filterParameters.endDate = dateRange.end;
            if (!isInitial) {
                this.getTradeIncomeList();
            }
        },
        onClickDateItemOfTradeRefund(val) {
            this.tradeRefund.selectedDateType = val;
            const dateRange = this.getDateRangeString(val);
            this.tradeRefund.filterParameters.startDate = dateRange.start;
            this.tradeRefund.filterParameters.endDate = dateRange.end;
            this.getTradeRefundList();
        },
        onClickDateItemOfTradeSummary(val) {
            this.tradeSummary.selectedDateType = val;
            const dateRange = this.getDateRangeString(val);
            this.tradeSummary.filterParameters.startDate = dateRange.start;
            this.tradeSummary.filterParameters.endDate = dateRange.end;
            this.getTradeSummaryList();
        },
        /**
           * []
           * @param start
           * @param end
           * @returns {{ascendingOrder: boolean, intervalProper: boolean}}
           */
        checkDateStatus(start, end) {
            let isAscendingOrder = true;
            let isIntervalProper = true;
            const startDate = new Date(Date.parse(start.replace(/-/g, '/'))).getTime();
            const endDate = new Date(Date.parse(end.replace(/-/g, '/'))).getTime();
            const interval = endDate - startDate;
            if (interval < 0) {
                isAscendingOrder = false;
                return {
                    ascendingOrder: isAscendingOrder,
                    intervalProper: isIntervalProper,
                };
            }
            const days = interval / (1000 * 60 * 60 * 24);
            if (days > 31) {
                isIntervalProper = false;
            }
            return {
                ascendingOrder: isAscendingOrder,
                intervalProper: isIntervalProper,
            };
        },
        validateDate() {
            if (this.currentModule === 'tradeIncome') {
                const result = this.checkDateStatus(this.tradeIncome.filterParameters.startDate,
                    this.tradeIncome.filterParameters.endDate);
                this.tradeIncome.dateValidation.isAscendingOrder = result.ascendingOrder;
                this.tradeIncome.dateValidation.isIntervalProper = result.intervalProper;
            } else if (this.currentModule === 'tradeRefund') {
                const result = this.checkDateStatus(this.tradeRefund.filterParameters.startDate,
                    this.tradeRefund.filterParameters.endDate);
                this.tradeRefund.dateValidation.isAscendingOrder = result.ascendingOrder;
                this.tradeRefund.dateValidation.isIntervalProper = result.intervalProper;
            } else {
                const result = this.checkDateStatus(this.tradeSummary.filterParameters.startDate,
                    this.tradeSummary.filterParameters.endDate);
                this.tradeSummary.dateValidation.isAscendingOrder = result.ascendingOrder;
                this.tradeSummary.dateValidation.isIntervalProper = result.intervalProper;
            }
        },
        handleClickToSearch() {
            if (this.currentModule === 'tradeIncome') {
                this.tradeIncome.selectedDateType = -1;
                this.getTradeIncomeList();
            } else if (this.currentModule === 'tradeRefund') {
                this.tradeRefund.selectedDateType = -1;
                this.getTradeRefundList();
            } else {
                this.tradeSummary.selectedDateType = -1;
                this.getTradeSummaryList();
            }
        },
        updateShopIdsString() {
            let str = '';
            this.tradeIncome.filterParameters.shopIdList.map((x) => {
                if (str.length === 0) {
                    str = `shopIdList[]=${x}`;
                } else {
                    str = `${str}&shopIdList[]=${x}`;
                }
                return str;
            });
            this.shopIdsString = str;
        },
        downloadDetail() {
            let downloadUrl = '';
            if (this.currentModule === 'tradeIncome') {
                downloadUrl = `/ajax/shop/finance/trade/income/excel?${this.shopIdsString}&startDate=${this.tradeIncome.filterParameters.startDate}&endDate=${this.tradeIncome.filterParameters.endDate}`;
            } else if (this.currentModule === 'tradeRefund') {
                downloadUrl = `/ajax/shop/finance/trade/refund/excel?${this.shopIdsString}&startDate=${this.tradeRefund.filterParameters.startDate}&endDate=${this.tradeRefund.filterParameters.endDate}`;
            } else {
                downloadUrl = `/ajax/shop/finance/trade/summary/excel?${this.shopIdsString}&startDate=${this.tradeSummary.filterParameters.startDate}&endDate=${this.tradeSummary.filterParameters.endDate}`;
            }
            window.open(`${getPath().serverDomain}${downloadUrl}`, '_blank');
        },
        onClickDetailLinkOfTradeSummary(item) {
            this.selectedItem = [item];
            this.currentModule = 'tradeIncome';
            const params = {
                shopIdList: [item.id.toString()],
                startDate: this.tradeSummary.filterParameters.startDate,
                endDate: this.tradeSummary.filterParameters.endDate,
                pn: 1,
            };
            this.tradeIncome.selectedDateType = this.tradeSummary.selectedDateType;
            this.tradeIncome.filterParameters = params;
            this.getTradeIncomeList();
        },
        didChangePageOfTradeIncome(clickedPage) {
            this.tradeIncome.filterParameters.pn = clickedPage;
            this.getTradeIncomeList();
        },
        didChangePageOfTradeRefund(clickedPage) {
            this.tradeRefund.filterParameters.pn = clickedPage;
            this.getTradeRefundList();
        },
        didChangePageOfTradeSummary(clickedPage) {
            this.tradeSummary.filterParameters.pn = clickedPage;
            this.getTradeSummaryList();
        },
        showShopSelectResults(selectedItem) {
            if (selectedItem.length === 1) {
                return selectedItem[0].name;
            }
            return `已选择${selectedItem.length}家`;
        },
        changeHandle(item) {
            const shopIdList = item.reduce((rv, x) => {
                rv.push(x.id.toString());
                return rv;
            }, []);
            this.tradeIncome.filterParameters.shopIdList = shopIdList;
            this.tradeRefund.filterParameters.shopIdList = shopIdList;
            this.tradeSummary.filterParameters.shopIdList = shopIdList;
        },
        onClickSelectBtn() {
            if (this.tradeIncome.filterParameters.shopIdList.length === 0) {
                this.showToast('请至少选择一家门店！');
                return;
            }
            if (this.currentModule === 'tradeIncome') {
                this.getTradeIncomeList();
            } else if (this.currentModule === 'tradeRefund') {
                this.getTradeRefundList();
            } else {
                this.getTradeSummaryList();
            }
        },
        showToast(msg) {
            this.$toast({
                text: msg,
                duration: 2000,
            });
        },
    },
};
</script>

<style lang="less">
@import '~@dp/bee-ui/dist/styles/theme/ecom/index.css';
@import "finance-check.less";
@import "tip-hover.less";
</style>
