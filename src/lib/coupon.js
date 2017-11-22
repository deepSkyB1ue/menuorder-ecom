import moment from 'moment';
/**
 * 获取优惠券/优惠活动状态
 * @param  {[type]} coupon [description]
 * @return {[type]}      [description]
 */
function getCouponActivityStatus(dateIntervalVO) {
    const beginTime = moment(dateIntervalVO.fromDate);
    const endTime = moment(dateIntervalVO.toDate);
    const time = moment(moment().format('YYYY-MM-DD'));

    if (beginTime.isAfter(time)) {
        return {
            status: 1,
            text: '未开始',
        };
    } else if (endTime.isBefore(time)) {
        return {
            status: 0,
            text: '已过期',
        };
    }
    return {
        status: 2,
        text: '生效中',
    };
}

/**
 * [数据处理]
 * @param  {[type]} coupon [description]
 * @return {[type]}        [description]
 */
function couponProcess(couponOrigin) {
    const coupon = JSON.parse(JSON.stringify(couponOrigin));
    coupon.name = coupon.name.replace(/(^\s*)|(\s*$)/g, '');

    if (!coupon.useDurationVO.hasExcludeWeekdays) {
        coupon.useDurationVO.excludeWeekdays = [];
    }
    if (!coupon.useDurationVO.hasExcludeDateInterval) {
        coupon.useDurationVO.excludeDateIntervals = [];
    }
    if (coupon.useDurationVO.type.toString() === '20') {
        coupon.useDurationVO.dateIntervalVO = null;
    }
    return coupon;
}

/**
 * 数据处理
 * @param  {[type]} promotionOrigin [description]
 * @return {[type]}                 [description]
 */
function promotionProcess(promotionOrigin) {
    const coupon = JSON.parse(JSON.stringify(promotionOrigin));

    if (coupon.promotionType.toString() === '1') {
        coupon.reductionVO = null;
    }

    if (coupon.promotionType.toString() === '2') {
        coupon.discountVO = null;
    }

    if (!coupon.durationVO.hasExcludeWeekdays) {
        coupon.durationVO.excludeWeekdays = [];
    }
    if (!coupon.durationVO.hasExcludeDateInterval) {
        coupon.durationVO.excludeDateIntervals = [];
    }

    return coupon;
}

export { getCouponActivityStatus, couponProcess, promotionProcess };
