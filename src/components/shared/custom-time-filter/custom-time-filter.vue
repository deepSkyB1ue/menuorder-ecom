<template>
<div class="custom-time-filter">
    <ul class="core-select">
        <li class="core-select-item" v-for="index in [1,2,3,4]">
            <a :class="periodVO.type === index ? 'switchable-tag tag-selected' : 'switchable-tag'" @click="selectType(index)">{{timeTypeText[index]}}</a>
        </li>
    </ul>
    <p v-if="periodVO.type !== typeCustom">已选时段 {{periodTypeInterval[periodVO.type].fromTime}} 至 {{periodTypeInterval[periodVO.type].toTime}}</p>
    <div v-if="periodVO.type == typeCustom" class="time-range-list">
        <custom-time-range
            :intervals="tempCustomInterval"
            :maxCustomLength="maxLength"
            :defaultInterval="periodTypeInterval[typeCustom]"
            @selectCallback="setCustomInterval"
        >
        </custom-time-range>
    </div>
</div>
</template>

<script>
    import UIButton from '../../ui-base/button/button.vue';
    import CustomTimeRange from '../custom-time-range/custom-time-range.vue';

    const PERIOD_TYPE_ENUM = {
        0: { fromTime: '00:00', toTime: '24:00', timeSpan: 1440 }, // 全时段(错误数据兼容)
        1: { fromTime: '00:00', toTime: '24:00', timeSpan: 1440 }, // 全时段
        2: { fromTime: '10:00', toTime: '15:00', timeSpan: 300 }, // 午市
        3: { fromTime: '17:00', toTime: '23:00', timeSpan: 360 }, // 晚市
        4: { fromTime: '10:00', toTime: '23:00', timeSpan: 780 }, // 自定义
    };

    const TYPE_CUSTOM = 4;
    const TYPE_DEFAULT = 1;//
    const TIME_TYPE_TEXT = ['', '全时段', '午市', '晚市', '自定义'];

    export default {
        name: 'custom-time-filter',
        props: ['duration', 'maxCustomLength'],
        methods: {
            selectType(type) {
                this.periodVO.type = type;
                if (type === this.typeCustom) {
                    if (this.tempCustomInterval && this.tempCustomInterval.length > 0) {
                        this.periodVO.interval = this.tempCustomInterval;
                    } else {
                        this.tempCustomInterval = [this.periodTypeInterval[type]];
                        this.periodVO.interval = this.tempCustomInterval;
                    }
                } else {
                    this.periodVO.interval = [this.periodTypeInterval[type]];
                }
                this.selectCallback();
            },
            setCustomInterval(intervals) {
                this.tempCustomInterval = intervals;
                this.periodVO.interval = intervals;
                this.selectCallback();
            },
            selectCallback() {
                this.$emit('selectCallback', this.periodVO);
            },
        },
        components: {
            'ui-button': UIButton,
            'custom-time-range': CustomTimeRange,
        },
        data() {
            return {
                maxLength: typeof this.maxCustomLength === 'undefined' ? -1 : this.maxCustomLength,
                periodVO: this.duration,
                periodTypeInterval: PERIOD_TYPE_ENUM,
                typeCustom: TYPE_CUSTOM,
                timeTypeText: TIME_TYPE_TEXT,
                tempCustomInterval: null,

            };
        },
        created() {
            let currentType = TYPE_DEFAULT;
            let curentIntervals = null;
            if (this.periodVO && typeof this.periodVO.type !== 'undefined') {
                currentType = this.periodVO.type; // 默认选中全时段
                if (this.periodVO.interval && this.periodVO.interval.length > 0) {
                    // 自定义情况下保存当前自定义值
                    if (currentType === this.typeCustom) {
                        this.tempCustomInterval = this.periodVO.interval;
                    }
                    curentIntervals = this.periodVO.interval;
                } else {
                    curentIntervals = [this.periodTypeInterval[currentType]];
                }
            } else {
                curentIntervals = [this.periodTypeInterval[currentType]];
            }

            this.periodVO = {
                type: currentType,
                interval: curentIntervals,
            };

            this.selectCallback();
        },
    };
</script>

<style lang="less">
@import '../../../assets/less/color.less';
@import '../../../assets/less/core-select.less';
.custom-time-filter {
    .time-range-list {
        padding: 20px;
        width: 760px;
        border: 1px solid @border-color;
        background-color: @bg-color;
        margin-top: 10px;
    }
}
</style>
