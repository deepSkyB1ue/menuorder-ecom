<template>
    <div class="main">
        <div class="table-container">
            <div class="order-search-filter">
                <date-range-filter :datepicker-options="datePickerOptions" :default-button="defaultButton" :validate="!(dateValidation.isIntervalProper && dateValidation.isAscendingOrder)" @startDateChanged="didChangeStartDate" @endDateChanged="didChangeEndDate" @selectCallback="onStartSearching"></date-range-filter>
                <div class="download-button" @click="downloadDetail">
                    <!--<img class="download-icon" src="../../../assets/img/download.png">-->
                    <span class="download-text">下载明细</span>
                </div>
                <div class="dateErrMsg">
                    <span v-if="!dateValidation.isAscendingOrder">结束日期不能早于起始日期</span>
                    <span v-if="!dateValidation.isIntervalProper">时间跨度不能超过31天</span>
                </div>
            </div>
            <div class="table-area">
                <table width="100%" class="table-body">
                    <tbody>
                    <tr>
                        <th v-for="item in tableHeadList">{{item.name}}</th>
                    </tr>

                    <tr v-for="item in queueOrderVOS">
                        <td class="fee-table-item" width="16%">{{item.queueTime}}</td>
                        <td class="fee-table-item" width="16%">{{item.orderViewId}}</td>
                        <td class="fee-table-item" width="8%">{{item.tableType}}</td>
                        <td class="fee-table-item" width="12%">{{item.queueNo}}</td>
                        <td class="fee-table-item" width="32%">{{item.orderStatus}}</td>
                        <td class="fee-table-item" width="16%">{{item.waitTime}}</td>
                    </tr>
                    <tr>
                        <td colspan="13" class="fee-table-item" v-if="queueOrderVOS.length === 0">暂无相关数据</td>
                    </tr>
                    </tbody>
                </table>
                <div class="pagination">
                    <pagination :given-page-count=this.pageCount :given-current-page=this.filterParameters.pageIndex :did-change-page="didChangePage" :type="'small'" :show-arrow-text="true" v-if=" this.pageCount > 0 "></pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

/* eslint-disable import/no-unresolved */
/* eslint-disable no-extend-native */
// eslint-disable-next-line
import { Pagination, Button } from '@dp/bee-ui';
import PageError from '../../shared/page-error.vue';
import DateRangeFilter from './date-range-filter.vue';
import { Ajax } from '../../../lib/utils.js';
// import { login } from '../../../lib/auth.js';
import getPath from '../../../lib/path.js';

export default {
    data() {
        return {
            shopInfo: {},
            userInfo: {},
            defaultButton: '今天',
            datePickerOptions: {
                allowInput: true,
                enableTime: false,
                time_24hr: true,
                enableConfirmButtons: false,
            },
            filterParameters: {
                dateType: 0,
                startTime: '',
                endTime: '',
                pageIndex: 1,
            },
            dateValidation: {
                isAscendingOrder: true,
                isIntervalProper: true,
            },
            tableHeadList: [
                {
                    name: '取号时间',
                },
                {
                    name: '订单编号',
                },
                {
                    name: '桌型',
                },
                {
                    name: '排队号',
                },
                {
                    name: '订单状态',
                },
                {
                    name: '等待时长',
                },
            ],
            queueOrderVOS: [],
            pageCount: 0,
        };
    },
    components: {
        'page-error': PageError,
        'date-range-filter': DateRangeFilter,
        pagination: Pagination,
        'bee-button': Button,
    },
    watch: {
        'filterParameters.startTime': 'validateDate',
        'filterParameters.endTime': 'validateDate',
    },
    methods: {
        getOrderList() {
            this.loading = this.$loading();
            Ajax.get({
                url: 'que_order',
                params: this.filterParameters,
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code.toString() === '200') {
                        this.queueOrderVOS = res.data.queueOrderVOS;
                        this.pageCount = res.data.pageCount;
                    //                    } else if (res.code.toString() === '308') {
                    //                        const url = res.data;
                    //                        window.location = url;
                    } else {
                        this.showToast('网络异常，请稍后重试！');
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.showToast('网络异常，请稍后重试！');
                },
            });
        },
        didChangePage(clickedPage) {
            this.filterParameters.pageIndex = clickedPage;
            this.getOrderList();
        },
        onStartSearching() {
            this.filterParameters.pageIndex = 1;
            this.getOrderList();
        },
        didChangeStartDate(val) {
            this.filterParameters.startTime = val;
        },
        didChangeEndDate(val) {
            this.filterParameters.endTime = val;
        },
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
            const result = this.checkDateStatus(this.filterParameters.startTime,
                this.filterParameters.endTime);
            this.dateValidation.isAscendingOrder = result.ascendingOrder;
            this.dateValidation.isIntervalProper = result.intervalProper;
        },
        downloadDetail() {
            const downloadUrl = `/que_order/download?dateType=${this.filterParameters.dateType}&startTime=${this.filterParameters.startTime}&endTime=${this.filterParameters.endTime}`;
            location.assign(`${getPath().ajax}${downloadUrl}`);
        },
        showToast(msg) {
            this.$toast({
                text: msg,
                duration: 2000,
            });
        },
    },
    mounted() {
        this.getOrderList();
        // this.loading = this.$loading();
        // login().then((item) => {
        //     this.loading.$stopLoading();
        //     this.shopInfo = {
        //         shopName: item.shop.shopName,
        //         shopId: item.shop.shopId,
        //         isIntellShop: item.shop.isIntellShop,
        //     };
        //     this.userInfo = {
        //         hasMultiShops: item.user.hasMultiShops,
        //         role: item.user.role,
        //     };
        //     this.getOrderList();
        // });
    },
};

</script>
<style  lang="less">
    @import '../../../assets/less/color';
    .table-container {
        .order-search-filter {
            padding-left: 10px;
            padding-top: 15px;
            padding-bottom: 15px;
            /*width: 100%;*/
            background-color: #f2f2f2;
            border: 1px solid #d9d9d9;
            margin: 20px;
            box-sizing: border-box;

            .download-button {
                line-height: 30px;
                height: 30px;
                float: right;
                display: inline-block;
                cursor: pointer;
                padding-right: 10px;
                .download-icon {
                    height: 12px;
                    width: 12px;
                }

                .download-text {
                    color: #2578E6;
                }
            }

            .dateErrMsg {
                margin-left: 335px;
                color: red;
                font-size: 12px;
            }
        }

        .table-area {
            margin-left: 20px;
            margin-right: 20px;
        }

        .table-body {
            border: 1px solid @mt-black-3;

            th {
                font-size: 12px;
                line-height: 1.5;
                color: @mt-black-8;
                padding: 10px;
                text-align: center;
                background-color: @mt-black-1;
                border: 1px solid @mt-black-3;
            }

            .fee-table-item {
                border: 1px solid @mt-black-3;
                padding: 10px;
                text-align: center;
                color: @text-normal;
                font-size: 13px;

                .detail-link {
                    text-align: center;
                }
            }
        }

        .pagination {
            padding: 10px 0px;
            float: right;
        }

    }
    .main {
        min-width: 960px;
        margin: 0 auto;
    }

</style>
