export default {
    env: { // 环境判断
        beta: {
            domain: 'test.i.meituan.com', // 当前域名
            serverDomain: 'dev.orderdish.ecom.web.meituan.com/s', // 当前后端域名
            login: 'dev.orderdish.ecom.web.meituan.com/s/ajax/login', // 当前登录地址
            oldDomain: 'orderdish.ecom.dev.meituan.com', // 老项目域名
        },
        prd: {
            domain: 'i.meituan.com',
            serverDomain: 'e-orderdish.meituan.com/s',
            login: 'e-orderdish.meituan.com/s/ajax/login',
            oldDomain: 'orderdish.sr.meituan.com',
        },
    },
    module: { // 模块判断
        shop: { // ecom商户
            action: '/shop', // 后端模块，用于页面跳转
            ajax: '/ajax/shop', // 接口地址，用户'ajax'请求
            inEcom: true, // 是否在ECOM中
            oldModule: '/shop',
        },
        sale: { // ecom销售
            action: '/sale',
            ajax: '/ajax/sale',
            inEcom: false,
            oldModule: '/sale/shop',
        },
        exe: {
            action: '/exe',
            ajax: '/exe/ajax/shop',
            inEcom: false,
            oldModule: '/shop',
        },
        exemdp: {
            action: '/exemdp',
            ajax: '/hobbit/warehouseman/ajax',
            inEcom: false,
            oldModule: '/shop',
            beta: {
                serverDomain: 'm.51ping.com', // 当前后端域名
                login: 'dev.orderdish.ecom.web.meituan.com/s/ajax/login', // 当前登录地址
                oldDomain: 'orderdish.ecom.dev.meituan.com', // 老项目域名
            },
            prd: {
                serverDomain: 'm.dianping.com',
                login: 'e-orderdish.meituan.com/s/ajax/login',
                oldDomain: 'orderdish.sr.meituan.com',
            },
        },
        shopcoop: {
            action: '/shopcoop',
            ajax: '/ajax/shopcoop',
            inEcom: false,
            oldModule: '/shopcoop',
        },
        miaofu: {
            action: '/shop',
            ajax: '/ajax/shop',
            inEcom: false,
            oldModule: '/shop',
            beta: {
                serverDomain: 'hack-ecom.meishi.test.meituan.com', // 当前后端域名
                login: 'dev.orderdish.ecom.web.meituan.com/s/ajax/login', // 当前登录地址
                oldDomain: 'orderdish.ecom.dev.meituan.com', // 老项目域名
            },
            prd: {
                serverDomain: 'hack-ecom.meishi.meituan.com',
                login: 'e-orderdish.meituan.com/s/ajax/login',
                oldDomain: 'orderdish.sr.meituan.com',
            },
        },
        authcode: {
            action: '/shop',
            ajax: '/ajax/shop',
            inEcom: true,
            oldModule: '/shop',
        },
        default: {
            action: '', // 后端模块，用于页面跳转
            ajax: '/ajax', // 接口地址，用户'ajax'请求
            inEcom: true, // 是否在ECOM中
            oldModule: '/shop',
        },
    },
    oldIndex: '/query',
    oldUserInfo: '/ajax/current_info',
};
