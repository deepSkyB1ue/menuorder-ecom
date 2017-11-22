<template>
  <div>
    <div class="table-set-opt">
      <p class="table-set-header">本店是否支持桌位设置：</p>
      <label for="table-set-yes">
        <span class="table-set-txt">支持</span>
        <input id="table-set-yes"
               value="1"
               v-model.number="isSupportTable"
               type="radio"
               name="table-set">
      </label>
      <label for="table-set-no">
        <span class="table-set-txt">不支持</span>
        <input id="table-set-no"
               value="0"
               v-model.number="isSupportTable"
               type="radio"
               name="table-set">
      </label>
    </div>
    <!-- 非对接/对接 -->
    <!-- 不要用v-if, 否则plupload初始化时候会无法绑定按钮 -->
    <div v-show="isSupportTable">
      <div class="input-type-opt">
        <p class="input-type-header">桌号输入方式：</p>
        <label for="input-type-man">
          <span class="input-type-txt">支持扫码和手动输入</span>
          <input id="input-type-man"
                 value="2"
                 v-model.number="tableCodeMode"
                 type="radio"
                 name="input-type">
        </label>
        <label for="input-type-noman">
          <span class="input-type-txt">仅支持扫码</span>
          <input id="input-type-noman"
                 value="1"
                 v-model.number="tableCodeMode"
                 type="radio"
                 name="input-type">
        </label>
      </div>
      <!-- 不要用v-if, 否则plupload初始化时候会无法绑定按钮 -->
      <div class="operation-area"
           v-show="tableCodes.shopAuthority.uploadTableEdit">
        <div class="btn-area">
          <div class="btns">
            <ui-button id="tableExcelUpload"
                       text="EXCEL上传桌号"
                       type="btn-medium-normal-green"></ui-button>
            <br>
            <span v-if="!tableCodes.isIntellShop">提示：上传后将覆盖现有桌号信息</span>
            <span v-else>提示：请根据excel中已有桌号添加分区，不使用的桌号可添加在单独的分区</span>
          </div>
          <div class="links">
            <template v-if="tableCodes.shopAuthority">
              <a v-if="tableCodes.shopAuthority.downloadNoRegionTableEdit"
                 @click="handleDownloadTemplateNoRegion"
                 class="link">下载不分区桌号模板</a>
              <a v-if="tableCodes.shopAuthority.downloadRegionTableEdit"
                 @click="handleDownloadTemplate"
                 class="link">下载分区桌号模板</a>
              <a v-if="tableCodes.shopAuthority.clearTableEdit"
                 @click="handleClearTableCodeDidClick"
                 class="link">清空桌号</a>
            </template>
          </div>
        </div>
      </div>
    </div>
  
    <ui-confirm v-if="confirm.visible"
                :visible="confirm.visible"
                :title="confirm.title"
                :content="confirm.content"
                :confirmText="confirm.confirmText"
                :cancelText="confirm.cancelText"
                @close="hideConfirm"
                @confirm="joinClearTableCodeConfirm">
    </ui-confirm>
  
    <ui-toast :visible="toast.visible"
              :text="toast.text">
    </ui-toast>
  
  </div>
</template>

<script src="./table-settings.js">
</script>

<style scoped lang="less">
@import "./table.less";
.btn-medium-normal-green {
  width: auto;
  padding: 0 20px;
  margin: 0 20px 10px;
}
</style>
