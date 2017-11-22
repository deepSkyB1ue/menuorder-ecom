<template>
    <div class="main-box">
        <div class="control-area">
            <date-range-picker :show-standalone-shortcuts="true"
                               :cur-type="29"
                               :shortcuts="shortcuts"
                               :pickerOptions="pickerOptions"
                               @select-callback="onDateRangeDidSelect"></date-range-picker>
            <a class="download-link"
               :href="getDownloadExcelAddress()">
                <img src="../../../../assets/img/download.png">下载明细
            </a>
        </div>
        <div class="table-area">
            <table>
                <thead>
                    <tr>
                        <th class="cell-time">打款时间</th>
                        <th class="cell-amount">打款金额</th>
                        <th class="cell-account">收款账号信息</th>
                        <th class="cell-period">结算周期</th>
                        <th class="cell-status">打款状态</th>
                        <th class="cell-action">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in itemVoList"
                        :key="task.taskId">
                        <td class="cell-time">{{ task.drawDate }}</td>
                        <td class="cell-amount">
                            <span>{{ task.drawAmount }}</span>
                            <span class='to-billpage' v-if='task.miaofuSettleAmount && task.otherSettleAmount' @click='toBillpage()'>查看打款单</span>
                            <div v-if='task.miaofuSettleAmount && task.otherSettleAmount'>（{{task.miaofuSettleAmount}} 秒付，{{task.otherSettleAmount}} 其他）</div>
                        </td>
                        <td class="cell-account">{{ task.bankInfo.title.length ? task.bankInfo.title : '--' }}
                            <a v-if="task.withdrawFlag"
                               :href="calculateWalletJumpAddress(task.bankInfo.value)">去提现</a>
                        </td>
                        <td class="cell-period">{{ task.settlePeriod }}</td>
                        <td class="cell-status"
                            :class="{ failed: task.drawCode == 20 }">{{ task.drawStatus }}</td>
                        <td class="cell-action">
                            <router-link :to="{ path: '/shop/financePaymentDetail', query: { taskId: task.taskId } }">查看详情</router-link>
                        </td>
                    </tr>
                    <tr v-if="!itemVoList.length&&this.currentDateType===0&&this.emptyStatusText">
                        <td colspan="100"
                            class="cell-no-result-info">{{this.emptyStatusText}}</td>
                    </tr>
                    <tr v-else-if="!itemVoList.length">
                        <td colspan="100"
                            class="cell-no-result-info">暂无相关数据</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination"
                 v-if="itemVoList.length">
                <pagination :given-page-count="pagination.totalPage"
                            :given-current-page="pagination.currentPage"
                            :did-change-page="onPageDidChange"
                            :type="'small'"></pagination>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable import/no-unresolved */

import { DateCombineRangePicker, Pagination } from '@dp/bee-ui'; // eslint-disable-line import/extensions
import { Ajax } from '@/lib/utils.js';
import { login } from '@/lib/auth.js';
import getEnv from '@/lib/env.js';
import getPath from '@/lib/path.js';
import cookie from '@/lib/cookie.js';
import moment from 'moment'; // eslint-disable-line import/extensions

const MAX_DATE_RANGE = 31;

