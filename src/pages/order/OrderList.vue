<style lang='less'>
@import './orderList.less';
</style>

<template>
    <div class="main">
        <shop-header :headerTitle="'订单查询'" :shopInfo='shopInfo' v-if='shopInfo' @changeShop='changeShopCallBack'></shop-header>
        <order-filter 
        :startDatePicker='startDatePicker' 
        :endDatePicker='endDatePicker' 
        :validateData='validateData'
        :orderStatus='ORDER_STATUS'
        :days='days'
        @clickDayBtn='clickDayBtn'
        @setStatus='setStatus'
        @search='search'
        @downloadExcel='downloadExcel'
        @changeText='changeSearchText'>
        </order-filter>
        <div class='order-container'>
            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="order-table">
                <thead>
                    <tr>
                        <th width="10%">更新时间</th>
                        <th width="10%">创建时间</th>
                        <th width="10%">订单编号</th>
                        <th width="8%" v-if='shopInfo.supportTable'>桌号</th>
                        <th width="8%">订单金额</th>
                        <th width="8%">优惠金额</th>
                        <th width="8%">实付金额</th>
                        <th width="8%">支付方式</th>
                        <th width="15%">订单状态</th>
                        <th width="15%">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for='order in orderList' :key="order.viewId">
                        <td>
                            {{order.displayUpdateTime | countDownTime}}
                        </td>
                        <td>
                            {{order.addTime || '-'}}
                        </td>
                        <td>
                            {{order.viewId || '-'}}
                        </td>
                        <td v-if='shopInfo.supportTable'>
                            {{order.tableNo || '-'}}
                        </td>
                        <td>
                            {{Number(order.originPrice).toFixed(2)}}
                        </td>
                        <td>
                            <span v-if='order.payStatus === 10'>-</span>
                            <span v-else>
                                ￥{{Number(order.customerDiscountAmount).toFixed(2)}}
                            </span>
                        </td>
                        <td>
                            <span v-if='order.payStatus === 10'>-</span>
                            <span v-else>
                                ￥{{Number(order.customerPrice).toFixed(2)}}
                            </span>
                        </td>
                        <td>
                            {{order.payChannel||'-'}}
                        </td>
                        <td>
                            <div class="invoice-cont" v-if='order.invoice || order.invoiceCode'>
                                <div class="invoice">发票</div>
                                <div class="tip-over">
                                    <div class='tip-line' v-if='order.invoice'>发票抬头：<span>{{order.invoice}}</span>
                                    <a class='copy-link' id="company-name" :data-clipboard-text='order.invoice' @click="copy('company-name')">复制</a></div>
                                    <div class='tip-line' v-if='order.invoiceCode'>税号：<span>{{order.invoiceCode | showInvoiceCode }}</span>
                                    <a class='copy-link' id="tax-number" :data-clipboard-text='order.invoiceCode' @click="copy('tax-number')">复制</a></div>
                                    <i></i>
                                </div>
                            </div>
                            <span>{{order.statusDisplay}}</span>
                            <span v-if='order.refundAmount' class='refund-word'>
                                退款 -￥{{Number(order.refundAmount).toFixed(2)}}
                            </span>
                        </td>
                        <td>
                            <a href="javascript:;" @click='showOrderDetail(order)'>查看详情</a>
                            <ui-dropdown :name="'更多'" :options="order.operationTypeList"></ui-dropdown>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="13" class="empty-default" v-if="paginationInfo.totalPages === 0">暂无订单</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-cont">
            <pagination :givenPageCount='paginationInfo.totalPages' :givenCurrentPage='paginationInfo.pn' :didChangePage='didChangePage'>
            </pagination>
        </div>
        <black-list-pop @close='showBlackListPop=false' @ok='addBlackList' :userInfo="blackInfo" v-if='showBlackListPop'></black-list-pop>

        <ui-confirm v-if="confirm.visible"
                    :visible="confirm.visible"
                    :title="confirm.title"
                    :content="confirm.content"
                    :confirmText="confirm.confirmText"
                    :cancelText="confirm.cancelText"
                    :mode="confirm.mode"
                    @close="userMaskClose"
                    @confirm="userMaskConfirm">
        </ui-confirm>

        <bee-popup v-if="popupObject.visible"
                   title="退款"
                   :visible="popupObject.visible"
                   @close="closeMembercardRefundAllPopup">
            <div slot="pop-content">
                <div class="membercard-refund-all-content">
                    <div class="title">确认全单退款？</div>
                    <p class="refund-amount">退款金额: <span class="membercard-refund-price">{{popupObject.order.customerPrice}}</span><br>
                    <span class="tips">(顾客使用的会员积分、优惠券、储值，退款时将全部退回)</span></p>
                    <div class="btn-container">
                        <ui-button id="confirm-btn"
                                   text="全单退款" 
                                   type="btn-solid-small-green-normal" 
                                   @click="postMembercardRefundAllRequest(popupObject.order)">
                        </ui-button>
                        <ui-button text="取消"
                                   type="btn-solid-small-grey-normal"
                                   @click="closeMembercardRefundAllPopup">
                        </ui-button>
                    </div>
                </div>
            </div>
        </bee-popup>
        <!-- <auth-code></auth-code> -->
    </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */
