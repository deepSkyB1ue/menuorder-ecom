<template>
<div class="custom-week-filter">
    <ul class="core-select">
        <li class="core-select-item" v-for="index in [1,2,3,4,5,6,0]">
            <a @click="selectType(index)" :class="currentWeekends.indexOf(index) != -1 ? 'switchable-tag tag-selected' : 'switchable-tag'">{{WEEK_TYPE_ENUM[index]}}</a>
        </li>
    </ul>
</div>
</template>

<script>
    export default {
        name: 'custom-week-filter',
        props: ['weekdays', 'defaultWeekdays'],
        methods: {
            selectType(week) {
                const index = this.currentWeekends.indexOf(week);
                if (index === -1) {
                    this.currentWeekends.push(week);
                } else if (this.currentWeekends.length > 1) {
                    this.currentWeekends.splice(index, 1);
                }
                this.$emit('selectCallback', this.currentWeekends);
            },
        },
        data() {
            return {
                WEEK_TYPE_ENUM: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                currentWeekends: this.weekdays ? this.weekdays : [],
            };
        },
        created() {
        // 默认选中
            if (this.weekdays.length === 0 && this.defaultWeekdays && this.defaultWeekdays.length > 0) {
                this.currentWeekends = this.defaultWeekdays;
                this.$emit('selectCallback', this.currentWeekends);
            }
        },
    };
</script>

<style scoped lang="less">
@import '../../../assets/less/color.less';
@import '../../../assets/less/core-select.less';
.custom-week-filter {
    padding: 20px;
    width: 760px;
    border: 1px solid @border-color;
    background-color: @bg-color;
}
</style>
