<template>
<ui-popup
    :visible="visible"
    @close="close"
    :title="title"
    @width="300">
    <div class="select-multishop-content" slot="pop-content">
        <ul>
            <li>
                <label>
                    <input v-model="allChecked" type="checkbox" v-on:click='checkedAll'>
                    <span>全选</span>
                </label>
            </li>
            <li v-for="shop in shopList">
                <label>
                    <input type="checkbox" :value="shop.id"  v-model="shopIds">
                    <span>{{shop.shopName}}</span>
                </label>
            </li>
        </ul>
        <div class="error-msg">{{error}}</div>
        <div class="btn-container">
            <ui-button type="btn-solid-small-orange-normal" text="确认" @click="confirm"/>
            <ui-button type="btn-solid-small-grey-normal" text="取消" @click="cancel"/>
        </div>
    </div>
</ui-popup>
</template>

<script>
    import UIButton from '../../ui-base/button/button.vue';
    import Popup from '../../ui-base/popup/popup.vue';

    export default {
        name: 'select-multishop-pop',
        props: ['title', 'selectedShopIds', 'shopList', 'visible'],
        mixins: [Popup],
        components: {
            'ui-button': UIButton,
            'ui-popup': Popup,
        },
        methods: {
            checkedAll() { // 全选、反选
                if (this.allChecked) {
                    this.shopIds = [];
                    this.allChecked = false;
                } else {
                    this.shopIds = this.allShopIds;
                    this.allChecked = true;
                }
            },
            cancel() {
                this.$emit('close');
            },
            confirm() {
                this.computeError();
                if (this.error) {
                    return;
                }
                this.$emit('confirm', this.shopIds);
            },
            computeError() {
                if (this.shopIds.length === 0) {
                    this.error = '请选择适用门店';
                } else {
                    this.error = '';
                }
            },
        },
        computed: {
            allChecked: {
                get() {
                    this.computeError();
                    return this.shopIds.length > 0 &&
                    this.shopList.map(shop => shop.id).length === this.shopIds.length;
                },
                set() {
                },
            },
        },
        data() {
            return {
                error: '',
                shopIds: this.selectedShopIds.map(id => id), // 当前选中，避免改动父组件数据
                allShopIds: this.shopList.map(shop => shop.id), // 所有
            };
        },
    };
</script>

<style lang="less">
@import '../../../assets/less/checkbox.less';
.select-multishop-content {
    width: 450px;
    overflow-y: scroll;
    padding: 20px;
    ul{
        max-height: 309px;
        overflow: scroll;
    }
    li{
        line-height: 20px;
        height: 20px;
        &:first-child {
            padding-bottom: 10px;
        }
    }
    .btn-container {
        margin-top: 10px;
        text-align: center;
        button {
            &:first-child {
                margin-right: 10px;
            }
        }
    }
    .error-msg {
        color: #f00;
        height: 20px;
    }
}
</style>
