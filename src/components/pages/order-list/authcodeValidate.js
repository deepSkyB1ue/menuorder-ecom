import Vue from 'vue';
import authCode from './authcode.vue';

const AuthCodeConstuctor = Vue.extend(authCode);
export default (option) => {
    const options = option || {};
    if (!options.realAuthCode) {
        if (options.callback) {
            options.callback();
            return null;
        }
    }

    const instance = new AuthCodeConstuctor({
        data: options,
    });
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el); // append the component HTML to document
    return instance.vm;
};
