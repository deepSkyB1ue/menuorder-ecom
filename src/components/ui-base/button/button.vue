<template>
    <button
    :class="type"
    :disabled="disabled"
    @click="handleClick">{{text}}</button>
</template>

<script>
    export default {
        name: 'button',
        props: ['text', 'type', 'disabled'],
        methods: {
            handleClick() {
                this.$emit('click')
            }
        },
        data() {
            return {}
        }
    }
</script>

<style lang="less">
    @import './button.less';
</style>
