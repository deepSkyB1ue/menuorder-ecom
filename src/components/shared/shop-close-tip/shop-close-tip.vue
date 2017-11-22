<#if isShopClosing??&&isShopClosing==1>
    <div class="msg-warning">点餐服务已关闭，顾客无法使用手机点餐功能。
    <#if inConfigPage?? && inConfigPage == 1>
    <#else>
        <a href="${configHref}">点此设置</a>
    </#if>
    </div>
<#elseif showODPayHint>
    <div class="msg-warning">11月29日起，点餐先付账单将迁移至【点菜--财务管理】，结款记录请使用管理员账号登录查看。
    </div>
</#if>