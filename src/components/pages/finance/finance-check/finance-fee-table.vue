<template>
    <table>
        <tbody>
        <tr>
            <th v-for="item in rowConfigs">
                <div class="item-style">
                    <span class="fee-name">{{item.name}}</span>
                    <span class="tip-box">
                        <span class="tip-popover">
                            {{item.tips}}
                            <i></i>
                        </span>
                    </span>
                    <!-- <i class="questionmark-icon"></i> -->
                    <p>{{item.fee}}</p>
                    <!--<p>$0.0</p>-->
                    <span class="fee-symbol">{{item.symbol}}</span>
                </div>
            </th>
        </tr>
        </tbody>
    </table>
</template>

<script>
    export default{
        name: 'finance-fee-table',
        props: ['configInfo'],
        data() {
            return {
                rowConfigs: [
                    {
                        name: '商户实收',
                        tips: '商家实际从平台收到的金额',
                        fee: this.configInfo.settleAmount,
                        symbol: '=',
                    },
                    {
                        name: '消费金额',
                        tips: '原始订单金额汇总',
                        fee: this.configInfo.consumptionAmount,
                        symbol: '-',
                    },
                    {
                        name: '优惠金额',
                        tips: '商家在收银和平台配置的满减折扣、秒付优惠券和会员优惠券优惠金额汇总',
                        fee: this.configInfo.discountAmount,
                        symbol: '-',
                    },
                    {
                        name: '储值金额',
                        tips: '用户使用储值卡支付的金额',
                        fee: this.configInfo.prePaidAmount,
                        symbol: '-',
                    },
                    {
                        name: '积分抵扣金额',
                        tips: '用户使用积分抵扣的金额',
                        fee: this.configInfo.integralDeductionAmount,
                        symbol: '-',
                    },
                    {
                        name: '抹零金额',
                        tips: '根据收银设置的规则，向上或向下取整的金额',
                        fee: this.configInfo.malingAmount,
                        symbol: '-',
                    },
                    {
                        name: '累计退款金额',
                        tips: '订单累计退款金额',
                        fee: this.configInfo.refundAmount,
                        symbol: '-',
                    },
                    {
                        name: '服务费',
                        tips: '商家实际支付的手续费',
                        fee: this.configInfo.commissionAmount,
                        symbol: '',
                    },
                ],
            };
        },
        watch: {
            configInfo: 'updateConfigs',
        },
        methods: {
            updateConfigs() {
                this.rowConfigs = [
                    {
                        name: '商户实收',
                        tips: '商家实际从平台收到的金额',
                        fee: this.configInfo.settleAmount,
                        symbol: '=',
                    },
                    {
                        name: '消费金额',
                        tips: '原始订单金额汇总',
                        fee: this.configInfo.consumptionAmount,
                        symbol: '-',
                    },
                    {
                        name: '优惠金额',
                        tips: '商家在收银和平台配置的满减折扣、秒付优惠券和会员优惠券优惠金额汇总',
                        fee: this.configInfo.discountAmount,
                        symbol: '-',
                    },
                    {
                        name: '储值金额',
                        tips: '用户使用储值卡支付的金额',
                        fee: this.configInfo.prePaidAmount,
                        symbol: '-',
                    },
                    {
                        name: '积分抵扣金额',
                        tips: '用户使用积分抵扣的金额',
                        fee: this.configInfo.integralDeductionAmount,
                        symbol: '-',
                    },
                    {
                        name: '抹零金额',
                        tips: '根据收银设置的规则，向上或向下取整的金额',
                        fee: this.configInfo.malingAmount,
                        symbol: '-',
                    },
                    {
                        name: '累计退款金额',
                        tips: '订单累计退款金额',
                        fee: this.configInfo.refundAmount,
                        symbol: '-',
                    },
                    {
                        name: '服务费',
                        tips: '商家实际支付的手续费',
                        fee: this.configInfo.commissionAmount,
                        symbol: '',
                    },
                ];
            },
        },
    };
</script>

<style lang="less" scoped>
    @import "finance-fee-table.less";
</style>
