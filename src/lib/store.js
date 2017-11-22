import Vue from 'vue';
import Vuex from 'vuex';

/* eslint-disable no-param-reassign */
Vue.use(Vuex);
const moduleOrderList = {
    state: {
        userMask: {
            userId: '',
            phone: '',
        },
        count: 0,
    },
    mutations: {
        increment(state) {
            state.count += 1;
        },
    },
    actions: {
        updateUserMask(context, data) {
            context.state.userMask = data;
        },
    },
};

const store = new Vuex.Store({
    modules: {
        // 在此可添加多个module
        orderList: moduleOrderList,
    },
});
export default store;
