<template>
<div class="center-block">
    <p class="title">{{title}}</p>
    <div class="apply-order-form">
        <div class="input-block">
            <label><span class="required">*</span><span class="input-label">商户名</span></label>
            <input class="input-search-large" type="text" placeholder="请输入商户名" v-model="shopCooperateVO.shopName">
        </div>
        <div class="input-block">
            <label><span class="required">*</span><span class="input-label">门店数量</span></label>
            <input class="input-search-large" type="text" placeholder="请输入门店数量" v-model="shopCooperateVO.shopCount">
        </div>
        <div class="input-block">
            <label><span class="required">*</span>城市</label>
            <input class="input-search-large" type="text" placeholder="请输入城市名" v-model="shopCooperateVO.cityName">
        </div>
        <div class="input-block">
            <label><span class="required">*</span>联系人</label>
            <input class="input-search-large" type="text" placeholder="请输入联系人姓名" v-model="shopCooperateVO.contact">
        </div>
        <div class="input-block">
            <label><span class="required">*</span>职务</label>
            <input class="input-search-large" type="text" placeholder="请输入联系人职务" v-model="shopCooperateVO.duty">
        </div>
        <router-view @changePosType="getPosType" name="miaofu-postype"></router-view>
        <div class="input-block">
            <label><span class="required">*</span>手机号</label>
            <input class="input-search-large" type="text" placeholder="请输入手机号" v-model="shopCooperateVO.mobile">
            <button type="submit" class="send-code-btn" @click="sendCode" ref="sendCodeBtn" :disabled="disableSendBtn">{{sendCodeMsg}}</button>
        </div>
        <div class="input-block verify-block" v-show="showVerifyBlock">
            <label><span class="required">*</span>验证码</label>
            <input class="input-search-large" type="text" placeholder="请输入验证码" v-model="shopCooperateVO.verifyCode">
            <span class="error-verify-code" v-show="showCodeErr">验证码错误</span>
        </div>
        <button class="btn-medium-normal-green btn-submit" @click="postApply">提交</button>
    </div>
    <div class="logo"></div>
</div>
</template>
<script>
    import Vue from 'vue';
    import orderApplyPc from './order-apply.js';
    import orderApplyBase from './order-apply-base.js';
    import { reportOperTime } from '../../../lib/utils.js';

    const orderApplyObj = Vue.extend({
        mixins: [orderApplyPc, orderApplyBase],
        created() {
            if (this.$route && this.$route.meta.source === 'miaofu') {
                // 秒付Web打点
                this.initWhatever({
                    pageId: 'orderdish_mfcooperate_web',
                    submitModule: 'orderdish_mfcooperate_web_submit_click',
                });
            } else {
                // 点餐Web打点
                this.initWhatever({
                    pageId: 'orderdish_cooperate_web',
                    submitModule: 'orderdish_cooperate_web_submit_click',
                });
            }
            this.sendPV();
            reportOperTime({
                pageId: 'orderdish_mfcooperate_web',
                module: 'order_applyWeb_operate_time',
            });
        },
    });
    export default orderApplyObj;
</script>
<style lang="less">
@import './order-apply.less';
</style>
