<template>
  <div class="page-container">
    <ul class="sidenav">
      <li>{{ text.sectionTitle }}</li>
    </ul>

    <div class="content">
      <h1>{{ text.sectionTitle }}</h1>
      <div v-for="(faq, index) in text.faqs"
           :key="index">
        <div class="question-container"
             @click="onAnswerClick(faq)">
          <label class="question">{{ faq.question }}</label>
          <span class="arrow"
                :class="{ 'arrow-unfold': faq.expanded }"></span>
        </div>
        <div class="answer"
             :class="{ 'answer-expanded': faq.expanded }">
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import { reportOperTime } from '../lib/utils.js';

export default {
    name: 'Help',
    data() {
        return {
            text: {
                sectionTitle: '常见问题 FAQ',
                faqs: [{
                    expanded: false,
                    question: '每次秒付扫码都直接出现付款页面，没有拉单，为什么？',
                    answer: '“餐厅云管家” 在线时才可以拉单，请打开并用门店账号登录。',
                }, {
                    expanded: false,
                    question: '安装 “餐厅云管家” 后电脑变慢，影响外卖接单，为什么？',
                    answer: '因为电脑配置较低，建议您清理不必要的内存',
                }, {
                    expanded: false,
                    question: '扫码出现 “订单无法被关闭，请稍候，如有疑问请联系服务员” 的提示，为什么？',
                    answer: '顾客使用美团／点评app进行扫码，并且第一次没有支付成功，第二次扫码会出现该提示。',
                }, {
                    expanded: false,
                    question: '拉单失败有什么原因？',
                    answer: '“餐厅云管家” 离线会导致拉单失败，此时请退出并重新登录 “餐厅云管家” 。',
                }],
            },
        };
    },
    methods: {
        onAnswerClick(faq) {
            faq.expanded = !faq.expanded;
        },
    },
    created() {
        reportOperTime({
            pageId: 'menuorder_ecom_help',
            module: 'help_operate_time',
        });
    },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
}

.page-container {
  font-family: sans-serif;
  letter-spacing: 0;
  display: flex;
  flex-direction: row;
  height: 100%;
}

.sidenav {
  flex: 0 194px;
  background-color: #FAFAFA;
  padding: 18px 25px;
}

.sidenav li {
  text-decoration: none;
  font-size: 13px;
  color: #999;
  display: block;
}

.content {
  flex: 1;
  padding: 18px 25px;
  overflow-y: auto;
}

.content h1 {
  color: #666;
  font-weight: normal;
  font-size: 13px;
  margin-bottom: 12.5px;
}

.question-container {
  display: block;
  background: #FAFAFA;
  padding: 8px 25px;
  margin: 7.5px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question::before {
  content: "Q: "
}

.question {
  color: #333;
  font-size: 12px;
}

.arrow {
  width: 4px;
  height: 4px;
  border-color: #999;
  border-width: 1px 0px 0px 1px;
  border-style: solid;
  display: inline-block;
  transform: rotate(45deg);
}

.arrow-unfold {
  border-color: #168CEF;
  -webkit-transform: rotate(225deg);
  transform: rotate(225deg);
  position: relative;
  top: -2px;
}

.answer p:first-of-type::before {
  content: "A: "
}

.answer {
  height: 0px;
  font-size: 13px;
  margin-left: 25px;
  margin-right: 25px;
  overflow: hidden;
  transition: height 0.5s;
  color: #999;
}

.answer-expanded {
  height: auto;
  margin-top: 17.5px;
  margin-bottom: 17.5px;
}
</style>
