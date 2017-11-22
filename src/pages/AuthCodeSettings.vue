<template>
    <div>
        <div class="main-box"
             v-if="!confirmInfo.visible">
            <div class="content-box">
                <div class="input-area">
                    <label for="authcode">{{ inputTitle }}</label>
                    <bee-password-box class="authcode-input"
                                      id="authcode"
                                      :type="showResetBtn ? 'password' : 'text'"
                                      v-model="authCode"
                                      :warn="authFailed"></bee-password-box>
                    <div class="hint-area">
            <span class="error-hint"
                  v-show="authFailed">授权码错误，请重新输入</span>
                        <router-link to="/authcode"
                                     class="reset-hint"
                                     v-if="showResetBtn">忘记授权码</router-link>
                    </div>
                </div>
                <div class="input-area"
                     v-if="showInputArea2">
                    <label for="authcode-2">请输入新授权码（纯数字）</label>
                    <bee-password-box class="authcode-input"
                                      type="text"
                                      id="authcode-2"
                                      v-model="authCode2"></bee-password-box>
                </div>
            </div>
            <div class="btn-area">
                <bee-button id="confirmBtn"
                            :text="confirmBtnTitle"
                            :type="confirmEnabled ? 'btn-medium-normal-green' : 'btn-medium-disable'"
                            @click="onConfirmBtnClick"></bee-button>
                <bee-button id="cancelBtn"
                            text="取消"
                            type="btn-medium-normal-grey"
                            @click="onCancelBtnClick"></bee-button>
            </div>
        </div>
        <authcode-confirm :visible="confirmInfo.visible"
                          :title="confirmInfo.title"
                          :confirmBtnTitle="confirmInfo.confirmBtnTitle"
                          :authCode="confirmInfo.authCode"
                          @close="onSuccessConfirmClose"></authcode-confirm>
    </div>
</template>

