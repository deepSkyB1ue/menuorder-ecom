<template>
    <div class="page-container">
        <popup :visible="popupInfo.visible" :title="popupInfo.title" @close="hidePopInfo">
            <div class="pop-panel" slot="pop-content">
                <div class="content">
                    <div class="note-text">
                        <div>请下载并打印以下二维码</div>
                        <div>顾客可通过扫描二维码提供开票信息</div>
                    </div>
                    <div class="qr-code">
                        <img class="qr-img" :src="popupInfo.downloadUrl">
                    </div>
                    <div class="download">
                        <a class='download-btn' @click='download($event)'>下载</a>
                    </div>
                </div>
            </div>
        </popup>
    </div>
</template>
<script>
import { Button, Popup } from '@dp/bee-ui';

export default {
    name: 'qr-code',
    data() {
        return {
            popupInfo: {
                visible: true,
                title: '下载开票二维码',
                downloadUrl: '',
            },
        };
    },
    components: {
        popup: Popup,
        'bee-button': Button,
    },
    methods: {
        hidePopInfo() {
            this.$emit('close');
            this.popupInfo.visible = false;
        },
        download(event) {
            const odownLoad = event.target;
            odownLoad.href = this.popupInfo.downloadUrl;
            odownLoad.download = 'barcode.png';
        },
    },
    mounted() {
        const beta = location.href.indexOf('test') > 0;
        let domain = '';
        if (beta) {
            domain = `${location.protocol}//m.51ping.com`;
        } else {
            domain = `${location.protocol}//m.dianping.com`;
        }
        this.popupInfo.downloadUrl = `${domain}/hobbit/warehouseman/ajax/downloadInvoiceQrcode`;
    },
};
</script>
<style lang="less">
@import "~@dp/bee-ui/dist/styles/theme/exe/index.css";
.content-container {
  width: 460px;
  height: 340px;
}
.pop-panel {
  background: #fff;

  .content {
    .note-text {
      margin-top: 1px;
      margin-bottom: 12px;
      font-size: 14px;
      color: #666666;
      text-align: center;
    }

    .qr-code {
      border: 0 solid #fff;
      /*!*alignment: center;*!*/
      width: 125px;
      height: 187px;

      margin: 0 auto;
      position: relative;
      .qr-img {
        /*alignment: center;*/
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 125px;
        height: 187px;
      }
    }

    .download {
      padding-top: 30px;
      width: 104px;
      margin: 0 auto;

      .download-btn {
        /*width: 104px;*/
        height: 40px;
        background: #168cef;
        color: white;
        padding: 15px 40px;
        border-radius: 2px;
        cursor: pointer;
      }
    }
  }
}
</style>
