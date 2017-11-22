import whatever from '../../../lib/whatever-adaptor.js';
import {
    getUrlParam,
    isMiaofuPage,
} from '../../../lib/utils.js';

export default {
    name: 'OrderApplyBase',
    methods: {
        sendPV() {
            whatever.sendPV({
                jsLoadTime: window.jsLoadTime,
                pageId: this.whateverOptions.pageId,
                module: this.whateverOptions.pageId,
                activity_code: getUrlParam('activity_code'),
            });
        },
        sendMV(module) {
            whatever.report({
                pageId: this.whateverOptions.pageId,
                action: 'click',
                module,
                activity_code: getUrlParam('activity_code'),
                page_source: isMiaofuPage(this.$route) ? 'miaofu' : 'diancan',
            });
        },
        initWhatever(options) {
            this.whateverOptions = options;
        },
        successCallBack() {
            this.status = 1;
            alert('您的申请提交成功,请耐心等待工作人员电话联系。');
        },
        countTime() {
            let count = 60;
            const self = this;
            const timer = setInterval(() => {
                if (count > 0) {
                    self.sendCodeMsg = `${count}s后重新发送`;
                    count -= 1;
                } else {
                    self.sendCodeMsg = '发送验证码';
                    self.disableSendBtn = false;
                    clearInterval(timer);
                }
            }, 1000);
        },
    },
};
