<template>
    <div class="tab-table">
        <ul>
            <li v-for="item in dateItemList">
                <input type="button" :value=item.title @click="onClickDateItem(item.dateType)" class="tab-button" :class="{ 'selected-button' : (selectedDateType === item.dateType) }">
            </li>
        </ul>
        <div class="custom">
            <date-picker style="margin-left: 5px;" :options="startDatePicker.fromOptions" :error="validate" :input-calendar-icon="startDatePicker.inputCalendarIcon" :value="startDate"></date-picker>
            <span class='to'>至</span>
            <date-picker :options="endDatePicker.fromOptions" :error="validate" :input-calendar-icon="endDatePicker.inputCalendarIcon" :value="endDate"></date-picker>
            <bee-button text="确定" type="btn-solid-small-green-normal" :disabled="validate" @click="onClickConfirm"></bee-button>
        </div>
    </div>
</template>
<script>
    import { DatePicker, Button } from '@dp/bee-ui';

    export default {
        name: 'dateRangeFilter',
        props: {
            // options: Object, // {defaultButton: '', }
            defaultButton: String,
            startDateValue: String,
            endDateValue: String,
            datepickerOptions: Object,
            validate: Boolean,
        },
        data() {
            return {
                selectedDateType: -1,
                filterParameters: {},
                startDate: '',
                endDate: '',
                dateItemList: [
                    {
                        title: '昨天',
                        dateType: 1,
                    },
                    {
                        title: '今天',
                        dateType: 0,
                    },
                    {
                        title: '近7天',
                        dateType: 6,
                    },
                    {
                        title: '近30天',
                        dateType: 29,
                    },
                ],
                startDatePicker: {
                    // 是否显示输入框icon
                    inputCalendarIcon: false,
                    // 是否样式外框标红
                    // options参数是用来设置Flatpick.js的
                    fromOptions: {
                        allowInput: this.datepickerOptions.allowInput,
                        enableTime: this.datepickerOptions.enableTime,
                        time_24hr: this.datepickerOptions.time_24hr,
                        enableConfirmButtons: this.datepickerOptions.enableConfirmButtons,
                        onValueUpdate: this.updateStartDate,
                        disable: this.datepickerOptions.disable || [
                            /* eslint-disable */
                            function (date) {
                                const now = new Date();
                                return date > now;
                            },
                        ],
                    },
                },
                endDatePicker: {
                    // 是否显示输入框icon
                    inputCalendarIcon: false,
                    // 是否样式外框标红
                    // options参数是用来设置Flatpick.js的
                    fromOptions: {
                        allowInput: this.datepickerOptions.allowInput,
                        enableTime: this.datepickerOptions.enableTime,
                        time_24hr: this.datepickerOptions.time_24hr,
                        enableConfirmButtons: this.datepickerOptions.enableConfirmButtons,
                        onValueUpdate: this.updateEndDate,
                        disable: this.datepickerOptions.disable || [
                            /* eslint-disable */
                            function (date) {
                                const now = new Date();
                                return date > now;
                            },
                        ],
                    },
                },
            };
        },
        components: {
            'date-picker': DatePicker,
            'bee-button': Button,
        },
        watch: {
            options(opt) {
                Object.keys(opt).map((key) => {
                    this.filterParameters.set(key, opt[key]);
                    return this.filterParameters;
                });
            },
            defaultButton(str) {
                const defaultItem = this.dateItemList.filter(item => item.title === str);
                this.selectedDateType = defaultItem[0].dateType;
                const dateRange = this.getDateRangeString(this.selectedDateType);
                this.startDate = dateRange.start;
                this.endDate = dateRange.end;
            },
            startDateValue(val) {
                this.startDate = JSON.parse(JSON.stringify(val));
            },
            endDateValue(val) {
                this.endDate = JSON.parse(JSON.stringify(val));
            },
        },
        methods: {
            updateStartDate(selectedDates, inputValue) {
                this.startDate = inputValue;
                this.$emit('startDateChanged', inputValue);
            },
            updateEndDate(selectedDates, inputValue) {
                this.endDate = inputValue;
                this.$emit('endDateChanged', inputValue);
            },

            /**
             * [根据特定的日期返回日历区间 ]
             * @param interval
             * @returns {{start: string, end: string}}
             */
            getDateRangeString(interval) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - (3600 * 1000 * 24 * interval));
                if (interval === 1) {
                    end.setTime(end.getTime() - (3600 * 1000 * 24));
                }
                let monthS = start.getMonth() + 1;
                let dayS = start.getDate();
                if (monthS >= 1 && monthS <= 9) {
                    monthS = `0${monthS}`;
                }
                if (dayS >= 0 && dayS <= 9) {
                    dayS = `0${dayS}`;
                }
                let monthE = end.getMonth() + 1;
                let dayE = end.getDate();
                if (monthE >= 1 && monthE <= 9) {
                    monthE = `0${monthE}`;
                }
                if (dayE >= 0 && dayE <= 9) {
                    dayE = `0${dayE}`;
                }
                const startDate = this.datepickerOptions.enableTime ? `${start.getFullYear()}-${monthS}-${dayS} 00:00` : `${start.getFullYear()}-${monthS}-${dayS}`;
                const endDate = this.datepickerOptions.enableTime ? `${end.getFullYear()}-${monthE}-${dayE} 23:59` : `${end.getFullYear()}-${monthE}-${dayE}`;
                return {
                    start: startDate,
                    end: endDate,
                };
            },
            onClickDateItem(val) {
                this.selectedDateType = val;
                const dateRange = this.getDateRangeString(val);
                this.startDate = dateRange.start;
                this.endDate = dateRange.end;
                this.$emit('startDateChanged', this.startDate);
                this.$emit('endDateChanged', this.endDate);
                this.$emit('selectCallback', this.startDate, this.endDate);
            },
            onClickConfirm() {
                this.selectedDateType = -1;
                this.$emit('selectCallback', this.startDate, this.endDate);
            },
        },
        created() {
            //        this.onClickDateItem(this.selectedDateType);
        },
        mounted() {
            const defaultItem = this.dateItemList.filter(item => item.title === this.defaultButton);
            this.selectedDateType = defaultItem[0].dateType;
            const dateRange = this.getDateRangeString(this.selectedDateType);
            this.startDate = dateRange.start;
            this.endDate = dateRange.end;
            this.$emit('startDateChanged', this.startDate);
            this.$emit('endDateChanged', this.endDate);
        },
    };
</script>
<style lang="less">
    @import '../../../assets/less/color';
    @import '~@dp/bee-ui/dist/styles/theme/exe/index.css';
    .tab-table {
        //width:240px;
        display: inline-block;
        height: 30px;
        position: relative;

        ul {
            display: inline-block;
        }

        li {
            display: inline-block;
            height:28px;
            border: 1px solid @mt-black-4;
            border-right:none;
            background-color: #F5f5f5;
        }
        li:last-child {
            border-right:1px solid @mt-black-4;
        }

        .tab-button {
            font-size: 13px;
            width:80px;
            //height:100%;
            height: 28px;
            background-color: white;
            border: 2px solid white;

            &.selected-button {
                background-color: #2578E6;
                color: white;
                border: 1px solid #2578E6;
            }
        }

        .custom {
            display: inline-block;
            .to{
                margin:0 10px;
            }

            .date-input {
                width: 150px;
                height: 30px;
            }
        }

        button {
            width: 66px;
            margin-right: 5px;
        }

        button[disabled] {
            background-color: #86b9F6;
        }
    }
</style>
