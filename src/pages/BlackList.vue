<template lang="html">
    <div class="page-container">
        <shop-header :headerTitle="'黑名单设置'" :shopInfo='shopInfo' v-if='shopInfo' @changeShop='changeShopCallBack'></shop-header>
        <div class="blacklist-body" v-if='postPaid && !blackListLoading'>
            <div class="tc-line cf">
                <a class="additem-btn" href="javascript:;" @click='showBlackListPop=true'>添加</a>
            </div>
            <table class="blacklist-table">
                <tbody>
                    <tr class="table-header">
                        <th class="th1">用户</th>
                        <th class="th2">进黑名单的原因</th>
                        <th class="th3">维护时间/维护人</th>
                        <th class="th4">移出黑名单</th>
                    </tr>
                    <tr v-for='blackItem in blackLists'>
                        <td>
                            <div class="">
                                {{blackItem.userId}}
                            </div>
                            <div class="">
                                ({{blackItem.phone}})
                            </div>
                        </td>
                        <td>{{blackItem.reason}}</td>
                        <td>
                            <div class="">
                                {{blackItem.updateTime}}
                            </div>
                            <div class="">
                                {{blackItem.updateBy}}
                            </div>
                        </td>
                        <td><a class="removeitem-btn" href="javascript:;" @click='removeBlackList(blackItem.id)'>移出</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if='!postPaid && !blackListLoading'>
            <div class="info-word">
                仅后付商户需要维护黑名单
            </div>
        </div>
        <black-list-pop @close='showBlackListPop=false' @ok='addBlackList' v-if='showBlackListPop'></black-list-pop>
        <ui-confirm v-if="confirm.visible"
            :visible="confirm.visible"
            :title="confirm.title"
            :content="confirm.content"
            :confirmText="confirm.confirmText"
            :cancelText="confirm.cancelText"
            @close="closeConfirm"
            @confirm="confirmRemove">
        </ui-confirm>
        <ui-toast
            :visible="toast.visible"
            :text="toast.text"
            :duration="toast.duration"
          ></ui-toast>
    </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
// import '/Users/zp/notes/mock/mock.js'
import BlackListPop from '@/components/pages/shop-manage/black-list-pop.vue';
import UIConfirm from '@/components/ui-base/confirm/confirm.vue';
import UIToast from '@/components/ui-base/toast/toast.vue';
import ShopHeader from '@/components/shared/shop-header/shop-header.vue';
import {
    Ajax,
} from '@/lib/utils.js';
import {
    login,
} from '@/lib/auth'; // 登录接口

export default {
    data() {
        return {
            showBlackListPop: false,
            user: {},
            confirm: {
                visible: false,
                title: '确认',
                content: '确认移除黑名单吗？',
                confirmText: '确定',
                cancelText: '取消',
            },
            toast: {
                visible: false,
                text: '',
            },
            postPaid: true,
            shopInfo: {},
            blackLists: [],
            choosedBlackItemId: '',
            blackListLoading: 'true',
        };
    },
    methods: {
        changeShopCallBack() {
            window.location.reload();
        },
        closeConfirm() {
            this.confirm.visible = false;
        },
        confirmRemove() {
            Ajax.delete({
                url: `${this.shopInfo.shopId}/blacklist`,
                params: {
                    id: this.choosedBlackItemId,
                },
                success: (res) => {
                    if (res.code.toString() === '200') {
                        this.toast = {
                            visible: true,
                            text: res.msg,
                        };
                        setTimeout(() => {
                            this.toast.visible = false;
                        }, 2000);
                        window.location.reload();
                    } else {
                        this.toast = {
                            visible: true,
                            text: res.msg,
                        };
                        setTimeout(() => {
                            this.toast.visible = false;
                        }, 2000);
                    }
                    this.confirm.visible = false;
                },
                error: () => {
                    this.toast = {
                        visible: true,
                        text: '网络错误，请重试',
                    };
                    setTimeout(() => {
                        this.toast.visible = false;
                    }, 2000);
                },
            });
        },

        hidePopInfo() {
            this.popupInfo.visible = false;
        },
        addBlackList(info) {
            Ajax.post({
                url: `${this.shopInfo.shopId}/blacklist`,
                params: JSON.stringify({
                    phone: info.phone,
                    reason: info.reason,
                }),
                success: (res) => {
                    if (res.code.toString() === '200') {
                        this.toast = {
                            visible: true,
                            text: res.msg,
                        };
                        setTimeout(() => {
                            this.toast.visible = false;
                        }, 2000);
                        window.location.reload();
                    } else {
                        this.toast = {
                            visible: true,
                            text: res.msg,
                        };
                        setTimeout(() => {
                            this.toast.visible = false;
                        }, 2000);
                    }
                },
                error: () => {
                    this.toast = {
                        visible: true,
                        text: '网络错误，请重试',
                    };
                    setTimeout(() => {
                        this.toast.visible = false;
                    }, 2000);
                },
            });
        },
        removeBlackList(id) {
            this.choosedBlackItemId = id;
            this.confirm.visible = true;
        },
        getBlackLists() {
            Ajax.get({
                url: `${this.shopInfo.shopId}/blacklist`,
                success: (res) => {
                    this.blackListLoading = false;
                    if (res.code.toString() === '200') {
                        this.blackLists = res.data;
                    } else if (res.code.toString() === '400') {
                        this.postPaid = false;
                    } else {
                        this.toast = {
                            visible: true,
                            text: res.msg,
                        };
                        setTimeout(() => {
                            this.toast.visible = false;
                        }, 2000);
                    }
                },
                error: () => {
                    this.blackListLoading = false;
                    this.toast = {
                        visible: true,
                        text: '网络错误，请重试',
                    };
                    setTimeout(() => {
                        this.toast.visible = false;
                    }, 2000);
                },
            });
        },
    },
    mounted() {
        login().then((item) => {
            this.shopInfo = {
                shopName: item.shop.shopName,
                shopId: item.shop.shopId,
                hasMultiShops: (item.user && item.user.hasMultiShops) || 0,
            };
            this.getBlackLists();
        });
    },
    components: {
        'black-list-pop': BlackListPop,
        'ui-confirm': UIConfirm,
        'ui-toast': UIToast,
        'shop-header': ShopHeader,
    },
};
</script>

<style lang="less">@import "./blackList.less";</style>