<script>
    /* eslint-disable import/no-unresolved */
    import { Button, PasswordBox } from '@dp/bee-ui';
    import AuthCodeConfirm from '@/components/pages/authcode/authcode-confirm';
    import { Ajax, getUrlParam } from '../lib/utils.js';

    const ActionTypeEnum = {
        ACTION_TYPE_NEW: 10,
        ACTION_TYPE_CHANGE: 20,
    };

    export default {
        name: 'AuthCodeNew',
        components: {
            'authcode-confirm': AuthCodeConfirm,
            'bee-button': Button,
            'bee-password-box': PasswordBox,
        },
        data() {
            return {
                authCode: '',
                authCode2: '',
                authCodeLength: 4,
                authFailed: false,
                shopId: this.$route.query.shopId || getUrlParam('shopId'),
                loading: {},
                confirmInfo: {
                    visible: false,
                    title: '',
                    confirmBtnTitle: '',
                    authCode: '',
                },
            };
        },
        computed: {
            confirmEnabled() {
                if (this.$route.meta.actionType === ActionTypeEnum.ACTION_TYPE_CHANGE) {
                    return this.authCode && this.authCode.length === this.authCodeLength &&
                this.authCode2 && this.authCode2.length === this.authCodeLength;
                }
                return this.authCode && this.authCode.length === this.authCodeLength;
            },
            inputTitle() {
                switch (this.$route.meta.actionType) {
                case ActionTypeEnum.ACTION_TYPE_NEW:
                    return '设置授权码（纯数字）';
                case ActionTypeEnum.ACTION_TYPE_CHANGE:
                    return '输入旧的授权码';
                default:
                    return '请输入授权码';
                }
            },
            showInputArea2() {
                return this.$route.meta.actionType === ActionTypeEnum.ACTION_TYPE_CHANGE;
            },
            confirmBtnTitle() {
                switch (this.$route.meta.actionType) {
                case ActionTypeEnum.ACTION_TYPE_NEW:
                    return '确认设置';
                case ActionTypeEnum.ACTION_TYPE_CHANGE:
                    return '确认修改';
                default:
                    return '确认关闭';
                }
            },
            showResetBtn() {
                return this.$route.meta.actionType !== ActionTypeEnum.ACTION_TYPE_NEW;
            },
        },
        methods: {
            onConfirmBtnClick() {
                if (!this.confirmEnabled) {
                    return;
                }

                switch (this.$route.meta.actionType) {
                case ActionTypeEnum.ACTION_TYPE_NEW:
                    this.postAddAuthCodeRequest();
                    break;
                case ActionTypeEnum.ACTION_TYPE_CHANGE:
                    this.postUpdateAuthCodeRequest();
                    break;
                default:
                    this.postCloseAuthCodeRequest();
                    break;
                }
            },
            onCancelBtnClick() {
                this.callNativeCloseWindow();
            },
            onSuccessConfirmClose() {
                this.callNativeCloseWindow();
            },

            callNativeCloseWindow() {
                // 关闭窗口
                if ('authCodeQuery' in window) {
                    window.authCodeQuery({
                        request: 'closeDialog',
                        onSuccess() {
                        },
                        onFailure(errorCode, errorMessage) {
                            console.error(`Error:${errorMessage}`);
                        },
                    });
                } else {
                    console.error("Error: authCodeQuery isn't registered");
                }
            },
            callNativeRefreshCode() {
                // 关闭授权码或打开授权码成功时调用
                if ('authCodeQuery' in window) {
                    window.authCodeQuery({
                        request: 'refreshCodeState',
                        onSuccess() {
                        },
                        onFailure(errorCode, errorMessage) {
                            console.error(`Error:${errorMessage}`);
                        },
                    });
                } else {
                    console.error("Error: authCodeQuery isn't registered");
                }
            },
            postCloseAuthCodeRequest() {
                Ajax.post({
                    url: 'closeSwitch',
                    params: JSON.stringify({
                        shopId: this.shopId,
                        authCode: this.authCode,
                    }),
                    success: (res) => {
                        switch (Number(res.code)) {
                        case 200:
                            this.authFailed = false;
                            this.callNativeRefreshCode();
                            this.callNativeCloseWindow();
                            break;
                        case 501:
                            this.authFailed = true;
                            break;
                        default:
                            this.authFailed = false;
                            break;
                        }
                    },
                    error: () => {
                        this.authFailed = true;
                    },
                });
            },
            postAddAuthCodeRequest() {
                Ajax.post({
                    url: 'addAuthCode',
                    params: JSON.stringify({
                        shopId: this.shopId,
                        authCode: this.authCode,
                    }),
                    success: (res) => {
                        if (res.code.toString() === '200') {
                            this.callNativeRefreshCode();
                            this.confirmInfo = {
                                visible: true,
                                title: '授权码设置成功，请记住密码',
                                confirmBtnTitle: '记住了',
                                authCode: this.authCode,
                            };
                        }
                    },
                });
            },
            postUpdateAuthCodeRequest() {
                Ajax.post({
                    url: 'updateAuthCode',
                    params: JSON.stringify({
                        shopId: this.shopId,
                        oldAuthCode: this.authCode,
                        newAuthCode: this.authCode2,
                    }),
                    success: (res) => {
                        switch (Number(res.code)) {
                        case 200:
                            this.authFailed = false;
                            this.confirmInfo = {
                                visible: true,
                                title: '授权码修改成功，请记住密码',
                                confirmBtnTitle: '记住了',
                                authCode: this.authCode2,
                            };
                            break;
                        case 501:
                            this.authFailed = true;
                            break;
                        default:
                            this.authFailed = false;
                            break;
                        }
                    },
                });
            },
        },
    };
</script>

<style lang="less" scoped>
    @import '~@dp/bee-ui/dist/styles/theme/exe/index.css';
    .main-box {
        overflow: none;
        padding: 20px;
        width: 300px;
        height: 322px;
        display: flex;
        flex-direction: column;

        label {
            margin: 7px 0;
            color: #333;
            font-size: 14px;
            display: block;
        }

        .content-box {
            display: flex;
            flex-direction: column;
            height: 235px;
            justify-content: center;

            .input-area {
                padding: 0 9px;

                .authcode-input {
                    margin: 7px 0;
                    flex-direction: row;
                }

                .hint-area {
                    flex-direction: row;
                    margin-bottom: 11px;
                    width: 100%;
                    display: inline-block;

                    .error-hint {
                        float: left;
                        color: #f52f3e;
                        font-size: 12px;
                    }

                    .reset-hint {
                        float: right;
                        font-size: 12px;
                    }
                }
            }
        }

        .btn-area {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-top: auto;

            #confirmBtn {
                margin-right: 10px;
            }
        }
    }
</style>
