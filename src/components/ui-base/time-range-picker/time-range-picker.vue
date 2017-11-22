<template>
    <div class="time-range-picker">
        <div class="inline-block">
            <select data-order="0" v-model="period.fromTime" @change="selectCallback">
                <option v-for="limit in period.fromTimeLimit" :value="limit">{{limit}}</option>
            </select>
        </div>
        <span>至</span>
        <div class="inline-block">
            <select data-order="0" v-model="period.toTime" @change="selectCallback">
                <option v-for="limit in period.toTimeLimit" :value="limit">{{limit}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import { Period } from '../../../lib/period.js'

    export default {
        name: 'time-range-picker',
        props: ['fromTime', 'timeSpan'],
        components: {
        },
        watch: {
            fromTime () {
                this.period = new Period({
                   'fromTime': this.fromTime,
                   'timeSpan': this.timeSpan,
                   'crossDay': false
                });
            },
            timeSpan() {
                this.period = new Period({
                   'fromTime': this.fromTime,
                   'timeSpan': this.timeSpan,
                   'crossDay': false
                });
            }
        },
        methods: {
            selectCallback() {
                this.period.calLimit();

                //需手动设置触发更新
                this.$set(this.period, this.period);

                this.$emit('selectCallback', {
                    'fromTime': this.period.fromTime,
                    'timeSpan': this.period.countTimeSpan(this.period.fromTime, this.period.toTime),
                    'toTime': this.period.toTime
                });
            }
        },
        computed: {
            error() {
                return false
            },
            errorMsg() {
                return ''
            }
        },
        data() {
            return {
                period: new Period({
                   'fromTime': this.fromTime,
                   'timeSpan': this.timeSpan,
                   'crossDay': false
                })
            }
        }
    }
</script>

<style lang="less">

.time-range-picker {
    display: inline-block;
    .from-time-container {
        position: relative;
    }
    .to-time-container {
        position: relative;
    }
    .inline-block {
        display: inline-block;
    }

    @media screen and (-webkit-min-device-pixel-ratio:0) {  /*safari and chrome*/
        select {
            width: 80px;
            height: 30px;
            line-height: 30px;
            background: #fff;
            color: #3DC6B6;
            border: 0px;
            outline: 1px solid #EAEAEA;
        }
    }
    select::-moz-focus-inner { /*Remove button padding in FF*/
        border: 0;
        padding: 0;
    }
    @-moz-document url-prefix() { /* targets Firefox only */
        select {
            padding: 15px 0!important;
        }
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button{
        -webkit-appearance: none !important;
        margin: 0;
    }
}
</style>
