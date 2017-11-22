<template>
<div class="ui-popup" v-if="visible">
    <div class="pop_overlayer"></div>
    <div class="pop-container">
        <div class="pop-header">
            <div class="pop-title">{{title}}</div>
            <div v-if="closable !== false" class="pop-close" @click="close"></div>
        </div>
        <div class="content-container">
            <slot name="pop-content"></slot>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        name: 'ui-popup',
        props: ['visible', 'title', 'closable'],
        methods: {
            close() {
                this.$emit('close');
            }
        },
        data() {
            return {

            }
        }
    }
</script>

<style lang="less">
    @import './popup.less';
</style>
