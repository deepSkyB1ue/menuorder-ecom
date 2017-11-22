<template>
	<div class="table-area">
		<div v-for="area in tableAreas"
		     :key="area.tableTypeId">
			<div v-if="!area.isRegion"
			     class="area-item">
				<div class="area-item-content">
					<div class="form-tit"
					     v-if="shopInfo.isIntellShop">未分区桌号</div>
					<div class="form-tit"
					     v-else>桌号</div>
					<div class="form-txt">
						<div v-for="tableCode in area.tableCodeSet"
						     :key="tableCode"
						     class="table-code-txt">{{ tableCode }};&nbsp;&nbsp;</div>
					</div>
				</div>
			</div>
			<div v-else
			     class="area-item">
				<div class="area-item-title">{{ area.tableTypeName }}</div>
				<div class="area-item-content">
					<div class="form-tit">桌号</div>
					<div class="form-txt">
						<div v-for="tableCode in area.tableCodeSet"
						     :key="tableCode"
						     class="table-code-txt">{{ tableCode }};&nbsp;&nbsp;</div>
					</div>
				</div>
				<div class="area-item-content">
					<div class="form-tit">打印机编号</div>
					<div class="form-txt">
						<div class="print-list">
							<div v-for="printer in area.hobbitPrinterBoList"
							     :key="printer.printerId">
								<span v-if="printer.ununsed"
								      class="print-tag invalid">{{ printer.printerName }}
									<i class="icon-delete"
									   @click="showDeletePrinterConfirm(printer.printerId, area.tableTypeId)">×</i>
									<span class="tip-invalid">失效</span>
								</span>
								<span v-else
								      class="print-tag">{{ printer.printerName }}
									<i class="icon-delete"
									   @click="showDeletePrinterConfirm(printer.printerId, area.tableTypeId)">×</i>
								</span>
							</div>
							<span class="add-print"
							      @click="getPrinterList(area.tableTypeId)">
								<i class="icon-add">+</i>添加编号</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<add-printer-popup v-if="popupInfo.visible"
		                   :visible="popupInfo.visible"
		                   :title="popupInfo.title"
		                   :printerList="popupInfo.printerList"
		                   @confirm="addPrinterDidConfirm"
		                   @cancel="hidePopup"
		                   @close="hidePopup"></add-printer-popup>
	
		<ui-confirm :visible="deletePrinterConfirmInfo.visible"
		            :title="deletePrinterConfirmInfo.title"
		            :content="deletePrinterConfirmInfo.content"
		            :confirmText="deletePrinterConfirmInfo.confirmText"
		            :cancelText="deletePrinterConfirmInfo.cancelText"
		            mode="confirm"
		            @close="hideConfirm"
		            @confirm="deletePrinterDidConfirm">
		</ui-confirm>
		<ui-confirm :visible="confirmInfo.visible"
		            :title="confirmInfo.title"
		            :content="confirmInfo.content"
		            :confirmText="confirmInfo.confirmText"
		            mode="alert"
		            @confirm="hideConfirm">
		</ui-confirm>
	
		<ui-toast :visible="toast.visible"
		          :text="toast.text">
		</ui-toast>
	</div>
</template>

<script src="./table-area.js">
</script>

<style scoped lang="less">
@import "./table.less";
</style>
