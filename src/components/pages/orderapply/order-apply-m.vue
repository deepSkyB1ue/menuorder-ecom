<template>
    <div class="quick-register">
        <div>
            <div class="form-header">
                <img class="header-logo" src="../../../assets/img/shopcoopm-header.png" v-if="status === 0">
            </div>
            <div class="cell-header">
                <label for="">申请信息</label>
            </div>
            <div v-if="status === 0">
                <div class="control-group-city" v-bind:class="{'error-status' : errorStatus.cityNameErrStatus}" @click="onCityInputClick">
                    <label for="">餐厅所在城市</label>
                    <div class="orientation-doing" v-if="!orientationCompleted">
                        <img class="orientation-img" src="../../../assets/img/orientation.png"/>
                        <span class="note-text">定位中……</span>
                    </div>
                    <div class="orientation-done" ref="orientationDone" v-else-if="orientationCompleted && orientationSucceed && !hasSelectedCity">
                        <div class="orientation-img"><img src="../../../assets/img/orientation.png"></div>
                        <div class="city-info">
                            <div class="city-name">{{ shopCooperateVO.cityName }}</div>
                            <div class="city-sub">当前定位城市</div>
                        </div>
                    </div>
                    <div class="orientation-fail" ref="orientationFail" v-else-if="orientationCompleted && !orientationSucceed && !hasSelectedCity">
                        <img class="orientation-img" src="../../../assets/img/orientation.png"/>
                        <span class="note-text">定位失败，请手动选择</span>
                    </div>

                    <div class="manual-chosen" ref="manualChosen" v-else>{{shopCooperateVO.cityName}}</div>
                    <div class="manual-img"><img src="../../../assets/img/rectangle.png"></div>
                    <div class="error-msg-label" v-if="errorStatus.cityNameErrStatus">
                        <label>请选择城市</label>
                    </div>

                </div>
                <div class="control-group-normal" v-bind:class="{'error-status' : errorStatus.shopNameErrStatus}">
                    <label>餐厅名</label>
                    <input type="text" class="input-plain shop-name" placeholder="请输入餐厅名称" data-regx="^\s*([\u4e00-\u9fa5a-zA-Z0-9（）()]+\s?)+$" data-empty="请输入餐厅名称" data-format="餐厅名称格式有误" required v-model="shopCooperateVO.shopName" @click="errorStatus.shopNameErrStatus=0"/>
                    <div class="error-msg-label" v-if="errorStatus.shopNameErrStatus">
                        <label>请选择输入餐厅名</label>
                    </div>
                </div>

                <div class="control-group-selection">
                    <div class="radio-title">
                        <label for="">您的餐厅想开通的是</label>
                    </div>
                    <div class="radio-selection">
                        <div class="ratio-wrap">
                            <input type="radio" value="10" v-model="shopCooperateVO.businessType">
                            <span class="radio-input-item">扫码付款</span>
                        </div>
                        <div class="ratio-wrap">
                            <input type="radio" value="0" v-model="shopCooperateVO.businessType">
                            <span class="radio-input-item">手机点餐</span>
                        </div>
                        <div class="ratio-wrap">
                            <input type="radio" value="100" v-model="shopCooperateVO.businessType">
                            <span class="radio-input-item">两者都要</span>
                        </div>
                    </div>
                </div>

                <div class="control-group-selection last">
                    <div class="radio-title">
                        <label for="">餐厅是否有收银系统</label>
                    </div>
                    <div class="radio-selection">
                        <div class="ratio-wrap">
                            <input type="radio" value="有" v-model="shopCooperateVO.posType">
                            <span class="radio-input-item">有收银</span>
                        </div>
                        <div class="ratio-wrap">
                            <input type="radio" value="没有" v-model="shopCooperateVO.posType">
                            <span class="radio-input-item">没有收银</span>
                        </div>
                        <div class="ratio-wrap">
                            <input type="radio" value="不清楚" v-model="shopCooperateVO.posType">
                            <span class="radio-input-item">不清楚</span>
                        </div>
                    </div>
                </div>

                <div class="cell-header">
                    <label for="">联系方式</label>
                </div>

                <div class="control-group-normal" v-bind:class="{'error-status' : errorStatus.contactErrStatus}">
                    <label for="">联系人</label>
                    <input type="text" class="input-plain contact" placeholder="请输入联系人姓名，方便后续为您服务" data-regx="^\s*([\u4e00-\u9fa5a-zA-Z0-9（）()]+\s?)+$" data-empty="请输入联系人姓名" data-format="联系人格式有误" required v-model="shopCooperateVO.contact" @click="errorStatus.contactErrStatus=0"/>
                    <div class="error-msg-label" v-if="errorStatus.contactErrStatus">
                        <label>请输入联系人</label>
                    </div>
                </div>

                <div class="form-group">
                    <div class="control-group relative" v-bind:class="{'error-status' : errorStatus.mobileErrStatus}">
                        <label for="">手机号</label>
                        <input type="text" class="input-plain" data-regx="^1\d{10}$" pattern="\d*" placeholder="请输入您的手机号" data-empty="请输入手机号" data-format="手机号码格式有误" required v-model="shopCooperateVO.mobile" @click="errorStatus.mobileErrStatus=0"/>
                        <button type="submit" class="send-code-btn" @click="sendCode" ref="sendCodeBtn" :disabled="disableSendBtn">{{sendCodeMsg}}</button>
                        <div class="error-msg-label" v-if="errorStatus.mobileErrStatus">
                            <label>{{mobileErrInfo}}</label>
                        </div>
                    </div>
                    <div class="control-group" v-bind:class="{'error-status' : errorStatus.verifyCodeErrStatus}">
                        <label>验证码</label>
                        <input class="input-plain" type="text" pattern="\d*" placeholder="请输入手机验证码" required v-model="shopCooperateVO.verifyCode" @click="errorStatus.verifyCodeErrStatus=0">
                        <div class="error-msg-label" v-if="errorStatus.verifyCodeErrStatus">
                            <label>验证码错误</label>
                        </div>
                    </div>
                </div>

                <div class="form-group btn-group">
                    <div class="control-group">
                        <button type="button" :disabled="!submitEnabled" class="register-btn submit" @click="postApply">提交</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="status">
            <div class="form-group btn-group success-group">
                <div class="success-container">
                    <img class="logo-success" alt="" src="../../../assets/img/shopcoopm-success.png">
                    <div class="msg-success">您的需求已提交成功</div>
                    <div class="tips-success">我们将在三个工作日内与您联系</div>
                    <img class="logo-progress" alt="" src="../../../assets/img/shopcoopm-progress.png">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import orderApplyM from './order-apply-m.js';
    import orderApplyBase from './order-apply-base.js';
    import { isMiaofuPage, reportOperTime, getLocation } from '../../../lib/utils.js';

    const jsonp = require('jsonp');

    const orderApplyMObj = Vue.extend({
        mixins: [orderApplyM, orderApplyBase],
        watch: {
            'shopCooperateVO.verifyCode': 'checkSubmitButtonStatus',
        },
        created() {
            if (this.$route && this.$route.meta.source === 'miaofu') {
                // 秒付H5打点
                this.initWhatever({
                    pageId: 'orderdish_mfcooperate_h5',
                    submitModule: 'orderdish_mfcooperate_h5_submit_click',
                });
            } else {
                // 点餐H5打点
                this.initWhatever({
                    pageId: 'orderdish_cooperate_h5',
                    submitModule: 'orderdish_cooperate_h5_submit_click',
                });
            }
            this.sendPV();

            reportOperTime({
                pageId: 'orderdish_mfcooperate_h5',
                module: 'order_applyH5_operate_time',
            });
        },
        mounted() {
            this.restoreInputContentFromTemp();
            if (!this.orientationCompleted) {
                this.onOrientationStart();
            }
        },
        methods: {
            onOrientationStart() {
                const self = this;
                const data = {};
                getLocation({
                    success(e) {
                        data.lat = e.lat || 0; // 纬度
                        data.lng = e.lng || 0; // 经度
                        self.obtainCityName(data);
                    },
                    fail() {
                        data.lat = 0; // 纬度
                        data.lng = 0; // 经度
                        self.orientationSucceed = false;
                        self.orientationCompleted = true;
                    },
                });
            },
            obtainCityName(data) {
                const self = this;
                const key = 'EDbaac610a111b8cdf7886a1118d87c6';
                const apiUrl = `https://api.map.baidu.com/geocoder/v2/?ak=${key}&location=${data.lat},${data.lng}&output=json&pois=1`;
                jsonp(apiUrl, null, (err, resData) => {
                    if (err) {
                        self.showToast('网络错误，请稍后再试');
                    } else {
                        self.orientationCity = resData.result.addressComponent.city;
                        self.shopCooperateVO.cityName = resData.result.addressComponent.city;
                        self.orientationSucceed = true;
                    }
                    self.orientationCompleted = true;
                });
            },
            onCityInputClick() {
                this.errorStatus.cityNameErrStatus = 0;
                this.saveInputContentToTemp();
                if (this.$router) {
                    this.$router.replace('/orderapply/m/miaofu/city');
                } else {
                    window.location.replace('orderapplycity.html');
                }
            },
            saveInputContentToTemp() {
                sessionStorage.setItem('shopCooperateVO', JSON.stringify(this.shopCooperateVO));
                sessionStorage.setItem('errorStatus', JSON.stringify(this.errorStatus));
                sessionStorage.setItem('orientationCompleted', JSON.stringify(this.orientationCompleted));
                sessionStorage.setItem('orientationCity', JSON.stringify(this.orientationCity));
            },
            restoreInputContentFromTemp() {
                const shopCooperateVO = JSON.parse(
                    sessionStorage.getItem('shopCooperateVO'),
                );
                if (shopCooperateVO) {
                    this.shopCooperateVO = shopCooperateVO;
                }
                const errorStatus = JSON.parse(
                    sessionStorage.getItem('errorStatus'),
                );
                if (errorStatus) {
                    this.errorStatus = errorStatus;
                }
                const orientationSucceed = JSON.parse(
                    sessionStorage.getItem('orientationSucceed'),
                );
                if (orientationSucceed) {
                    this.orientationSucceed = orientationSucceed;
                    this.orientationCompleted = true;
                    const orientationCity = JSON.parse(sessionStorage.getItem('orientationCity'));
                    this.orientationCity = orientationCity;
                    this.shopCooperateVO.cityName = orientationCity;
                }

                const selectedCityName = sessionStorage.getItem('selectedCityName');
                if (selectedCityName && selectedCityName.length > 0) {
                    this.orientationCompleted = true;
                    this.hasSelectedCity = true;
                    this.shopCooperateVO.cityName = selectedCityName;
                }
                sessionStorage.clear();
            },
            checkSubmitButtonStatus() {
                if (this.shopCooperateVO.verifyCode === '') {
                    this.submitEnabled = false;
                } else {
                    this.submitEnabled = true;
                }
            },
        },
        computed: {
            cityInputPlaceholder() {
                return isMiaofuPage() ? '请选择城市' : '请输入城市';
            },
        },
    });
    export default orderApplyMObj;
</script>
<style lang="less">
@import './order-apply-m.less';
</style>
