const addBlackList = function addBlackList(this: any) {
};
const blackCallBack = function blackCallBack(this: any , item:any) {
    if(item.status){
        return;
    }
    this.blackInfo = {
        userId:item.order.userId,
        phone:item.order.phone
    }
    this.showBlackListPop = true ;
};
const importDiffCss = (context:any) => {
    // if (context.$route.path.indexOf('ecom')>=0) {
    //     import('../../node_modules/@dp/bee-ui/dist/styles/theme/ecom/index.css');
    // } else {
    //     import('../../node_modules/@dp/bee-ui/dist/styles/theme/exe/index.css');
    //     import('./orderListExe.less');
    // }
}

enum ORDER_TYPE {
    ORDER = 10,
    HACK = 20,
};
const ORDER_STATUS = [
    {
        code: '130',
        name: '默认订单状态',
    }, {
        code: '100',
        name: '全部订单',
    }, {
        code: '110',
        name: '未支付订单',
    }, {
        code: '120',
        name: '已支付订单',
    }, {
        code: '200',
        name: '退款',
    },
];
export { addBlackList, blackCallBack, ORDER_TYPE, ORDER_STATUS}