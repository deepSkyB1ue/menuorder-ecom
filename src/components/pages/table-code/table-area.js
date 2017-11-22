/* eslint-disable import/no-unresolved */

import UIConfirm from '@/components/ui-base/confirm/confirm.vue';
import UIToast from '@/components/ui-base/toast/toast';
import { Ajax } from '@/lib/utils.js';
import AddPrinterPopup from './add-printer-popup';


export default {
    name: 'table-area',
    props: ['tableAreas', 'shopInfo', 'initialPrinterType'],
    components: {
        'ui-confirm': UIConfirm,
        'ui-toast': UIToast,
        'add-printer-popup': AddPrinterPopup,
    },
    data() {
        return {
            deletePrinterConfirmInfo: {
                visible: false,
                title: '',
                content: '',
                confirmText: '确认',
                cancelText: '取消',
                printerId: 0,
                tableTypeId: 0,
            },
            confirmInfo: {
                visible: false,
                title: '',
                content: '',
                confirmText: '确认',
            },
            toast: {
                visible: false,
                text: '',
            },
            popupInfo: {
                visible: false,
                title: '',
                tableTypeId: 1,
                printerList: [{
                    printerId: 1,
                    printerName: 'printer',
                    unused: 1,
                }],
            },
        };
    },
    computed: {
        printerType() {
            return this.initialPrinterType;
        },
    },
    methods: {
    // Add printer
        showAddPrinterPopup(printerList, tableTypeId) {
            this.popupInfo = {
                visible: true,
                title: '选择打印机编号',
                printerList,
                tableTypeId,
            };
        },

        hidePopup() {
            this.popupInfo.visible = false;
        },

        addPrinterDidConfirm(selectedPrinterIds) {
            if (selectedPrinterIds.length === 0) {
                this.showToast('请选择打印机编号');
            } else {
                this.hidePopup();
                this.postAddPrinter(this.popupInfo.tableTypeId, selectedPrinterIds);
            }
        },

        // Delete printer
        showDeletePrinterConfirm(printerId, tableTypeId) {
            this.deletePrinterConfirmInfo = {
                visible: true,
                title: '提示',
                content: '您确定要解绑打印机吗？',
                confirmText: '确认',
                cancelText: '取消',
                printerId,
                tableTypeId,
            };
        },

        hideConfirm() {
            this.deletePrinterConfirmInfo.visible = false;
            this.confirmInfo.visible = false;
        },

        deletePrinterDidConfirm() {
            this.hideConfirm();
            this.deletePrinter(this.deletePrinterConfirmInfo.printerId,
                this.deletePrinterConfirmInfo.tableTypeId);
        },

        // Toast
        showToast(text, timeout = 2000) {
            this.toast = {
                visible: true,
                text,
            };
            setTimeout(() => {
                this.toast.visible = false;
            }, timeout);
        },

        // Requests
        getPrinterList(tableTypeId) {
            Ajax.get({
                url: `${this.shopInfo.shopId}/tableCode/printer`,
                params: {
                    tableTypeId,
                },
                success: (res) => {
                    if (res.code.toString() === '200') {
                        this.printerType = res.data.printerType;
                        this.showAddPrinterPopup(res.data.printerList, tableTypeId);
                    } else {
                        this.confirmInfo = {
                            visible: true,
                            title: '提示',
                            content: res.msg,
                            confirmText: '知道了',
                        };
                    }
                },
                error: () => {
                    this.showToast('请求失败请检查网络并重试');
                },
            });
        },

        postAddPrinter(tableTypeId, printerIdList) {
            Ajax.post({
                url: `${this.shopInfo.shopId}/tableCode/printer`,
                params: JSON.stringify({
                    tableTypeId,
                    printerType: this.printerType,
                    printerIdList,
                }),
                success: (res) => {
                    this.showToast(res.msg || '添加成功');
                    setTimeout(() => {
                        if (res.code.toString() === '200') {
                            window.location.reload();
                        }
                    }, 2500);
                },
                error: () => {
                    this.showToast('选择打印机编号失败请重试');
                },
            });
        },

        deletePrinter(printerId, tableTypeId) {
            Ajax.delete({
                url: `${this.shopInfo.shopId}/tableCode/printer/${printerId}`,
                params: {
                    shopId: this.shopInfo.shopId,
                    printerId,
                    printerType: this.printerType,
                    tableTypeId,
                },
                success: (res) => {
                    this.showToast(res.msg);
                    setTimeout(() => {
                        if (res.code.toString() === '200') {
                            window.location.reload();
                        }
                    }, 2500);
                },
                error: () => {
                    this.showToast('删除失败请重试');
                },
            });
        },
    },
};
