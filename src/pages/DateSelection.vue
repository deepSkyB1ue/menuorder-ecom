<template>
    <div class="main-box">
        <div class="row">
            <label class="date-picker-label">开始</label>
            <date-picker :options="beginDatePickerOptions"
                         :fixed-width="fixedWidth"
                         :error="!isValid"
                         :input-calendar-icon="showIcon"
                         :value="beginDateStr"></date-picker>
        </div>
        <div class="row">
            <label class="date-picker-label">结束</label>
            <date-picker :options="endDatePickerOptions"
                         :fixed-width="fixedWidth"
                         :error="!isValid"
                         :input-calendar-icon="showIcon"
                         :value="endDateStr"></date-picker>
        </div>
        <div class="info-area">
            <span class="validation-info"
                  v-show="!isValid">开始日期不能晚于结束日期<br></span>
            <span class="max-range-info">查询时间跨度最长支持48小时</span>
        </div>
        <div class="button-area">
            <bee-button id="confirm-button"
                        text="确定"
                        type="btn-medium-normal-green"
                        @click="handleConfirmDidClick"></bee-button>
            <bee-button text="取消"
                        type="btn-medium-normal-grey"
                        @click="handleCancelDidClick"></bee-button>
        </div>
    </div>
</template>

<script>
import { DatePicker, Button } from '@dp/bee-ui';
import { getUrlParam } from '../lib/utils.js';

export default {
    name: 'DateSelection',
    data() {
        return {
            fixedWidth: false,
            isValid: true,
            showIcon: true,
            beginDatePickerOptions: {
                allowInput: true,
                enableTime: true,
                time_24hr: true,
                enableConfirmButtons: true,
                onValueUpdate: this.onBeginDateUpdate,
                disable: [this.isDateAfterToday],
            },
            endDatePickerOptions: {
                allowInput: true,
                enableTime: true,
                time_24hr: true,
                enableConfirmButtons: true,
                onValueUpdate: this.onEndDateUpdate,
                disable: [this.isDateAfterToday],
            },
            beginTimestamp: Number(this.$route.query.begin || getUrlParam('begin')) || 0,
            endTimestamp: Number(this.$route.query.end || getUrlParam('end')) || 0,
        };
    },
    computed: {
        beginDateStr: {
            get() {
                return this.formatDate(this.beginTimestamp);
            },
            set(v) {
                this.beginTimestamp = Date.parse(v) * 1;
            },
        },
        endDateStr: {
            get() {
                return this.formatDate(this.endTimestamp);
            },
            set(v) {
                this.endTimestamp = Date.parse(v) * 1;
            },
        },
    },
    methods: {
        formatDate(dateInLong) {
            const date = new Date(dateInLong);
            const day = (`0${date.getDate()}`).slice(-2);
            const month = (`0${date.getMonth() + 1}`).slice(-2);
            const year = date.getFullYear();
            const hour = (`0${date.getHours()}`).slice(-2);
            const minute = (`0${date.getMinutes()}`).slice(-2);
            return `${year}-${month}-${day} ${hour}:${minute}`;
        },
        isDateAfterToday(date) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return date > now;
        },
        handleConfirmDidClick() {
            if (this.validateDateRange()) {
                this.isValid = true;
                this.callNativeSetDateRange();
                this.callNativecCloseWindow();
            } else {
                this.isValid = false;
            }
        },
        handleCancelDidClick() {
            this.callNativecCloseWindow();
        },
        onBeginDateUpdate(selectedDate, inputValue) {
            this.beginDateStr = inputValue;
            this.isValid = this.validateDateRange();
        },
        onEndDateUpdate(selectedDate, inputValue) {
            this.endDateStr = inputValue;
            this.isValid = this.validateDateRange();
        },
        validateDateRange() {
            return this.beginTimestamp <= this.endTimestamp;
        },
        callNativeSetDateRange() {
            if ('datePicker' in window) {
                window.datePicker({
                    request: `setDateRange\n${this.beginTimestamp}\n${this.endTimestamp}`,
                    onSuccess() {
                    },
                    onFailure(errorCode, errorMessage) {
                        console.error(`Error:${errorMessage}`);
                    },
                });
            } else {
                console.error("Error: datePicker isn't registered");
            }
        },
        callNativeSetDate(timestamp) {
            if ('datePicker' in window) {
                window.datePicker({
                    request: `setDate\n${timestamp}`,
                    onSuccess() {
                    },
                    onFailure(errorCode, errorMessage) {
                        console.error(`Error:${errorMessage}`);
                    },
                });
            } else {
                console.error("Error: datePicker isn't registered");
            }
        },
        callNativecCloseWindow() {
            if ('datePicker' in window) {
                window.datePicker({
                    request: 'cancelDatePick\n',
                    onSuccess() {
                    },
                    onFailure(errorCode, errorMessage) {
                        console.error(`Error:${errorMessage}`);
                    },
                });
            } else {
                console.error("Error: datePicker isn't registered");
            }
        },
    },
    components: {
        'bee-button': Button,
        'date-picker': DatePicker,
    },
};
</script>

<style lang="less">
@import '~@dp/bee-ui/dist/styles/theme/exe/index.css';

.main-box {
    padding: 30px 36px 20px 36px;

    .row {
        display: flex;
        margin-bottom: 10px;
        justify-content: center;
        align-items: center;

        .date-picker-label {
            color: #666;
            font-size: 14px;
            margin-right: 10px;
        }

        .date-input {
            width: 230px;
            &:hover {
                border-color: #168cef;
            }
        }
    }

    .info-area {
        font-size: 12px;
        margin-left: 37px;

        .validation-info {
            color: #f52f3e;
        }

        .max-range-info {
            color: #999
        }
    }

    .button-area {
        margin-top: 44px;
        display: flex;
        justify-content: center;

        #confirm-button {
            margin-right: 10px;
        }
    }
}
</style>