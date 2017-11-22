<template>
  <div class="main-box">
    <div class="main">
      <div class="colmain table-panel"
           v-if="shopInfo.shopId != -1 || shopInfo.hasMultiShops == 0">
        <shop-header :headerTitle="headerTitle"
                     :shopInfo="shopInfo" @changeShop='changeShopCallBack'></shop-header>
        <div v-if="shopInfo.redirectToOpenViewMenuGuidePage">
          <p>该门店已开通开放平台菜单展示，如需管理更多信息，请
            <router-link to="/shop/menudescribe">升级为点餐合作商户</router-link>
          </p>
        </div>
        <div v-else>
          <div class="table-container">
            <table-settings :shopInfo="shopInfo"
                            :tableCodes="tableCodes"
                            @isSupportTableChange="onIsSupportTableChange"
                            @tableCodeModeChange="onTableCodeModeChange"></table-settings>
            <table-area v-show="tableCodes.isSupportTable"
                        :tableAreas="tableCodes.tableCodeAndPrinterVOS"
                        :initialPrinterType="tableCodes.printerType"
                        :shopInfo="shopInfo"></table-area>
          </div>
          <ui-button text="保存设置"
                     type="btn-medium-normal-green"
                     @click="onSaveButtonClick"></ui-button>
        </div>
      </div>
    </div>
    <ui-toast :visible="toast.visible"
		          :text="toast.text">
		</ui-toast>
    <ui-loading :visible="loading.visible"
                :text="loading.text"></ui-loading>
  </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
import Vue from 'vue';
import TableArea from '@/components/pages/table-code/table-area.vue';
import TableSettings from '@/components/pages/table-code/table-settings.vue';
import UIToast from '@/components/ui-base/toast/toast';
import UIButton from '@/components/ui-base/button/button';
import UILoading from '@/components/ui-base/loading/loading';
import ShopHeader from '@/components/shared/shop-header/shop-header';
import { login } from '../lib/auth'; // 登录接口
import { Ajax } from '../lib/utils.js';
import whatever from '../lib/whatever-adaptor.js';

Vue.component('ui-button', UIButton);
Vue.component('ui-loading', UILoading);
Vue.component('ui-toast', UIToast);
export default {
    name: 'TableCode',
    created() {
        this.showLoading('加载中……');
        login().then((item) => {
            this.hideLoading();
            this.shopInfo = {
                shopName: item.shop.shopName,
                shopId: item.shop.shopId,
                hasMultiShops: (item.user && item.user.hasMultiShops) || 0,
                redirectToOpenViewMenuGuidePage: item.user.redirectToOpenViewMenuGuidePage,
            };
            this.getTableCode();

            whatever.sendPV({
                pageId: 'menuorder_ecom_tablecode',
                shopId: item.shop.shopId,
                accountid: item.user.userId,
            });
        });
    },
    data() {
        return {
            headerTitle: '桌号设置',
            shopInfo: {},
            loading: {
                visible: false,
                text: '',
            },
            toast: {
                visible: false,
                text: '',
            },
            tableCodes: {
                isSupportTable: 0,
                tableCodeMode: 1,
                shopAuthority: {
                },
            },
        };
    },
    components: {
        'table-area': TableArea,
        'table-settings': TableSettings,
        'shop-header': ShopHeader,
    },
    methods: {
        changeShopCallBack() {
            window.location.reload();
        },
        showLoading(text) {
            this.loading.visible = true;
            this.loading.text = text || '数据加载中……';
        },
        hideLoading() {
            this.loading.visible = false;
        },
        onSaveButtonClick() {
            this.putTableCodeSettings();
        },
        onIsSupportTableChange(newValue) {
            this.tableCodes.isSupportTable = newValue;
        },
        onTableCodeModeChange(newValue) {
            this.tableCodes.tableCodeMode = newValue;
        },

        putTableCodeSettings() {
            Ajax.put({
                url: `${this.shopInfo.shopId}/tableCodeConfig`,
                params: JSON.stringify({
                    isSupportTable: String(this.tableCodes.isSupportTable),
                    tableCodeMode: String(this.tableCodes.tableCodeMode),
                }),
                success: (res) => {
                    let content = '';
                    if (res.code.toString() === '200') {
                        content = '设置更新';
                    } else {
                        content = res.msg;
                    }
                    this.toast = {
                        visible: true,
                        text: content,
                    };
                    setTimeout(() => {
                        this.toast.visible = false;
                    }, 2000);
                },
                error: () => {
                    this.toast = {
                        visible: true,
                        text: '设置失败请重试',
                    };
                    setTimeout(() => {
                        this.toast.visible = false;
                    }, 2000);
                },
            });
        },

        getTableCode() {
            Ajax.get({
                url: `${this.shopInfo.shopId}/tableCode`,
                success: (res) => {
                    this.hideLoading();
                    if (res.code.toString() === '200') {
                        this.tableCodes = res.data;
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
                    this.hideLoading();
                    this.toast = {
                        visible: true,
                        text: '请求失败请重试',
                    };
                    setTimeout(() => {
                        this.toast.visible = false;
                    }, 2000);
                },
            });
        },
    },
};
</script>

<style scoped lang="less">
@import '../assets/less/layout.less';

.table-container {
  position: relative;
  background-color: #f8f8f8;
  padding-top: 10px;
  padding-bottom: 10px;
}

.btn-medium-normal-green {
  margin: 10px 20px 10px 15px;
}
</style>
