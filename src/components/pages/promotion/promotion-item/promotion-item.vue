<template>
<div :class="couponStatus.status !== 2 ? 'coupon-item off' : 'coupon-item'">
    <h2>{{item.name}}
            <div class="status">{{couponStatus.text}}</div>
        </h2>
    <!--<div class="form-line">-->
    <!--<div class="item-key">-->
    <!--<span class="key-txt" style="margin-left: 11px">优惠ID</span>-->
    <!--</div>-->
    <!--<div class="item-value">-->
    <!--<p>{{item.viewId}}</p>-->
    <!--</div>-->
    <!--</div>-->
    <div class="form-line">
        <div class="item-key">
            <span class="key-txt">优惠类型</span>
        </div>
        <div class="item-value">
            <p>{{typeText}}</p>
        </div>
    </div>
    <div class="form-line">
        <div class="item-key">
            <span class="key-txt">适用门店</span>
        </div>
        <div class="item-value">
            <p>{{shopNameListText}}</p>
        </div>
    </div>
    <div class="form-line">
        <div class="item-key">
            <span>优惠时间</span>
        </div>
        <div class="item-value">
            <p>{{item.durationVO.dateIntervalVO.fromDate}} 至 {{item.durationVO.dateIntervalVO.toDate}}</p>
            <p v-if="excludeText" class="second">{{excludeText}}</p>
        </div>
    </div>
    <div class="form-line">
        <div class="item-key">
            <span class="key-txt">优惠时段</span>
        </div>
        <div class="item-value">
            <p>{{usePeriodText}}</p>
        </div>
    </div>
    <div class="form-line" v-if="limitText">
        <div class="item-key">
            <span class="key-txt">优惠限制</span>
        </div>
        <div class="item-value">
            <p>{{limitText}}</p>
        </div>
    </div>
    <div class="button-fix">
        <ui-button text="删除" @click="deletePromotion" type="btn-solid-small-orange-normal" />
        <ui-button text="编辑" @click="editPromotion" type="btn-solid-small-green-normal" />
    </div>
    <ui-confirm v-if="confirm.visible" :mode="confirm.mode" :visible="confirm.visible" :title="confirm.title" :content="confirm.content" :confirmText="confirm.confirmText" :cancelText="confirm.cancelText" @close="closeConfirm" @confirm="confirm.confirmCallback">
    </ui-confirm>
    <ui-toast :visible="toast.visible" :text="toast.text" :duration="toast.duration">
        <!-- 非活动组件将被缓存！ -->
    </ui-toast>
</div>
</template>

<script>
import {
    Ajax,
} from '../../../../lib/utils.js';
import {
    getCouponActivityStatus,
} from '../../../../lib/coupon.js';
import {
    countToTime,
} from '../../../../lib/period.js';

export default {
    name: 'promotion-item',
    props: ['item', 'shopList'],
    methods: {
        editPromotion() {
            this.$emit('editPromotion');
        },
        deletePromotion() {
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
                    Ajax.delete({
                        url: `promotion/${this.item.id}`,
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
        typeText() {
            const textList = [];
            if (this.item.promotionType.toString() === '1') {
                textList.push(`${this.item.discountVO.discount}折`);
                if (this.item.discountVO.hasDiscountLimit) {
                    textList.push(`最高减${this.item.discountVO.maxDiscount}元`);
                }
            } else {
                textList.push(`每满${this.item.reductionVO.step}减${this.item.reductionVO.reduce}元`);
                if (this.item.reductionVO.hasOverlay) {
                    textList.push(`最多叠加${this.item.reductionVO.additionCount}次`);
                }
            }
            return textList.join('; ');
        },
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
            if (this.item.durationVO.hasExcludeHoliday) {
                excludeList.push('节假日除外');
            }

            // 特定日期
            if (this.item.durationVO.hasExcludeDateInterval) {
                excludeList.push(`${this.item.durationVO.excludeDateIntervals.map((interval) => {
                    if (interval.fromDate === interval.toDate) {
                        return interval.fromDate;
                    }
                    return `
                    $ {
                        interval.fromDate
                    }
                    至 $ {
                        interval.toDate
                    }
                    `;
                }).join('、 ')}除外`);
            }

            // 特定星期
            const WEEKDAY_LIST = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            if (this.item.durationVO.hasExcludeWeekdays) {
                excludeList.push(`${this.item.durationVO.excludeWeekdays.map(weekDay => WEEKDAY_LIST[weekDay]).join('、 ')}除外`);
            }

            if (excludeList.length > 0) {
                return `(${excludeList.join('; ')})`;
            }
            return '';
        },
        /**
         * 优惠限制
         * @return {[type]} [description]
         */
        limitText() {
            const limitList = [];
            if (this.item.categoryLimitVO && this.item.categoryLimitVO.hasSelected
          && this.item.categoryNames.length > 0) {
                limitList.push(`${this.item.categoryNames.join('、')}不参与优惠`);
            }
            if (this.item.countLimitVO && this.item.countLimitVO.hasSelected) {
                limitList.push(`最多参与${this.item.countLimitVO.limitCount}次`);
            }
            if (limitList.length > 0) {
                return limitList.join('; ');
            }
            return '';
        },
    },
    created() {
        this.couponStatus = getCouponActivityStatus(this.item.durationVO.dateIntervalVO);
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
        margin: 5px 0 10px 15px;
    }
    .hr-line {
        border: none;
        border-top: 1px solid #eaeaea;
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
