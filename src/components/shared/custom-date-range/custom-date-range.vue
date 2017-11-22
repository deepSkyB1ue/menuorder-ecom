<template>
<div class="custom-date-range">
    <div v-for="(interval, index) in currentInterval" class="custom-date-item">
        <date-range-picker
            :validateRules="customValidateRules"
            :interval="interval"
            @selectCallback="(interval) => {chooseIntervalDate(index, interval)}"
        ></date-range-picker>
        <a  class="date-item-delete" href="javascript:;" @click="deleteIntervalDate(index)">删除</a>
    </div>
    <ui-button text="+添加日期" @click="addInterval" type="btn-solid-small-green-normal"></ui-button>
</div>
</template>

<script>
    import moment from 'moment';

    import Button from '../../ui-base/button/button.vue';
    import DateRangePicker from '../../ui-base/date-range-picker/date-range-picker.vue';

    export default {
        name: 'custom-date-range',
        props: ['intervals', 'customValidateRules'],
        components: {
            'ui-button': Button,
            'date-range-picker': DateRangePicker,
        },
        methods: {
        /**
             * [设置日期]
             * @param  {[type]} index [description]
             * @return {[type]}       [description]
             */
            chooseIntervalDate(index, interval) {
                this.$set(this.currentInterval, index, interval);
                this.selectCallback();
            },
            /**
             * [添加日期]
             */
            addInterval() {
                this.currentInterval.push({
                    fromDate: moment().format('YYYY-MM-DD'),
                    toDate: moment().format('YYYY-MM-DD'),
                });
                this.selectCallback();
            },
            /**
             * [删除日期]
             * @param  {[type]} index [description]
             * @return {[type]}       [description]
             */
            deleteIntervalDate(index) {
                this.currentInterval.splice(index, 1);
                this.selectCallback();
            },
            selectCallback() {
                this.$emit('selectCallback', this.currentInterval);
            },
        },
        data() {
            return {
                currentInterval: this.intervals ? this.intervals : [],
            };
        },
        created() {
        // 添加时默认当前至当前
            if (this.currentInterval.length === 0) {
                this.addInterval();
            }
        },
    };
</script>

<style lang="less">
.custom-date-range {
    .custom-date-item {
        margin-bottom: 10px;
        position: relative;
        .error-msg {
            position: absolute;
            top: 0;
            left: 240px;
        }
    }
    .date-item-delete {
        position: absolute;
        left: 205px;
    }
}

</style>