import {
    Select, Pagination, Button, Confirm, Popup,
} from '@dp/bee-ui'; // eslint-disable-line import/extensions
// import DateRangePicker from '../components/ui-base/date-range-picker/date-range-picker.vue'
import Vue from 'vue'; // eslint-disable-line import/extensions
import moment from 'moment'; // eslint-disable-line import/extensions
import ShopHeader from '@/components/shared/shop-header/shop-header.vue';

import DropDown from '@/components/ui-base/dropdown/dropdown.vue';
import RefundDetail from '@/components/pages/order-list/refund-detail.vue';
import RefundDetailBJ from '@/components/pages/order-list/refund-detail-miaofu-bj.vue';
// import AuthCode from '@/components/pages/order-list/authcode.vue';
import AuthCodeValidate from '@/components/pages/order-list/authcodeValidate.js';
import OrderDetail from '@/components/pages/order-list/order-detail.vue';
import getPath from '@/lib/path.js';
import { ORDER_TYPE } from '@/lib/constant.js';
import BlackListPop from '@/components/pages/shop-manage/black-list-pop.vue';
import { login } from '@/lib/auth'; // 登录接口
import cookie from '@/lib/cookie.js';

import OrderFilter from './OrderFilter.vue';


import { Ajax, copyClipboard } from '../../lib/utils.js';
import { blackCallBack, ORDER_STATUS } from './orderList.ts';

// import '../../../data/mock.js';


