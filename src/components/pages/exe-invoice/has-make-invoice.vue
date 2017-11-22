<template>
    <div>
        <!-- <div class='search-cont'>
            <input type="text" class='input-search'>
            <bee-button class='search-btn' text="确定" type="btn-solid-small-green-normal" @click="searchVoice"></bee-button>
        </div> -->
        <div class='time-filter'>
            <date-range-filter :datepicker-options="datePickerOptions" :default-button="defaultButton" :validate="!(dateValidation.isIntervalProper && dateValidation.isAscendingOrder)" @startDateChanged="didChangeStartDate" @endDateChanged="didChangeEndDate" @selectCallback="onStartSearching">
            </date-range-filter>
            <div class='download-qrcode'>
                <!-- <i class="bee-icon bee-icon-qrcode middle-text"></i> -->
                <div class='qrcode-icon'></div>
                <div class='download-word' @click='downloadQrImg.showPopup=true'>下载开票二维码</div>
            </div>
        </div>
        <div class="table-invoice">
            <table width="100%" class="table-body">
                <tbody>
                    <tr>
                        <th width="20%">申请时间</th>
                        <th width="60%">企业名称</th>
                        <th width="20%" class="th-handle">操作</th>
                    </tr>

                    <tr v-for="item in invoiceOrders">
                        <td class="invoice-item" width="20%">{{item.addTime}}</td>
                        <td class="invoice-item" width="60%">{{item.companyName}}</td>
                        <td class="invoice-item see-detail" width="20%" @click='seeDetail(item)'>查看详情</td>
                    </tr>
                    <tr>
                        <td colspan="13" class="empty-default" v-if="invoiceOrders.length === 0">暂无开票申请</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <pagination :given-page-count="pageCount" :given-current-page="pageIndex" :did-change-page="didChangePage" :show-arrow-text="true" v-if="this.pageCount > 0 "></pagination>
            </div>
        </div>
        <qr-popup @close='downloadQrImg.showPopup=false' v-if="downloadQrImg.showPopup"></qr-popup>
        <info-dialog :done='true' :show-info-dialog='showInvoiceDialog' :invoice-info='infoData' v-if='showInvoiceDialog' @close='showInvoiceDialog =false'></info-dialog>
    </div>
</template>
<script>
import { Pagination, Button } from '@dp/bee-ui';
import DateRangeFilter from '../order-query/date-range-filter.vue';
import QrPopup from './qrcode-popup.vue';
import invoiceModal from './invoice-detail-dialog.vue';
import { Ajax } from '../../../lib/utils.js';

export default {
    data() {
        return {
            downloadQrImg: {
                showPopup: false,
            },
            showInvoiceDialog: false,
            infoData: {},
            shopInfo: {},
            defaultButton: '今天',
            datePickerOptions: {
                allowInput: true,
                enableTime: false,
                time_24hr: true,
                enableConfirmButtons: false,
                disable: [
                    function (date) {
                        const now = new Date();
                        const before = new Date(Date.now() - (90 * 1000 * 24 * 3600));
                        return date > now || date < before;
                    },
                ],

            },
            dateValidation: {
                isAscendingOrder: true,
                isIntervalProper: true,
            },
            invoiceOrders: [
            ],
            queryParams: {
                startDate: '',
                endDate: '',
                status: 2, // 已开票
                pageSize: 6,
                page: 1,
                orderType: -1, // 1:正序，-1：倒序，其他：不排序
            },
            pageCount: 0,
            pageIndex: 1,
        };
    },
    watch: {
        'queryParams.startDate': 'validateDate',
        'queryParams.endDate': 'validateDate',
    },
    mounted() {
        this.getHasMakeVoice();
    },
    methods: {
        validateDate() {
            const startDate = this.queryParams.startDate;
            const endDate = this.queryParams.endDate;
            if (startDate > endDate) {
                this.dateValidation.isAscendingOrder = false;
            } else {
                this.dateValidation.isAscendingOrder = true;
            }
            const chooseDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
            if (chooseDays > 30) {
                this.dateValidation.isIntervalProper = false;
                this.$toast({ text: '查询时间限制在30天以内，请重新选择日期', duration: 2000 });
            } else {
                this.dateValidation.isIntervalProper = true;
            }
        },
        didChangeStartDate(date) {
            this.queryParams.startDate = new Date(`${date} 00:00`).getTime();
        },
        didChangeEndDate(date) {
            this.queryParams.endDate = new Date(`${date} 23:59`).getTime();
        },
        onStartSearching() {
            this.queryParams.page = 1;
            this.getHasMakeVoice();
        },
        searchVoice() {
            this.getHasMakeVoice();
        },
        seeDetail(item) {
            this.showInvoiceDialog = true;
            this.infoData = item;
        },
        didChangePage(val) {
            this.queryParams.page = val;
            this.getHasMakeVoice();
        },
        getHasMakeVoice() {
            this.loading = this.$loading();
            Ajax.get({
                url: 'queryInvoiceList',
                params: this.queryParams,
                success: (res) => {
                    this.loading.$stopLoading();
                    this.invoiceOrders = res.data.fullInvoiceVOs || [];
                    this.pageCount = res.data.totalCount;
                },
                error: () => {
                    this.loading.$stopLoading();
                },
            });
        },
    },
    components: {
        'date-range-filter': DateRangeFilter,
        'qr-popup': QrPopup,
        'info-dialog': invoiceModal,
        'bee-button': Button,
        pagination: Pagination,
    },
};
</script>
<style lang='less'>
@import 'invoice.less';
.tab-table .tab-button.selected-button{
    background-color: #168cef !important ;
    color: white;
    border: 1px solid #168cef !important;
}
.btn-solid-small-green-normal{
    background-color: #168cef !important ;
}
</style>
