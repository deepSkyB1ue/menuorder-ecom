<template>
    <div v-if="visible">
        <div class="toast-popup" slot="pop-content">
            <div class="con">{{text}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'toast',
        data() {
            return {
                text: '',
                visible: false,
                duration: 2000,
            };
        },
        mounted() {
            this.duration = Math.max(this.duration, 100); // set duration no less than 100;
            this.visible = true;
            setTimeout(() => {
                this.visible = false;

                // destroy the toast after usage
                this.$destroy(true);
                this.$el.parentNode.removeChild(this.$el);
            }, this.duration);
        },
    };
</script>

<style lang="less">
.rgba(@r: 0, @g: 0, @b: 0, @a: 1) {
    @argb: argb(rgba(@r, @g, @b, @a));
    // IE hack
    zoom: 1;
    background-color: black\9;
    -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=@{argb}, endColorstr=@{argb})";
    filter: ~"progid:DXImageTransform.Microsoft.gradient(startColorstr=@{argb}, endColorstr=@{argb})";
    _background-color: #111;
    background: rgba(@r, @g, @b, @a);
}

.toast-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    .rgba(0, 0, 0, 0.8);
    color: #fff;
    border: none;
    border-radius: 4px;
    text-align: center;
    z-index: 101;
    .con {
        padding: 17px 45px;
        font-size: 14px;
        max-width: 300px;
        font-family: "微软雅黑";
    }
}
</style>

