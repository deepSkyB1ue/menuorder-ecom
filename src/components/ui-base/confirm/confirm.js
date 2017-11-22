import Confirm from './new-confirm'
import Vue from 'vue'
let confirmConstruct = Vue.extend(Confirm);

export default (options) => {
    const instance = new confirmConstruct({
        el: document.createElement('div'),
        data: options.data,
        methods: {
            confirm: options.callback
        }
    })
    document.body.appendChild(instance.$el);
    return instance;
}
