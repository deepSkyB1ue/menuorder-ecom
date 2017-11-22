<template>
    <div class="drop-cont" v-click-outside='hideDropInfo' v-if='options.length'>
        <div class="head-cont" @click='showDropInfo()'>
            <div class='head-title'>{{name}}</div>
            <div :class="{'down-triangle':!showInfo,'up-triangle':showInfo}"></div>
        </div>
        <ul class='drop-list' v-if='showInfo'>
            <li class='drop-item' :class="{'disable':item.status}" @click='chooseDropItem(item)' v-for='item in options'>{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
import Vue from 'vue'
import vClickOutside from 'v-click-outside'

Vue.use(vClickOutside)
export default {
    props:
        {
            name:String,
            options:Array
        }
    ,
    data(){
        return {
            showInfo:false
        }
    },
    methods:{
        showDropInfo(){
            this.showInfo = true;
        },
        hideDropInfo(){
            this.showInfo = false;
        },
        chooseDropItem(item){
            if(item.callback){
                item.callback(item)
            }
        }
    }

}
</script>
<style lang="less">
    .drop-cont{
        position: relative;
        display: inline-block;
        .head-cont{
            cursor: pointer;
            .head-title{
                color:#3dc6b6;
                display: inline-block;
            }
            .down-triangle{
                display: inline-block;
                width: 7px;
                height: 7px;
                border: 1px solid #3dc6b6;
                border-top: none;
                border-left: none;
                box-sizing: border-box;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                position: relative;
                top: -2px;
            }
            .up-triangle{
                display: inline-block;
                width: 7px;
                height: 7px;
                border: 1px solid #3dc6b6;
                border-bottom: none;
                border-right: none;
                box-sizing: border-box;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                position: relative;
                top: 2px;
            }
        }

       
        .drop-list{
            cursor: pointer;
            position: absolute;
            left: -30px;
            top: 25px;
            list-style: none;
            min-width: 100px;
            border: 1px solid #d1d1d1;
            background: #fff;
            color:#3dc6b6;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,.1), 0 4px 8px 0 rgba(0,0,0,.2);
            z-index: 99;
            .drop-item{
                text-align: center;
                height: 30px;
                line-height: 30px;
                &:hover{
                    background:#f2f2f2;
                }
            }
            .disable{
                color:#ccc;
            }
        }
        .drop-list li:first-child::before{
            position: absolute;
            content: '';
            border: 1px solid #d1d1d1;
            border-right: none;
            border-bottom: none;
            transform: translate(-50%, -50%) rotate(45deg) ;
            height: 10px;
            width: 10px;
            top: -1px;
            left:50%;
            z-index: 1;
            background-color: #fff;
        }
        .drop-list li:first-child:hover::before{
            background-color: #f2f2f2;
        }
    }
</style>
