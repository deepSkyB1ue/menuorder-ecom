/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import {
    intervalValidate,
} from '../../../../lib/period.js';

import {
    dateRangeValidate,
} from '../../../../lib/validate.js';

// 所有需要正则校验的字段名(最多支持2层)
const fieldNameList = ['name', 'giveStep', 'giveCount', 'selectedShopIds', 'giveDurationVO.dateIntervalVO', 'useDurationVO.step', 'useDurationVO.dateIntervalVO', 'usePeriodVO.interval', 'useDurationVO.excludeDateIntervals', 'useDurationVO.excludeWeekdays', 'useLimitVO.step', 'useLimitVO.reduce'];

const regValidateFieldList = ['name', 'giveStep', 'giveCount', 'useLimitVO.step', 'useLimitVO.reduce'];

// 正则校验
const regValidateRules = {
    name: {
        reg: /\s*\S+/,
        msg: '活动名称不能为空',
    },
    giveStep: { // ＞1，不支持小数
        reg: /^[1-9](\d)*$/,
        msg: '消费金额不能小于1元',
    },
    giveCount: {
        reg: /^[1-9]$/,
        msg: '张数必须在1到9之间',
    },
    'useDurationVO.step': {
        reg: /^[1-9](\d)*$/,
        msg: '有效期不能小于1天',
    },
    'useLimitVO.step': {
        reg: /^[1-9](\d)*$/,
        msg: '起用金额不得小于1元',
    },
    'useLimitVO.reduce': {
        reg: /^[1-9]\d?$/,
        msg: '减免金额必须在1到99之间',
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
    'giveDurationVO.dateIntervalVO': (coupon, options) => {
        if (coupon.giveDurationVO.type === 4) {
            return dateRangeValidate.validateByRules(coupon.giveDurationVO.dateIntervalVO, options.rules['giveDurationVO.dateIntervalVO']);
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'useDurationVO.step': (coupon) => {
        if (coupon.useDurationVO.type === 20) {
            return regValidate('useDurationVO.step', coupon.useDurationVO.step);
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'useDurationVO.dateIntervalVO': (coupon, options) => {
        if (coupon.useDurationVO.type === 10) {
            return dateRangeValidate.validateByRules(coupon.useDurationVO.dateIntervalVO, options.rules['useDurationVO.dateIntervalVO']);
        }
        return {
            fail: false,
            msg: '',
        };
    },
    'useDurationVO.excludeDateIntervals': (coupon, options) => {
        if (coupon.useDurationVO.hasExcludeDateInterval) {
            if (coupon.useDurationVO.excludeDateIntervals.length === 0) {
                return {
                    fail: true,
                    msg: '请添加不参与优惠的日期',
                };
            }
            for (const interval in coupon.useDurationVO.excludeDateIntervals) {
                const result = dateRangeValidate.validateByRules(
                    coupon.useDurationVO.excludeDateIntervals[interval],
                    options.rules['useDurationVO.excludeDateIntervals']);
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
    'useDurationVO.excludeWeekdays': (coupon) => {
        if (coupon.hasExcludeWeekdays) {
            if (!coupon.excludeWeekdays || coupon.excludeWeekdays.length < 1) {
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
    'useLimitVO.reduce': (coupon) => {
        if (!regValidate('useLimitVO.step', coupon.useLimitVO.step).fail &&
            !regValidate('useLimitVO.reduce', coupon.useLimitVO.reduce).fail &&
            parseInt(coupon.useLimitVO.step, 10) <= parseInt(coupon.useLimitVO.reduce, 10)) {
            return {
                fail: true,
                msg: '减免金额不能大于等于起用金额',
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
    giveStep: { // ＞1，不支持小数
        fail: false,
        msg: '',
    },
    giveCount: { // 1 - 9，不支持小数
        fail: false,
        msg: '',
    },
    selectedShopIds: {
        fail: false,
        msg: '',
    },
    'giveDurationVO.dateIntervalVO': { // 开始日期<结束日期
        fail: false,
        msg: '',
    },
    'useDurationVO.step': {
        fail: false,
        msg: '',
    },
    'useDurationVO.dateInterval': {
        fail: false,
        msg: '',
    },
    'usePeriodVO.interval': {
        fail: false,
        msg: '',
    },
    'useDurationVO.excludeDateIntervals': {
        fail: false,
        msg: '',
    },
    'useDurationVO.excludeWeekdays': {
        fail: false,
        msg: '',
    },
    'useLimitVO.step': {
        fail: false,
        msg: '',
    },
    'useLimitVO.reduce': {
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
function couponValidate(coupon, options) {
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
    couponValidate,
};
