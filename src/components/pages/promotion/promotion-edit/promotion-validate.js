/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import {
    intervalValidate,
} from '../../../../lib/period.js';

import {
    dateRangeValidate,
} from '../../../../lib/validate.js';

// 所有需要校验的字段名
const fieldNameList = ['name', 'reductionVO.step', 'reductionVO.reduce', 'reductionVO.additionCount', 'discountVO.discount', 'discountVO.maxDiscount', 'countLimitVO.limitCount', 'selectedShopIds', 'durationVO.dateIntervalVO', 'durationVO.excludeDateIntervals', 'durationVO.excludeWeekdays', 'usePeriodVO.interval', 'countLimitVO.limitCount'];

// 所有正则校验的字段名
const regValidateFieldList = ['name'];

// 正则校验
const regValidateRules = {
    name: {
        reg: /\s*\S+/,
        msg: '活动名称不能为空',
    },
    'reductionVO.step': { // 消费金额必须大于减免金额
        reg: /^(\d+)(\.\d{1,2})?$/,
        msg: '消费金额格式不正确',
    },
    'reductionVO.reduce': {
        reg: /^(\d+)(\.\d{1,2})?$/, // 减免金额不能小于1元
        msg: '减免金额格式不正确',
    },
    'reductionVO.additionCount': { // 限制次数不能小于1次
        reg: /^[1-9](\d)*$/,
        msg: '限制次数不能小于1次',
    },
    'discountVO.discount': { // 折扣不能低于1折,折扣不能大于等于10折
        reg: /^\d+(\.\d*)?$/,
        msg: '折扣格式不正确',
    },
    'discountVO.maxDiscount': { // 最高减免金额格式不正确，限制金额不能小于3元
        reg: /^\d+(\.\d*)?$/,
        msg: '最高减免金额格式不正确',
    },
    'countLimitVO.limitCount': { // 限制次数不能小于1次
        reg: /^[1-9](\d)*$/,
        msg: '限制次数不能小于1次',
    },
};
/**
 * [regValidate description]
 * @param  {[type]} coupon    [description]
 * @param  {[type]} fieldName [description]
 * @return {[type]}           [description]
 */
function regValidate(fieldName, fieldValue) {
    const rule = regValidateRules[fieldName];
    if (rule.reg.test(fieldValue)) {
        return {
            fail: false,
            msg: '',
        };
    }
    return {
        fail: true,
        msg: rule.msg,
    };
}

