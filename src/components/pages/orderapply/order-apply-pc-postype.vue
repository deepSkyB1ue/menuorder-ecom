<template>
    <div class="miaofu-postype input-block">
        <label>收银品牌</label>
        <input @change="changePosType" class="input-search-large" type="text" placeholder="请输入收银品牌" v-model="posType">
    </div>
</template>
<script>
    export default {
        name: 'miaofu-postype',
        methods: {
            changePosType() {
                this.$emit('changePosType', this.posType);
            },
        },
        data() {
            return {
                posType: '',
            };
        },
    };
</script>