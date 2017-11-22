<template>
<div class="main">
    <div class="content">
        <div class="header">
            <span class="header-hint">请联系您的微生活城市经理获取关联美团点评秒付需要用的 AppId、AppKey</span>
            <div class="header-input-area">
                <div>
                    <label>AppID</label>
                    <input v-model="formattedAppId" placeholder="请输入">
                </div>
                <div>
                    <label>AppKey</label>
                    <input v-model="formattedAppKey" placeholder="请输入">
                </div>
                <bee-button id="search-button" text="查询" :type="searchBtnEnabled ? 'btn-hollow-small-grey-normal' : 'btn-hollow-small-disable'" @click="onSearchBtnDidClick"></bee-button>
            </div>
        </div>
        <div class="search-result-list">
            <div v-show="hasSearched">
                <h2>查询结果</h2>
                <div v-if="pagedShopList.length > 0">
                    <table>
                        <thead>
                            <tr>
                                <td>微生活门店名称</td>
                                <td>微生活门店ID</td>
                                <td class="shop-bind-status">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="shop in pagedShopList[currentPage - 1]" :key="shop.tShopId">
                                <td>{{ shop.name }}</td>
                                <td>{{ shop.tShopId }}</td>
                                <td class="shop-bind-status" :class="{disabled : boundTShopId && boundTShopId != shop.tShopId}" @click="onBindBtnToggle(shop)">{{ shop.status ? "取消关联" : "关联本门店" }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <pagination class="pagination" :givenPageCount="pagedShopList.length" :givenCurrentPage="currentPage" :didChangePage="pageDidChange" type="small-hollow"></pagination>
                </div>
                <div v-else class="search-result-empty-hint">
                    <span>无搜索结果，请检查 appId、appKey 是否正确</span>
                </div>
            </div>
        </div>
    </div>
    <div class="bottom-button-area">
        <bee-button id="cancel-button" text="取消" type="btn-hollow-small-grey-normal" @click="onCancelBtnDidClick"></bee-button>
        <bee-button id="confirm-button" text="保存" :type="saveBtnEnabled ? 'btn-solid-small-green-normal' : 'btn-solid-small-disable'" @click="onSaveBtnDidClick"></bee-button>
    </div>
</div>
</template>

<script>
/* eslint-disable no-param-reassign */
import {
    Button,
    Pagination,
} from '@dp/bee-ui';
import {
    Ajax,
} from '../../../lib/utils.js';

export default {
    name: 'membercard-shop-search',
    props: {
        systemId: Number,
        initialAppId: String,
        initialAppKey: String,
    },
    data() {
        return {
            appId: this.initialAppId,
            appKey: this.initialAppKey,
            hasSearched: false,
            shopList: [],
            currentPage: 1,
            entrysPerPage: 4,
            initialBoundTShopId: null,
            boundTShopId: null,
            loading: {},
        };
    },
    computed: {
        pagedShopList() {
            const result = [];
            for (let i = 0, j = this.shopList.length; i < j; i += this.entrysPerPage) {
                const chuck = this.shopList.slice(i, i + this.entrysPerPage);
                result.push(chuck);
            }
            return result;
        },
        searchBtnEnabled() {
            return this.appId.length > 0 && this.appKey.length > 0;
        },
        saveBtnEnabled() {
            return this.boundTShopId != null;
        },
        formattedAppId: {
            get() {
                return this.formatStrByInsertingWhitespaces(this.appId);
            },
            set(v) {
                this.appId = this.trimAllWhitespaces(v);
            },
        },
        formattedAppKey: {
            get() {
                return this.formatStrByInsertingWhitespaces(this.appKey);
            },
            set(v) {
                this.appKey = this.trimAllWhitespaces(v);
            },
        },
    },
    watch: {
        shopList() {
            this.initialBoundTShopId = this.initiateBoundTShopId();
            this.boundTShopId = this.initialBoundTShopId;
        },
    },
    methods: {
        pageDidChange(clickedPageNumber) {
            this.currentPage = clickedPageNumber;
        },
        onSaveBtnDidClick() {
            if (this.saveBtnEnabled) {
                this.postSaveRequest();
            }
        },
        onCancelBtnDidClick() {
            this.$emit('close');
        },
        onSearchBtnDidClick() {
            if (this.searchBtnEnabled) {
                this.getShopListRequest();
            }
        },
        onBindBtnToggle(shop) {
            if (this.boundTShopId) {
                // 已经有绑定门店的情况下，只能取消绑定
                if (shop.tShopId === this.boundTShopId) {
                    shop.status = 0;
                    this.boundTShopId = null;
                }
            } else {
                // 没有的时候随便绑定
                shop.status = 1;
                this.boundTShopId = shop.tShopId;
            }
        },

        initiateBoundTShopId() {
            for (let index = 0; index < this.shopList.length; index += 1) {
                const shop = this.shopList[index];
                if (shop.status.toString() === '1') {
                    return shop.tShopId;
                }
            }
            return null;
        },
        findShopByTShopId(tShopId) {
            for (let index = 0; index < this.shopList.length; index += 1) {
                const shop = this.shopList[index];
                if (shop.tShopId === tShopId) {
                    return shop;
                }
            }
            return null;
        },

        getShopListRequest() {
            this.loading = this.$loading();
            Ajax.get({
                url: 'queryVenusShops',
                params: {
                    appId: this.appId,
                    appKey: this.appKey,
                },
                success: (res) => {
                    this.loading.$stopLoading();
                    if (res.code.toString() === '200') {
                        this.shopList = res.data;
                        this.hasSearched = true;
                    } else {
                        this.$toast({
                            text: res.msg || '网络错误，请重试',
                            duration: 2000,
                        });
                    }
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
        postSaveRequest() {
            this.loading = this.$loading();
            const params = this.saveVipParams();
            if (params.venusShops.length === 0) {
                this.$emit('close');
                return;
            }

            Ajax.post({
                url: 'saveVip',
                params: JSON.stringify(params),
                success: (res) => {
                    this.loading.$stopLoading();
                    let message = '';
                    if (res.code.toString() === '200') {
                        message = '操作成功';
                        this.$emit('saveSuccess');
                    } else {
                        message = res.msg || '网络错误，请重试';
                        this.$emit('saveFailed');
                    }
                    this.$toast({
                        text: message,
                        duration: 2000,
                    });
                },
                error: (res) => {
                    this.loading.$stopLoading();
                    this.$toast({
                        text: res.msg || '网络错误，请重试',
                        duration: 2000,
                    });
                    this.$emit('saveFailed');
                },
            });
        },
        saveVipParams() {
            const operations = [];
            if (this.initialBoundTShopId !== this.boundTShopId) {
                const shopToUnbind = this.findShopByTShopId(this.initialBoundTShopId);
                if (shopToUnbind) {
                    operations.push({
                        status: 0,
                        shopId: shopToUnbind.shopId,
                        tShopId: shopToUnbind.tShopId,
                        name: shopToUnbind.name,
                    });
                }
                if (this.boundTShopId != null) {
                    const shopTobind = this.findShopByTShopId(this.boundTShopId);
                    if (shopTobind) {
                        operations.push({
                            status: 1,
                            shopId: shopTobind.shopId,
                            tShopId: shopTobind.tShopId,
                            name: shopTobind.name,
                        });
                    }
                }
            }

            return {
                systemId: this.systemId,
                appId: this.appId,
                appKey: this.appKey,
                venusShops: operations,
            };
        },

        formatStrByInsertingWhitespaces(str) {
            return str.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
        },
        trimAllWhitespaces(str) {
            return str.replace(/\s+/g, '');
        },
    },
    components: {
        pagination: Pagination,
        'bee-button': Button,
    },
};
</script>

<style lang="less">
.content-container {
    width: 680px;
    max-width: 680px;
    max-height: 440px;
    padding: 18px 0;
}

.content {
    overflow-y: scroll;
}

.header-hint {
    padding: 0 20px;
    color: #999;
    font-size: 12px;
    line-height: 22px;
}

.header-input-area {
    margin: 8px 0;
    padding: 0 20px;

    label {
        display: inline-block;
        width: 66px;
        font-size: 13px;
    }

    input {
        color: #333;
        font-size: 13px;
        width: 320px;
        padding: 8px 16px;
        margin: 5px 0;
        border: 1px solid #E9EEF1;
        border-radius: 2px;
    }
    input::after {
        display: block;
    }
}

#search-button {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 70px;
}

.search-result-list {
    height: 85px;
    padding: 5px 20px;
    display: flex;
    flex-direction: column;
    position: relative;

    h2 {
        font-size: 12px;
        color: #999;
        font-weight: normal;
    }

    table {
        margin-top: 10px;
        width: 100%;
        border: 1px solid #eee;

        thead {
            background-color: #fafafa;

            td {
                color: #666;

                &.shop-bind-status {
                    color: #666;
                    text-align: center;
                }
            }
        }

        tr {
            height: 36px;
        }

        td {
            font-size: 13px;
            padding: 10px 20px;
            color: #333;
            border-bottom: 1px solid #eee;

            &.shop-bind-status {
                color: #168cef;
                cursor: pointer;
                text-align: center;

                &.disabled {
                    color: #999;
                }
            }
        }
    }

    .pagination {
        position: absolute;
        margin-top: 10px;
        right: 17px;
    }

    .search-result-empty-hint {
        padding: 12px 0;
        font-size: 13px;
    }
}

.bottom-button-area {
    display: flex;
    margin-top: 16px;
    padding: 0 20px;
    height: 51px;
    align-items: flex-end;
    justify-content: flex-end;
    box-shadow: 0 -3px 4px 0 rgba(217, 226, 233, 0.5);

    #cancel-button {
        margin-right: 10px;
    }
}

::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #999;
}

:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #999;
}

::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #999;
}

:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #999;
}
</style>