// 特殊校验
const customValidate = {
    'reductionVO.step': (coupon) => {
        if (coupon.promotionType === 2) { // 满减
            return regValidate('reductionVO.step', coupon.reductionVO.step);
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'reductionVO.reduce': (coupon) => {
        if (coupon.promotionType === 2) { // 满减
            const regResult = regValidate('reductionVO.reduce', coupon.reductionVO.reduce);
            if (regResult.fail) {
                return regResult;
            }
            if (Number(coupon.reductionVO.reduce) < 1) {
                return {
                    fail: true,
                    msg: '减免金额不能小于1元',
                };
            }
            if (!regValidate('reductionVO.step', coupon.reductionVO.step).fail &&
                Number(coupon.reductionVO.step) <= Number(coupon.reductionVO.reduce)) {
                return {
                    fail: true,
                    msg: '消费金额必须大于减免金额',
                };
            }
            return {
                fail: false,
                msg: '',
            };
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'reductionVO.additionCount': (coupon) => {
        if (coupon.promotionType === 2 && coupon.reductionVO.hasOverlay) {
            return regValidate('reductionVO.additionCount', coupon.reductionVO.additionCount);
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'discountVO.discount': (coupon) => {
        if (coupon.promotionType === 1) { // 折扣
            const regResult = regValidate('discountVO.discount', coupon.discountVO.discount);
            if (regResult.fail) {
                return regResult;
            }
            if (Number(coupon.discountVO.discount) < 1
            || Number(coupon.discountVO.discount) >= 10) {
                return {
                    fail: true,
                    msg: '折扣不能低于1折或大于等于10折',
                };
            }
            return {
                fail: false,
                msg: '',
            };
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'discountVO.maxDiscount': (coupon) => {
        if (coupon.promotionType === 1 && coupon.discountVO.hasDiscountLimit) {
            const regResult = regValidate('discountVO.maxDiscount', coupon.discountVO.maxDiscount);
            if (regResult.fail) {
                return regResult;
            } else if (Number(coupon.discountVO.maxDiscount) < 3) {
                return {
                    fail: true,
                    msg: '限制金额不能小于3元',
                };
            }
            return {
                fail: false,
                msg: '',
            };
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'durationVO.dateIntervalVO': (coupon, options) => dateRangeValidate.validateByRules(coupon.durationVO.dateIntervalVO, options.rules['durationVO.dateIntervalVO']),
    'durationVO.excludeDateIntervals': (coupon, options) => {
        if (coupon.durationVO.hasExcludeDateInterval) {
            if (coupon.durationVO.excludeDateIntervals.length === 0) {
                return {
                    fail: true,
                    msg: '请添加不参与优惠的日期',
                };
            }
            for (const interval in coupon.durationVO.excludeDateIntervals) {
                const result = dateRangeValidate.validateByRules(coupon.durationVO.excludeDateIntervals[interval], options.rules['durationVO.excludeDateIntervals']);
                if (result.fail) {
                    return result;
                }
            }
            return {
                fail: false,
                msg: '',
            };
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'durationVO.excludeWeekdays': (coupon) => {
        if (coupon.durationVO.hasExcludeWeekdays) {
            if (!coupon.durationVO.excludeWeekdays
                || coupon.durationVO.excludeWeekdays.length < 1) {
                return {
                    fail: true,
                    msg: '请选择不参与优惠的星期',
                };
            }
            return {
                fail: false,
                msg: '',
            };
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'usePeriodVO.interval': (coupon) => {
        if (coupon.usePeriodVO.type !== 4) {
            return {
                fail: false,
                msg: '',
            };
        }
        return intervalValidate(coupon.usePeriodVO.interval);
    },
    selectedShopIds: (coupon) => {
        if (coupon.selectedShopIds.length === 0) {
            return {
                fail: true,
                msg: '请至少选择一家门店',
            };
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'countLimitVO.limitCount': (coupon) => {
        if (coupon.countLimitVO.hasSelected) {
            return regValidate('countLimitVO.limitCount', coupon.countLimitVO.limitCount);
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'categoryLimitVO.categoryIds': (coupon) => {
        if (coupon.categoryLimitVO.hasSelected && coupon.categoryLimitVO.categoryIds.length === 0) {
            return {
                fail: true,
                msg: '请选择一个分类',
            };
        }
        return {
            fail: false,
            msg: '',
        };
    },
};

/**
 * [获取字段值]
 * @param  {[type]} coupon    [description]
 * @param  {[type]} fieldName [description]
 * @return {[type]}           [description]
 */
function getFieldValue(coupon, fieldName) {
    if (fieldName.indexOf('.') > -1) {
        const fields = fieldName.split('.'); // 最多支持2层
        return coupon[fields[0]][fields[1]];
    }
    return coupon[fieldName];
}


// 初始化校验结果
const defaultValidateResult = {
    name: {
        fail: false,
        msg: '',
    },
    'reductionVO.step': {
        fail: false,
        msg: '',
    },
    'reductionVO.reduce': {
        fail: false,
        msg: '',
    },
    'reductionVO.additionCount': {
        fail: false,
        msg: '',
    },
    'discountVO.discount': {
        fail: false,
        msg: '',
    },
    'discountVO.maxDiscount': {
        fail: false,
        msg: '',
    },
    selectedShopIds: {
        fail: false,
        msg: '',
    },
    'durationVO.dateIntervalVO': { // 开始日期<结束日期
        fail: false,
        msg: '',
    },
    'durationVO.excludeDateIntervals': {
        fail: false,
        msg: '',
    },
    'durationVO.excludeWeekdays': {
        fail: false,
        msg: '',
    },
    'usePeriodVO.interval': {
        fail: false,
        msg: '',
    },
    'categoryLimitVO.categoryIds': {
        fail: false,
        msg: '',
    },
    'countLimitVO.limitCount': {
        fail: false,
        msg: '',
    },
};

/**
 * 数据校验
 * @param  {[type]} coupon  [description]
 * @param  {[type]} options {fieldName,rules,mode} [description]
 * @return {[type]}         [description]
 */
function promotionValidate(coupon, options) {
    const fieldName = options.fieldName;
    const mode = options.mode;
    if (fieldName) {
        const fieldValue = getFieldValue(coupon, fieldName);

        // 指定特殊校验
        if (mode && mode === 'custom' && customValidate[fieldName]) {
            return customValidate[fieldName](coupon, options);
        }
        // 先正则再特殊校验
        if (regValidateFieldList.indexOf(fieldName) > -1) {
            const regResult = regValidate(fieldName, fieldValue);
            if (!regResult.fail && customValidate[fieldName]) {
                return customValidate[fieldName](coupon, options);
            }
            return regResult;
        }
        return customValidate[fieldName](coupon, options);
    } // 全部字段校验
    const result = {};

    fieldNameList.forEach((name) => {
        if (regValidateFieldList.indexOf(name) > -1) {
            result[name] = regValidate(name, getFieldValue(coupon, name));
        }
        if ((!result[name] || !result[name].fail) && customValidate[name]) {
            result[name] = customValidate[name](coupon, options);
        }
    });
    return result;
}

export {
    defaultValidateResult,
    promotionValidate,
};
