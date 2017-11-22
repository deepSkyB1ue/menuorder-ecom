<template>
    <div class="fail-tip">
        <div class="fail-img"></div>
        <p class="fail-content" v-html="msg"></p>
    </div>
</template>
<script>
    export default {
        name: 'page-error',
        props: ['msg'],
        methods: {
        },
        data() {
            return {};
        },
    };
</script>
<style>
    .fail-tip {
        width: 450px;
        overflow: auto;
        margin: 70px auto;
        text-align: center;
    }
    .fail-img {
        display: inline-block;
        width: 70px;
        height: 92px;
        background-image: url('../../assets/img/fail-mm.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .fail-content {
        font-size: 14px;
        color: #666;
        margin: 48px 23px;
    }
</style>