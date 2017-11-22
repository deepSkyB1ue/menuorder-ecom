<template>
    <div>
        <div class='top-bar'>
            <bee-tabs class='' step="1" :tabs-info="tabsInfo"></bee-tabs>
            <div class="phone-numb">美团点评客服电话：10107888</div>
        </div>
        <has-make-invoice v-if="tabsInfo.selectedId === 2"></has-make-invoice>
        <need-invoice v-if="tabsInfo.selectedId === 1"></need-invoice>
    </div>
</template>
<script>
/* eslint-disable import/no-unresolved */
import { Tabs } from '@dp/bee-ui';
import HasMakeInvoice from '@/components/pages/exe-invoice/has-make-invoice.vue';
import NeedInvoice from '@/components/pages/exe-invoice/need-invoice.vue';

export default {
    data() {
        return {
            tabsInfo: {
                list: [
                    {
                        name: '待开票',
                        id: 1,
                    }, {
                        name: '已开票',
                        id: 2,
                    }],
                selectedId: 1,
            },
        };
    },
    components: {
        'bee-tabs': Tabs,
        'has-make-invoice': HasMakeInvoice,
        'need-invoice': NeedInvoice,
    },
};
</script>
<style lang='less'>
@import '~@dp/bee-ui/dist/styles/theme/exe/index.css';
.top-bar{
    margin:0 0px 20px 0px;
    padding: 0 25px 0 5px; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
    box-shadow: 0 1px 0 0 #F8F8F8, 0 2px 10px 0 rgba(220,223,225,0.26);
}
.tab-item-nulltype-container .tab-item{
    padding: 8px 0;
}
.tab-item-nulltype-container .tab-item.tab-item-selected{
    color:#158cef !important;
    border-bottom: 3px solid #4285F4 !important;
}
.tab-item{
    margin: 0 20px;
}
</style>
