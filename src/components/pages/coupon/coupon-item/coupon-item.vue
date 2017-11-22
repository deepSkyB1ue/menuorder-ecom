<template>
    <div :class="couponStatus.status !== 2 ? 'coupon-item off' : 'coupon-item'">
        <h2>{{item.name}}
            <div class="status">{{couponStatus.text}}</div>
            <div class="link" v-if="item.finished" @click="gotoReport">查看活动报告</div>
        </h2>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt" style="margin-left: 11px">券金额</span>
            </div>
            <div class="item-value">
                <p><span style="color: #f76120">{{item.useLimitVO.reduce}}</span>元</p>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">送券条件</span>
            </div>
            <div class="item-value">
                <p>消费满{{item.giveStep}}元送{{item.giveCount}}张</p>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">用券条件</span>
            </div>
            <div class="item-value">
                <p>消费满{{item.useLimitVO.step}}元可用</p>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt">用券时间</span>
            </div>
            <div class="item-value">
                <p>{{usePeriodText}}</p>
                <p v-if="excludeText" class="second">{{excludeText}}</p>
            </div>
        </div>
        <div class="hr-line"></div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt gray-color">活动门店</span>
            </div>
            <div class="item-value">
                <p class="gray-color">{{shopNameListText}}</p>
            </div>
        </div>
        <div class="form-line">
            <div class="item-key">
                <span class="key-txt gray-color">活动时间</span>
            </div>
            <div class="item-value">
                <p class="gray-color">{{item.giveDurationVO.dateIntervalVO.fromDate}} 至 {{item.giveDurationVO.dateIntervalVO.toDate}}</p>
            </div>
        </div>
        <div class="button-fix">
            <ui-button text="删除" @click="deleteCoupon" type="btn-solid-small-orange-normal"/>
            <ui-button text="编辑" @click="editCoupon" type="btn-solid-small-green-normal"/>
        </div>
        <ui-confirm
            v-if="confirm.visible"
            :mode="confirm.mode"
            :visible="confirm.visible"
            :title="confirm.title"
            :content="confirm.content"
            :confirmText="confirm.confirmText"
            :cancelText="confirm.cancelText"
            @close="closeConfirm"
            @confirm="confirm.confirmCallback">
        </ui-confirm>
        <ui-toast
            :visible="toast.visible"
            :text="toast.text"
            :duration="toast.duration">
            <!-- 非活动组件将被缓存！ -->
        </ui-toast>
    </div>
</template>

