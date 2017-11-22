<template>
    <div class="main-container"
         v-show="showPage">
        <div class="container">
            <img src="../../assets/img/invoice_enable_icon_invoice.png"
                 class="icon">
            <div class="text-container">
                <h1>简化开票流程，提高开票效率</h1>
                <p>开启极速开票功能后，顾客可扫描二维码，在手机上填写开票信息进行开票</p>
                <bee-button id="enable-btn"
                            text="马上开启"
                            type="btn-medium-normal-green"
                            @click="handleEnableBtnDidClick"></bee-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Button } from '@dp/bee-ui'; // eslint-disable-line import/extensions
import { Ajax } from '../../lib/utils.js';
import getEnv from '../../lib/env.js';
import whatever from '../../lib/whatever-adaptor.js';

const ENABLE_INVOICE_STORAGE_KEY_SHOPID = 'enable_invoice_storage_key_shopid';
const ENABLE_INVOICE_STORAGE_KEY_STATUS = 'enable_invoice_storage_key_status';

export default {
    components: {
        'bee-button': Button,
    },
    data() {
        return {
            loading: null,
            isEnabled: false,
            showPage: false,
        };
    },
    methods: {
        handleEnableBtnDidClick() {
            if (!this.isEnabled) {
                this.enableShopInvoice();
            } else {
                this.jumpToMakeInvoicePage();
            }
            this.sendMV('exe_click_open');
        },

        jumpToMakeInvoicePage(isInitial) {
            const destPath = '/exemdp/makeInvoice';
            if (isInitial) {
                this.$router.replace({
                    path: destPath,
                    query: {
                        init: 1,
                    },
                });
            } else {
                this.$router.replace(destPath);
            }
        },

        getShopIdFromCookie() {
            const cookieName = 'dbh_shopId';
            let cStart;
            let cEnd;
            if (document.cookie.length > 0) {
                cStart = document.cookie.indexOf(`${cookieName}=`);
                if (cStart !== -1) {
                    cStart = cStart + cookieName.length + 1;
                    cEnd = document.cookie.indexOf(';', cStart);
                    if (cEnd === -1) {
                        cEnd = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(cStart, cEnd));
                }
            }
            return '';
        },

        isBetaEnv() {
            const env = getEnv();
            return env === 'beta';
        },

        saveEnableInvoiceStatus() {
            const currentShopId = this.getShopIdFromCookie();
            sessionStorage.setItem(ENABLE_INVOICE_STORAGE_KEY_SHOPID, currentShopId.toString());
            sessionStorage.setItem(ENABLE_INVOICE_STORAGE_KEY_STATUS, this.isEnabled.toString());
        },

        readEnableInvoiceStatus() {
            const currentShopId = this.getShopIdFromCookie();
            const oldShopId = sessionStorage.getItem(ENABLE_INVOICE_STORAGE_KEY_SHOPID);
            if (currentShopId === oldShopId) {
                return sessionStorage.getItem(ENABLE_INVOICE_STORAGE_KEY_STATUS) === 'true';
            }
            return false;
        },

        getShopInvoiceStatus() {
            Ajax.get({
                url: 'queryShopInvoice',
                success: (res) => {
                    if (Number(res.code) === 200) {
                        this.isEnabled = res.data;
                    } else {
                        this.$toast({
                            text: '网络失败，请重试',
                            duration: 2000,
                        });
                    }
                    this.saveEnableInvoiceStatus();
                    if (this.isEnabled) {
                        this.jumpToMakeInvoicePage();
                        this.sendMV('exe_open_success');
                    } else {
                        this.showPage = true;
                    }
                },
                error: () => {
                    this.$toast({
                        text: '网络失败，请重试',
                        duration: 2000,
                    });
                },
            });
        },

        enableShopInvoice() {
            this.loading = this.$loading();
            Ajax.get({
                url: 'applyShopInvoice',
                success: (res) => {
                    this.loading.$stopLoading();
                    let message = '';
                    if (Number(res.code) === 200 && res.data) {
                        message = '开启成功';
                        this.isEnabled = true;
                        setTimeout(() => {
                            this.jumpToMakeInvoicePage(true);
                        }, 2100);
                    } else {
                        message = '开启失败，请重试';
                        this.isEnabled = false;
                    }
                    this.saveEnableInvoiceStatus();
                    this.$toast({
                        text: message,
                        duration: 2000,
                    });
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.$toast({
                        text: '开启失败，请重试',
                        duration: 2000,
                    });
                },
            });
        },

        sendMV(module) {
            whatever.report({
                pageId: 'exe_apply_invoice',
                module,
                shopid: this.getShopIdFromCookie(),
                is_test: this.isBetaEnv() ? 1 : 0,
            });
        },

        sendPV() {
            whatever.sendPV({
                pageId: 'exe_apply_invoice',
                shopid: this.getShopIdFromCookie(),
                is_test: this.isBetaEnv() ? 1 : 0,
            });
        },
    },
    mounted() {
        if (this.readEnableInvoiceStatus()) {
            this.jumpToMakeInvoicePage();
        } else {
            this.getShopInvoiceStatus();
        }

        this.sendPV();
    },
};
</script>

<style lang="less" scoped>
@import '~@dp/bee-ui/dist/styles/theme/exe/index.css';

.main-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
    min-width: 960px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url(../../assets/img/invoice_enable_bg_left.png), url(../../assets/img/invoice_enable_bg_right.png);
    background-repeat: no-repeat, no-repeat;
    background-position: bottom left, bottom right;

    .container {
        display: flex;
        flex-direction: row;
        justify-content: center;

        img {
            width: 196px;
            height: 160px;
        }

        .text-container {
            display: flex;
            flex-direction: column;
            min-width: 530px;
            margin-left: 35px;
            margin-top:12px;

            h1 {
                color: #666;
                font-size: 28px;
                font-weight: normal;
            }

            p {
                margin-top: 3px;
                color: #999;
                font-size: 16px;
            }

            #enable-btn {
                margin-top: 21px;
            }
        }
    }
}
</style>
