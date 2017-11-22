<template lang="html">
    <div class="add-blacklist-panel">
        <ui-popup  :visible="popupInfo.visible" :title="popupInfo.title" @close="hidePopInfo">
            <div class='pop-panel' slot='pop-content'>
                <div>
                    <div class="user-cont" v-if='userInfo'>
                        <div><span class="icon_must">*</span><span>用户：</span></div>
                        <div class='user-info'>
                            <div>{{userInfo.userId}}</div>
                            <div>（{{userInfo.phone}}）</div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="choose-item">
                            <span class="icon_must">*</span><span>用户手机：</span>
                        </div>
                        <input placeholder="加到黑名单的用户" type="text" class='phone-input' v-model='phoneNumber' name="" value="">
                    </div>
                </div>
                <div class="choose-item">
                    <span class="icon_must">*</span><span>原因：</span>
                </div>
                <div class="choose-item">
                    <input type="checkbox" class='bee-icon bee-icon-checkbox' name="" value="下无效单" @click='chooseReason()'>下无效单
                </div>
                <div class="choose-item">
                    <input type="checkbox" class='bee-icon bee-icon-checkbox' name="" value="竞对破坏" @click='chooseReason()'>竞对破坏
                </div>
                <div class="other-container">
                    <span>其他</span>
                    <textarea placeholder="加到黑名单的原因" v-model='otherReason' name="name" rows="8" cols="30"></textarea>
                </div>
                <div class="button-container">
                    <ui-button text="确定" type="btn-solid-small-orange-normal" @click='confirm()'/>
                    <ui-button text="取消" type="btn-solid-small-grey-normal" @click='cancel()'/>
                </div>
            </div>
        </ui-popup>
        <ui-toast
            :visible="toast.visible"
            :text="toast.text"
            :duration="toast.duration"
          ></ui-toast>
    </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
import Popup from '@/components/ui-base/popup/popup.vue';
import UIButton from '@/components/ui-base/button/button.vue';
import UIToast from '@/components/ui-base/toast/toast.vue';

export default {
    props: {
        userInfo: Object,
    },
    data() {
        return {
            popupInfo: {
                visible: true,
                title: '添加黑名单用户',
            },
            reasonList: [],
            otherReason: '',
            phoneNumber: '',
            commitReason: '',
            toast: {
                visible: false,
                text: '',
            },
        };
    },
    methods: {
        hidePopInfo() {
            this.$emit('close');
            this.popupInfo.visible = false;
        },
        chooseReason() {
            const value = event.target.value;
            if (this.reasonList.indexOf(value) >= 0) {
                this.reasonList.splice(this.reasonList.indexOf(value), 1);
            } else {
                this.reasonList.push(value);
            }
        },
        confirm() {
            if (this.check()) {
                if (this.userInfo) {
                    this.$emit('ok', {
                        phone: this.userInfo.phone,
                        userId: this.userInfo.userId,
                        reason: this.commitReason,
                    });
                } else {
                    this.$emit('ok', {
                        phone: this.phoneNumber,
                        reason: this.commitReason,
                    });
                }
                this.hidePopInfo();
            }
        },
        cancel() {
            this.hidePopInfo();
        },
        showToastMsg(msg, time = 2000) {
            this.toast = {
                visible: true,
                text: msg,
            };
            setTimeout(() => {
                this.toast.visible = false;
            }, time);
        },
        check() {
            if (!this.userInfo) {
                if (!this.phoneNumber || !/^1[3|4|5|7|8][0-9]{9}$/.test(this.phoneNumber)) {
                    this.showToastMsg('请输入正确的手机号！');
                    return false;
                }
            }
            if (this.reasonList.length === 0 && this.otherReason.trim() === '') {
                this.showToastMsg('请输入加入黑名单原因！');
                return false;
            }
            let reason = this.reasonList.length ? this.reasonList.toString() : '';
            if (reason.length > 0) {
                if (this.otherReason.trim().length > 0) {
                    reason += `,${this.otherReason}`;
                }
            } else {
                reason = this.otherReason;
            }
            if (reason.length > 100) {
                this.showToastMsg('内容过长！');
                return false;
            }
            this.commitReason = reason;
            return true;
        },
    },
    components: {
        'ui-popup': Popup,
        'ui-button': UIButton,
        'ui-toast': UIToast,
    },
};
</script>

<style lang="less" scoped>@import "./black-list-pop.less";</style>
