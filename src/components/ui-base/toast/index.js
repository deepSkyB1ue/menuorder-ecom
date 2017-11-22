/**
 * @fileOverview toast component
 * @name index.js<ecom-common-ui/src/components/ui-base/toast>
 * @author Young Lee <youngleemails@gmail.com>
 * @license MIT
 */
import Vue from 'vue';
import ToastComponent from './invoice-toast.vue';

const ToastConstructor = Vue.extend(ToastComponent);

// export toast function with options
// text: text to show in the toast
// duration: time of the toast

// sample:
// this.$toast({
//   text: 'text',
//   duration: 1000
// });

export default (option) => {
    const options = option || {};
    const instance = new ToastConstructor({
        data: options,
    });
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el); // append the component HTML to document
    instance.vm.visible = true;
    return instance.vm;
};
