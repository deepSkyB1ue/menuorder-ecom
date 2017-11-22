<template>
    <div class="cont" v-click-outside='hideDropList'>
        <div class="select-val" @click='showDropInfo()'>
            <div for="" class='choose-text'>{{choosedText}}</div>
            <div :class="{'down-triangle':!showDropList,'up-triangle':showDropList}">

            </div>
        </div>
        <ul class="dropdown-list" v-show='showDropList'>
            <li class="li-item" v-for='item in options' @click='chooseItem(item)'>
                {{item.name}}
            </li>
        </ul>
    </div>
</template>
<script>
import Vue from 'vue'
import vClickOutside from 'v-click-outside'

Vue.use(vClickOutside)
export default {
    props:{
        options:{
            name:String,
            code:String
        },
        defaultText:String
    },
    data(){
        return {
            showDropList:false,
            choosedText:this.defaultText
        }
    },
    methods:{
        showDropInfo(){
            this.showDropList = true ;
        },
        chooseItem(item){
            this.showDropList = false ;
            this.choosedText = item.name;
            this.$emit('chooseSelectItem',item)
        },
        hideDropList(){
            this.showDropList = false;
        }

    }
}
</script>
<style lang="less">
.cont {
    cursor: pointer;
    display: inline-block;
    position: relative;
    width: 150px;
    height: 30px;
    vertical-align: top;
    .select-val {
        position: relative;
        min-height: 30px;
        border: 1px solid #D1D1D1;
        background: #ffffff;
        box-sizing: border-box;
        .choose-text{
            padding-left: 10px;
            height: 30px;
            line-height: 30px;
        }
        .down-triangle{
            position: absolute;
            right:10px;
            top:5px;
            width: 10px;
            height: 10px;
            border: 1px solid #D1D1D1;
            border-top: none;
            border-left: none;
            box-sizing: border-box;
            transform: rotate(45deg)
        }
        .up-triangle{
            position: absolute;
            right:10px;
            top:11px;
            width: 10px;
            height: 10px;
            border: 1px solid #D1D1D1;
            border-top: none;
            border-left: none;
            box-sizing: border-box;
            transform: rotate(225deg)
        }
    }
    .dropdown-list {
        width: 150px;
        position: relative;
        float: left;
        top: -1px;
        z-index: 99;
        background: #ffffff;
        border: 1px solid #D1D1D1;
        box-sizing: border-box;
        .li-item {
            padding: 10px 10px;
            &:hover {
                background: #f2f2f2;
            }
        }
    }
}
</style>

