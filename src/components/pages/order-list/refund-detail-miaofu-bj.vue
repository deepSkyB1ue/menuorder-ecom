<template>
<div>
    <ui-popup class='refund-detail-bj pop-panel' :visible="popupInfo.visible" :title="popupInfo.title" @close="hidePopInfo">
        <div slot='pop-content'>
            <div class="content">
                <div class='refund-word'>退款金额</div>
                <div class='price-cont'>
                    <span>实收：</span><span>{{refundPrice}}</span>
                    <span class='refund-price'>退款：</span><span class='text-orange'>{{refundPrice}}</span>
                </div>
                <div class='refund-reason-title'>退款原因（必填）</div>
                <div class='radio-item' v-for='(reason,index) in reasonList'>
                    <input type="radio" class='bee-icon bee-icon-checkbox' name='refund-reason' :checked='index===0' @click='setReason(reason)'><span class='reason-item'>{{reason}}</span>
                </div>
            </div>
            <div class="button-cont">
                <ui-button text="取消" type="btn-solid-small-green-normal" @click='hidePopInfo()'/>
                <ui-button text="确认退款" type="btn-solid-small-green-normal" @click='refundConfirm()'/>
            </div>
        </div>
    </ui-popup>
    <bee-confirm 
    :title='confirm.title' 
    :visible='confirm.visible' 
    :content='confirm.content' 
    :confirmText='confirm.confirmText' 
    :cancelText='confirm.cancelText' 
    :mode='confirm.mode' 
    @close='closeConfirm'></bee-confirm>
</div>
</template>
<script>
/* eslint-disable import/no-unresolved */
import Popup from '@/components/ui-base/popup/popup.vue';
// import Comfirm from '@/components/ui-base/confirm/confirm.js';
import {
    Button, Confirm,
} from '@dp/bee-ui';
import { Ajax } from '@/lib/utils.js';

export default {
    data() {
        return {
            popupInfo: {
                visible: true,
                title: '退款处理',
            },
            reasonList: ['下错菜品', '买错桌台', '其他原因'],
            chooseReason: '下错菜品',
            refundPrice: '',
            shopId: '',
            orderId: '',
            authCode: '',
            confirm: {
                title: '',
                content: '',
                confirmText: '确认',
                cancelText: '取消',
                visible: false,
                mode: true,
            },
        };
    },
    methods: {
        closeConfirm() {
            this.confirm.visible = false;
        },
        hidePopInfo() {
            this.popupInfo.visible = false;
        },
        setReason(reason) {
            this.chooseReason = reason;
        },
        refundConfirm() {
            this.loading = this.$loading();
            this.popupInfo.visible = false;
            Ajax.post({
                url: `${this.shopId}/order/${this.orderId}/refundBjHackOrder`,
                params: {
                    userOrderId: this.orderId,
                    refundAmount: this.refundPrice,
                    refundReason: this.chooseReason,
                    authCode: this.authCode || '',
                },
                timeout: 15000,
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code === '200') {
                        this.$toast({ text: res.msg, duration: 2000 });
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else if (res.code === '500') {
                        const title = (res.data && res.data.title) ? res.data.title : '发起退款失败';
                        const msg = (res.data && res.data.msg) ? res.data.msg : (res.msg || '发起退款失败，请稍后重试');
                        this.confirm.title = title;
                        this.confirm.content = msg;
                        this.confirm.visible = true;
                    } else {
                        this.$toast({ text: res.msg || '服务器出错', duration: 2000 });
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.$toast({ text: '服务器异常', duration: 2000 });
                },
            });
        },
    },
    components: {
        'ui-popup': Popup,
        'ui-button': Button,
        'bee-confirm': Confirm,
    },
};
</script>

<style lang='less'>

.refund-detail-bj {
    color:#999;
    .content-container {
        padding: 30px 50px 20px 50px;
        word-break: break-all;
        max-width: 500px;
        min-width: 300px;
    }
    .refund-word{
        font-size: 16px;
    }
    .price-cont{
        font-size: 13px;
        .refund-price{
            margin-left: 20px;
        }
        .text-orange{
            color:#FF9A00;
        }
    }
    .refund-reason-title{
        margin-top:20px;
        font-size: 16px;
    }
    .radio-item {
        margin:10px 0;
        .reason-item{
            margin-left: 10px;
        }
    }
    .button-cont{
        text-align: center;
    }
}



</style>