<script>
    import { Ajax } from '../../../../lib/utils.js';
    import { getCouponActivityStatus } from '../../../../lib/coupon.js';
    import { countToTime } from '../../../../lib/period.js';

    export default {
        name: 'coupon-item',
        props: ['item', 'shopList'],
        methods: {
            gotoReport() {
                // http://e.meishi.test.meituan.com/meishi/?cate=6#http://test.i.meituan.com/awp/app/gandalf-ecom/index.html#/activityanalysis?activityId=123&activityName=456
                if (window.location.href.indexOf('test.') > 0) {
                    window.location.href = `http://test.i.meituan.com/awp/app/gandalf-ecom/index.html#/couponcheck?activityId=${this.item.id}`;
                } else {
                    window.location.href = `http://i.meituan.com/awp/app/gandalf-ecom/index.html#/couponcheck?activityId=${this.item.id}`;
                }
            },
            editCoupon() {
                this.$emit('editCoupon');
            },
            deleteCoupon() {
                if (this.deleting) {
                    return;
                }
                this.openConfirm({
                    title: '删除活动',
                    content: '确定要删除活动吗？删除后不可恢复？',
                    confirmText: '确定',
                    cancelText: '取消',
                    confirmCallback: () => {
                        this.deleting = true;
                        Ajax.post({
                            url: 'deleteCouponActivity',
                            params: {
                                id: this.item.id,
                            },
                            success: (response) => {
                                this.deleting = false;
                                if (response.code.toString() === '200') {
                                    this.showToast({
                                        text: '删除成功',
                                    });
                                    setTimeout(() => {
                                        location.reload();
                                    }, 2000);
                                } else {
                                    this.showToast({
                                        text: response.msg,
                                    });
                                }
                            },
                            error: () => {
                                this.deleting = false;
                            },
                        });
                    },
                });
            },
            openConfirm(options) {
                this.confirm = {
                    visible: true,
                    title: options.title,
                    content: options.content,
                    confirmText: options.confirmText,
                    cancelText: options.cancelText,
                    confirmCallback: options.confirmCallback,
                };
            },
            closeConfirm() {
                this.confirm.visible = false;
            },
            showToast(options) {
                this.toast = {
                    visible: true,
                    text: options.text,
                };
                setTimeout(() => {
                    this.hideToast();
                }, options.duration || 2000);
            },
            hideToast() {
                this.toast.visible = false;
            },
        },
        computed: {
        /**
             * 选择门店列表
             * @return {[type]} [description]
             */
            shopNameListText() {
                return this.shopList.filter(shop => this.item.selectedShopIds.indexOf(shop.id) > -1).map(s => s.shopName).join(',');
            },
            /**
             * 用券时间
             * @return {[type]} [description]
             */
            usePeriodText() {
                return this.item.usePeriodVO.interval.map(i => `${i.fromTime} 至 ${countToTime(i.fromTime, i.timeSpan)}`).join('、');
            },
            /**
             * 排除时间
             * @return {[type]} [description]
             */
            excludeText() {
                const excludeList = [];

                // 节假日
                if (this.item.useDurationVO.hasExcludeHoliday) {
                    excludeList.push('节假日除外');
                }

                // 特定日期
                if (this.item.useDurationVO.hasExcludeDateInterval) {
                    excludeList.push(`${this.item.useDurationVO.excludeDateIntervals.map((interval) => {
                        if (interval.fromDate === interval.toDate) {
                            return interval.fromDate;
                        }
                        return `${interval.fromDate} 至 ${ interval.toDate}`;
                    }).join('、 ')}除外`);
                }

                // 特定星期
                const WEEKDAY_LIST = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                if (this.item.useDurationVO.hasExcludeWeekdays) {
                    excludeList.push(`${this.item.useDurationVO.excludeWeekdays.map(weekDay => WEEKDAY_LIST[weekDay]).join('、 ')}除外`);
                }

                if (excludeList.length > 0) {
                    return `(${excludeList.join('; ')})`;
                }
                return '';
            },
        },
        created() {
            this.couponStatus = getCouponActivityStatus(this.item.giveDurationVO.dateIntervalVO);
        },
        data() {
            return {
                couponStatus: null,
                confirm: {
                    visible: false,
                },
                toast: {
                    visible: false,
                    text: '',
                    duration: 2000,
                },
                deleting: false,
            };
        },
    };
</script>

<style lang="less">
.coupon-item {
    margin-top: 20px;
    border: 1px solid #EAEAEA;
    border-radius: 3px;
    position: relative;
    padding: 10px 0;
    .status {
        color: #83C537;
        float: right;
        font-size: 12px;
        margin-right: 17px;
        font-weight: normal;
    }
    .link{
        color: #3dc6b6;
        position: absolute;
        right: 17px;
        top: 20px;
        font-size: 14px;
        font-weight: normal;
        margin-top: 20px;
        cursor: pointer;
    }
    &.off {
        background-color: #fafafa;
        .status {
            color: #999;
            float: right;
            font-size: 12px;
            margin-right: 17px;
        }
    }
    h2 {
        font-size: 16px;
        margin: 5px 0px 10px 15px;
    }
    .hr-line {
        border: none;
        border-top:1px solid #eaeaea;
        width: 940px;
        margin: 5px 0;
    }
    .form-line {
        min-height: 34px;
        line-height: 34px;
        .item-key {
            color: #666;
            font-size: 12px;
            display: inline-block;
            vertical-align: top;
            padding: 0 25px 0 16px;
            width: 48px;
            .gray-color {
                color: #a5a5a5;
            }
        }
        .item-value {
            color: #666;
            font-size: 12px;
            display: inline-block;
            vertical-align: top;
            max-width: 650px;
            .gray-color {
                color: #a5a5a5;
            }
            .second {
                line-height: 20px;
                margin-top: -9px;
                margin-bottom: 5px;
            }
        }
        .right-fix {
            float: right;
            margin-right: 12px;
        }
    }
    .button-fix {
        position: absolute;
        right: 17px;
        bottom: 15px;
        button {
            &:not(:first-child) {
                margin-left: 5px;
            }
        }
    }
}
</style>
