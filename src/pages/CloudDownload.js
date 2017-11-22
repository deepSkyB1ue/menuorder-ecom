import Vue from 'vue';
import CloudDownload from '../components/pages/exe-invoice/cloud-download.vue';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<CloudDownload/>',
    components: { CloudDownload },
});
