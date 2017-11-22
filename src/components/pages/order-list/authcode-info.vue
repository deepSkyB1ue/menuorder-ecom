<template>
   <ui-popup class='authinfo-pop-panel' :visible="authInfoData.visible" :title="authInfoData.title" @close="hidePopInfo">
        <div slot='pop-content'>
            <div class="content">
                <div class="info-word">
                    <div>请去餐厅云管家 “设置->系统设置-></div>
                    <div>设置退款授权码->忘记授权码” 中找回</div>
                    <div>授权码</div>
                </div>
                
            </div>
            <div class="authinfo-button-cont">
                <ui-button text="知道了" type="btn-solid-small-green-normal" @click='hidePopInfo()'/>
            </div>
        </div>
    </ui-popup>
</template>
<script>
/* eslint-disable import/no-unresolved */
import Popup from '@/components/ui-base/popup/popup.vue';
import {
    Button, PasswordBox,
} from '@dp/bee-ui'; // eslint-disable-line import/extensions

export default {
    props: {
        authInfoData: Object,
    },
    methods: {
        hidePopInfo() {
            this.authInfoData.visible = false;
        },
    },
    components: {
        'ui-popup': Popup,
        'ui-button': Button,
        'password-box': PasswordBox,
    },
};
</script>

<style lang='less'>
.info-word{
    font-size: 14px;
}
.authinfo-button-cont{
    text-align: center;
    margin-top:28px;
}
.authinfo-pop-panel .content-container{
    min-width: 245px;
    padding:20px 25px 20px 30px;
}
</style>
