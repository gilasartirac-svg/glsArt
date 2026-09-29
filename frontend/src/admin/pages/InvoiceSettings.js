import {api} from '../services/api.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export default function InvoiceSettings(){
 setTimeout(async()=>{
  const form=document.querySelector('#invoice-settings-form');
  const error=document.querySelector('#invoice-settings-error');
  if(!form)return;
  try{
   const d=await api('/api/admin/invoice-settings');
   const s=d.item||{};
   for(const [k,v] of Object.entries(s)){
    const el=form.elements.namedItem(k);
    if(el)el.value=v||'';
   }
  }catch(e){if(error)error.textContent=e.message||'خطا در دریافت تنظیمات فاکتور';}
  form.onsubmit=async e=>{
   e.preventDefault();
   const b={};
   ['invoice_store_name','invoice_national_id','invoice_economic_code','invoice_registration_number','invoice_phone','invoice_mobile','invoice_postal_code','invoice_address','invoice_logo_path','invoice_signature_path'].forEach(k=>b[k]=String(new FormData(form).get(k)||'').trim());
   try{
    await api('/api/admin/invoice-settings',{method:'PUT',body:JSON.stringify(b)});
    alert('تنظیمات فاکتور با موفقیت ذخیره شد.');
   }catch(x){if(error)error.textContent=x.message||'ذخیره تنظیمات فاکتور انجام نشد';}
  };
 },0);

 return `<div class="admin-page" dir="rtl">
  <div class="admin-title">
   <div><h2>تنظیمات فاکتور</h2><span class="muted">اطلاعات رسمی و تجاری فروشنده که مستقیماً در فاکتور و پیش‌فاکتور نمایش داده می‌شود.</span></div>
  </div>
  <div id="invoice-settings-error" class="error"></div>
  <div class="panel">
   <form id="invoice-settings-form" class="form">
    <div class="invoice-settings">
     <h3>مشخصات فروشنده</h3>
     <p class="muted">این اطلاعات در یک محل ذخیره می‌شود و تمام فاکتورها از همین اطلاعات استفاده می‌کنند.</p>
     <label>نام فروشگاه / فروشنده<input name="invoice_store_name" required maxlength="200" placeholder="فروشگاه صنایع دستی گیلاس آرت"></label>
     <label>شناسه ملی<input name="invoice_national_id" inputmode="numeric" maxlength="20" placeholder="شناسه ملی شرکت / مجموعه"></label>
     <label>شماره اقتصادی<input name="invoice_economic_code" inputmode="numeric" maxlength="30" placeholder="شماره اقتصادی"></label>
     <label>شماره ثبت<input name="invoice_registration_number" inputmode="numeric" maxlength="30" placeholder="شماره ثبت"></label>
     <label>تلفن ثابت<input name="invoice_phone" inputmode="tel" maxlength="30" placeholder="تلفن ثابت فروشگاه"></label>
     <label>تلفن همراه<input name="invoice_mobile" inputmode="tel" maxlength="30" placeholder="شماره همراه فروشگاه"></label>
     <label>کد پستی<input name="invoice_postal_code" inputmode="numeric" maxlength="20" placeholder="کد پستی"></label>
     <label>آدرس کامل فروشگاه<textarea name="invoice_address" maxlength="1000" rows="4" placeholder="استان، شهر، خیابان، پلاک، واحد..."></textarea></label>
     <h3>هویت بصری فاکتور</h3>
     <label>مسیر لوگوی فاکتور<input name="invoice_logo_path" maxlength="500" placeholder="/glsArt/invoice/logo.svg"><small class="muted">فایل لوگو در مسیر عمومی پروژه قرار می‌گیرد.</small></label>
     <label>مسیر مهر و امضا<input name="invoice_signature_path" maxlength="500" placeholder="/glsArt/invoice/stamp-signature.png"><small class="muted">فایل مهر و امضا بهتر است PNG با پس‌زمینه شفاف باشد.</small></label>
    </div>
    <button class="btn primary" type="submit">ذخیره تنظیمات فاکتور</button>
   </form>
  </div>
  <div class="notice">تغییرات این فرم روی فاکتورهای تولیدشده بعدی و نمایش فاکتور در حساب مشتری اعمال می‌شود.</div>
 </div>`;
}
