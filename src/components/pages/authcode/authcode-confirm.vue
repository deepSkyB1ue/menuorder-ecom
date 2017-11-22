<template>
    <div class="main-box"
         v-if="visible">
        <div class="text-box">
            <h1 class="title">{{ title }}</h1>
            <span class="authcode">{{ authCode }}</span>
        </div>
        <div>
            <bee-button id="confirm-btn"
                        :text="confirmBtnTitle"
                        type="btn-medium-normal-green"
                        @click="onConfirmBtnClick"></bee-button>
        </div>
    </div>
</template>

<script>
    import { Button } from '@dp/bee-ui';

    export default {
        name: 'authcode-confirm',
        components: {
            'bee-button': Button,
        },
        props: {
            visible: Boolean,
            title: String,
            authCode: String,
            confirmBtnTitle: String,
        },
        methods: {
            onConfirmBtnClick() {
                this.$emit('close');
            },
        },
    };
</script>

<style lang="less" scoped>
    @import '~@dp/bee-ui/dist/styles/theme/exe/index.css';
    .main-box {
        width: 280px;
        height: 302px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;

        .text-box {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;

            .title {
                color: #333;
                font-size: 14px;
                font-weight: normal;
            }

            .authcode {
                color: #f97916;
                font-size: 28px;
                margin-top: 9px;
                text-align: center;
            }
        }
    }
</style>
