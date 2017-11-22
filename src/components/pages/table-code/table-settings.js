/* eslint-disable import/no-unresolved */
import UIButton from '@/components/ui-base/button/button.vue';
import UIConfirm from '@/components/ui-base/confirm/confirm.vue';
import UIToast from '@/components/ui-base/toast/toast.vue';
import { Ajax } from '@/lib/utils.js';
import getPath from '@/lib/path.js';
import Plupload from 'plupload';

export default {
    name: 'table-settings',
    props: ['shopInfo', 'tableCodes'],
    data() {
        return {
            isSupportTable: 0,
            tableCodeMode: 1,
            confirm: {
                visible: false,
                title: '',
                content: '',
                confirmText: '确认',
                cancelText: '取消',
            },
            toast: {
                visible: false,
                text: '',
            },
        };
    },
    components: {
        'ui-button': UIButton,
        'ui-confirm': UIConfirm,
        'ui-toast': UIToast,
    },
    watch: {
        shopInfo() {
            this.initUpload();
        },
        tableCodes(val) {
            this.isSupportTable = val.isSupportTable;
            this.tableCodeMode = val.tableCodeMode;
        },
        isSupportTable(val) {
            this.$emit('isSupportTableChange', val);
        },
        tableCodeMode(val) {
            this.$emit('tableCodeModeChange', val);
        },
    },
    methods: {
        joinClearTableCodeConfirm() {
            this.deleteClearTableCode();
        },

        hideConfirm() {
            this.confirm.visible = false;
        },

        handleClearTableCodeDidClick() {
            this.confirm = {
                visible: true,
                content: '是否确认清空现有桌号？',
                confirmText: '确认',
                cancelText: '取消',
            };
        },

        handleDownloadTemplateNoRegion() {
            const path = getPath();
            window.location.href = `${path.ajax}/${this.shopInfo.shopId}/tableCodeTemplateNoRegion`;
        },

        handleDownloadTemplate() {
            const path = getPath();
            window.location.href = `${path.ajax}/${this.shopInfo.shopId}/tableCodeTemplateWithRegion`;
        },

        deleteClearTableCode() {
            Ajax.delete({
                url: `${this.shopInfo.shopId}/tableCode`,
                success: (res) => {
                    if (res.code.toString() === '200') {
                        this.toast = {
                            visible: true,
                            text: '清空成功',
                        };
                        setTimeout(() => {
                            this.toast.visible = false;
                        }, 2000);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                },
                error: () => {
                    this.toast = {
                        visible: true,
                        text: '请求失败请检查网络并重试',
                    };
                    setTimeout(() => {
                        this.toast.visible = false;
                    }, 2000);
                },
            });
        },

        initUpload() {
            const uploader = new Plupload.Uploader({
                browse_button: 'tableExcelUpload',
                unique_names: true,
                url: `${getPath().ajax}/${this.shopInfo.shopId}/tableCodeImportWithExcel`,
                filters: {
                    mime_types: [{
                        title: 'xlsx files',
                        extensions: 'xlsx',
                    }],
                    max_file_size: '100K',
                },
                file_data_name: 'File',
                runtimes: 'html5, html4',
                multi_selection: false,
                required_features: 'send_browser_cookies',
            });
            uploader.init();

            uploader.bind('FilesAdded', (loader) => {
                loader.start();
            });

            uploader.bind('FileUploaded', (loader, file, responseObject) => {
                const res = JSON.parse(responseObject.response);
                this.toast = {
                    visible: true,
                    text: res.msg,
                };
                setTimeout(() => {
                    this.toast.visible = false;
                }, 2000);
                if (res.code.toString() === '200') {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            });

            uploader.bind('Error', (loader, error) => {
                let errorStr = '上传失败请重试';
                if (error.code.toString() === '-601') {
                    errorStr = '上传失败，模板错误';
                } else if (error.code.toString() === '-600') {
                    errorStr = '上传失败，文件需在100k以内';
                }
                this.toast = {
                    visible: true,
                    text: errorStr,
                };
                setTimeout(() => {
                    this.toast.visible = false;
                }, 2000);
            });
        },
    },
};
