/* eslint-disable no-param-reassign */
// 跨天
const allLimit = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00', '次日00:30', '次日01:00', '次日01:30', '次日02:00', '次日02:30', '次日03:00', '次日03:30', '次日04:00', '次日04:30', '次日05:00', '次日05:30', '次日06:00'];

const allLimitSpan = ['00:00~', '00:30~', '01:00~', '01:30~', '02:00~', '02:30~', '03:00~', '03:30~', '04:00~', '04:30~', '05:00~', '05:30~', '06:00~', '06:30~', '07:00~', '07:30~', '08:00~~', '08:30~~', '09:00~~', '09:30~~',
    '10:00~', '10:30~', '11:00~', '11:30~', '12:00~', '12:30~', '13:00~', '13:30~', '14:00~', '14:30~', '15:00~', '15:30~', '16:00~', '16:30~', '17:00~', '17:30~', '18:00~', '18:30~', '19:00~', '19:30~',
    '20:00~', '20:30~', '21:00~', '21:30~', '22:00~', '22:30~', '23:00~', '23:30~', '24:00~', '次日00:30~', '次日01:00~', '次日01:30~', '次日02:00~', '次日02:30~', '次日03:00~', '次日03:30~', '次日04:00~', '次日04:30~', '次日05:00~', '次日05:30~'];

// 不跨天
const allLimitNonCross = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '24:00'];

const allLimitSpanNonCross = ['00:00~', '00:30~', '01:00~', '01:30~', '02:00~', '02:30~', '03:00~', '03:30~', '04:00~', '04:30~', '05:00~', '05:30~', '06:00~', '06:30~', '07:00~', '07:30~', '08:00~~', '08:30~~', '09:00~~', '09:30~~',
    '10:00~', '10:30~', '11:00~', '11:30~', '12:00~', '12:30~', '13:00~', '13:30~', '14:00~', '14:30~', '15:00~', '15:30~', '16:00~', '16:30~', '17:00~', '17:30~', '18:00~', '18:30~', '19:00~', '19:30~',
    '20:00~', '20:30~', '21:00~', '21:30~', '22:00~', '22:30~', '23:00~', '23:30~', '24:00~'];

function intervalValidate(intervals) {
    let minTime;
    let maxTime;
    let overLay = false;
    const allLimitSpanCopy = allLimitSpan.slice();

    intervals.forEach((period) => {
    // 检查间隔24小时
        if (!minTime) {
            minTime = period.fromTime;
        } else if (allLimit.indexOf(minTime) > allLimit.indexOf(period.fromTime)) {
            minTime = period.fromTime;
        }
        if (!maxTime) {
            maxTime = period.toTime;
        } else if (allLimit.indexOf(maxTime) < allLimit.indexOf(period.toTime)) {
            maxTime = period.toTime;
        }
        // 检查重叠
        const startIndex = allLimit.indexOf(period.fromTime);
        const endIndex = allLimit.indexOf(period.toTime);
        allLimitSpanCopy.forEach((item, index, array) => {
            if (index >= startIndex && index < endIndex) {
                if (array[index] === 1) {
                    overLay = true;
                } else {
                    array[index] = 1;
                }
            }
        });
    });

    // 判断时间是否重叠
    if (overLay) {
        return {
            fail: true,
            msg: '时段不可重叠',
        };
    } else if (allLimit.indexOf(maxTime) - allLimit.indexOf(minTime) > 48) {
        return {
            fail: true,
            msg: '开始与结束时间跨度不可超过24小时',
        };
    }
    return {
        fail: false,
        msg: '',
    };
}

function countToTime(fromTime, timeSpan) {
    return allLimit[(allLimit.indexOf(fromTime) * 1) + (timeSpan / 30)];
}

class Period {
    constructor(data) {
        this.id = Math.random();
        this.fromTime = data.fromTime;
        this.toTime = countToTime(data.fromTime, data.timeSpan);
        // 前后时间段以及限制在后面进行计算
        this.fromTimeLimit = [];
        this.toTimeLimit = [];

        this.allLimit = data.crossDay === false ? allLimitNonCross : allLimit;
        this.allLimitSpan = data.crossDay === false ? allLimitSpanNonCross : allLimitSpan;

        this.calLimit();
    }
    calLimit() {
    // 开始时间的选择范围从0开始到24点
        if (this.toTime.length > 5) {
            this.fromTimeLimit = this.allLimit.slice(0, this.allLimit.indexOf('24:00'));
        } else {
            this.fromTimeLimit = this.allLimit.slice(0, this.allLimit.indexOf(this.toTime));
        }

        // 截止时间选择时间范围从现在开始时间+30分钟开始，到次日的6点
        const toTimeLimitStart = countToTime(this.fromTime, 30);
        this.toTimeLimit = this.allLimit.slice(this.allLimit.indexOf(toTimeLimitStart));
    }
    countTimeSpan(fromTime, toTime) {
        return ((this.allLimit.indexOf(toTime) * 1) - (this.allLimit.indexOf(fromTime) * 1)) * 30;
    }
}

export { allLimit, allLimitSpan, Period, intervalValidate, countToTime };
