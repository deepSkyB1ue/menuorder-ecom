<template>
<div>
    <div class="main-box" v-if="!showEmptyPage">
        <h1 class="page-title">会员授权设置</h1>
        <div class="system-list-container">
            <div class="system-detail-container" v-for="system in systemList" :class="{disabled: disabledSystemIdList.indexOf(system.systemId) != -1}" :key="system.systemId">
                <span class="system-title">{{ system.systemName }}</span>
                <span class="system-status">{{ system.authStatus == 1 ? "已授权" : "未授权" }}
            <span v-if="system.authoredShop[0] && system.authoredShop[0].status">{{ system.authoredShop[0].name }}</span>
                </span>
                <bee-button class="auth-btn" :type="disabledSystemIdList.indexOf(system.systemId) != -1 ? 'btn-hollow-small-disable' : 'btn-hollow-small-normal'" :text="system.authStatus == 1 ? '取消授权' : '授权'" @click="onSystemAuthButtonClick(system)"></bee-button>
            </div>
        </div>
        <bee-popup class='pop-panel' :visible="dpPopupInfo.visible" :title="dpPopupInfo.title" @close="onCloseDPAuthPopup">
            <membercard-shop-search slot='pop-content' :systemId="dpPopupInfo.systemId" :initialAppId="dpPopupInfo.appId" :initialAppKey="dpPopupInfo.appKey" @close="onCloseDPAuthPopup" @saveSuccess="onDPAuthPopupSaveSuccess">
            </membercard-shop-search>
        </bee-popup>
        <bee-confirm :visible="mtPopupInfo.visible" :title="mtPopupInfo.title" :content="mtPopupInfo.content" :confirmText="mtPopupInfo.confirmText" :mode="mtPopupInfo.mode" @close="onCloseMTAuthPopup"></bee-confirm>
    </div>
    <div class="empty-box" v-else>
        <img class="empty-icon" src="../assets/img/membercard-empty.png">
        <span class="empty-hint">会员功能开发中，敬请期待...</span>
    </div>
</div>
</template>

<script>
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-useless-escape */

import {
    Button,
    Confirm,
    Popup,
} from '@dp/bee-ui';
import MembercardShopSearch from '../components/pages/membercard/membercard-shop-search';
import {
    Ajax,
} from '../lib/utils.js';

