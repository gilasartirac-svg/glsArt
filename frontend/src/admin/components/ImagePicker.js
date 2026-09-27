import {api} from '../services/api.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function bindImagePicker({buttonId,inputId,altInputId}){
 const button=document.getElementById(buttonId);if(!button)return;
 button.onclick=async()=>{let modal=document.getElementById('media-picker-modal');if(!modal){modal=document.createElement('div');modal.id='media-picker-modal';modal.className='media-picker-modal';document.body.appendChild(modal)}
 modal.innerHTML='<div class="media-picker-panel"><div class="sectionhead"><h3>انتخاب تصویر</h3><button class="btn ghost" id="media-close">بستن</button></div><div id="media-items" class="media-picker-grid">در حال دریافت تصاویر...</div></div>';
 modal.hidden=false;document.getElementById('media-close').onclick=()=>modal.hidden=true;
 try{const d=await api('/api/admin/media-images'),el=document.getElementById('media-items');el.innerHTML=(d.items||[]).map(x=>'<button type="button" class="media-pick" data-path="'+esc(x.url)+'" data-name="'+esc(x.name)+'"><img src="'+esc(x.url)+'" alt="'+esc(x.name)+'"><span>'+esc(x.name)+'</span></button>').join('')||'<div class="notice">در مسیرهای فعلی تصویری پیدا نشد.</div>';el.querySelectorAll('.media-pick').forEach(x=>x.onclick=()=>{document.getElementById(inputId).value=x.dataset.path;if(altInputId&&document.getElementById(altInputId)&&!document.getElementById(altInputId).value)document.getElementById(altInputId).value=x.dataset.name;modal.hidden=true})}catch(e){document.getElementById('media-items').innerHTML='<div class="error">'+esc(e.message)+'</div>'}}
}
