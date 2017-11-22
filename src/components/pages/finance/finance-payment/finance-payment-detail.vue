<template>
    <div class="main">
        <div class="head-info">
            <div class="link-path">
                <router-link :to="'/shop/financePayment'">财务结款</router-link>
                >打款详情
            </div>
            <a class="download-button"
               :href="calculateDownloadExcelAddress()">
                <img class="download-icon"
                     src="../../../../assets/img/download.png">
                <span class="download-text">下载明细</span>
            </a>
        </div>
        <div class="table-area">
            <table width="100%"
                   class="table-body">
                <tbody>
                    <tr>
                        <th v-for="(item, index) in paymentTableHeadList"
                            :key="index">{{ item.name }}</th>
                    </tr>
                    <tr>
                        <td class="fee-table-item">{{ withdrawRecordItemVO.drawDate }}</td>
                        <td class="fee-table-item">{{ withdrawRecordItemVO.miaofuSettleAmount ? withdrawRecordItemVO.miaofuSettleAmount : withdrawRecordItemVO.drawAmount }}</td>
                        <td class="fee-table-item">{{ withdrawRecordItemVO.bankInfo && withdrawRecordItemVO.bankInfo.title ? withdrawRecordItemVO.bankInfo.title : '--' }}</td>
                        <td class="fee-table-item">{{ withdrawRecordItemVO.settlePeriod }}</td>
                        <td class="fee-table-item">{{ withdrawRecordItemVO.drawStatus }}</td>
                    </tr>
                </tbody>
            </table>
            <table width="100%"
                   class="table-body">
                <tbody>
                    <tr>
                        <th v-for="(item, index) in orderTableHeadList"
                            :key="index">{{item.name}}</th>
                    </tr>

                    <tr v-for="item in shopOrderIncomeVOs"
                        :key="item.recordId">
                        <td class="fee-table-item">{{ item.recordId }}</td>
                        <td class="fee-table-item">{{ item.payTime }}</td>
                        <td class="fee-table-item">{{ item.shopName }}</td>
                        <td class="fee-table-item">{{ item.merchantAmount }}</td>
                        <td class="fee-table-item">{{ item.consumptionAmount }}</td>
                        <td class="fee-table-item">{{ item.discountAmount }}</td>
                        <td class="fee-table-item">{{ item.prePaidAmount }}</td>
                        <td class="fee-table-item">{{ item.integralDeductionAmount }}</td>
                        <td class="fee-table-item">{{ item.malingAmount }}</td>
                        <td class="fee-table-item">{{ item.totalRefundAmount }}</td>
                        <td class="fee-table-item">{{ item.commissionAmount }}</td>
                    </tr>
                    <tr v-if="!shopOrderIncomeVOs.length">
                        <td colspan="100"
                            class="fee-table-item no-result-info">暂无相关数据</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination">
            <pagination :given-page-count="pagination.totalPages"
                        :given-current-page="params.pn"
                        :did-change-page="handlePageDidChange"
                        :type="'small'"></pagination>
        </div>
    </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
import { Pagination } from '@dp/bee-ui'; // eslint-disable-line import/extensions
import { Ajax } from '@/lib/utils.js';
import getPath from '@/lib/path.js';

export default {
    data() {
        return {
            params: {
                taskId: this.$route.query.taskId,
                pn: 1,
            },
            loading: null,
            withdrawRecordItemVO: [],
            shopOrderIncomeVOs: {},
            paymentTableHeadList: [
                {
                    name: '打款时间',
                },
                {
                    name: '打款金额',
                },
                {
                    name: '收款账号信息',
                },
                {
                    name: '结算周期',
                },
                {
                    name: '打款状态',
                },
            ],
            orderTableHeadList: [
                {
                    name: '订单编号',
                },
                {
                    name: '支付时间',
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
            ],
            pagination: {
                totalRecord: 0,
                totalPages: 1,
            },
        };
    },
    components: {
        pagination: Pagination,
    },
    created() {
        this.getPaymentDetailInfo();
    },
    methods: {
        handlePageDidChange(clickedPage) {
            this.params.pn = clickedPage;
            this.getPaymentDetailInfo();
        },

        calculateDownloadExcelAddress() {
            return `${getPath().ajax}/finance/withdraw/detail/excel?taskId=${this.params.taskId}`;
        },

        getPaymentDetailInfo() {
            this.loading = this.$loading();
            Ajax.get({
                url: 'finance/withdraw/detail',
                // url:'http://localhost:3000/fiance-payment',
                params: this.params,
                success: (res) => {
                    this.loading.$stopLoading();
                    switch (res.code.toString()) {
                    case '200':
                        this.withdrawRecordItemVO = res.data.withdrawRecordItemVO;
                        this.shopOrderIncomeVOs = res.data.shopOrderIncomeVOs;
                        this.pagination = res.data.pagination;
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
};
</script>

<style lang="less" scoped>
@import '../../../../assets/less/color';
@import '~@dp/bee-ui/dist/styles/theme/ecom/index.css';

.main {
    min-width: 960px;
    margin: 0 auto;
    .head-info {
        margin: 17px 20px 11px 20px;
        .link-path {
            font-size: 12px;
            display: inline-block;
        }
        .download-button {
            line-height: 18px;
            height: 18px;
            float: right;
            .download-icon {
                height: 12px;
                width: 12px;
            }
            .download-text {
                color: @mt-green-light;
            }
        }
    }
    .table-area {
        margin-left: 20px;
        margin-right: 20px;
        .fee-table {
            margin-bottom: 20px;
            width: 100%;
        }
    }
    .table-body {
        border: 1px solid @mt-black-3;
        margin: 0 0 20px 0;
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
            &.no-result-info {
                text-align: center;
                color: #333;
            }
        }
    }
    .pagination {
        padding: 10px 10px;
        float: right;
        margin-right: 10px;
    }
}
</style>
