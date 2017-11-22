<template>
    <div class="need-invoice">
        <div class="header-container">
            <span class="header-title">待开票申请</span>
            <div class="header-download">
                <div class='qrcode-icon'></div>
                <!-- <i class="bee-icon bee-icon-qrcode middle-text"></i> -->
                <span class="header-title middle-text" @click="downloadQrImg = true">下载开票二维码</span>
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
                    <tr v-for="(item, key) in invoiceOrders" :key="key">
                        <td class="invoice-item" width="20%">{{item.addTime}}</td>
                        <td class="invoice-item" width="60%">{{item.companyName}}</td>
                        <td class="invoice-item see-detail" width="20%" @click='showDetailDialog(item)'>查看详情</td>
                    </tr>
                    <tr>
                        <td colspan="13" class="empty-default" v-if="invoiceOrders.length === 0">暂无开票申请</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <pagination :given-page-count="pageCount" :given-current-page="pageIndex" :did-change-page="didChangePage" :show-arrow-text="true" v-if="pageCount > 0 "></pagination>
            </div>
        </div>
        <qr-popup @close="downloadQrImg=false" v-if="downloadQrImg"></qr-popup>
        <info-dialog :show-info-dialog='showDetailMod' :invoice-info='infoData' @submit="applyInvoice" @close="hideDialog"></info-dialog>
    </div>
</template>

<script>
import { Pagination } from '@dp/bee-ui';
import invoiceModal from './invoice-detail-dialog.vue';
import QrPopup from './qrcode-popup.vue';
import { Ajax } from '../../../lib/utils.js';
import hybrid from './common.js';

export default {
    name: 'need-invoice',
    components: {
        'info-dialog': invoiceModal,
        'qr-popup': QrPopup,
        Pagination,
    },
    created() {
        this.getInvoiceInfoByPage(1);
        if (parseInt(this.$route.query.init, 10) === 1) {
            this.downloadQrImg = true;
            const hash = location.hash;
            const res = hash.split('?');
            location.href = location.origin + location.pathname + res[0];
        }
        hybrid.updateData = this.updateData;
    },
    watch: {
        pageCount(newCount) {
            let params = {};
            if (newCount === 0) {
                // 没有待开发票，去掉小红点
                /* eslint-disable quote-props */
                params = {
                    'func': 'showTabUnprocTip',
                    'isShow': 'false',
                };
            } else {
                params = {
                    'func': 'showTabUnprocTip',
                    'isShow': 'true',
                };
            }
            this.redPot(params);
        },
    },
    methods: {
        redPot(params) {
            if ('tabUnprocTipQuery' in window) {
                console.log('红点处理');
                console.log('参数', JSON.stringify(params));
                window.tabUnprocTipQuery({
                    request: JSON.stringify(params),
                    onSuccess() {
                    },
                    onFailure(errorCode, errorMessage) {
                        console.error(`Error:${errorMessage}`);
                    },
                });
            } else {
                console.error("Error: tabUnprocTipQuery isn't registered");
            }
        },
        updateData() {
            this.getInvoiceInfoByPage(1);
        },
        applyInvoice(val) {
            this.loading = this.$loading();
            Ajax.get({
                url: 'hobbit/warehouseman/ajax/openInvoice',
                params: {
                    viewId: val.viewId,
                },
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code === 200) {
                        this.$toast({
                            text: '处理成功',
                            duration: 1000,
                        });
                    } else {
                        this.$toast({
                            text: '操作失败，请稍候重试',
                            duration: 1000,
                        });
                    }
                    this.hideDialog();
                    this.getInvoiceInfoByPage(1);
                },
                error: () => {
                    this.loading.$stopLoading();
                },
            });
        },
        hideDialog() {
            this.showDetailMod = false;
        },
        showDetailDialog(val) {
            this.infoData = val;
            this.showDetailMod = true;
        },
        didChangePage(page) {
            this.pageIndex = page;
            this.getInvoiceInfoByPage(page);
        },
        getInvoiceInfoByPage(page) {
            this.loading = this.$loading();
            Ajax.get({
                url: 'hobbit/warehouseman/ajax/queryInvoiceList',
                params: {
                    status: 1,
                    pageSize: 6,
                    page,
                    orderType: 1,
                    r: +new Date(),
                },
                success: (res) => {
                    this.loading.$stopLoading();
                    this.pageIndex = res.data.pageNo;
                    this.invoiceOrders = res.data.fullInvoiceVOs;
                    this.pageCount = res.data.totalCount;
                },
                error: () => {
                    this.loading.$stopLoading();
                },
            });
        },
    },
    data() {
        return {
            showDetailMod: false,
            pageCount: 0,
            pageIndex: 0,
            downloadQrImg: false,
            infoData: {},
            invoiceOrders: [],
        };
    },
};
</script>

<style lang="less">
@import 'invoice.less';
.header-container {
    background: #FAFAFA;
    height: 35px;
    line-height: 35px;
    padding: 0px 25px;
    margin-top: 20px;
    .header-download {
        float: right;
        color: #168CEF;
        cursor: pointer;
        .qrcode-icon{
            width: 14px;
            height: 14px;
            display: inline-block;
            vertical-align: middle;
            background-image: url('../../../assets/img/qrcode-default.png');
            background-size: 100% 100%;
        }
        &:hover{
            color: #065EA7;
        }
        &:hover .qrcode-icon{
            background-image: url('../../../assets/img/qrcode-hover.png');
            background-size: 100% 100%;
        }
        .middle-text {
            vertical-align: middle;
        }
    }
    .header-title {
        font-size: 12px;
        height: 16px;
        display: inline-block;
        font-family: "微软雅黑";
        line-height: 16px;
    }
}

.invoice-table {
    margin: 20px 25px 15px 25px;
    display: block;
    color: #666;
    font-size: 14px;
    font-family: "微软雅黑";
}

.table-header {
    background: #FAFAFA;
    border: 1px solid #EAEAEA;
    .title {
        text-align: center;
        border-right: 1px solid #EAEAEA;
        height: 24px;
        line-height: 24px;
        padding: 8px 0px;
    }
}

.table-row {
    .row-item {
        border: 1px solid #EAEAEA;
        height: 24px;
        font-size: 14px;
        padding: 0 40px;
    }
}
</style>
