<template>
  <div class="ui-popup">
    <div class="pop_overlayer"></div>
    <div class="pop-container">
      <div class="pop-header">
        <div class="pop-title">{{ title }}</div>
        <div class="pop-close"
             @click="close"></div>
      </div>
      <div class="content-container">
        <div class="content">
          <div class="print-code-box">
            <ul class="print-code-list">
              <li class="print-code-item"
                  v-for="printer in printerList"
                  :key="printer.printerId">
                <label>
                  <input type="checkbox"
                         id="printer.printerId"
                         :disabled="printer.disabled"
                         v-model="printer.checked">
                  <span class="print-txt">{{ printer.printerName }}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="btn-cont">
          <ui-button text="确认"
                     type="btn-solid-small-orange-normal"
                     @click="confirm"></ui-button>
          <ui-button text="取消"
                     type="btn-solid-small-grey-normal"
                     @click='cancel'></ui-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
import UIButton from '@/components/ui-base/button/button.vue';

export default {
    props: ['title', 'printerList'],
    computed: {
        selectedPrinterIds() {
            return this.printerList.filter(
                printer => printer.checked).map(
                printer => printer.printerId);
        },
    },
    components: {
        'ui-button': UIButton,
    },
    methods: {
        close() {
            this.$emit('close');
        },
        confirm() {
            this.$emit('confirm', this.selectedPrinterIds);
        },
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>

<style scoped lang="less">
@import './table.less';
@import '../../ui-base/popup/popup.less';
</style>
