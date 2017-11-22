<template>
    <div v-if='showPanel'>
        <div class="refund-panel">
            <div class="header">
                <div class="title">退款</div>
                <div class="close" @click='close'></div>
            </div>
            <div class="content">
                <div class="main-info-container">
                    <div class="top-line">
                        <span v-if='refundableOrderHeadInfo.barCode'>点单码：{{refundableOrderHeadInfo.barCode}}</span>
                        <span v-if='refundableOrderHeadInfo.viewId'>订单编号：{{refundableOrderHeadInfo.viewId}}</span>
                        <span v-if='refundableOrderHeadInfo.orderTime'>下单时间：{{refundableOrderHeadInfo.orderTime}}</span>
                    </div>

                    <div class='detail-info'>
                        <div class="left-panel">
                            <div class="top">
                                <div class='table-number'>桌号：{{refundableOrderHeadInfo.tableNo|| '-' }}</div>
                                <div class='person-number' v-if='refundableOrderHeadInfo.personCount'>{{refundableOrderHeadInfo.personCount}}人就餐</div>
                            </div>
                            <div class="bottom">
                                <div class='phone-text'>手机号码：</div>
                                <div class='phone-number'>{{refundableOrderHeadInfo.phone || '顾客未绑定'}}</div>
                            </div>
                        </div>
                        <div class="vertical-line">
                        </div>
                        <div class="right-panel">
                            <div class='item' v-if='refundableOrderHeadInfo.consumptionPrice'>
                                <div>消费金额：</div>
                                <div>￥{{refundableOrderHeadInfo.consumptionPrice.toFixed(2)}}</div>
                            </div>
                            <div class='item' v-if='refundableOrderHeadInfo.totalPromotionDiscount'>
                                <div>支付优惠：</div>
                                <div>-￥{{refundableOrderHeadInfo.totalPromotionDiscount.toFixed(2)}}</div>
                            </div>
                            <div class='item' v-if='refundableOrderHeadInfo.totalCouponDiscount'>
                                <div>优惠券抵扣：</div>
                                <div>-￥{{refundableOrderHeadInfo.totalCouponDiscount.toFixed(2)}}</div>
                            </div>
                            <div class='item' v-if='refundableOrderHeadInfo.eraseZeroAmount'>
                                <div>抹零：</div>
                                <div>{{refundableOrderHeadInfo.eraseZeroAmount}}</div>
                            </div>
                            <div class='item' v-if='refundableOrderHeadInfo.refundAmount'>
                                <div>退款金额：</div>
                                <div>-￥{{refundableOrderHeadInfo.refundAmount.toFixed(2)}}</div>
                            </div>
                            <div class="pay-money" v-if='refundableOrderHeadInfo.merchantAmount'>
                                <div>实付金额：</div>
                                <div class='show-value'>￥{{refundableOrderHeadInfo.merchantAmount.toFixed(2)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-container" v-if='showDishOrderList.length'>
                    <div class="tab activce-tab-title">点餐详情</div>
                </div>
                <div class="refund-list-container" v-if='showDishOrderList.length'>
                    <div class="dish-header">
                        <div class="dish-name">菜品</div>
                        <div class="dish-number">可退份数</div>
                        <div class="dish-price">价格</div>
                        <div class="dish-state">状态</div>
                    </div>
                    <div class="refund-list" v-for='(refundOrder,index) in showDishOrderList'>
                        <div class="order-time">
                            <label v-if='index === subRefundableOrderList.length-1'>点餐时间：</label>
                            <label v-else>加菜时间：</label>{{refundOrder.subOrderTime}}</div>
                        <div class="refund-item" v-for='dish in refundOrder.showDishList'>
                            <div class="item-name-container">
                                <div class='input-box' :class="{'box-selected':dish.choosed,'input-box-disable':dish.status!=='已支付'}" @click="selectDish(dish)"></div>
                                <div class='item-name'>{{dish.name}}</div>
                                <div class='spec-attr' v-for='spec in dish.specAttr'>
                                    {{spec}}
                                </div>
                            </div>
                            <div class="item-number-container">
                                <span class='multi'></span>
                                <input class='item-number' type="text" :value='dish.editCount' @blur='countBlur(dish)' v-if="dish.status==='已支付' && dish.choosed">
                                <span class='number-word' v-else>{{dish.count}}</span>
                            </div>
                            <div class="item-price">
                                <span class='origin-price' v-if='dish.originPrice!=dish.currentPrice'>￥{{dish.originPrice}}</span>
                                <span>￥{{dish.currentPrice}}</span>
                            </div>
                            <div class="item-state" :class="{'item-state-red':dish.status==='已退款'}">{{dish.status}}</div>
                        </div>
                    </div>
                    <div class='total-price'>
                        <div class='item'>消费金额：￥{{refundableOrderHeadInfo.consumptionPrice}}</div>
                        <div class='item'>优惠金额：￥{{refundableOrderHeadInfo.disCountAmount}}</div>
                        <div class='item'>用户实付：￥{{refundableOrderHeadInfo.merchantAmount}}</div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class='price-container'>
                    <div>商户实收：￥{{refundableOrderHeadInfo.merchantAmount}}</div>
                    <div class='right-container'>
                        <div class='question' v-if='hasCoupon'></div>
                        <!-- <img class="question" src="../../src/img/question-green.png" alt=""> -->
                        <div class='tips'>
                            该金额根据退款菜品价格在总额中的比例计算您可自行修改
                        </div>
                        <span>退款金额：</span>
                        <input type="text" class='refund-price' v-model='dishPrice' @blur='checkPriceInput'>
                    </div>
                </div>
                <div class="button-container">
                    <bee-button @click='popRefund(true)'
                                type="btn-solid-small-green-normal"
                                :style="{ visibility: order.orderType === 2 ? 'hidden' : 'visible' }"
                                text='全单退款'>
                    </bee-button>
                    <div>
                        <div class='warn-msg' v-if='errorMsg'>{{errorMsg}}</div>
                        <bee-button @click='popRefund()' type='btn-solid-small-green-normal' text='确认退款'></bee-button>
                        <bee-button type='btn-solid-small-grey-normal' @click='close' text='取消'></bee-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="over-layer"></div>

        <bee-confirm :visible="confirm.visible"
                     :title="confirm.title"
                     :content="confirm.content"
                     :confirmText="confirm.confirmText"
                     :cancelText="confirm.cancelText"
                     :mode="confirm.mode"
                     @close="confirmClose"
                     @confirm="confirmOk">
        </bee-confirm>

    </div>
</template>
<script>
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
import { Confirm, Button } from '@dp/bee-ui'; // eslint-disable-line import/extensions
import { Ajax } from '@/lib/utils.js';
import { ORDER_TYPE } from '@/lib/constant.js';

export default {
    data() {
        return {
            showPanel: false,
            order: {},
            source: '',
            shopId: '',
            dishPrice: 0,
            authCode: '',
            showDishOrderList: [],
            refundSkus: [],
            refundExtraFees: [],
            refundDishCartDiscnt: [],
            refundableOrderHeadInfo: {},
            subRefundableOrderList: [],
            pass: true,
            errorMsg: '',
            hasCoupon: false,
            refundPrice: 0,
            refundType: 0,
            confirm: {
                visible: false,
                title: '提示',
                content: '确认退款？',
                confirmText: '确定',
                cancelText: '取消',
                mode: false,
                allFlag: false,
            },
        };
    },
    methods: {
        confirmClose() {
            this.confirm.visible = false;
        },
        confirmOk() {
            this.confirm.visible = false;
            if (this.confirm.type === 'refund') {
                if (this.confirm.allFlag) {
                    this.refund(true);
                } else {
                    this.refund();
                }
            }
        },
        close() {
            this.$destroy();
            this.$el.remove();
            document.body.style = '';
        },
        refundAjax(ajaxData) {
            this.$toast({
                text: '退款已提交，请等待',
                duration: 2000,
            });
            let url = `${this.shopId}/order/${this.order.orderId}/refundOrderdishOrder`;
            if (this.order.orderType === ORDER_TYPE.HACK) {
                url = `${this.shopId}/order/${this.order.orderId}/refundShHackOrder`;
            }
            Ajax.post({
                url,
                params: JSON.stringify(ajaxData),
                success: (res) => {
                    switch (Number(res.code)) {
                    case 200:
                        this.$toast({
                            text: res.msg || '成功',
                            duration: 2000,
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 2100);
                        break;
                    case 500:
                        this.confirm.title = res.data.title || '发起退款失败';
                        this.confirm.content = res.data.msg || (res.msg || '发起退款失败，请稍后重试');
                        this.confirm.mode = true;
                        this.confirm.type = 'other';
                        this.confirm.visible = true;
                        break;
                    default:
                        this.$toast({
                            text: res.msg || '服务器出错',
                            duration: 2000,
                        });
                        break;
                    }
                },
                error: () => {
                    this.$toast({
                        text: '网络错误，请重试',
                        duration: 2000,
                    });
                },
            });
        },
        popRefund(allFlag) {
            if (allFlag && !this.refundableOrderHeadInfo.canRefundAll) {
                return;
            }
            if (!allFlag) {
                this.checkPriceInput();
                if (!this.pass) {
                    this.$toast({
                        text: '退款信息有误，请修改后再提交',
                        duration: 2000,
                    });
                    return;
                }
            }
            this.confirm.content = '确认退款？';
            if (allFlag) {
                this.confirm.content = '确认全单退款？';
                this.confirm.allFlag = true;
            }
            this.confirm.mode = false;
            this.confirm.visible = true;
            this.confirm.type = 'refund';
        },
        refund(allFlag) {
            this.refundSkus = [];
            this.refundExtraFees = [];
            this.refundDishCartDiscnt = [];
            this.showDishOrderList.forEach((showRefundOrder) => {
                let choosedList = [];
                if (allFlag) {
                    choosedList = showRefundOrder.showDishList;
                } else {
                    choosedList = showRefundOrder.showDishList.filter(
                        dish => dish.choosed === true,
                    );
                }
                choosedList.forEach((item) => {
                    if (item.type === 'order') {
                        this.refundSkus.push({
                            skuId: item.skuId,
                            count: item.editCount,
                            currentPrice: item.currentPrice,
                            suggestRefundPrice: item.suggestRefundPrice,
                            orderId: item.orderId,
                        });
                    } else if (item.type === 'extra') {
                        this.refundExtraFees.push({
                            id: item.id,
                            count: item.editCount,
                            price: item.currentPrice,
                            suggestRefundPrice: item.suggestRefundPrice,
                            orderId: item.orderId,
                        });
                    } else if (item.type === 'dishcart') {
                        this.refundDishCartDiscnt.push({
                            actId: item.actId,
                            spuId: item.spuId,
                            skuVO: {
                                skuId: item.skuId,
                                count: item.editCount,
                                currentPrice: item.currentPrice,
                                orderId: item.orderId,
                            },
                        });
                    }
                });
            });

            let refundParamsVO = null;
            if (this.order.orderType === ORDER_TYPE.HACK) {
                refundParamsVO = {
                    pullOrderId: this.refundableOrderHeadInfo.orderId,
                };
            } else {
                refundParamsVO = {
                    orderGroupId: this.refundableOrderHeadInfo.orderGroupId,
                    pullOrderId: this.refundableOrderHeadInfo.orderId,
                    refundType: this.refundType,
                    refundSkuVOs: this.refundSkus,
                    refundExtraFeeVOs: this.refundExtraFees,
                    refundDishCartDiscntVOs: this.refundDishCartDiscnt,
                };
            }
            refundParamsVO.authCode = this.authCode || '';
            refundParamsVO.refundAmount = allFlag
                ? this.refundableOrderHeadInfo.merchantAmount
                : this.dishPrice;
            this.refundAjax(refundParamsVO);
        },
        dealData() {
            const showDishOrderList = [];
            if (this.subRefundableOrderList) {
                this.subRefundableOrderList.forEach((order) => {
                    const showRefundOrder = {};
                    const showDishList = [];
                    if (order.refundableSkuVOs) {
                        order.refundableSkuVOs.forEach((skuVO) => {
                            showDishList.push({
                                type: 'order',
                                skuId: skuVO.skuId,
                                orderId: order.orderId,
                                name: skuVO.name,
                                count: skuVO.count,
                                editCount: skuVO.count,
                                originPrice: skuVO.originPrice,
                                currentPrice: skuVO.currentPrice,
                                status: skuVO.status,
                                suggestRefundPrice: skuVO.suggestRefundPrice,
                                specAttr: skuVO.specAttr,
                                choosed: false,
                            });
                        });
                    }

                    if (order.refundableExtraFeeVOs) {
                        order.refundableExtraFeeVOs.forEach((extraVO) => {
                            showDishList.push({
                                type: 'extra',
                                id: extraVO.id,
                                orderId: order.orderId,
                                name: extraVO.name,
                                count: extraVO.count,
                                editCount: extraVO.count,
                                // 餐位两个价格相同
                                originPrice: extraVO.price,
                                currentPrice: extraVO.price,
                                status: extraVO.status,
                                suggestRefundPrice: extraVO.suggestRefundPrice,
                                choosed: false,
                            });
                        });
                    }

                    if (order.refundableDishCartDiscntVOs) {
                        order.refundableDishCartDiscntVOs.forEach((cartVO) => {
                            showDishList.push({
                                type: 'dishcart',
                                orderId: order.orderId,
                                actId: cartVO.actId,
                                spuId: cartVO.spuId,
                                skuId: cartVO.skuVO.skuId,
                                name: cartVO.skuVO.name,
                                count: cartVO.skuVO.count,
                                editCount: cartVO.skuVO.count,
                                originPrice: cartVO.skuVO.originPrice,
                                currentPrice: cartVO.skuVO.currentPrice,
                                status: cartVO.skuVO.status,
                                suggestRefundPrice: cartVO.skuVO.suggestRefundPrice,
                                specAttr: cartVO.skuVO.specAttr,
                                choosed: false,
                            });
                        });
                    }
                    showRefundOrder.subOrderTime = order.subOrderTime;
                    showRefundOrder.showDishList = showDishList;
                    showDishOrderList.push(showRefundOrder);
                });
            }

            this.showDishOrderList = showDishOrderList;
        },
        countBlur(dish) {
            const number = event.target.value;
            const count = dish.count;
            if (!/^[1-9]+[0-9]*?$/.test(number) || number > count || number < 1) {
                event.target.value = count;
            }
            dish.editCount = event.target.value;
            this.updatePrice();
        },
        selectDish(dish) {
            if (dish.status !== '已退款') {
                dish.choosed = !dish.choosed;
                this.updatePrice();
                this.checkPriceInput();
            }
        },
        updatePrice() {
            this.dishPrice = 0;
            this.hasCoupon = false;
            this.showDishOrderList.forEach((showRefundOrder) => {
                const choosedList = showRefundOrder.showDishList.filter(
                    dish => dish.choosed === true,
                );
                if (showRefundOrder.currentPrice !== showRefundOrder.suggestRefundPrice) {
                    this.hasCoupon = true;
                }
                choosedList.forEach((item) => {
                    this.dishPrice = this.pricePlus(
                        this.dishPrice,
                        this.priceMultiply(item.editCount, item.suggestRefundPrice),
                    );
                    if (item.currentPrice !== item.suggestRefundPrice) {
                        this.hasCoupon = true;
                    }
                });
            });
            if (this.dishPrice > this.refundableOrderHeadInfo.merchantAmount) {
                this.refundPrice = this.refundableOrderHeadInfo.merchantAmount;
            } else {
                this.refundPrice = this.dishPrice;
            }
        },
        pricePlus(a, b) {
            a = Number(a);
            b = Number(b);
            let sum;
            const scale = Math.max(this.getScale(a), this.getScale(b));
            const integerSum = Math.round((a * (10 ** scale)) + (b * (10 ** scale)));
            if (scale <= 2) {
                sum = integerSum / (10 ** scale);
            } else {
                sum = Math.floor(integerSum / (10 ** (scale - 2))) / 100;
            }
            return sum;
        },

        priceMultiply(a, b) {
            a = Number(a);
            b = Number(b);
            let product;
            const scaleA = this.getScale(a);
            const scaleB = this.getScale(b);
            const scale = scaleA + scaleB;
            const integerProduct = Math.round(
                (a * (10 ** scaleA)) * (b * (10 ** scaleB)),
            );
            if (scale <= 2) {
                product = integerProduct / (10 ** scale);
            } else {
                product = Math.floor(integerProduct / (10 ** (scale - 2))) / 100;
            }
            return product;
        },

        priceFormat(price) {
            const reg = /([0-9]+\.[0-9]{2})[0-9]*/;
            return Number(String(price).replace(reg, '$1'));
        },

        getScale(num) {
            const arr = String(Number(num)).split('.');
            if (arr.length === 1) {
                return 0;
            }
            return arr[1].length;
        },
        checkPriceInput() {
            const refundVal = this.dishPrice;
            this.errorMsg = '';
            this.pass = true;
            if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(refundVal)) {
                this.pass = false;
                this.errorMsg = '退款金额格式不正确';
            } else if (parseFloat(refundVal) <= 0) {
                this.pass = false;
                this.errorMsg = '退款金额不能为0';
            } else if (
                parseFloat(refundVal) >
        parseFloat(this.refundableOrderHeadInfo.merchantAmount)
            ) {
                this.errorMsg = '退款金额不能大于用户支付金额';
                this.pass = false;
            }
            if (this.dishPrice === this.refundPrice) {
                this.refundType = 0;
            } else {
                this.refundType = 1;
            }
        },
        listenToEscKey() {
            document.addEventListener('keyup', (e) => {
                if (e.keyCode === 27) {
                    this.close();
                }
            });
        },
    },
    mounted() {
        if (this.source === 'exe') {
            import('./refund-detail-exe.less');
        }

        this.listenToEscKey();
        document.body.style = 'height:100%;overflow:hidden';
        this.loading = this.$loading();
        let refundDetailURL = `${this.shopId}/order/${this.order.orderId}`;
        if (this.order.orderType === ORDER_TYPE.HACK) {
            refundDetailURL += '/hackRefundableDish';
        } else {
            refundDetailURL += '/orderdishRefundableDish';
        }
        Ajax.get({
            url: refundDetailURL,
            params: {
                viewId: this.order.viewId,
            },
            success: (res) => {
                this.loading.$stopLoading();
                if (Number(res.code) === 200) {
                    this.showPanel = true;
                    this.refundableOrderHeadInfo = res.data.refundableOrderHeadInfo;
                    this.subRefundableOrderList = res.data.subRefundableOrderList;
                    this.dealData();
                } else if (Number(res.code) === 403) {
                    this.$toast({
                        text: '你已退出登录，请重新刷新试试',
                        duration: 1000,
                    });
                }
            },
            error: () => {
                this.loading.$stopLoading();
            },
        });
    },
    components: {
        'bee-button': Button,
        'bee-confirm': Confirm,
    },
};
</script>

<style lang="less" scoped>
@import "./refund-detail.less";
</style>


