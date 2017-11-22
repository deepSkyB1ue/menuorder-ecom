<template>
<div class="ui-popup" v-if="visible">
    <div class="toast-popup" slot="pop-content">
        <div class="con">{{text}}</div>
    </div>
</div>
</template>

<script>
    export default {
        name: 'toast',
        props: ['text', 'visible'],
        data() {
            return {}
        }
    }
</script>

<style lang="less">
    @import '../../../assets/less/preset.less';
    .pop_overlayer {
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #000;
        zoom: 1;
        .rgba(0, 0, 0, 0.4);
        position: fixed;
        z-index: 100;
    }
    .toast-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        .rgba(0, 0, 0, 0.6);
        color: #fff;
        border: none;
        border-radius: 5px;
        text-align: center;
        z-index: 101;
        .con {
            padding: 60px 50px;
            font-size: 14px;
            max-width: 300px;
        }
    }
</style>