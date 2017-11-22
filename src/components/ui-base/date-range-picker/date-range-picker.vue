<template>
<div class="date-range-picker">
    <date-picker v-model="dateFrom" :options='fromOptions' @selectCallback="selectCallback" :error="(this.validate.fail && !this.validate.target) || (this.validate.target && this.validate.target==='fromDate')"></date-picker>
    <span>至</span>
    <date-picker v-model="dateTo" :options='toOptions' @selectCallback="selectCallback" :error="(this.validate.fail && !this.validate.target) || (this.validate.target && this.validate.target==='toDate')"></date-picker>
    <span class="error-msg">{{this.validate.msg}}</span>
</div>
</template>

<script>
    import UIdatepicker from '../date-picker/date-picker.vue'
    import { dateRangeValidate } from '../../../lib/validate.js';
    import moment from 'moment'

    export default {
        name: 'date-range-picker',
        props: ['interval', 'validateRules'],
        components: {
            'date-picker': UIdatepicker
        },
        watch: {
            interval: function (val) {
                this.updateTime(val);
                this.validateTime(val);
            },
            dateFrom(newVal) {
                this.toOptions = {
                    'allowInput': true,
                    'minDate': newVal
                };
            }
        },
        methods: {
            selectCallback() {
                let interval = {
                    fromDate: this.dateFrom,
                    toDate: this.dateTo
                };
                this.$emit('selectCallback', interval);
            },
            updateTime(interval) {
                if (!interval || !interval.fromDate || !interval.toDate) {
                    this.dateFrom = moment().format('YYYY-MM-DD');
                    this.dateTo = moment().format('YYYY-MM-DD');

                } else {
                    this.dateFrom = interval.fromDate;
                    this.dateTo = interval.toDate;
                }
            },
            validateTime(interval) {
                this.validate = dateRangeValidate.validateByRules(interval, this.validateRules.validate);
            }
        },
        data() {
            return {
                validate: {
                    fail: false,
                    msg: ''
                },
                fromOptions: {
                    "allowInput": true
                },
                toOptions: {
                    "allowInput": true
                },
                dateFrom: this.interval && this.interval.fromDate ? this.interval.fromDate : null,
                dateTo: this.interval && this.interval.toDate ? this.interval.toDate : null
            }
        },
        created() {
            this.updateTime(this.interval);
            this.selectCallback();
            let rangeLimit = this.validateRules && this.validateRules.select && this.validateRules.select.find((rule) => {
                return rule.name === 'rangeLimit';
            });
            if (rangeLimit && rangeLimit.options) {
                if (rangeLimit.options.from) {
                    let fromMinDate = rangeLimit.options.from.min === 'today' ? moment().format('YYYY-MM-DD') : rangeLimit.options.from.min;
                    let fromMaxDate = rangeLimit.options.from.max === 'today' ? moment().format('YYYY-MM-DD') : rangeLimit.options.from.max;
                    this.fromOptions = {
                        'allowInput': true,
                        'minDate': fromMinDate,
                        'maxDate': fromMaxDate
                    };
                }
                if (rangeLimit.options.to) {
                    let toMinDate = rangeLimit.options.from.to === 'today' ? moment().format('YYYY-MM-DD') : rangeLimit.options.from.min;
                    let toMaxDate = rangeLimit.options.to.max === 'today' ? moment().format('YYYY-MM-DD') : rangeLimit.options.to.max;
                    this.toOptions = {
                        'allowInput': true,
                        'minDate': toMinDate,
                        'maxDate': toMaxDate
                    };
                } else {
                    this.toOptions = {
                        'allowInput': true,
                        'minDate': this.fromOptions.minDate ? this.fromOptions.minDate : his.dateFrom
                    };
                }
            }
        }
    }
</script>

<style lang="less">
.date-range-picker {
    display: inline-block;
}
.error-msg {
    color: red;
}
</style>