export default {
    name: 'finance-payment',
    components: {
        'date-range-picker': DateCombineRangePicker,
        pagination: Pagination,
    },
    data() {
        return {
            startDateStr: moment().subtract(29, 'days').format('YYYY-MM-DD'),
            endDateStr: moment().format('YYYY-MM-DD'),
            shortcuts: [{
                text: '昨天',
                type: 1,
                endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            }, {
                text: '今天',
                type: 0,
            }, {
                text: '近7天',
                type: 6,
            }, {
                text: '近30天',
                type: 29,
            }],
            itemVoList: [],
            emptyStatusText: '',
            currentDateType: 29,
            totalPage: 0,
            pagination: {
                currentPage: 1,
                totalPage: 0,
            },
            fp: null,
            loading: {},
            pickerOptions: {
                clickToggles: true,
                enableConfirmButtons: true,
                disable: [
                    function (date) {
                        const now = new Date();
                        return date > now;
                    },
                ],
                onChange: this.handleOnChange,
            },
        };
    },
    methods: {
        toBillpage() {
            window.location = 'http://settle.meituan.com/payinfo/billList';
        },
        onPageDidChange(clickedPage) {
            this.pagination.currentPage = clickedPage;
            this.getWithdrawRecords(this.pagination.currentPage);
        },
        onDateRangeDidSelect(dateRange) {
            this.currentDateType = dateRange.curType;
            this.startDateStr = dateRange.fromDate;
            this.endDateStr = dateRange.toDate;
            if (this.validateDateRange()) {
                this.fp.set('minDate', null);
                this.fp.set('maxDate', null);
                this.pagination.currentPage = 1;
                this.getWithdrawRecords(this.pagination.currentPage);
            }
        },
        validateDateRange() {
            const startDate = new Date(this.startDateStr);
            const endDate = new Date(this.endDateStr);
            const dayDiff = parseInt((endDate - startDate) / (1000 * 60 * 60 * 24), 10);
            return dayDiff <= MAX_DATE_RANGE;
        },
        handleOnChange(selectedDates) {
            if (selectedDates.length === 0) {
                return;
            }
            const minDate = moment(selectedDates[0]).subtract(MAX_DATE_RANGE, 'days').format('YYYY-MM-DD');
            const maxDate = moment(selectedDates[0]).add(MAX_DATE_RANGE, 'days').format('YYYY-MM-DD');
            this.fp.set('minDate', minDate);
            this.fp.set('maxDate', maxDate);
        },

        calculateWalletJumpAddress(walletId) {
            const env = getEnv();
            const host = env === 'beta' ? `${location.protocol}//mpay.paymt.paydev.sankuai.com` : 'https://paymp.meituan.com';
            const bsid = cookie.getCookie('orderdish_bsid');
            return `${host}/mwallet/front/common/login-access?source=1&mwalletId=${walletId}&BSID=${bsid}&page=home`;
        },
        getDownloadExcelAddress() {
            return `${getPath().ajax}/finance/withdraw/excel?startDate=${this.startDateStr}&endDate=${this.endDateStr}`;
        },

        getWithdrawRecords(pageNumber) {
            this.loading = this.$loading();
            Ajax.get({
                url: 'finance/withdraw',
                // url:'http://localhost:3000/with-draw',
                params: {
                    startDate: this.startDateStr,
                    endDate: this.endDateStr,
                    pn: pageNumber,
                },
                success: (res) => {
                    this.loading.$stopLoading();
                    switch (res.code.toString()) {
                    case '200':
                        this.emptyStatusText = res.data.emptyStatusText;
                        this.itemVoList = res.data.itemVoList;
                        this.pagination.totalPage = res.data.totalPage;
                        break;
                    case '308':
                        if (res.data) {
                            window.location.href = res.data;
                        } else {
                            this.$toast({ text: '系统异常，请稍后重试', duration: 2000 });
                        }
                        break;
                    default:
                        this.$toast({ text: '系统异常，请稍后重试', duration: 2000 });
                        break;
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.$toast({ text: '系统异常，请稍后重试', duration: 2000 });
                },
            });
        },
    },
    mounted() {
        this.loading = this.$loading();
        this.fp = document.querySelector('.date-input')._flatpickr; // eslint-disable-line no-underscore-dangle
        login().then(() => {
            this.loading.$stopLoading();
            this.getWithdrawRecords(this.pagination.currentPage);
        });
    },
};
</script>

<style lang="less" scoped>
@import '~@dp/bee-ui/dist/styles/theme/ecom/index.css';

.main-box {
    padding: 20px;
    min-width: 960px;
    .control-area {
        margin-top: 8px;
        padding: 12px 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .download-link {
            cursor: pointer;
            color: #33c7b6;
            font-size: 12px;
        }
    }
    .table-area {
        table {
            border: 1px solid #eaeaea;
            width: 100%;
            thead {
                tr {
                    background-color: #fafafa;
                }
            }
            tr {
                height: 40px;
                &:hover {
                    background-color: #fafafa;
                }
            }
            th {
                font-size: 14px;
                color: #666;
                font-weight: normal;
                text-align: center;
                border: 1px solid #eaeaea;
            }
            td {
                font-size: 14px;
                color: #666;
                padding: 0 20px;
                border: 1px solid #eaeaea;
            }
            .cell-amount {
                text-align: center;
                font-size: 12px;
                .to-billpage{
                    color: #3dc6b6;
                    cursor: pointer;
                }
            }
            .cell-period {
                text-align: center;
            }
            .cell-status {
                text-align: center;
                &.failed {
                    color: #f76120;
                }
            }
            .cell-action {
                text-align: center;
            }
            .cell-no-result-info {
                text-align: center;
                color: #333;
            }
        }
        .pagination {
            margin-top: 10px;
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
