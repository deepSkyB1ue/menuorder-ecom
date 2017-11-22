<template>
<div>
    <div class="head">
        <div class="header">
            <span class="text">美团点评点餐|商家自入驻</span>
            <span class="logo"></span>
        </div>
        <div class="main">
            <p>手机点餐合作申请</p>
            <button class="apply-btn" @click="redirectApply">加入我们</button>
        </div>
    </div>
    <div class="center-box">
        <div class="title-block">
            <hr />
            <div class="text">申请流程</div>
        </div>
        <div class="step-list">
            <div class="step">
                <span>1</span>
                <p>提交审核</p>
                <ul>
                    <li>&#x2022; 录入门店基本信息</li>
                    <li>&#8226; 录入联系方式</li>
                    <li>&#8226; 提交审核</li>
                </ul>
            </div>
            <div class="step">
                <span class="step2">2<span class="workday">1-3个工作日</span></span>
                <p>通过审核</p>
                <ul>
                    <li>&#8226; 基本信息初审</li>
                    <li>&#8226; 电话联系沟通</li>
                    <li>&#8226; 资质信息补齐</li>
                </ul>
            </div>
            <div class="step">
                <span>3</span>
                <p>上线营业</p>
                <ul>
                    <li>&#8226; 完成配置和培训</li>
                    <li>&#8226; 正式上线</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="order-step">
        <div class="title-block">
            <hr />
            <div class="text">手机点餐流程</div>
        </div>
        <img src="../../../assets/img/diancanflow.png" />
    </div>
    <div class="center-box">
        <div class="title-block">
            <hr />
            <div class="text">合作商户</div>
        </div>
        <div class="pic-wall">
            <img src="../../../assets/img/cooperate-shop.png" />
        </div>
    </div>
    <div class="center-box footer">
        <button class="apply-btn" @click="redirectApply">加入我们</button>
    </div>
</div>
</template>
<script>
    import { getUrlParam, reportOperTime } from '../../../lib/utils.js';
    import whatever from '../../../lib/whatever-adaptor.js';

    export default {
        name: 'OrderApplyWelcome',
        methods: {
            redirectApply() {
                whatever.report({
                    pageId: 'orderdish_cooprate_landing_web',
                    action: 'click',
                    module: 'orderdish_cooprate_landing_web_want_click',
                    activity_code: getUrlParam('activity_code'),
                });

                setTimeout(() => {
                    location.href = `orderapply.html${location.search}`;
                }, 100);
            },
        },
        created() {
            whatever.sendPV({
                pageId: 'orderdish_cooprate_landing_web',
                module: 'orderdish_cooprate_landing_web',
                activity_code: getUrlParam('activity_code'),
            });
            reportOperTime({
                pageId: 'orderdish_cooprate_landing_web',
                module: 'cooperate_landing_operate_time',
            });
        },
        data() {
            return {};
        },
    };
</script>
<style lang="less">
@import './order-apply-welcome.less';
</style>
