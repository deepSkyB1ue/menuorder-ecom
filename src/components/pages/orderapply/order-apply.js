import {
    Ajax,
    getUrlParam,
    isMiaofuPage,
} from '../../../lib/utils.js';

function notNull(data) {
    return data.replace(/(^\s*)|(\s*$)/g, '').length !== 0;
}
export default {
    name: 'OrderApply',
    methods: {
        checkParams() {
            const rePhone = new RegExp(/^1\d{10}$/);
            const regCount = /^[1-9]\d*$/;
            if (!notNull(this.shopCooperateVO.shopName)) {
                alert('商户名不得为空');
                return false;
            }
            // 提交时校验该字段必须为数字且大于0，否则提示“请输入正确的门店数量” 。
            if (!regCount.test(this.shopCooperateVO.shopCount)) {
                alert('请输入正确的门店数量');
                return false;
            }
            if (!notNull(this.shopCooperateVO.cityName)) {
                alert('城市名不得为空');
                return false;
            }
            if (!notNull(this.shopCooperateVO.contact)) {
                alert('联系人不得为空');
                return false;
            }
            if (!notNull(this.shopCooperateVO.duty)) {
                alert('职务不得为空');
                return false;
            }
            if (!rePhone.test(this.shopCooperateVO.mobile)) {
                alert('请输入正确的手机号');
                return false;
            }
            return true;
        },
        sendCode() {
            if (this.checkParams()) {
                this.showCodeErr = false;
                // 保留老页面，默认都是点餐
                this.shopCooperateVO.businessType = isMiaofuPage(this.$route) ? 10 : 0;
                Ajax.post({
                    url: 'cooperate/sendCode',
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
            Ajax.post({
                url: 'cooperate/add',
                params: this.shopCooperateVO,
                success: (response) => {
                    this.posting = false;
                    if (response.code.toString() === '200') {
                        this.successCallBack();
                    } else {
                        alert(response.msg);
                        this.showCodeErr = true;
                    }
                },
                error: () => {
                    this.posting = false;
                },
            });
        },
    },
    mounted() {
        this.title = isMiaofuPage(this.$route) ? '点餐秒付合作申请' : '点餐合作申请';
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
                businessType: 0, // 点餐为0，秒付为10
            },
            whateverOptions: {
                pageId: 'orderdish_cooperate_web',
                submitModule: 'orderdish_cooperate_web_submit_click',
            },
            showVerifyBlock: false,
            sendCodeMsg: '发送验证码',
            disableSendBtn: false,
            showCodeErr: false,
        };
    },
};
