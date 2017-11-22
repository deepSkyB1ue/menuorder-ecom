<template lang="html">
    <div>
        <div class="switch-account-container" v-show='showPopPanel'>
            <div class="switch-account">
                <div class="switch-title">
                    选择账户
                </div>
                <div class="close" @click="close()">
                </div>
                <div class="search"><span class="hint">搜索门店</span>
                    <input type="text" class="shop-condition" v-model='searchText'  @keyup='searchShop()'></input>
                    <a class="magnifier" href="javascript:;" @click='searchShop()'></a>
                </div>
                <ul class="account-item-cont">
                    <div class='account-item' v-for='info in filterShopInfo'>
                        <input type="radio" name="shop" class='bee-icon bee-icon-checkbox' @click='clickShopItem(info)' :checked='info.shopId== shopInfo.shopId'><span class='shopName'>{{info.shopName}}</span>
                    </div>
                </ul>
                <div class="btn-cont">
                    <ui-button text="确认" type="btn-medium-normal-orange" @click='ok()'/>
                    <ui-button text="取消" type="btn-medium-normal-grey" @click='cancel()'/>
                </div>
            </div>
        </div>
        <div class="switch-overlay">
        </div>
    </div>
</template>

<script>
import UIButton from '../../../components/ui-base/button/button.vue';

export default {
    props: {
        shopInfos: Array,
        shopInfo: {},
    },
    data() {
        return {
            searchText: '',
            showPopPanel: true,
            filterShopInfo: [],
            choosedShopInfo: {},
        };
    },
    methods: {
        ok() {
            this.$emit('ok', this.choosedShopInfo);
        },
        cancel() {
            this.close();
        },
        close() {
            this.$emit('close');
        },
        isChecked(index) {
            return this.checkedIndexs.indexOf(index) >= 0;
        },
        searchShop() {
            this.filterShopInfo = this.shopInfos.filter(item =>
                item.shopName.indexOf(this.searchText) >= 0);
        },
        clickShopItem(info) {
            this.choosedShopInfo = info;
        },
    },
    mounted() {
        this.filterShopInfo = this.shopInfos;
        this.choosedShopInfo = this.shopInfo;
    },
    components: {
        'ui-button': UIButton,
    },
};
</script>

<style lang="less">
@import '../../../assets/less/reset.less';
@import './select-shop.less';
</style>
