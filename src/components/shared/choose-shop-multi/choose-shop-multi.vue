<template lang="html">
    <div>
        <div class="switch-account-container" v-show='showPopPanel'>
            <div class="switch-account">
                <div class="switch-title">
                    请选择您想要开通的门店
                </div>
                <div class="close" @click="close()">
                </div>
                <div class="search"><span class="hint">搜索门店</span>
                    <input type="text" class="shop-condition" v-model='searchText'  @keyup='searchShop()'></input>
                    <a class="magnifier" href="javascript:;" @click='searchShop()'></a>
                </div>
                <ul class="account-item-cont">
                        <li class="account-item" v-for='(info,index) in filterShopInfo'>
                            <i class='checked-btn' :class="{'checked':isChecked(index)}" @click='clickShopItem(info,index)'></i>
                            <span class="account-text">{{info.shopName}} {{info.checked}}</span>
                        </li>
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
        shopInfo: Array,
    },
    data() {
        return {
            searchText: '',
            showPopPanel: true,
            filterShopInfo: [],
            choosedShopInfos: [],
            checkedIndexs: [],
        };
    },
    methods: {
        ok() {
            this.$emit('chooseShop', this.choosedShopInfos);
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
            this.filterShopInfo = this.shopInfo.filter(item =>
                item.shopName.indexOf(this.searchText) >= 0);
        },
        clickShopItem(info, index) {
            if (this.isChecked(index)) {
                this.checkedIndexs.splice(this.checkedIndexs.indexOf(index), 1);
                this.choosedShopInfos =
        this.choosedShopInfos.filter(item => item.dpShopid !== info.dpShopid);
            } else {
                this.checkedIndexs.push(index);
                this.choosedShopInfos.push(info);
            }
        },
    },
    mounted() {
        this.filterShopInfo = this.shopInfo;
    },
    components: {
        'ui-button': UIButton,
    },
};
</script>

<style lang="less">
@import '../../../assets/less/reset.less';
@import './choose-shop-multi.less';
</style>
