<template>
    <div class="search-panel">
        <div class="search-box">
            <input type="text" v-model='searchText' class='' @input='changeSearchText()' name="" value="" placeholder="输入点单号/手机号/订单编号">
            <ui-button text="搜索" type="ordersearh-btn btn-solid-small-green-normal" @click='search()' />
        </div>
        <div class="filter-item">
            <div class="quickfilter">
                <div v-for='day in days' 
                :class="{'btn-solid-small-green-normal':day.active,'date-btn':!day.active}" 
                @click='clickDayBtn(day)'>
                {{day.name}}
                </div>
            </div>
            <date-picker style="margin-left: 5px;" 
            :options="startDatePicker.fromOptions" 
            :error='validateData.isDataOutRange || validateData.isBeginLessEnd' 
            :value='startDatePicker.value'>
            </date-picker>
            至
            <date-picker style="margin-left: 5px;" 
            :error='validateData.isDataOutRange || validateData.isBeginLessEnd' 
            :options="endDatePicker.fromOptions" 
            :value='endDatePicker.value'>
            </date-picker>
            <ui-select @chooseSelectItem='setStatus' :options='orderStatus' defaultText='默认订单状态'></ui-select>
            <ui-button text="确定" type="btn-ok btn-solid-small-green-normal" @click='search()' />
            <a class="query-download-excel" @click='downloadExcel()'>下载明细</a>
        </div>
    </div>
</template>
<script>
/* eslint-disable import/no-unresolved */
import {
    DatePicker, Button,
} from '@dp/bee-ui';
import UISelect from '@/components/ui-base/select/select.vue';

export default {
    props: {
        startDatePicker: Object,
        endDatePicker: Object,
        validateData: Object,
        orderStatus: Array,
        days: Array,
    },
    data() {
        return {
            searchText: '',
        };
    },
    methods: {
        clickDayBtn(day) {
            this.$emit('clickDayBtn', day);
        },
        setStatus(item) {
            this.$emit('setStatus', item);
        },
        search() {
            this.$emit('search', this.searchText);
        },
        downloadExcel() {
            this.$emit('downloadExcel');
        },
        changeSearchText() {
            this.$emit('changeText', this.searchText);
        },
    },
    components: {
        'ui-button': Button,
        'date-picker': DatePicker,
        'ui-select': UISelect,
    },
};
</script>
<style lang='less'>
    @import './orderList.less';
    .query-download-excel{
        float: right;
        cursor: pointer;
    }
</style>

