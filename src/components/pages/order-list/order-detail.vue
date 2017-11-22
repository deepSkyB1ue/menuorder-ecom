<template>
    <div class='main-container' v-cloak v-if='showPanel'>
        <div class="order-panel" v-if='orderDetailHeadInfo'>
            <div class="header">
                <div class="title">点单详情</div>
                <div class="close" @click='close'></div>
            </div>
            <div class="content">
                <div class="main-info-container">
                    <div class="top-line">
                        <span v-if='orderDetailHeadInfo.barCode'>
                            点单码：{{orderDetailHeadInfo.barCode}}
                        </span>
                        <span v-if='orderDetailHeadInfo.viewId'>
                            订单编号：{{orderDetailHeadInfo.viewId}}
                        </span>
                        <span v-if='orderDetailHeadInfo.orderTime'>
                            下单时间：{{orderDetailHeadInfo.orderTime}}
                        </span>
                    </div>

                    <div class='order-tips' :class='bgColor'>
                        <div class='main-tip'>
                            <span :class='iconColor'></span>
                            <span :class='displayColor'>{{orderDetailHeadInfo.orderDisplayStatus}}</span>
                        </div>
                        <div class='desc' v-html='orderDetailHeadInfo.orderDisplaySubStatus'></div>
                    </div>

                    <div class='detail-info'>
                        <div class="left-panel">
                            <div class="top">
                                <div class='table-number'>
                                    桌号：{{orderDetailHeadInfo.tableNo|| '-' }}
                                </div>
                                <div class='person-number' v-if='orderDetailHeadInfo.personCount'>
                                    {{orderDetailHeadInfo.personCount}}人就餐
                                </div>
                            </div>
                            <div class="bottom">
                                <div class='phone-text'>手机号码：</div>
                                <div class='phone-number'>{{orderDetailHeadInfo.phone || '顾客未绑定'}}</div>
                            </div>
                        </div>
                        <div class="vertical-line">
                        </div>
                        <div class="right-panel">
                            <div class='item' v-if='orderDetailHeadInfo.totalCurrentPrice'>
                                <div>消费金额：</div>
                                <div>￥{{orderDetailHeadInfo.totalCurrentPrice.toFixed(2)}}</div>
                            </div>
                            <div class='item' v-if='orderDetailHeadInfo.totalDiscountAmount && order.orderType ===3 '>
                                <div>优惠金额：</div>
                                <div>￥{{orderDetailHeadInfo.totalDiscountAmount.toFixed(2)}}</div>
                            </div>
                            <div class='item' v-if='orderDetailHeadInfo.totalCashierDiscount'>
                                <div>收银优惠：</div>
                                <div>-￥{{orderDetailHeadInfo.totalCashierDiscount.toFixed(2)}}</div>
                            </div>
                            <div class='item' v-if='orderDetailHeadInfo.totalPromotionDiscount'>
                                <div>支付优惠：</div>
                                <div>-￥{{orderDetailHeadInfo.totalPromotionDiscount.toFixed(2)}}</div>
                            </div>
                            <div class='item' v-if='orderDetailHeadInfo.totalCouponDiscount'>
                                <div>优惠券抵扣：</div>
                                <div>{{orderDetailHeadInfo.totalCouponDiscount}}</div>
                            </div>
                            <div class='item' v-for='(item, index) in orderDetailHeadInfo.priceInfoList' :key="index">
                                <div>{{item.title}}</div>
                                <div>-￥{{Number(item.amount).toFixed(2)}}</div>
                            </div>
                            <div class='item' v-if='orderDetailHeadInfo.eraseZeroAmount'>
                                <div>抹零：</div>
                                <div>{{orderDetailHeadInfo.eraseZeroAmount}}</div>
                            </div>
                            <div class='item' v-if='orderDetailHeadInfo.totalRefundAmount'>
                                <div>退款金额：</div>
                                <div>-￥{{orderDetailHeadInfo.totalRefundAmount}}</div>
                            </div>
                            <div class="pay-money">
                                <div>实付金额<span v-if='orderDetailHeadInfo.payChannel'>（{{orderDetailHeadInfo.payChannel}}）</span>：</div>
                                <div class='show-value'>￥{{Number(orderDetailHeadInfo.totalConsumptionPrice).toFixed(2)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-container">
                    <div class="tab tab-title " :class="{'active':activeTab==='orderDish'}" @click='showDishDetail()'>
                        点餐详情
                    </div>
                    <div class="tab tab-title" :class="{'active':activeTab==='refund'}" @click='showRefundDetail()' v-if='refundDetail.length'>
                        退款详情
                    </div>
                </div>
                <div v-if="activeTab ==='orderDish'" class="order-container">
                    <div v-if="orderDetail.length">
                        <div class="invoice-cont" v-if='orderDetailHeadInfo.invoice || orderDetailHeadInfo.invoiceCode'>
                            <div class='tip-line' v-if='orderDetailHeadInfo.invoice'>发票抬头：
                                <span id='company-name'>{{orderDetailHeadInfo.invoice}}</span>
                                <a class='copy-link' id="company-name" :data-clipboard-text='orderDetailHeadInfo.invoice' @click="copy('company-name')">复制</a>
                            </div>
                            <div class='tip-line' v-if='orderDetailHeadInfo.invoiceCode'>税号：
                                <span id='tax-number'>{{orderDetailHeadInfo.invoiceCode}}</span>
                                <a class='copy-link' id="tax-number" :data-clipboard-text='orderDetailHeadInfo.invoiceCode' @click="copy('tax-number')">复制</a>
                            </div>
                        </div>
                        <div class="dish-header">
                            <div class="dish-name">菜品</div>
                            <div class="dish-number"></div>
                            <div class="dish-number">份数</div>
                            <div class="dish-price">价格</div>
                        </div>
                        <div class="order-list" v-for='(orderItem,index) in orderDetail' :key='inrdex'>
                            <div class="order-time">
                                <label v-if='index === orderDetail.length - 1'>点餐时间：</label>
                                <label v-else>加菜时间：</label>
                                {{orderItem.orderCreateTime}}
                            </div>
                            <div class="order-item" v-for='(dish, index) in orderItem.dishes' :key="index">
                                <div class="item-name-container">
                                    <div class='item-name'>{{dish.name}}</div>
                                    <div class="spec-attr-cont">
                                        <div class='spec-attr' v-for='(spec, index) in dish.specAttr' :key="index">
                                            {{spec}}
                                        </div>
                                        <div class='spec-attr' v-for='(taste, index) in dish.selectiveTastes' :key="index">
                                            {{taste}}
                                        </div>
                                    </div>
                                </div>
                                <div class='refund-info'>
                                    <label class="refund" v-if='dish.isRefund == 1'>退款菜品</label>
                                </div>
                                <div class="item-number-container">
                                    <span class='multi'></span>
                                    <span class='number-word'>
                                        {{dish.count}}
                                    </span>
                                </div>
                                <div class="item-price">
                                    <span class='origin-price' v-if='dish.originPrice!=dish.currentPrice'>
                                        ￥{{dish.originPrice}}
                                    </span>
                                    <span>￥{{dish.currentPrice}}</span>
                                </div>
                            </div>

                            <div class='total-price' v-if='order.orderType !== 3'>
                                <div class='item'>消费金额：￥{{orderItem.orderPriceBeforePromotion}}</div>
                                <div class='item'>优惠金额：￥{{orderItem.orderPromotionPrice}}</div>
                                <div class='item'>用户实付：￥{{orderItem.orderPayPrice}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class='empty-order'>无点餐详情</div>
                    </div>
                </div>
                <div v-if="activeTab ==='refund'" class='refund-detail-cont order-container'>
                    <div v-if="refundDetail.length && order.orderType === 1">
                        <div class="dish-header">
                            <div class="dish-name">菜品</div>
                            <div class="dish-number">份数</div>
                            <div class="dish-price">价格</div>
                        </div>
                        <div class="order-list" v-for='refundOrder in refundDetail' :key="index">
                            <div class="order-time">
                                <label>退款时间：{{refundOrder.refundTime}}</label>
                            </div>
                            <div class="order-item" v-for='(dish, index) in refundOrder.dishes' :key="index">
                                <div class="item-name-container">
                                    <div class='item-name'>{{dish.name}}</div>
                                    <div class="spec-attr-cont">
                                        <div class='spec-attr' v-for='(spec, index) in dish.specAttr' :key="index">
                                            {{spec}}
                                        </div>
                                        <div class='spec-attr' v-for='(taste, index) in dish.selectiveTastes' :key="index">
                                            {{taste}}
                                        </div>
                                    </div>
                                </div>
                                <div class="item-number-container">
                                    <span class='multi'></span>
                                    <span class='number-word'>
                                        {{dish.count}}
                                    </span>
                                </div>
                                <div class="item-price">
                                    <span class='origin-price' v-if='dish.originPrice!=dish.currentPrice'>
                                        ￥{{dish.originPrice}}
                                    </span>
                                    <span>￥{{dish.currentPrice}}</span>
                                </div>
                            </div>
                            <div class="refund-desc">
                                <span>退款金额: {{refundOrder.refundAmount}} </span>
                                <span class="refund-process" v-if='refundOrder.refundProcess ===0'>退款失败</span>
                                <span class="refund-process" v-if='refundOrder.refundProcess ===1'>退款成功</span>
                                <span class="refund-process" v-if='refundOrder.refundProcess ===2'>退款中</span>
                                <span class="refund-process" v-if='refundOrder.refundProcess ===3'>退款受理</span>
                                <span class="refund-process" v-if='refundOrder.refundProcess ===4'>退款拒绝</span>
                            </div>

                            <div class='refund-word' v-for='(desc, index) in order.refundDesc' :key="index">
                                @{desc.refundDesc}
                            </div>
                        </div>
                    </div>
                    <div v-else-if='refundDetail.length && (order.orderType === 2 || order.orderType === 3)'>
                        <div class="hack-refund" v-for='refundOrder in refundDetail' :key="refundOrder.refundId">
                            <div class="main-container">
                                <div class='refund-time'>退款时间：{{refundOrder.refundTime}}<span v-if='refundOrder.refundDesc'>({{refundOrder.refundDesc}})</span></div>
                                <div class='refund-money'>
                                    <span>退款金额: ¥{{refundOrder.refundAmount}}</span>
                                    <span class="refund-process" v-if='refundOrder.refundProcess === 0'>（退款失败）</span>
                                    <span class="refund-process" v-else-if='refundOrder.refundProcess === 1'>（退款成功）</span>
                                    <span class="refund-process" v-else-if='refundOrder.refundProcess === 2'>（退款中）</span>
                                    <span class="refund-process" v-else-if='refundOrder.refundProcess === 3'>（退款受理）</span>
                                    <span class="refund-process" v-else-if='refundOrder.refundProcess === 4'>（退款拒绝）</span>
                                </div>
                            </div>
                            <div class="dish-remark-warning" v-if='refundOrder.refundDesc && order.orderType !== 3 '>{{refundOrder.refundDesc}}</div>
                            <div class="refund-vip-remark" v-if='orderDetailHeadInfo.useVipDiscount'>注: 顾客使用的会员积分、优惠券、储值，退款时将全部退回。</div>
                        </div>
                    </div>
                </div>
                <div class="tel">
                    <p>*退款会按原路退回到客人的支付宝/微信/银行卡；支付宝/微信一般即时到账，银行卡到账时间视各银行具体流程而定</p>
                    <p>*若无退款按钮，请让客人联系大众点评客服退款，1010-0011</p>
                </div>
            </div>
            <div class="footer" v-if='showFooter'>
                <div class="button-container">
                    <ui-button class='btn-solid-small-green-normal' text='云打印' @click='cloudPrint()' v-if='orderDetailHeadInfo.cloudPrintable'></ui-button>
                    <ui-button class='btn-solid-small-green-normal' text='打印' @click='print()' v-if='orderDetailHeadInfo.printable'></ui-button>
                    <ui-button class='btn-solid-small-green-normal' text='退款' @click='handleRefundBtnDidClick()' v-if='orderDetailHeadInfo.isDisplayRefundButton || orderDetailHeadInfo.toRefundFlag'></ui-button>
                </div>

            </div>
        </div>
        <div class="over-layer">
        </div>
        <bee-popup v-if="popupObject.visible"
                   title="退款"
                   :visible="popupObject.visible"
                   @close="closeMembercardRefundAllPopup">
            <div slot="pop-content">
                <div class="membercard-refund-all-content">
                    <div class="title">确认全单退款？</div>
                    <p class="refund-amount">退款金额: <span class="membercard-refund-price">{{orderDetailHeadInfo.totalPayPrice}}</span><br>
                    <span class="tips">(顾客使用的会员积分、优惠券、储值，退款时将全部退回)</span></p>
                    <div class="btn-container">
                        <ui-button id="confirm-btn"
                                   text="全单退款" 
                                   type="btn-solid-small-green-normal" 
                                   @click="postMembercardRefundAllRequest">
                        </ui-button>
                        <ui-button text="取消"
                                   type="btn-solid-small-grey-normal"
                                   @click="closeMembercardRefundAllPopup">
                        </ui-button>
                    </div>
                </div>
            </div>
        </bee-popup>
        <bee-confirm :title="confirmObject.title"
                     :content="confirmObject.content"
                     :confirm-text="confirmObject.confirmText"
                     :visible="confirmObject.visible"
                     :mode="confirmObject.mode"
                     @close="closeConfirm"
                     @confirm="closeConfirm">
        </bee-confirm>
    </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
import Vue from 'vue'; // eslint-disable-line import/extensions
import { Ajax, copyClipboard } from '@/lib/utils.js';
import getPath from '@/lib/path.js';
import { Button, Popup, Confirm } from '@dp/bee-ui'; // eslint-disable-line import/extensions
import RefundDetail from '@/components/pages/order-list/refund-detail.vue';
import AuthCodeValidate from '@/components/pages/order-list/authcodeValidate.js';
import { ORDER_TYPE } from '@/lib/constant.js';
import RefundDetailBJ from '@/components/pages/order-list/refund-detail-miaofu-bj.vue';


export default {
    data() {
        return {
            source: '',
            showPanel: false,
            displayColor: 'color-green',
            bgColor: 'bgColor-green',
            iconColor: 'icon-green',
            activeTab: 'orderDish',
            orderDetail: [],
            refundDetail: [],
            orderDetailHeadInfo: {},
            showFooter: false,
            popupObject: {
                visible: false,
            },
            loading: null,
            confirmObject: {
                title: '',
                content: '',
                confirmText: '',
                visible: false,
                mode: true,
            },
            shopId: '',
            order: {},
        };
    },
    methods: {
        cloudPrint() {
            Ajax.post({
                url: `${this.shopId}/order/cloudPrint`,
                params: {
                    orderId: this.order.orderId,
                    viewId: this.order.viewId,
                    orderType: this.order.orderType,
                },
                success: (res) => {
                    if (res.code === '200') {
                        this.$toast({
                            text: '打印任务发送成功!',
                            duration: 2000,
                        });
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
        copy(str) {
            copyClipboard(str);
        },
        print() {},
        postMembercardRefundAllRequest() {
            if (this.order.orderType !== ORDER_TYPE.HACK) {
                return;
            }
            this.loading = this.$loading();
            const refundAjaxUrl = `${getPath().ajax}/${this.shopId}/order/${this.orderDetailHeadInfo.orderViewId}/refundShHackOrder`;

            Ajax.post({
                url: refundAjaxUrl,
                params: {
                    pullOrderId: this.orderDetailHeadInfo.orderId,
                    refundAmount: this.orderDetailHeadInfo.totalPayPrice,
                },
                success: (res) => {
                    this.loading.$stopLoading();
                    switch (Number(res.code)) {
                    case 200:
                        this.$toast({
                            text: res.msg || '成功',
                            duration: 1000,
                        });
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                        break;
                    case 500: {
                        const title = res.data.title || '发起退款失败';
                        const msg = res.data.msg || (res.msg || '发起退款失败，请稍后重试');
                        this.confirmObject.title = title;
                        this.confirmObject.content = msg;
                        this.confirmObject.confirmText = '知道了';
                        this.confirmObject.visible = true;
                        break;
                    }
                    default:
                        this.$toast({
                            text: res.msg || '服务器出错',
                            duration: 2000,
                        });
                        break;
                    }
                },
                error: () => {
                    this.loading.$stopLoading();
                    this.$toast({
                        text: '网络错误',
                        duration: 2000,
                    });
                },
            });
        },
        handleRefundBtnDidClick() {
            const authCode = this.order.authCode;
            const useVipDiscount = this.orderDetailHeadInfo.useVipDiscount;

            const self = this;
            AuthCodeValidate({
                realAuthCode: authCode,
                callback: () => {
                    if (useVipDiscount) {
                        self.showMembercardRefundAllPopup();
                    } else if (this.order.orderType === ORDER_TYPE.BJ_HACK) {
                        const refundDetail = new Vue(RefundDetailBJ);
                        refundDetail.refundPrice = this.orderDetailHeadInfo.totalConsumptionPrice;
                        refundDetail.shopId = this.shopId;
                        refundDetail.orderId = this.order.orderId;
                        refundDetail.authCode = authCode;
                        document.body.appendChild(refundDetail.$mount().$el);
                    } else {
                        const refundDetail = new Vue(RefundDetail);
                        refundDetail.order = this.order;
                        refundDetail.shopId = this.shopId;
                        refundDetail.source = this.source;
                        refundDetail.authCode = authCode;
                        document.body.appendChild(refundDetail.$mount().$el);
                    }
                },
            });
        },
        showMembercardRefundAllPopup() {
            this.popupObject.visible = true;
        },
        closeMembercardRefundAllPopup() {
            this.popupObject.visible = false;
        },
        showConfirm() {
            this.confirmObject.visible = true;
        },
        closeConfirm() {
            this.confirmObject.visible = false;
        },
        showDishDetail() {
            this.activeTab = 'orderDish';
        },
        showRefundDetail() {
            this.activeTab = 'refund';
        },
        close() {
            this.$destroy();
            this.$el.remove();
            document.body.style = '';
        },
        deal() {
            //  暂时不展示Footer
            if (this.orderDetailHeadInfo.cloudPrintable ||
                this.orderDetailHeadInfo.printable ||
                this.orderDetailHeadInfo.isDisplayRefundButton) {
                this.showFooter = true;
            }
            switch (this.orderDetailHeadInfo.orderDisplayStatusCode) {
            case 100:
            case 101:
            case 108:
            case 109:
            case 111:
                this.bgColor = 'bgColor-yellow';
                this.displayColor = 'color-yellow';
                this.iconColor = 'icon-yellow';
                break;
            case 103:
            case 104:
                this.bgColor = 'bgColor-grey';
                this.displayColor = 'color-grey';
                this.iconColor = 'icon-grey';
                break;
            case 105:
            case 107:
            case 110:
                this.bgColor = 'bgColor-red';
                this.displayColor = 'color-red';
                this.iconColor = 'icon-red';
                break;
            case 106:
            case 102:
            case 112:
            case 113:
            case 115:
            case 116:
                this.bgColor = 'bgColor-green';
                this.displayColor = 'color-green';
                this.iconColor = 'icon-green';
                break;
            default:
                this.bgColor = 'bgColor-green';
                this.displayColor = 'color-green';
                this.iconColor = 'icon-green';
                break;
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
        this.listenToEscKey();
        document.body.style = 'height:100%;overflow:hidden';
        this.loading = this.$loading();
        Ajax.get({
            url: `${this.shopId}/order/${this.order.orderId}/detail`,
            params: {
                viewId: this.order.viewId,
                orderType: this.order.orderType,
            },
            success: (res) => {
                this.loading.$stopLoading();
                if (res.code === '200') {
                    this.showPanel = true;
                    this.orderDetailHeadInfo = res.data.orderDetailHeadInfo;
                    this.orderDetail =
                        res.data.orderDetailList.subOrderDetailInfoList || [];
                    this.refundDetail =
                        res.data.orderDetailList.refundDetailInfoList || [];
                    this.deal();
                } else if (res.code === 403) {
                    this.$toast({
                        text: '你已退出登录，请重新刷新试试',
                        duration: 1000,
                    });
                }
            },
            error: () => {
                this.loading.$stopLoading();
                this.$toast({
                    text: '网络错误，请重试',
                    duration: 2000,
                });
            },
        });
    },
    components: {
        'ui-button': Button,
        'bee-popup': Popup,
        'bee-confirm': Confirm,
        'refund-detail': RefundDetail,
    },
};
</script>

<style lang="less">
@import '~@dp/bee-ui/dist/styles/theme/ecom/index.css';
@import './order-detail.less';
</style>
