<template>
<div class="ui-popup" v-if="visible">
    <div class="ui-loading" slot="pop-content">
        <i class="ui-loading-icon"></i>
        <span class="ui-loading-txt">{{text}}</span>
    </div>
</div>
</template>

<script>
    export default {
        name: 'loading',
        props: ['text', 'visible'],
        components: {
        },
        methods: {
        },
        data() {
            return {}
        }
    }
</script>

<style lang="less">
    @import '../../../assets/less/preset.less';
    @import '../../../assets/less/color.less';
    .ui-popup {
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #000;
        zoom: 1;
        .rgba(0, 0, 0, 0.4);
        position: fixed;
        z-index: 100;
        .ui-loading {
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
            padding: 20px 50px;
            .ui-loading-icon {
                display: inline-block;
                vertical-align: middle;
                height: 20px;
                width: 20px;
                border: 3px solid #E2E2E2;
                border-top: 3px solid @mt-green-light;
                border-radius: 20px;
                -webkit-animation: ratate 1s linear 0s infinite;
                -moz-animation:  ratate 1s linear 0s infinite;
                -os-animation:  ratate 1s linear 0s infinite;
                animation:  ratate 1s linear 0s infinite;
            }
            .ui-loading-txt {
                vertical-align: middle;
                color: #fff;
                font-size: 14px;
                line-height: 24px;
                text-align: center;
            }
        }
    }
    @-webkit-keyframes ratate {
        from {
            -webkit-transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(360deg);
        }
    }
    @-moz-keyframes ratate {
        from {
            -moz-transform: rotate(0deg);
        }
        to {
            -moz-transform: rotate(360deg);
        }
    }
    @-os-keyframes ratate {
        from {
            -os-transform: rotate(0deg);
        }
        to {
            -os-transform: rotate(360deg);
        }
    }
    @keyframes ratate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>