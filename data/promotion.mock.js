const promotionList = {
    "shopList":[
        {
            "id":8067103,
            "shopName":"肯德基(万达店)"
        },
        {
            "id":8067104,
            "shopName":"麦当劳(万达店)"
        }
    ],
    "holidayVOs":[ //【名称holiday修改】
        {
            "name":"春节",
            "dateDisplay":"1月27日-2月2日"
        }
    ],
    "promotionParamsVOs":[
        {
            "id":1376,
            "viewId":1376,
            "promotionType": 2, //优惠类型 1折扣，2满减
            "reductionVO": { //满减
                "step":3,
                "reduce":2,
                "hasOverlay":false, //限制叠加次数
                "additionCount":0 //限制叠加次数
            },
            "discountVO": null,
            "selectedShopIds":[ // 优惠门店
                8067103
            ],
            "durationVO":{ //优惠日期
                "type":2,
                "dateIntervalVO": { //【新增一层结构】
                    "fromDate":"2017-06-20",
                    "toDate":"2017-06-20",
                },
                "hasExcludeHoliday":true, //节假日不参与优惠
                "hasExcludeDateInterval":false,
                "excludeDateIntervals":[], //【字段修改】
                "hasExcludeWeekdays":false,
                "excludeWeekdays":[] //【字段修改】
            },
            "usePeriodVO": { // 时段选择【字段修改】
                "type":1,
                "interval":[
                    {
                        "fromTime":"00:00",
                        "timeSpan":1440
                    }
                ]
            },
            "categoryLimitVO": { // 优惠限制 - 指定分类不参与优惠，分类id
                "hasSelected": true,
                "categoryIds":[677135,655515]
            },
            "countLimitVO":{ // 优惠限制 - 限制参与活动次数
                "hasSelected": true,
                "limitCount":2
            },
            "status":2, //当前状体
            "categoryNames":[ // 优惠限制 - 指定分类不参与优惠，分类名称
                "test汤","雪婧测试(勿删)"
            ]
        }
    ]
};

const categoryList = {
    "code":200,
    "msg":"请求成功",
    "data":[
        {
            "id":677307,
            "name":"热菜"
        },
        {
            "id":677308,
            "name":"冷菜"
        },
        {
            "id":677309,
            "name":"套餐"
        },
        {
            "id":619719,
            "name":"RMB"
        },
        {
            "id":619718,
            "name":"分类的菜"
        },
        {
            "id":709052,
            "name":"arayzou"
        },
        {
            "id":654950,
            "name":"楼宇"
        },
        {
            "id":597369,
            "name":"罗宾沁爽果漾系列"
        },
        {
            "id":597380,
            "name":"分类1"
        },
        {
            "id":597381,
            "name":"分类2"
        },
        {
            "id":597382,
            "name":"分类3"
        },
        {
            "id":597383,
            "name":"分类4"
        },
        {
            "id":597384,
            "name":"分类5"
        },
        {
            "id":597371,
            "name":"乌素普魅力特调系列"
        },
        {
            "id":597372,
            "name":"布鲁克传统奶香系列"
        },
        {
            "id":597373,
            "name":"路飞鲜牛乳系列"
        },
        {
            "id":597374,
            "name":"乔巴活力养乐多系列"
        },
        {
            "id":597376,
            "name":"香吉士可口甜点系列"
        },
        {
            "id":597378,
            "name":"抹酱厚片吐司"
        },
        {
            "id":597379,
            "name":"风味小吃"
        },
        {
            "id":597370,
            "name":"弗兰克现磨经典咖啡系列"
        },
        {
            "id":597375,
            "name":"索隆畅爽果昔/冰沙系列"
        },
        {
            "id":597377,
            "name":"路飞堂超值套餐"
        },
        {
            "id":597385,
            "name":"商家APP"
        },
        {
            "id":629830,
            "name":"瑰鲜"
        }
    ]
};

export { promotionList, categoryList }
