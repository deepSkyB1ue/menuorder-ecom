<template>
    <bee-popup title="开票详情" :visible="show" @close="close">
        <div class="pop-content-wrapper" slot="pop-content">
            <div>
                <div class="detail-item" v-for="(value, key) in showData" :key="key">
                    <a v-if="value" :id="key" class="info-text item-handle" :data-clipboard-text='value' @click="(e)=>copy(e, key)">复制</a>
                    <span class="info-text item-title">{{keysObj[key]}}</span>
                    <span v-if="value" class="info-text item-info">{{value}}</span>
                </div>
            </div>
            <div class="btn-container">
                <bee-button v-if="done" text='已开票' type='btn-medium-disable' disabled></bee-button>
                <bee-button v-else text='确定已开票' type='btn-medium-normal-green' @click="submit"></bee-button>
            </div>
        </div>
    </bee-popup>
</template>

<script>
import { Popup, Button } from '@dp/bee-ui';
import Clipboard from 'clipboard';
import Toast from '../../ui-base/toast/index';

export default {
    name: 'invoice-modal',
    props: {
        showInfoDialog: {
            type: Boolean,
            default: false,
        },
        invoiceInfo: Object,
        done: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        copy(event, str) {
            const id = `#${str}`;
            const clipboard = new Clipboard(id);
            clipboard.on('success', (e) => {
                Toast({
                    text: '复制成功',
                    duration: 1000,
                });
                e.clearSelection();
                clipboard.destroy();
            });
            clipboard.on('error', (e) => {
                Toast({
                    text: '复制失败，请重试',
                    duration: 1000,
                });
                e.clearSelection();
                clipboard.destroy();
            });
        },
        submit() {
            this.$emit('submit', this.detailInfo);
        },
        close() {
            this.$emit('close');
        },
    },
    components: {
        'bee-popup': Popup,
        'bee-button': Button,
    },
    watch: {
        showInfoDialog(newVal) {
            this.show = newVal;
        },
        invoiceInfo(newInfo) {
            this.detailInfo = newInfo;
        },
    },
    computed: {
        showData: function () { // eslint-disable-line
            const obj = {
                companyName: this.detailInfo.companyName,
                taxNum: this.detailInfo.taxNum,
                address: this.detailInfo.address,
                registerPhone: this.detailInfo.registerPhone,
                bank: this.detailInfo.bank,
                account: this.detailInfo.account,
            };
            return obj;
        },
    },
    data() {
        return {
            detailInfo: this.invoiceInfo,
            keysObj: {
                companyName: '企业名称',
                taxNum: '企业税号',
                address: '详细地址',
                registerPhone: '注册电话',
                bank: '开户银行',
                account: '开户账号',
            },
            show: this.showInfoDialog,
        };
    },
};
</script>

<style lang='less'>
    @import '~@dp/bee-ui/dist/styles/theme/exe/index.css';
    .detail-item {
        position: relative;
        .item-handle {
            float: right;
            color: #168CEF;
            cursor: pointer;
        }
    }
    .info-text {
        display: inline-block;
        line-height: 32px;
        font-size: 14px;
        font-family: "微软雅黑";
    }
    .item-title {
        margin-right: 20px;
        color: #999;
    }
    .item-info {
        color: #333;
        width: 200px;
        margin-right: 100px;
        word-wrap: break-word;
        word-break: normal;
        vertical-align: top;
    }
    .pop-content-wrapper {
        height: 100%;
        position: relative;
    }
    .content-container {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .btn-container {
        text-align: center;
        margin-top: 35px;
    }
</style>
