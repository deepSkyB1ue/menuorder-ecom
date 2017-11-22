import Vue from 'vue';
import Router from 'vue-router';
/* eslint-disable global-require  */
/* eslint-disable import/no-unresolved  */
// 优惠券
const Coupon = (resolve) => {
    // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
    // （代码分块）
    require.ensure(['../pages/Coupon'], () => {
        resolve(require('../pages/Coupon'));
    });
};

// 自入驻申请
const OrderApply = (resolve) => {
    require.ensure(['../components/pages/orderapply/order-apply.vue'], () => {
        resolve(require('../components/pages/orderapply/order-apply.vue'));
    });
};
// 自入驻申请 - 手机端
const OrderApplyMobile = (resolve) => {
    require.ensure(['../components/pages/orderapply/order-apply-m.vue'], () => {
        resolve(require('../components/pages/orderapply/order-apply-m.vue'));
    });
};
// 自入驻申请 - 城市选择
const OrderApplyMCity = (resolve) => {
    require.ensure(['../pages/OrderApplyMCity'], () => {
        resolve(require('../pages/OrderApplyMCity'));
    });
};
// 看菜单
const MenuDescribe = (resolve) => {
    require.ensure(['../components/pages/menu-manage/menu-describe'], () => {
        resolve(require('../components/pages/menu-manage/menu-describe'));
    });
};

const BlackList = (resolve) => {
    // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
    // （代码分块）
    require.ensure(['../pages/BlackList'], () => {
        resolve(require('../pages/BlackList'));
    });
};
const OrderList = (resolve) => {
    require.ensure(['../pages/order/OrderList'], () => {
        resolve(require('../pages/order/OrderList'));
    });
};


const MiaofuPosType = (resolve) => {
    require.ensure(['../components/pages/orderapply/order-apply-pc-postype.vue'], () => {
        resolve(require('../components/pages/orderapply/order-apply-pc-postype.vue'));
    });
};

// 优惠活动
const Promotion = (resolve) => {
    require.ensure(['../pages/Promotion'], () => {
        resolve(require('../pages/Promotion'));
    });
};

// EXE 帮助页
const Help = (resolve) => {
    require.ensure(['../pages/Help'], () => {
        resolve(require('../pages/Help'));
    });
};

const TableCode = (resolve) => {
    require.ensure(['../pages/TableCode'], () => {
        resolve(require('../pages/TableCode'));
    });
};

const AuthCodeSettings = (resolve) => {
    require.ensure(['../pages/AuthCodeSettings'], () => {
        resolve(require('../pages/AuthCodeSettings'));
    });
};

const AuthCodeQuery = (resolve) => {
    require.ensure(['../pages/AuthCodeQuery'], () => {
        resolve(require('../pages/AuthCodeQuery'));
    });
};

const MemberCard = (resolve) => {
    require.ensure(['../pages/MemberCard'], () => {
        resolve(require('../pages/MemberCard'));
    });
};

const MakeInvoice = (resolve) => {
    require.ensure(['../pages/exe-invoice/MakeInvoice.vue'], () => {
        resolve(require('../pages/exe-invoice/MakeInvoice.vue'));
    });
};

const EnableInvoice = (resolve) => {
    require.ensure(['../pages/exe-invoice/EnableInvoice.vue'], () => {
        resolve(require('../pages/exe-invoice/EnableInvoice.vue'));
    });
};

const FinanceCheck = (resolve) => {
    require.ensure(['../components/pages/finance/finance-check/finance-check.vue'], () => {
        resolve(require('../components/pages/finance/finance-check/finance-check.vue'));
    });
};

const FinancePayment = (resolve) => {
    require.ensure(['../components/pages/finance/finance-payment/finance-payment.vue'], () => {
        resolve(require('../components/pages/finance/finance-payment/finance-payment.vue'));
    });
};

const FinancePaymentDetail = (resolve) => {
    require.ensure(['../components/pages/finance/finance-payment/finance-payment-detail.vue'], () => {
        resolve(require('../components/pages/finance/finance-payment/finance-payment-detail.vue'));
    });
};

const DateSelection = (resolve) => {
    require.ensure(['../pages/DateSelection'], () => {
        resolve(require('../pages/DateSelection'));
    });
};

