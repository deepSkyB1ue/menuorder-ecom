<template>
<div class="custom-time-range">
    <div class="time-range-item" v-for="(interval, index) in intervals">
        <time-range-picker
            :fromTime="interval.fromTime"
            :timeSpan="interval.timeSpan"
            @selectCallback="(interval) => {selectInterval(index, interval)}"
        >
        </time-range-picker>
        <a v-if="intervals.length > 1" href="javascript:;" @click="deleteInterval(index)" class="time-range-delete">删除</a>
        <span v-if="intervals.error">{{errorMsg}}</span>
    </div>
    <div v-if="errorMsg" class="error-msg">{{errorMsg}}</div>
    <ui-button v-if="maxCustomLength === -1 || intervals.length < maxCustomLength" text="+添加时间段" type="btn-solid-small-green-normal" @click="addInterval"/>
</div>
</template>
<script>
    import Button from '../../ui-base/button/button.vue';
    import TimeRangePicker from '../../ui-base/time-range-picker/time-range-picker.vue';
    import { intervalValidate } from '../../../lib/period.js';

    export default {
        name: 'custom-time-range',
        props: ['intervals', 'maxCustomLength', 'defaultInterval'],
        components: {
            'ui-button': Button,
            'time-range-picker': TimeRangePicker,
        },
        data() {
            return {
                errorMsg: '',
            };
        },
        methods: {
            addInterval() {
                this.intervals.push(this.defaultInterval);
                this.selectIntervalCallback();
            },
            deleteInterval(index) {
                this.intervals.splice(index, 1);
                this.selectIntervalCallback();
            },
            selectInterval(index, interval) {
                this.$set(this.intervals, index, interval);
                this.selectIntervalCallback();
            },
            selectIntervalCallback() {
                this.validate();
                this.$emit('selectCallback', this.intervals);
            },
            validate() {
                this.errorMsg = intervalValidate(this.intervals).msg;
            },
        },
        created() {
        },
    };
</script>

<style lang="less">
.custom-time-range {
    .time-range-item {
        margin-bottom: 10px;
    }
    .time-range-delete {
        margin-left: 10px;
    }
    .error-msg {
        color: red;
    }
}
</style>
