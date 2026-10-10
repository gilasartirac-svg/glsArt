(() => {
  const MODULES=['https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js','https://unpkg.com/three@0.180.0/build/three.module.js'];
  const TEXTURES={wall:'https://threejs.org/examples/textures/brick_diffuse.jpg',floor:'https://threejs.org/examples/textures/hardwood2_diffuse.jpg',ceiling:'https://threejs.org/examples/textures/uv_grid_opengl.jpg'};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pick=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,4)};
  async function loadThree(){let error;for(const url of MODULES){try{return await import(url)}catch(e){error=e}}throw error||new Error('three unavailable')}
  const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  function fallback(stage,products){stage.classList.add('vg3-home-fallback');stage.querySelector('canvas')?.remove();stage.querySelector('.vg3-home-loading')?.remove();stage.insertAdjacentHTML('beforeend','<div class="vg3-fallback-wall">'+pick(products).map((p,i)=>'<a class="vg3-fallback-art" href="/'+encodeURIComponent(String(p.slug||''))+'"><img src="'+esc(p.image)+'" alt="'+esc(p.name||'اثر هنری')+'" loading="lazy"><span>'+esc(p.name||'مشاهده اثر')+'</span></a>').join('')+'</div>')}
  async function init(stage){
    let products=[];try{products=JSON.parse(stage.dataset.galleryProducts||'[]')}catch{}products=products.filter(p=>p&&p.image&&p.slug);
    if(!products.length){stage.querySelector('.vg3-home-loading')?.remove();return}
    try{
      const T=await loadThree();if(!stage.isConnected)return;const chosen=pick(products),scene=new T.Scene();scene.background=new T.Color('#211b16');scene.fog=new T.Fog('#211b16',10,27);
      const camera=new T.PerspectiveCamera(48,1,.1,80);camera.position.set(0,2.5,8.8);camera.lookAt(0,2,0);
      const renderer=new T.WebGLRenderer({canvas:stage.querySelector('canvas'),antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
      scene.add(new T.HemisphereLight(0xffe6c3,0x30251b,2));
      const ambient=new T.PointLight(0xffc77b,25,18,2);ambient.position.set(0,5.1,1);scene.add(ambient);
      for(const x of [-3.5,0,3.5]){const light=new T.SpotLight(0xffd49a,36,15,Math.PI/5,.55,1.3);light.position.set(x,5.2,1);light.target.position.set(x,2,0);scene.add(light,light.target)}
      const loader=new T.TextureLoader();loader.setCrossOrigin('anonymous');
      const loadTexture=(url,rx,ry)=>new Promise(resolve=>loader.load(url,t=>{t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx,ry);t.colorSpace=T.SRGBColorSpace;resolve(t)},undefined,()=>resolve(null)));
      const [wallTex,floorTex,ceilTex]=await Promise.all([loadTexture(TEXTURES.wall,2,2),loadTexture(TEXTURES.floor,3,4),loadTexture(TEXTURES.ceiling,3,3)]);if(!stage.isConnected)return;
      const material=(color,map)=>new T.MeshStandardMaterial({color,map:map||null,roughness:.88});
      const floor=new T.Mesh(new T.PlaneGeometry(15,24),material('#8b6347',floorTex));floor.rotation.x=-Math.PI/2;floor.position.set(0,0,-3);scene.add(floor);
      const ceiling=new T.Mesh(new T.PlaneGeometry(15,24),material('#9d8b72',ceilTex));ceiling.rotation.x=Math.PI/2;ceiling.position.set(0,5.7,-3);scene.add(ceiling);
      const wallMat=material('#c7b49a',wallTex);const back=new T.Mesh(new T.PlaneGeometry(15,5.7),wallMat);back.position.set(0,2.85,-12);scene.add(back);
      for(const side of [-1,1]){const wall=new T.Mesh(new T.PlaneGeometry(24,5.7),wallMat);wall.rotation.y=side*Math.PI/2;wall.position.set(side*7.5,2.85,-3);scene.add(wall)}
      const artworks=[];
      chosen.forEach((p,i)=>{const side=i%2===0?-1:1,row=Math.floor(i/2),z=2-row*6.6;const group=new T.Group();group.position.set(side*7.42,2.75,z);group.rotation.y=side===-1?Math.PI/2:-Math.PI/2;scene.add(group);const m=new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide,toneMapped:false});const plane=new T.Mesh(new T.PlaneGeometry(2.25,2.65),m);group.add(plane);artworks.push({p,plane,m});loader.load(p.image,texture=>{if(!stage.isConnected){texture.dispose();return}texture.colorSpace=T.SRGBColorSpace;m.map=texture;m.needsUpdate=true},undefined,()=>{})});
      const trim=new T.MeshStandardMaterial({color:'#a87838',metalness:.62,roughness:.34});for(const y of [.48,5.2]){const rail=new T.Mesh(new T.BoxGeometry(14.8,.045,.045),trim);rail.position.set(0,y,-3);scene.add(rail)}
      const resize=()=>{if(!stage.isConnected)return;const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(stage);resize();
      const ray=new T.Raycaster(),pointer=new T.Vector2(),canvas=renderer.domElement;let downX=0,downY=0,drag=false;
      canvas.addEventListener('pointerdown',e=>{downX=e.clientX;downY=e.clientY;drag=false});canvas.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-downX)+Math.abs(e.clientY-downY)>7)drag=true});
      canvas.addEventListener('click',e=>{if(drag)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(artworks.map(a=>a.plane),false)[0];if(hit){const item=artworks.find(a=>a.plane===hit.object);if(item?.p?.slug)location.href='/'+encodeURIComponent(String(item.p.slug))}});
      let start=performance.now();const animate=now=>{if(!stage.isConnected){observer.disconnect();renderer.dispose();return}const t=(now-start)/1000;if(!reduced){camera.position.x=Math.sin(t*.19)*.55;camera.position.z=8.8+Math.sin(t*.13)*.35;camera.lookAt(Math.sin(t*.17)*.35,2.5,0)}renderer.render(scene,camera);requestAnimationFrame(animate)};
      stage.querySelector('.vg3-home-loading')?.remove();stage.classList.add('vg3-home-ready');requestAnimationFrame(animate);
    }catch(error){console.warn('GilasArt homepage gallery preview fallback:',error);fallback(stage,products)}
  }
  function install(){document.querySelectorAll('.vg3-home-stage:not([data-gallery-initialized])').forEach(stage=>{stage.dataset.galleryInitialized='true';init(stage)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  const app=document.getElementById('app');if(app)new MutationObserver(install).observe(app,{childList:true,subtree:true});
})();