var Mock = require("mockjs");
//moma shoplist and shopdetail *********
var orderList = {
    "code": "200",
    "msg": "成功",
    "data": {
        "shopInfoVO": {
            "shopId": 8067103,
            "shopName": "HomeThai",
            "shopType": 1,
            "isPostPay": 1,
            "isSupportTable": 1
        },
        "orderVOList": [
            {
                "tableNo": "105",
                "orderId": 6012339,
                "viewId": "2574267_B0117091100027",
                "barCode": "",
                "viewBarCode": "",
                "userId": 5045806,
                "phone": "13564999122",
                "addTime": "",
                "payTime": "2017-09-11 17:15",
                "realAddTime": 0,
                "statusDisplay": "已退款",
                "statusDisplayCode": 116,
                "isNewFlag": 0,
                "orderStatus": 0,
                "payStatus": 22,
                "toConfirmFlag": 0,
                "toRefundFlag": 0,
                "refundPirce": 0.18,
                "originPrice": 88,
                "consumptionPrice": 88,
                "customerPrice": 0,
                "shopIncoming": 0,
                "merchantDiscountAmount": 58.8,
                "merchantDiscountInfo": [],
                "customerDiscountAmount": 58.8,
                "customerDiscountInfo": [],
                "blackListed": false,
                "markUsered": false,
                "orderType": 3,
                "updateTime": 1505121600000,
                "displayUpdateTime": "2017-10-31 10:19",
                "addTime":"2017-09-11",
                "operationTypeList": [{
                        "code": 40,
                        "operation": "打印",
                        "status": false
                    },
                    {
                        "code": 20,
                        "operation": "拉黑",
                        "status": true
                    },
                    {
                        "code": 30,
                        "operation": "逃单",
                        "status": false
                    },
                    {
                        "code": 10,
                        "operation": "退款",
                        "status": false
                    }
                ],
                "useVipDiscount": true,
                "authCode": "81dc9bdb52d04dc20036dbd8313ed055",//1234
                "invoice": "1",
                "invoiceCode": "1111111111",
                "payChannel": "微信"
            },
            {
                "tableNo": "105",
                "orderId": 6012337,
                "viewId": "2574267_B0117091100025",
                "barCode": "",
                "viewBarCode": "",
                "userId": 5045806,
                "phone": "13564999122",
                "addTime": "",
                "payTime": "2017-09-11 16:56",
                "realAddTime": 0,
                "statusDisplay": "用户已支付成功已支付成功",
                "statusDisplayCode": 116,
                "isNewFlag": 0,
                "orderStatus": 0,
                "payStatus": 22,
                "toConfirmFlag": 0,
                "toRefundFlag": 0,
                "refundPirce": 0.9,
                "originPrice": 1,
                "consumptionPrice": 1,
                "customerPrice": 0.1,
                "shopIncoming": 0.1,
                "merchantDiscountAmount": 0.1,
                "merchantDiscountInfo": [],
                "customerDiscountAmount": 0.1,
                "customerDiscountInfo": [],
                "blackListed": false,
                "markUsered": false,
                "orderType": 1,
                "updateTime": 1505121000000,
                "displayUpdateTime": "2017-09-11 17:10",
                "operationTypeList": [{
                        "code": 40,
                        "operation": "打印",
                        "status": false
                    },
                    {
                        "code": 20,
                        "operation": "拉黑",
                        "status": false
                    },
                    {
                        "code": 30,
                        "operation": "逃单",
                        "status": false
                    },
                    {
                        "code": 10,
                        "operation": "退款",
                        "status": false
                    }
                ],
                "useVipDiscount": false,
                "authCode": "81dc9bdb52d04dc20036dbd8313ed055",
                "invoice": "",
                "invoiceCode": "",
                "payChannel": ""
            }
        ],
        "pagination": {
            "pageSize": 25,
            "totalRecord": 173,
            "totalPages": 7
        }
    }
};

