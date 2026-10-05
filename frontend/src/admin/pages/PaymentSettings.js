import {api} from '../services/api.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default function PaymentSettings(){
 setTimeout(async()=>{
  const form=document.querySelector('#payment-settings'),error=document.querySelector('#payment-error');
  try{
   const d=await api('/api/admin/integrations'),z=d.zarinpal||{},n=d.novinopay||{},c=d.cardTransfer||{};
   form.elements.zarinpalEnabled.checked=z.enabled;
   form.elements.novinopayEnabled.checked=n.enabled;
   form.elements.cardTransferEnabled.checked=c.enabled;
   form.elements.defaultProvider.value=d.defaultProvider||'zarinpal';
   form.elements.zarinpalEnvironment.value=z.environment||'production';
   form.elements.zarinpalCallback.value=z.callbackUrl||'';
   form.elements.novinopayCallback.value=n.callbackUrl||'';
   form.elements.zarinpalTitle.value=z.title||'زرین‌پال';
   form.elements.novinopayTitle.value=n.title||'نوینو پی';
   form.elements.cardTransferTitle.value=c.title||'کارت به کارت';
   form.elements.bankName.value=c.bankName||'';
   form.elements.accountHolder.value=c.accountHolder||'';
   form.elements.cardNumber.value=c.cardNumber||'';
   form.elements.iban.value=c.iban||'';
   form.elements.instructions.value=c.instructions||'';
   document.querySelector('#zarin-secret').textContent=z.merchantConfigured?'Merchant ID زرین‌پال در Worker Secret تنظیم شده است.':'Merchant ID زرین‌پال تنظیم نشده است.';
   document.querySelector('#novino-secret').textContent=n.merchantConfigured?'Merchant ID نوینو پی در Worker Secret تنظیم شده است.':'Merchant ID نوینو پی تنظیم نشده است.';
   form.addEventListener('submit',async e=>{
    e.preventDefault();
    try{
     await api('/api/admin/integrations',{method:'PUT',headers:{'x-csrf-token':document.cookie.match(/(?:^|; )gs_csrf=([^;]+)/)?.[1]||''},body:JSON.stringify({
      zarinpalEnabled:form.elements.zarinpalEnabled.checked,novinopayEnabled:form.elements.novinopayEnabled.checked,cardTransferEnabled:form.elements.cardTransferEnabled.checked,
      defaultProvider:form.elements.defaultProvider.value,zarinpalEnvironment:form.elements.zarinpalEnvironment.value,
      zarinpalCallbackUrl:form.elements.zarinpalCallback.value,novinopayCallbackUrl:form.elements.novinopayCallback.value,
      zarinpalTitle:form.elements.zarinpalTitle.value,novinopayTitle:form.elements.novinopayTitle.value,cardTransferTitle:form.elements.cardTransferTitle.value,
      cardTransferBankName:form.elements.bankName.value,cardTransferAccountHolder:form.elements.accountHolder.value,cardTransferCardNumber:form.elements.cardNumber.value,cardTransferIban:form.elements.iban.value,cardTransferInstructions:form.elements.instructions.value
     })});
     alert('تنظیمات درگاه‌های پرداخت ذخیره شد'); location.reload();
    }catch(e){error.textContent=e.message||'ذخیره تنظیمات انجام نشد.'}
   });
  }catch(e){error.textContent=e.message||'خطا در دریافت تنظیمات'}
 },0);
 return '<div class="admin-page" dir="rtl"><div class="admin-title"><div><h2>درگاه‌های پرداخت</h2><span class="muted">انتخاب روش پرداخت در زمان تسویه انجام می‌شود.</span></div></div><div id="payment-error" class="error"></div><form id="payment-settings" class="form"><div class="panel"><h3>روش‌های پرداخت</h3><label><input type="checkbox" name="zarinpalEnabled"> فعال بودن زرین‌پال</label><label><input type="checkbox" name="novinopayEnabled"> فعال بودن نوینو پی</label><label><input type="checkbox" name="cardTransferEnabled"> فعال بودن کارت به کارت</label><label>درگاه پیش‌فرض<select name="defaultProvider"><option value="zarinpal">زرین‌پال</option><option value="novinopay">نوینو پی</option><option value="card_transfer">کارت به کارت</option></select></label></div><div class="panel"><h3>زرین‌پال</h3><label>عنوان<input name="zarinpalTitle"></label><label>محیط<select name="zarinpalEnvironment"><option value="production">Production</option><option value="sandbox">Sandbox</option></select></label><label>Callback URL<input name="zarinpalCallback" dir="ltr"></label><div id="zarin-secret" class="notice"></div></div><div class="panel"><h3>نوینو پی</h3><label>عنوان<input name="novinopayTitle"></label><label>Callback URL<input name="novinopayCallback" dir="ltr"></label><div id="novino-secret" class="notice"></div><p class="muted">Merchant ID نوینو پی به‌صورت Secret در Worker نگهداری می‌شود و مقدار آن در پنل نمایش داده نمی‌شود.</p></div><div class="panel"><h3>کارت به کارت</h3><label>عنوان<input name="cardTransferTitle"></label><label>نام بانک<input name="bankName"></label><label>نام صاحب حساب<input name="accountHolder"></label><label>شماره کارت<input name="cardNumber" dir="ltr" inputmode="numeric"></label><label>شماره شبا<input name="iban" dir="ltr"></label><label>راهنمای پرداخت<textarea name="instructions" rows="4"></textarea></label></div><button class="btn primary" type="submit">ذخیره تنظیمات درگاه‌ها</button></form></div>';
}