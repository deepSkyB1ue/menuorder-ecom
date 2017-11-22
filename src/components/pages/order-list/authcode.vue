<template>
<div>
   <ui-popup class='pop-panel' :visible="popupInfo.visible" :title="popupInfo.title" @close="hidePopInfo">
        <div slot='pop-content'>
            <div class="content">
                <div class='info-title'>请输入授权码</div>
                <password-box v-model="inputAuthCode"></password-box>
                <div class="info">
                    <div class='warn-msg' :style="{visibility:errorStyle}">授权码输入错误，请重新输入</div>
                    <div class='forget' @click='forget'>忘记授权码</div>
                </div>
            </div>
            <div class="button-cont">
                <ui-button text="确认退款" :type="{'btn-solid-small-green-normal':allowClick,'btn-solid-small-grey-normal':!allowClick}" @click='ok()'/>
                <ui-button text="取消" type="btn-solid-small-grey-normal" @click='hidePopInfo()'/>
            </div>
        </div>
    </ui-popup>
    <authcode-info :authInfoData='authInfoData'></authcode-info>
</div>
</template>
<script>
/* eslint-disable import/no-unresolved */
import Popup from '@/components/ui-base/popup/popup.vue';
import {
    Button, PasswordBox,
} from '@dp/bee-ui';
import md5 from 'md5';

import AuthCodeInfo from './authcode-info';

export default {
    data() {
        return {
            popupInfo: {
                visible: true,
                title: '输入授权码',
            },
            authInfoData: {
                visible: false,
                title: '',
            },
            errorStyle: 'hidden',
            allowClick: false,
            inputAuthCode: '',
            realAuthCode: '',
            callback: () => {}, // 授权码校验成功走传入的回调
        };
    },
    watch: {
        inputAuthCode(val) {
            if (val.length === 4) {
                this.allowClick = true;
            } else {
                this.allowClick = false;
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            const passwords = document.getElementsByClassName('password-item');
            passwords[0].focus();
        });
    },
    methods: {
        hidePopInfo() {
            this.popupInfo.visible = false;
        },
        forget() {
            this.popupInfo.visible = false;
            this.authInfoData.visible = true;
        },
        ok() {
            if (md5(this.inputAuthCode) === this.realAuthCode) {
                this.popupInfo.visible = false;
                this.callback();
            } else {
                this.errorStyle = 'visible';
            }
        },
    },
    components: {
        'ui-popup': Popup,
        'ui-button': Button,
        'password-box': PasswordBox,
        'authcode-info': AuthCodeInfo,
    },
};
</script>

<style lang='less'>
.info-title{
    margin:7px 0 14px 0;
}
.info{
    margin-top:7px;
    width: 280px;
    display: flex;
    justify-content: space-between;
    .warn-msg{
        color: #F52F3E;
    }
    .forget{
        cursor: pointer;
        color: #168CEF;
    }
}

.button-cont{
    text-align: center;
    margin-top:35px;
}

</style>
