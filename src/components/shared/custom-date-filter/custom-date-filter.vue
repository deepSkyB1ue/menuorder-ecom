<template>
<div class="custom-date-filter">
    <ul class="core-select">
        <li v-for="index in typeList" class="core-select-item">
            <a :class="durationVO.type == index ? 'switchable-tag tag-selected' : 'switchable-tag'" @click="selectType(index)">{{dateTypeText[index]}}</a>
        </li>
    </ul>
    <p v-if="durationVO.type !== typeCustom">已选时间 {{durationVO.dateIntervalVO.fromDate}} 至 {{durationVO.dateIntervalVO.toDate}}</p>
    <div v-if="durationVO.type === typeCustom" class="date-range-list">
        <date-range-picker
            :validateRules="customValidateRules"
            :interval="durationVO.dateIntervalVO"
            @selectCallback="customSelectCallback"
        >
        </date-range-picker>
    </div>
</div>
</template>

<script>
    /* eslint-disable array-callback-return */
    import moment from 'moment';
    import DateRangePicker from '../../ui-base/date-range-picker/date-range-picker.vue';

    const TYPE_DEFAULT = 2; // 默认选中类型
    const TYPE_CUSTOM = 4; // 自定义类型
    const TYPE_LIST = [1, 2, 3, 4];
    const DATE_TYPE_TEXT = ['', '1个月', '3个月', '6个月', '自定义'];

    const ADD_MONTH = {
        1: 1,
        2: 3,
        3: 6,
        4: 0,
    };

    export default {
        name: 'custom-date-filter',
        props: ['duration', 'maxCustomLength', 'customValidateRules'],
        methods: {
            selectType(type) {
                // 保持之前自定义日期范围
                const currentInterval = this.getInterval(type);
                this.durationVO = {
                    type,
                    dateIntervalVO: currentInterval,
                };
                this.selectCallback();
            },
            customSelectCallback(dateInterval) {
                this.typeIntervalList[this.typeCustom] = dateInterval;
                this.durationVO.dateIntervalVO = dateInterval;
                this.selectCallback();
            },
            selectCallback() {
                this.$emit('selectCallback', this.durationVO);
            },
            getInterval(type) {
                return this.typeIntervalList[type];
            },
        },
        components: {
            'date-range-picker': DateRangePicker,
        },
        data() {
            return {
                durationVO: this.duration,
                typeCustom: TYPE_CUSTOM, // 自定义
                typeList: TYPE_LIST, // 列表
                dateTypeText: DATE_TYPE_TEXT, // 类型文案
                typeIntervalList: {},
            };
        },
        created() {
            this.typeList.map((t) => {
                this.typeIntervalList[t] = {
                    fromDate: moment().format('YYYY-MM-DD'),
                    toDate: moment().add(ADD_MONTH[t], 'months').format('YYYY-MM-DD'),
                };
            });

            const currentType = this.durationVO ? this.durationVO.type : TYPE_DEFAULT;
            let currentInterval = null;

            // 范围为空时自动计算
            if (!this.durationVO
                || !this.durationVO.dateIntervalVO
                || this.durationVO.dateIntervalVO.length === 0) {
                currentInterval = this.getInterval(currentType);
            } else {
                currentInterval = this.durationVO.dateIntervalVO;
            }

            // 保存自定义日期范围
            if (currentType === this.typeCustom) {
                this.typeIntervalList[this.typeCustom] = currentInterval;
            }

            this.durationVO = {
                type: currentType,
                dateIntervalVO: currentInterval,
            };
            this.selectCallback();
        },
    };
</script>

<style lang="less">
@import '../../../assets/less/core-select.less';
.custom-date-filter {
    .date-range-list {
        margin-top: 10px;
    }
}
</style>
