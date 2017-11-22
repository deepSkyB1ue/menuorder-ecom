<template>
    <input :class="error ? 'date-input warning' : 'date-input'" readonly="readonly" type="text" :value='value' @change='inputting' @input='inputting'>
</template>

<script>
    import Flatpickr from './flatpickr.js';

    export default {
        name: 'datepicker',
        data () {
            return {
                fp: null // flatpicker的配置变量
            }
        },
        props: ['options', 'value', 'error'],
        watch: {
            options (opt) {
                for (let o in opt) {
                this.fp.set(o, opt[o])
                }
            },
            message (val) {
                try {
                    val = val.split(this.fp.l10n.rangeSeparator);
                    this.fp.setDate(val, false);
                } catch(e) {}
            }
        },
        methods: {
            inputting (e) {
                this.$emit('input', e.target.value);
                this.$emit('selectCallback');
            }
        },
        mounted () {
            Flatpickr.l10ns.zh = {
                rangeSeparator: ' - ',
                weekdays: {
                    shorthand: ['日', '一', '二', '三', '四', '五', '六'],
                    longhand: ['日', '一', '二', '三', '四', '五', '六']
                },
                months: {
                    shorthand: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    longhand: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }
            };

            this.options.locale = 'zh';
            this.options.prevArrow = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 20 20"><g></g><path d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z"></path></svg>';
            this.options.nextArrow = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 20 20"><g></g><path d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z"></path></svg>'

            this.fp = new Flatpickr(this.$el, this.options);
        },
        destroyed () {
            this.fp.destroy()
        }
    }
</script>

<style lang="less">
  @import './date-picker.less';
</style>
