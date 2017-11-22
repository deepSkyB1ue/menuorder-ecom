<template>
    <div class="sale-nav-top">
        <ul class="sale-nav-list">
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}category">上架菜品/分类</a></li>
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}dish">全部菜品</a></li>
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}dishDiscount">菜品优惠</a></li>
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}query">订单管理</a></li>
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}config">点单服务时间</a></li>
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}tableCode">桌号设置</a></li>
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}printerConfig">云打印机设置</a></li>
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}shopInfoConfig">门店情况</a></li>
            <li v-if="shopType==1 || shopType==11"><a class="sale-nav-list-item" href="${ruleUrlPrefix}blacklist">黑名单设置</a></li>
            <li><a class="sale-nav-list-item" href="${ruleUrlPrefix}querycopyshoplist">菜单复制</a></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'navtop',
        props: ['shopType'],
        data() {
            return {};
        },
    };
</script>

<style scoped lang="less">
    @import './nav-top.less';
</style>