const OrderQuery = (resolve) => {
    require.ensure(['../components/pages/order-query/order-query.vue'], () => {
        resolve(require('../components/pages/order-query/order-query.vue'));
    });
};

const ServiceSetting = (resolve) => {
    require.ensure(['../components/pages/menu-manage/shop-service-setting.vue'], () => {
        resolve(require('../components/pages/menu-manage/shop-service-setting.vue'));
    });
};

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/shop/coupon',
        component: Coupon,
    }, {
        path: '/miaofu/ecom/coupon', // 秒付 - ecom - 优惠券
        component: Coupon,
    }, {
        path: '/miaofu/ecom/promotion', // 秒付 - ecom - 优惠活动
        component: Promotion,
    }, {
        path: '/shop/blacklist',
        component: BlackList,
    }, {
        path: '/shop/menudescribe',
        component: MenuDescribe,
    }, {
        path: '/shop/servicesetting',
        component: ServiceSetting,
    }, {
        path: '/orderapply/pc',
        component: OrderApply,
        meta: {
            businessType: 0,
            source: 'daincan',
        },
        children: [{
            path: 'miaofu',
            components: {
                'miaofu-postype': MiaofuPosType,
            },
            meta: {
                businessType: 10,
                source: 'miaofu',
            },
        }],
    }, {
        path: '/orderapply/m',
        component: OrderApplyMobile,
        meta: {
            businessType: 0,
            source: 'daincan',
        },
        children: [{
            path: 'miaofu',
            meta: {
                businessType: 10,
                source: 'miaofu',
            },
        }],
    }, {
        path: '/orderapply/m/miaofu/city',
        component: OrderApplyMCity,
    }, {
        path: '/help',
        component: Help,
    }, {
        path: '/shop/orderlist',
        component: OrderList,
    }, {
        path: '/exe/orderlist',
        component: OrderList,
    }, {
        path: '/shop/tablecode',
        component: TableCode,
    }, {
        path: '/authcode/disable',
        component: AuthCodeSettings,
        beforeEnter: (to, from, next) => {
            document.title = '关闭退款授权码';
            next();
        },
    }, {
        path: '/exe/authcode/disable',
        component: AuthCodeSettings,
        beforeEnter: (to, from, next) => {
            document.title = '关闭退款授权码';
            next();
        },
    }, {
        path: '/authcode',
        component: AuthCodeQuery,
        beforeEnter: (to, from, next) => {
            document.title = '找回授权码';
            next();
        },
    }, {
        path: '/exe/authcode',
        component: AuthCodeQuery,
        beforeEnter: (to, from, next) => {
            document.title = '找回授权码';
            next();
        },
    }, {
        path: '/authcode/new',
        component: AuthCodeSettings,
        meta: {
            actionType: 10,
        },
        beforeEnter: (to, from, next) => {
            document.title = '设置退款授权码';
            next();
        },
    }, {
        path: '/exe/authcode/new',
        component: AuthCodeSettings,
        meta: {
            actionType: 10,
        },
        beforeEnter: (to, from, next) => {
            document.title = '设置退款授权码';
            next();
        },
    }, {
        path: '/authcode/change',
        component: AuthCodeSettings,
        meta: {
            actionType: 20,
        },
        beforeEnter: (to, from, next) => {
            document.title = '修改授权码';
            next();
        },
    }, {
        path: '/exe/authcode/change',
        component: AuthCodeSettings,
        meta: {
            actionType: 20,
        },
        beforeEnter: (to, from, next) => {
            document.title = '修改授权码';
            next();
        },
    }, {
        path: '/shop/membercard',
        component: MemberCard,
    }, {
        path: '/exe/membercard',
        component: MemberCard,
    }, {
        path: '/shop/financeCheck',
        component: FinanceCheck,
    }, {
        path: '/shop/financePayment',
        component: FinancePayment,
    }, {
        path: '/shop/financePaymentDetail',
        component: FinancePaymentDetail,
    }, {
        path: '/exe/orderQuery',
        component: OrderQuery,
    }, {
        path: '/exe/dateselection',
        component: DateSelection,
    }, {
        path: '/exemdp/makeInvoice',
        component: MakeInvoice,
    }, {
        path: '/exemdp/enableInvoice',
        component: EnableInvoice,
    }],
});