export default {
    name: 'MemberCard',
    data() {
        return {
            systemList: [],
            confirm: {
                title: '',
                content: '',
                confirmText: '',
                visible: false,
                mode: 'alert',
            },
            dpPopupInfo: {
                systemId: 0,
                appId: '',
                appKey: '',
                visible: false,
                title: '',
            },
            mtPopupInfo: {
                visible: false,
                title: '对接会员系统',
                content: '请先登录 “美团点评·会员系统” （https:\/\/vip.meituan.com），在 “设置 - 授权美团业务 - 秒付” 中，对本门店进行授权。',
                confirmText: '知道了',
                mode: 'alert',
            },
            loading: {},
            showEmptyPage: true,
        };
    },
    computed: {
        disabledSystemIdList() {
            const result = [];
            this.systemList.forEach((system) => {
                if (system.authStatus.toString() === '0' || system.authStatus.toString() === '2') { // 所有可以开通授权的状态
                    result.push(system.systemId);
                }
            }, this);
            return result.length === this.systemList.length ? [] : result;
        },
    },
    methods: {
        postTurnOffAuth(system) {
            this.loading = this.$loading();
            Ajax.post({
                url: 'saveVip',
                params: JSON.stringify({
                    systemId: system.systemId,
                    appId: '',
                    appKey: '',
                    venusShops: [{
                        shopId: system.authoredShop[0].shopId,
                        tShopId: system.authoredShop[0].tShopId,
                        name: system.authoredShop[0].name,
                        status: 0,
                    }],
                }),
                success: (res) => {
                    this.loading.$stopLoading();
                    let message = '';
                    if (res.code.toString() === '200') {
                        message = '操作成功';
                    } else {
                        message = res.msg || '网络错误，请重试';
                    }
                    this.$toast({
                        text: message,
                        duration: 2000,
                    });
                    this.getSystemList();
                },
                error: (res) => {
                    this.loading.$stopLoading();
                    this.$toast({
                        text: res.msg || '网络错误，请重试',
                        duration: 2000,
                    });
                },
            });
        },
        getSystemList() {
            this.loading = this.$loading();
            Ajax.get({
                url: 'queryVip',
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code.toString() === '200') {
                        this.systemList = res.data;
                    } else if (res.code.toString() !== '700') { // 会员卡不在白名单不用显示错误 toast
                        this.$toast({
                            text: res.msg || '网络错误，请重试',
                            duration: 2000,
                        });
                    }

                    this.showEmptyPage = res.code.toString() !== '200';
                },
                error: (res) => {
                    this.loading.$stopLoading();
                    this.$toast({
                        text: res.msg || '网络错误，请重试',
                        duration: 2000,
                    });
                },
            });
        },
        postTurnOnMTAuth(system) {
            this.loading = this.$loading();
            Ajax.post({
                url: 'saveVip',
                params: JSON.stringify({
                    systemId: system.systemId,
                    appId: '',
                    appKey: '',
                    venusShops: [{
                        shopId: system.authoredShop[0].shopId,
                        tShopId: system.authoredShop[0].tShopId,
                        name: system.authoredShop[0].name,
                        status: 1,
                    }],
                }),
                success: (res) => {
                    this.loading.$stopLoading();
                    let message = '';
                    if (res.code.toString() === '200') {
                        message = '授权成功';
                    } else {
                        message = res.msg || '网络错误，请重试';
                    }
                    this.$toast({
                        text: message,
                        duration: 2000,
                    });
                    this.getSystemList();
                },
                error: (res) => {
                    this.loading.$stopLoading();
                    this.$toast({
                        text: res.msg || '网络错误，请重试',
                        duration: 2000,
                    });
                },
            });
        },

        onSystemAuthButtonClick(system) {
            if (this.disabledSystemIdList.length > 0 &&
                this.disabledSystemIdList.indexOf(system.systemId) !== -1) {
                return;
            }

            switch (system.systemId) {
            case 2:
                switch (system.authStatus) {
                case 0:
                    this.showMTAuthPopup(system);
                    break;
                case 1:
                    this.postTurnOffAuth(system);
                    break;
                case 2:
                    this.postTurnOnMTAuth(system);
                    break;
                default:
                    break;
                }
                break;
            case 3:
                if (system.authStatus) {
                    this.postTurnOffAuth(system);
                } else {
                    this.showDPAuthPopup(system);
                }
                break;
            default:
                break;
            }
        },
        showDPAuthPopup(system) {
            this.dpPopupInfo = {
                visible: true,
                title: '微生活门店授权',
                systemId: system.systemId,
                appId: system.appId,
                appKey: system.appKey,
            };
        },
        showMTAuthPopup() {
            this.mtPopupInfo.visible = true;
        },
        onCloseDPAuthPopup() {
            this.dpPopupInfo.visible = false;
        },
        onDPAuthPopupSaveSuccess() {
            this.onCloseDPAuthPopup();
            this.getSystemList();
        },
        onCloseMTAuthPopup() {
            this.mtPopupInfo.visible = false;
        },
    },
    mounted() {
        this.getSystemList();
    },
    components: {
        'bee-button': Button,
        'bee-confirm': Confirm,
        'bee-popup': Popup,
        'membercard-shop-search': MembercardShopSearch,
    },
};
</script>

<style lang="less">
@import '~@dp/bee-ui/dist/styles/theme/exe/index.css';

.page-title {
    padding: 10px 25px;
    background-color: #fafafa;
    color: #666;
    font-size: 12px;
    font-weight: normal;
}

.system-list-container {
    display: flex;
    flex-direction: row;
    padding: 10px 15px;
}

.system-detail-container {
    margin: 10px;
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 100px;
    width: 170px;
    border: 1px #eee solid;
    box-shadow: 0 5px 12px 0 rgba(217, 226, 233, 0.5);

    .system-title {
        margin: 0 5px;
        color: #333;
        font-size: 13px;
    }
    .system-status {
        margin: 0 5px;
        color: #999;
        font-size: 11px;
    }
}

.auth-btn {
    align-self: flex-end;
    margin-top: auto;
}

.auth-intro-popup {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 18px;
    padding-bottom: 25px;

    .auth-intro-hint {
        color: #999;
        font-size: 12px;
        line-height: 20px;
        margin-top: 12px;
    }

    .auth-intro-content {
        color: #333;
        font-size: 13px;
        line-height: 22px;
        margin-top: 12px;
    }

    .auth-intro-btn {
        margin-top: 22px;
    }
}

.empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .empty-icon {
        margin-top: 121px;
        width: 200px;
        height: 100px;
    }

    .empty-hint {
        margin-top: 13px;
        font-size: 14px;
        color: #666;
    }
}
</style>
