
/* eslint-disable import/no-extraneous-dependencies */
import Whatever from '@dp/whatever';

const whatever = {
    we: null,
    init(options) {
        this.we = Whatever.getWhatever({
            appName: 'menuorder-ecom',
            pageId: options.pageId || 'menuorder_ecom_unknow',
            lingxiConfig: {
                channel: 'ismart',
            },
        });
    },
    /**
     * [report description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    report(options) {
        if (this.we) {
            this.we.report(options);
        } else {
            this.init(options);
            this.report(options);
        }
    },
    /**
     * [sendPV description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    sendPV(options) {
        if (this.we) {
            this.we.sendPV(options);
        } else {
            this.init(options);
            this.sendPV(options);
        }
    },
};

export default whatever;
