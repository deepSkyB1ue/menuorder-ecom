/* eslint-disable no-param-reassign */
import moment from 'moment';
// 日期校验
const dateValidate = {
    /**
     * [rangeLimit description]
     * @param  {[type]} '2017-08-08'    [description]
     * @param  {[type]} options:
     * {
     *     name: '开始日期',
     *     min: '2017-08-08',//当天可传入'today'
     *     minName: '', //默认根据min获取，可传入'今天'
     *     max: '2017-09-09'//当天可传入'today'
     *     maxName: ''//默认根据max获取
     * }
     * [description]
     * @return {[type]}         [description]
     */
    rangeLimit(date, options) {
        if (options.min) {
            let minDate = options.min;
            let minName = options.minName || options.min;
            if (options.min === 'today') {
                minDate = moment().format('YYYY-MM-DD');
                minName = '今天';
            }
            if (date < minDate) {
                return {
                    fail: true,
                    target: options.target,
                    msg: `${options.name}不可早于${minName}`,
                };
            }
        }

        if (options.max) {
            let maxDate = options.max;
            let maxName = options.maxName || options.max;
            if (options.max === 'today') {
                maxDate = moment().format('YYYY-MM-DD');
                maxName = '今天';
            }
            if (date > maxDate) {
                return {
                    fail: true,
                    target: options.target,
                    msg: `${options.name}不可晚于${maxName}`,
                };
            }
        }

        return {
            fail: false,
            msg: '',
        };
    },
};
// 日期范围校验
const dateRangeValidate = {
    basicRules: ['fromToCompare', 'rangeLimit'],
    /**
     * 开始日期不能大于结束日期校验
     * @param  {[type]} dateInterval
     * {
     *     fromDate: '2017-08-08',
     *     toDate: '2017-08-08'
     * }
     * [description]
     * @return {[type]}              [description]
     */
    fromToCompare(dateInterval) {
        if (dateInterval.fromDate > dateInterval.toDate) {
            return {
                fail: true,
                target: 'toDate',
                msg: '结束日期不能早于起始日期',
            };
        }
        return {
            fail: false,
            msg: '',
        };
    },
    /**
     * 日期范围校验
     * @param  {[type]} dateInterval
     * {
     *     fromDate: '2017-08-08',
     *     toDate: '2017-08-08'
     * }
     * [description]
     * @param  {[type]} options
     * {
     *     from: {
     *         name: '开始日期',
     *         min: '2017-08-08',//当天可传入'today'
     *         minName: '', //默认根据min获取
     *         max: '2017-09-09'//当天可传入'today'
     *         maxName: ''//默认根据max获取
     *     },
     *     to: {
     *         name: '结束日期',
     *         min: '2017-08-08',//当天可传入'today'
     *         minName: '', //默认根据min获取
     *         max: '2017-09-09'//当天可传入'today'
     *         maxName: ''//默认根据max获取
     *     }
     * }
     * [description]
     * @return {[type]}              [description]
     */
    rangeLimit(dateInterval, options) {
        let fromValidate = {
            fail: false,
            msg: '',
        };
        if (options.from) {
            options.from.target = 'fromDate';
            fromValidate = dateValidate.rangeLimit(dateInterval.fromDate, options.from);
        }
        if (!fromValidate.fail && options.to) {
            options.to.target = 'toDate';
            return dateValidate.rangeLimit(dateInterval.toDate, options.to);
        }
        return fromValidate;
    },
    /**
     * [validateByRules description]
     * @param  {[type]} ruleList
     * [{
     *     name: 'fromToCompare'
     * }, {
     *     name: 'rangeLimit',
     *     options: {
     *         from: {
     *             name: '开始日期',
     *             min: '2017-08-08',//当天可传入'today'
     *             minName: '', //默认根据min获取
     *             max: '2017-09-09'//当天可传入'today'
     *             maxName: ''//默认根据max获取
     *         },
     *         to: {
     *             name: '结束日期',
     *             min: '2017-08-08',//当天可传入'today'
     *             minName: '', //默认根据min获取
     *             max: '2017-09-09'//当天可传入'today'
     *             maxName: ''//默认根据max获取
     *         }
     *    }
     * }]
     *  [description]
     * @return {[type]}          [description]
     */
    validateByRules(dateInterval, ruleList) {
        if (!ruleList || ruleList.length === 0) {
            return {
                fail: false,
                msg: '',
            };
        }

        function traverseValidate(currentIndex, rules) {
            let result = {
                fail: false,
                msg: '',
            };
            if (dateRangeValidate[rules[currentIndex].name]) {
                result = dateRangeValidate[rules[currentIndex].name](dateInterval,
                    rules[currentIndex].options);
            }

            if (currentIndex === rules.length - 1) { // 最后一层
                return result;
            }
            if (!result.fail) { // 校验通过，进入下一层校验
                return traverseValidate(currentIndex + 1, rules);
            } // 校验失败返回
            return result;
        }
        return traverseValidate(0, ruleList);
    },
};

export {
    dateRangeValidate,
    dateValidate,
};