export default {
    data() {
        return {
            blackInfo: {},
            shopInfos: [],
            showChooseShopPanel: true,
            source: '',
            showBlackListPop: false,
            popupObject: {
                visible: false,
                order: null,
            },
            confirm: {
                visible: false,
                title: '确认',
                content: '确定把该用户加入逃单用户名单？',
                confirmText: '确定',
                cancelText: '取消',
                data: {},
                mode: true,
            },
            paginationInfo: {
                pageSize: 0,
                totalPages: 0,
                pn: 0,
            },
            requestParams: {
                keyword: '',
                shopId: -1,
                status: 130, // 默认查询状态
                startDate: '',
                endDate: '',
                pn: 1,
            },
            loading: {},
            days: [
                { name: '昨天', active: false, dayCode: 1 },
                { name: '今天', active: true, dayCode: 2 },
                { name: '近7天', active: false, dayCode: 7 },
                { name: '近30天', active: false, dayCode: 30 },
            ],
            startDatePicker: {
                value: moment().format('YYYY-MM-DD'),
                fromOptions: {
                    allowInput: true,
                    enableTime: false,
                    time_24hr: true,
                    enableConfirmButtons: false,
                    onValueUpdate: this.updateStartDate,
                    disable: [
                        (date) => {
                            const now = new Date();
                            const before = new Date(Date.now() - (90 * 1000 * 24 * 3600));
                            return date > now || date < before;
                        },
                    ],
                },
                startDateRequest: false,

            },
            endDatePicker: {
                value: moment().format('YYYY-MM-DD'),
                fromOptions: {
                    allowInput: true,
                    enableTime: false,
                    time_24hr: true,
                    enableConfirmButtons: false,
                    onValueUpdate: this.updateEndDate,
                    disable: [
                        (date) => {
                            const now = new Date();
                            const before = new Date(Date.now() - (90 * 1000 * 24 * 3600));
                            return date > now || date < before;
                        },
                    ],
                },
                endDateRequest: false,
            },
            validateData: {
                isDataOutRange: false,
                isBeginLessEnd: false,
            },
            shopInfo: {
                // shopId: 82381518,
                shopId: 8067103,
                hasMultiShops: 0,
            },
            orderList: [],
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
            ORDER_STATUS,
        };
    },
    filters: {
        countDownTime(value) {
            if (!value) {
                return '-';
            }
            const dateTime = new Date(value).getTime();
            const now = new Date().getTime();
            const min = Math.ceil((now - dateTime) / (1000 * 60));
            if (min < 10) {
                return `${min}分钟前`;
            }
            return value;
        },
        showInvoiceCode(value) {
            return value.replace(/(.{4})/g, '$1 ');
            // return value.replace(/\s+/g, '');
        },
    },
    methods: {
        changeShopCallBack() {
            window.location.reload();
        },
        changeSearchText(text) {
            this.requestParams.keyword = text;
        },
        downloadExcel() {
            const downloadUrl = `${getPath().ajax}/${this.shopInfo.shopId}/uni_order/excel?shopId=${this.shopInfo.shopId}&startDate=${this.requestParams.startDate}&endDate=${this.requestParams.endDate}`;
            window.open(downloadUrl);
        },
        addBlackList(info) {
            Ajax.post({
                url: `${this.shopInfo.shopId}/blacklist`,
                params: JSON.stringify({
                    userId: info.userId,
                    phone: info.phone,
                    reason: info.reason,
                }),
                success: (res) => {
                    if (res.code.toString() === '200') {
                        this.$toast({
                            text: res.msg,
                            duration: 2000,
                        });
                        this.getOrderList();
                    } else {
                        this.$toast({
                            text: res.msg,
                            duration: 2000,
                        });
                    }
                },
                error: () => {
                    this.$toast({
                        text: '网络错误，请重试',
                        duration: 2000,
                    });
                },
            });
        },
        copy(str) {
            copyClipboard(str);
        },
        userMaskClose() {
            this.confirm.visible = false;
            this.confirm.mode = false;
        },
        userMaskConfirm() {
            this.loading = this.$loading();
            const userMask = this.$store.state.orderList.userMask;
            Ajax.post({
                url: `${this.shopInfo.shopId}/escapeUser/${userMask.userId}`,
                params: {
                    tel: userMask.phone,
                },
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code === '200') {
                        this.$toast({ text: res.msg, duration: 2000 });
                        // window.location.reload();
                        this.getOrderList();
                    } else if (res.code === '400') {
                        this.$toast({
                            text: res.msg,
                            duration: 2000,
                        });
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                },
            });
        },
        handleSelect(item) {
            this.requestParams.startDate = item.fromDate;
            this.requestParams.endDate = item.toDate;
            this.getOrderList();
        },
        clickDayBtn(day) {
            this.days.forEach((item) => {
                item.active = false;
            });
            day.active = true;
            switch (day.dayCode) {
            case 1:
                this.requestParams.startDate = moment().add(-1, 'days').format('YYYY-MM-DD');
                this.requestParams.endDate = moment().add(-1, 'days').format('YYYY-MM-DD');
                break;
            case 2:
                this.requestParams.startDate = moment().format('YYYY-MM-DD');
                this.requestParams.endDate = moment().format('YYYY-MM-DD');
                break;
            case 7:
                this.requestParams.startDate = moment().add(-7, 'days').format('YYYY-MM-DD');
                this.requestParams.endDate = moment().format('YYYY-MM-DD');
                break;
            case 30:
                this.requestParams.startDate = moment().add(-30, 'days').format('YYYY-MM-DD');
                this.requestParams.endDate = moment().format('YYYY-MM-DD');
                break;
            default:break;
            }
            this.startDatePicker.value = this.requestParams.startDate;
            this.endDatePicker.value = this.requestParams.endDate;
            this.resetPn(1);
            this.getOrderList();
        },
        resetPn(pn) {
            this.requestParams.pn = pn;
            this.paginationInfo.pn = pn;
        },
        validateDate() {
            if (new Date(this.requestParams.endDate) - new Date(this.requestParams.startDate) < 0) {
                this.$toast({
                    text: '开始日期必须小于结束日期',
                    duration: 2000,
                });
                return false;
            }
            const days = (new Date(this.requestParams.endDate)
             - new Date(this.requestParams.startDate)) / (1000 * 60 * 60 * 24);
            if (days > 31) {
                this.$toast({
                    text: '查询时间限制在31天以内，请重新选择日期',
                    duration: 2000,
                });
                return false;
            }
            return true;
        },
        updateStartDate(item) {
            this.requestParams.keyword = ''; // 清空搜索条件
            this.resetPn(1);

            this.requestParams.startDate = moment(item[0]).format('YYYY-MM-DD');
            if (this.startDatePicker.startDateRequest) {
                if (this.validateDate()) {
                    this.getOrderList();
                }
            }
            this.startDatePicker.startDateRequest = true;
        },

        updateEndDate(item) {
            this.requestParams.keyword = ''; // 清空搜索条件
            this.resetPn(1);

            this.requestParams.endDate = moment(item[0]).format('YYYY-MM-DD');
            if (this.endDatePicker.endDateRequest) {
                if (this.validateDate()) {
                    this.getOrderList();
                }
            }
            this.endDatePicker.endDateRequest = true;
        },

        setStatus(item) {
            this.requestParams.status = item.code;
            this.requestParams.keyword = ''; // 清空搜索条件
            this.resetPn(1);
            this.getOrderList();
        },
        search(searchText) {
            this.requestParams.keyword = searchText;
            this.getOrderList();
        },
        showOrderDetail(order) {
            const orderDetail = new Vue(OrderDetail);
            orderDetail.order = order;
            orderDetail.source = this.source;
            orderDetail.shopId = this.shopInfo.shopId;
            document.body.appendChild(orderDetail.$mount().$el);
        },
        refundCallback(item) {
            if (item.status) {
                return;
            }
            const authCode = item.order.authCode;
            AuthCodeValidate({
                realAuthCode: authCode,
                callback: () => {
                    if (item.order.useVipDiscount) {
                        this.popupObject.visible = true;
                        this.popupObject.order = item.order;
                    } else {
                        this.showRefundDetail(item, authCode);
                    }
                },
            });
        },
        closeMembercardRefundAllPopup() {
            this.popupObject.visible = false;
        },
        showMembercardRefundAllPopup(order) {
            this.popupObject.visible = true;
            this.popupObject.order = order;
        },
        showRefundDetail(item, authCode) {
            if (item.order.orderType === ORDER_TYPE.BJ_HACK) {
                const refundDetail = new Vue(RefundDetailBJ);
                refundDetail.refundPrice = item.order.customerPrice;
                refundDetail.authCode = authCode;
                refundDetail.shopId = this.shopInfo.shopId;
                refundDetail.orderId = item.order.orderId;
                document.body.appendChild(refundDetail.$mount().$el);
            } else {
                const refundDetail = new Vue(RefundDetail);
                refundDetail.order = item.order;
                refundDetail.source = this.source;
                refundDetail.shopId = this.shopInfo.shopId;
                refundDetail.authCode = authCode;
                document.body.appendChild(refundDetail.$mount().$el);
            }
        },
        didChangePage(pn) {
            this.resetPn(pn);
            this.getOrderList();
        },
        blackCallBack,
        escapeCallBack(item) {
            if (item.status) {
                return;
            }
            this.$store.dispatch('updateUserMask', item.data);
            this.confirm.visible = true;
            this.confirm.mode = false;
        },
        printCallBack(item) {
            if ('printOrderQuery' in window) {
                const viewId = item.order.viewId;
                window.printOrderQuery({
                    request: `printOrder\n${viewId}`,
                    onSuccess: function onSuccess() {},
                    onFailure: function onFailure(errorCode, errorMessage) {
                        console.error(`Error:${errorCode},${errorMessage}`);
                    },
                });
            }
            console.log('printCallBack');
        },
        getOrderList() {
            this.loading = this.$loading();
            const shopId = this.shopInfo.shopId;
            if (shopId) {
                Ajax.get({
                    url: `${shopId}/uni_order`,
                    // url: 'http://localhost:3000/uni_order',
                    params: {
                        shopId,
                        keyword: this.requestParams.keyword,
                        startDate: this.requestParams.startDate,
                        endDate: this.requestParams.endDate,
                        pn: this.requestParams.pn,
                        status: this.requestParams.status,
                    },
                    success: (res) => {
                        this.loading.$stopLoading();
                        switch (Number(res.code)) {
                        case 200:
                            this.handleGetOrderListSuccess(res);
                            break;
                        case 403:
                            this.$toast({
                                text: '你已退出登录，请重新刷新试试',
                                duration: 1000,
                            });
                            // window.location = res.data.loginUrl;
                            break;
                        default:
                            this.$toast({
                                text: res.msg,
                                duration: 2000,
                            });
                            break;
                        }
                    },
                    error: () => {
                        this.loading.$stopLoading();
                    },
                });
            } else {
                this.loading.$stopLoading();
            }
        },
        handleGetOrderListSuccess(res) {
            this.orderList = res.data.orderVOList;
            this.paginationInfo.totalPages = res.data.pagination.totalPages;
            this.paginationInfo.pageSize = res.data.pagination.pageSize;
            // this.paginationInfo.pn = 1;
            this.orderList.forEach((order) => {
                this.dealOperationTypeList(order);
            });
        },
        dealOperationTypeList(order) {
            if (this.source === 'ecom') {
                order.operationTypeList =
                order.operationTypeList.filter(type => type.code !== 40);
            }
            order.operationTypeList.forEach((type) => {
                type.name = type.operation;
                type.data = {
                    phone: order.phone,
                    userId: order.userId,
                    orderType: order.orderType,
                    shopId: this.shopInfo.shopId,
                    viewId: order.viewId,
                    authCode: order.authCode,
                };
                type.order = order;
                switch (type.code) {
                case 10:
                    type.callback = this.refundCallback;
                    if (type.status) {
                        type.name = '已退款';
                    }
                    break;
                case 20:
                    type.callback = this.blackCallBack;
                    if (type.status) {
                        type.name = '已拉黑';
                    }
                    break;
                case 30:
                    type.callback = this.escapeCallBack;
                    if (type.status) {
                        type.name = '已标记逃单';
                    }
                    break;
                case 40:
                    type.callback = this.printCallBack;
                    break;
                default:break;
                }
            });
        },
        postMembercardRefundAllRequest(order) {
            this.closeMembercardRefundAllPopup();
            if (order.orderType !== ORDER_TYPE.HACK) {
                return;
            }
            this.loading = this.$loading();
            const refundAjaxUrl = `${getPath().ajax}/${this.shopInfo.shopId}/order/${order.viewId}/refundShHackOrder`;

            Ajax.post({
                url: refundAjaxUrl,
                params: {
                    pullOrderId: order.orderId,
                    refundAmount: order.customerPrice,
                },
                success: (res) => {
                    this.loading.$stopLoading();
                    switch (Number(res.code)) {
                    case 200:
                        this.$toast({
                            text: res.msg || '成功',
                            duration: 1000,
                        });
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                        break;
                    case 500: {
                        const title = res.data.title || '发起退款失败';
                        const msg = res.data.msg || (res.msg || '发起退款失败，请稍后重试');
                        this.confirm.title = title;
                        this.confirm.content = msg;
                        this.confirm.confirmText = '知道了';
                        this.confirm.visible = true;
                        this.confirm.mode = true;
                        break;
                    }
                    default:
                        this.$toast({
                            text: res.msg || '服务器出错',
                            duration: 2000,
                        });
                        break;
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.$toast({
                        text: '网络错误',
                        duration: 2000,
                    });
                },
            });
        },
    },
    mounted() {
    //    importDiffCss();
        if (this.$route.path.indexOf('exe') >= 0) {
            import('@node_modules/@dp/bee-ui/dist/styles/theme/exe/index.css');
            import('./orderListExe.less');
            this.source = 'exe';
        } else {
            import('@node_modules/@dp/bee-ui/dist/styles/theme/ecom/index.css');
            this.source = 'ecom';
        }
        // this.getOrderList();
        if (this.source === 'exe') {
            this.shopInfo.shopId = cookie.getCookie('dbh_shopId', false);
            console.log(this.shopInfo.shopId);
            this.getOrderList();
        } else {
            login().then((item) => {
                this.shopInfo = {
                    shopName: item.shop.shopName,
                    shopId: item.shop.shopId,
                    hasMultiShops: (item.user && item.user.hasMultiShops) || 0,
                    supportTable: item.shop.supportTable,
                };
                // 如果是多门店同时 shopId<=0,弹出选择门店的窗口
                Vue.nextTick(() => {
                    if (this.shopInfo.shopId <= 0 && this.shopInfo.hasMultiShops) {
                        document.getElementsByClassName('switchAccount')[0].click();
                    }
                });
                if (this.shopInfo.shopId > 0) {
                    this.getOrderList();
                }
            });
        }
    },
    components: {
        'ui-button': Button,
        'bee-select': Select,
        'ui-dropdown': DropDown,
        pagination: Pagination,
        'ui-confirm': Confirm,
        'bee-popup': Popup,
        'shop-header': ShopHeader,
        'refund-detail': RefundDetail,
        'refund-detail-miaofu': RefundDetailBJ,
        'order-filter': OrderFilter,
        'black-list-pop': BlackListPop,
        // 'select-shop':SelectShop
    },
};
</script>
