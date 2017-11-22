<template>
<ui-popup
    :visible="visible"
    @close="close"
    :title="title"
    @width="300">
    <div class="confirm-popup" slot="pop-content">
        <div class="con">{{content}}</div>
        <div class="popup-footer">
            <ui-button :text="confirmText" @click="confirm" type="btn-solid-small-orange-normal" />
            <ui-button v-if="mode === 'confirm' || !mode" :text="cancelText" @click="close" type="btn-solid-small-grey-normal" />
        </div>
    </div>
</ui-popup>
</template>

<script>
    import UIButton from '../button/button.vue'
    import Popup from '../popup/popup.vue'
    export default {
        name: 'confirm',
        props: ['title', 'content', 'confirmText', 'cancelText', 'visible', 'mode'],
        components: {
            'ui-button': UIButton,
            'ui-popup': Popup
        },
        methods: {
            close() {
                this.$emit('close');
            },
            confirm() {
                this.$emit('confirm');
                this.$emit('close');
            }
        },
        data() {
            return {}
        }
    }
</script>

<style lang="less">
    .confirm-popup {
        position:relative;
        background-color:#fff;
        .con {
            padding:20px;
            zoom:1;
        }
        .popup-footer {
            line-height: 35px;
            padding: 10px 20px;
            text-align: right;
            button {
                &:first-child {
                    margin-right: 15px;
                }
            }
        }
        .popup-footer-alert {
            text-align: center;
        }
    }
</style>