var queryRefundableDish = {
    "code": 200,
    "msg": "成功",
    "data": {
        "refundableOrderHeadInfo": {
            "barCode": "1432",
            "orderViewId": "0704327819",
            "tableNo": "1",
            "orderGroupId": 21149045,
            "orderTime": "2017-07-10 15:38:51",
            "phone": "",
            "merchantAmount": 610.11,
            "consumptionPrice": 629.11,
            "refundAmount": 4,
            "disCountAmount": 14,
            "payPrice": 610.11,
            "canRefundAll": true
        },
        "subRefundableOrderList": [{
            "orderId": 303916,
            "payPrice": 615.02,
            "subOrderTime": "2017-07-10 15:38",
            "promotionRatio": 0.886188,
            "refundableSkuVOs": [{
                    "skuId": 10569299,
                    "name": "234234234",
                    "count": 2,
                    "originPrice": 0,
                    "currentPrice": 0,
                    "status": "已支付",
                    "specAttr": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "sharePromotion": 1,
                    "suggestRefundPrice": 0
                },
                {
                    "skuId": 10569302,
                    "name": "412",
                    "count": 1,
                    "originPrice": 123,
                    "currentPrice": 123,
                    "status": "已支付",
                    "specAttr": [],
                    "sharePromotion": 1,
                    "suggestRefundPrice": 117.849281
                },
                {
                    "skuId": 11687204,
                    "name": "可选套餐",
                    "count": 1,
                    "originPrice": 0.01,
                    "currentPrice": 0.01,
                    "status": "已退款",
                    "specAttr": [],
                    "sharePromotion": 0,
                    "suggestRefundPrice": 0.009835
                },
                {
                    "skuId": 10569300,
                    "name": "123123",
                    "count": 1,
                    "originPrice": 0.01,
                    "currentPrice": 0.01,
                    "status": "已支付",
                    "specAttr": [],
                    "sharePromotion": 1,
                    "suggestRefundPrice": 0.009591
                },
                {
                    "skuId": 11687225,
                    "name": "A",
                    "count": 1,
                    "originPrice": 10,
                    "currentPrice": 5,
                    "status": "已支付",
                    "specAttr": [],
                    "sharePromotion": 0,
                    "suggestRefundPrice": 4.912572
                },
                {
                    "skuId": 10565699,
                    "name": "炸鲜奶1",
                    "count": 7,
                    "originPrice": 67,
                    "currentPrice": 67,
                    "status": "已支付",
                    "specAttr": [],
                    "sharePromotion": 0,
                    "suggestRefundPrice": 65.828336
                }
            ],
            "refundableExtraFeeVOs": [{
                "id": 100944,
                "name": "餐位",
                "count": 3,
                "price": 9,
                "status": "已支付",
                "sharePromotion": 0,
                "suggestRefundPrice": 8.842615
            }]
        }]
    }
};
var detail = {
    "code": '200',
    "msg": "成功",
    "data": {
        "orderDetailHeadInfo": {
            "barCode": "8080",
            "orderViewId": "0703326814",
            "orderDisplayStatus": "已退款",
            "orderDisplaySubStatus": "退款金额会在5个工作日内原路返回给顾客",
            "orderTime": "2017-07-03 11:23",
            "phone": "18080808080",
            "tableNo": "0005",
            "viewBarCode": "8080",
            "isPostPay": "0",
            "isDisplayRefundButton": 1,
            "toRefundFlag": 1,
            "totalOriginPrice": 249.03,
            "totalCurrentPrice": 231,
            "totalConsumptionPrice": 100.01,
            "totalDiscountAmount": 17,
            "totalRefundAmount": 114.02,
            "totalPayPrice": 100.01,
            "cloudPrintable": true,
            "printable": true,
            "personCount": 8,
            "auditPersonCount": 1,
            "payChannel": "支付宝",
            "totalCashierDiscount":12,
            "totalPromotionDiscount":12,
            "totalCouponDiscount":12,
            "useVipDiscount": true,
            "priceInfoList":[
                {title:'price1',amount:12},
                {title:'price2',amount:12},
            ],
            "eraseZeroAmount":5,
            "invoice":"互怡信息上海",
            "invoiceCode":"HJFDsasjdfkasj"
        },
        "orderDetailList": {
            "subOrderDetailInfoList": [{
                    "orderViewId": "0703326816",
                    "orderTitle": "加菜菜品1",
                    "orderCreateTime": "2017-07-03 11:23",
                    "orderPayPrice": 7,
                    "orderPriceBeforePromotion": 10,
                    "orderPromotionPrice": 3,
                    "dishes": [{
                        "name": "A",
                        "count": 1,
                        "originPrice": 10,
                        "currentPrice": 10,
                        "isRefund": 0,
                        "specAttr": [],
                        "selectiveTastes": [],
                        "setMealSkus": []
                    }],
                    "remarksOfTaste": "好吃",
                    "remarksOfEndCustomers": "good",
                    "useCoupons": []
                },
                {
                    "orderViewId": "0703326814",
                    "orderTitle": "原点菜品",
                    "orderCreateTime": "2017-07-03 11:19",
                    "orderPayPrice": 207.03,
                    "orderPriceBeforePromotion": 221.03,
                    "orderPromotionPrice": 14,
                    "dishes": [{
                            "name": "1241",
                            "count": 1,
                            "originPrice": 123,
                            "currentPrice": 120,
                            "isRefund": 1,
                            "specAttr": [
                                1,
                                2,
                                3
                            ],
                            "selectiveTastes": [
                                "a",
                                "c",
                                "v"
                            ],
                            "setMealSkus": []
                        },
                        {
                            "name": "guixian的固定套餐",
                            "count": 1,
                            "originPrice": 0.01,
                            "currentPrice": 0.01,
                            "isRefund": 0,
                            "specAttr": [],
                            "selectiveTastes": [],
                            "setMealSkus": [{
                                    "name": "234234234",
                                    "count": 1,
                                    "originPrice": 0,
                                    "currentPrice": 0,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [],
                                    "setMealSkus": []
                                },
                                {
                                    "name": "123123",
                                    "count": 1,
                                    "originPrice": 0.01,
                                    "currentPrice": 0,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [],
                                    "setMealSkus": []
                                },
                                {
                                    "name": "1241",
                                    "count": 1,
                                    "originPrice": 123,
                                    "currentPrice": 0,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [],
                                    "setMealSkus": []
                                },
                                {
                                    "name": "412",
                                    "count": 1,
                                    "originPrice": 123,
                                    "currentPrice": 0,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [],
                                    "setMealSkus": []
                                },
                                {
                                    "name": "鱼香肉丝1",
                                    "count": 1,
                                    "originPrice": 123,
                                    "currentPrice": 0,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [],
                                    "setMealSkus": []
                                },
                                {
                                    "name": "鱼香肉丝123",
                                    "count": 1,
                                    "originPrice": 123,
                                    "currentPrice": 0,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [],
                                    "setMealSkus": []
                                },
                                {
                                    "name": "124",
                                    "count": 1,
                                    "originPrice": 34,
                                    "currentPrice": 0,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [],
                                    "setMealSkus": []
                                }
                            ]
                        },
                        {
                            "name": "234234234",
                            "count": 1,
                            "originPrice": 0,
                            "currentPrice": 0,
                            "isRefund": 0,
                            "specAttr": [],
                            "selectiveTastes": [],
                            "setMealSkus": []
                        },
                        {
                            "name": "冷葡萄柚多多L",
                            "count": 1,
                            "originPrice": 14,
                            "currentPrice": 14,
                            "isRefund": 0,
                            "specAttr": [],
                            "selectiveTastes": [],
                            "setMealSkus": []
                        },
                        {
                            "name": "可选套餐",
                            "count": 1,
                            "originPrice": 0.01,
                            "currentPrice": 0.01,
                            "isRefund": 0,
                            "specAttr": [],
                            "selectiveTastes": [],
                            "setMealSkus": [{
                                    "name": "冷柠檬多多L",
                                    "count": 1,
                                    "originPrice": 14,
                                    "currentPrice": 14,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [],
                                    "setMealSkus": []
                                },
                                {
                                    "name": "炸鲜奶1",
                                    "count": 1,
                                    "originPrice": 67,
                                    "currentPrice": 67,
                                    "isRefund": 0,
                                    "specAttr": [],
                                    "selectiveTastes": [
                                        "赤道火",
                                        "不酸"
                                    ],
                                    "setMealSkus": []
                                }
                            ]
                        },
                        {
                            "name": "123123",
                            "count": 1,
                            "originPrice": 0.01,
                            "currentPrice": 0.01,
                            "isRefund": 0,
                            "specAttr": [],
                            "selectiveTastes": [],
                            "setMealSkus": []
                        },
                        {
                            "name": "A",
                            "count": 3,
                            "originPrice": 30,
                            "currentPrice": 15,
                            "isRefund": 0,
                            "specAttr": [],
                            "selectiveTastes": [],
                            "setMealSkus": []
                        },
                        {
                            "name": "餐位",
                            "count": 8,
                            "originPrice": 72,
                            "currentPrice": 72,
                            "isRefund": 0
                        }
                    ],
                    "remarksOfTaste": "12",
                    "remarksOfEndCustomers": "12",
                    "useCoupons": [
                        "使用满22减11券优惠券1张"
                    ]
                }
            ],
            "refundDetailInfoList": [{
                "refundId": "24466",
                "refundDesc": "",
                "refundAmount": "114.02",
                "refundTime": "2017-07-03 11:45",
                "refundProcess": 1,
                "dishes": [{
                    "name": "1241",
                    "count": 1,
                    "originPrice": 120,
                    "currentPrice": 120,
                    "isRefund": 1,
                    "specAttr": [],
                    "suggestRefundPrice": 114.027968,
                    "selectiveTastes": [],
                    "setMealSkus": []
                }]
            }]
        },
        "orderType": 1
    }
};
Mock.mock(/uni_order/, orderList);
Mock.mock(/refund/, queryRefundableDish);
Mock.mock(/detail/, detail);


//moma shoplist and shopdetail ********* end
