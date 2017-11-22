import {
    Ajax,
    getUrlParam,
} from '../../../lib/utils.js';
import getEnv from '../../../lib/env.js';

function notNull(data) {
    return data.replace(/(^\s*)|(\s*$)/g, '').length !== 0;
}

export default {
    name: 'OrderApply',
    methods: {
        checkParams() {
            const rePhone = new RegExp(/^1\d{10}$/);

            if (!notNull(this.shopCooperateVO.shopName)) {
                this.errorStatus.shopNameErrStatus = 1;
                return false;
            }

            if (!notNull(this.shopCooperateVO.cityName)) {
                this.errorStatus.cityNameErrStatus = 1;
                return false;
            }

            if (!notNull(this.shopCooperateVO.contact)) {
                this.errorStatus.contactErrStatus = 1;
                return false;
            }


            if (!notNull(this.shopCooperateVO.businessType)) {
                alert('请完成选项');
                return false;
            }

            if (!notNull(this.shopCooperateVO.posType)) {
                alert('请完成选项');
                return false;
            }

            if (!rePhone.test(this.shopCooperateVO.mobile)) {
                this.errorStatus.mobileErrStatus = 1;
                this.mobileErrInfo = '请输入正确手机号';
                return false;
            }

            return true;
        },
        checkPhone() {
            const rePhone = new RegExp(/^1\d{10}$/);
            if (!rePhone.test(this.shopCooperateVO.mobile)) {
                this.errorStatus.mobileErrStatus = 1;
                this.mobileErrInfo = '请输入正确手机号';
                return false;
            }
            return true;
        },
        sendCode() {
            if (this.checkPhone()) {
                this.showCodeErr = false;
                const envName = getEnv();
                let urlHost = '';
                if (envName === 'beta') {
                    urlHost = `${location.protocol}//orderdish-ecom-web.51ping.com/`;
                } else {
                    urlHost = `${location.protocol}//orderdish-ecom-web.meituan.com/`;
                }
                Ajax.post({

                    url: `${urlHost}s/ajax/cooperate/sendCode`,
                    params: {
                        mobile: this.shopCooperateVO.mobile,
                        businessType: this.shopCooperateVO.businessType,
                    },
                    success: (res) => {
                        if (res.code.toString() === '200') {
                            this.disableSendBtn = true;
                            this.countTime();
                            this.showVerifyBlock = true;
                        } else {
                            alert(res.msg);
                        }
                    },
                });
            }
        },

        getPosType(posType) {
            this.shopCooperateVO.posType = posType;
        },
        postApply() {
            if (!this.checkParams()) {
                return;
            }
            if (this.posting) {
                return;
            }
            this.sendMV(this.whateverOptions.submitModule);
            this.posting = true;

            const envName = getEnv();
            let urlHost = '';
            if (envName === 'beta') {
                urlHost = `${location.protocol}//orderdish-ecom-web.51ping.com/`;
            } else {
                urlHost = `${location.protocol}//orderdish-ecom-web.meituan.com/`;
            }
            Ajax.post({
                url: `${urlHost}s/ajax/cooperate/add`,
                params: this.shopCooperateVO,
                success: (response) => {
                    this.posting = false;
                    if (response.code.toString() === '200') {
                        this.successCallBack();
                    } else {
                        this.errorStatus.verifyCodeErrStatus = 1;
                        this.showCodeErr = true;
                    }
                },
                error: () => {
                    this.posting = false;
                },
            });
        },
    },
    data() {
        return {
            title: '',
            posting: false,
            status: 0, // 0 未提交 1 提交成功
            shopCooperateVO: {
                shopName: '',
                shopCount: '',
                cityName: '',
                contact: '',
                duty: '',
                mobile: '',
                activityCode: getUrlParam('activity_code'),
                verifyCode: '',
                posType: '', // 收银品牌，只对秒付页面显示
                businessType: '', // 点餐为0，秒付为10
            },
            whateverOptions: {
                pageId: 'orderdish_cooperate_web',
                submitModule: 'orderdish_cooperate_web_submit_click',
            },
            orientationCompleted: false,
            orientationSucceed: false,
            orientationCity: '',
            hasSelectedCity: false,
            showVerifyBlock: true,
            sendCodeMsg: '获取验证码',
            mobileErrInfo: '',
            disableSendBtn: false,
            showCodeErr: false,
            submitEnabled: false,

            errorStatus: {
                shopNameErrStatus: 0,
                cityNameErrStatus: 0,
                contactErrStatus: 0,
                mobileErrStatus: 0,
                verifyCodeErrStatus: 0,
            },
        };
    },
};
