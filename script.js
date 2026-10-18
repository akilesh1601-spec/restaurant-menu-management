const STORAGE_KEY = "menupro_demo_v1";
const initialData = {
  categories: [
    {id:1,name:"Appetizers",description:"Small bites to start your meal",icon:"🥗"},
    {id:2,name:"Soups & Salads",description:"Fresh and comforting choices",icon:"🥣"},
    {id:3,name:"Main Course",description:"Hearty signature dishes",icon:"🍛"},
    {id:4,name:"Pizzas",description:"Oven-baked favourites",icon:"🍕"},
    {id:5,name:"Burgers",description:"Handcrafted burger classics",icon:"🍔"},
    {id:6,name:"Desserts",description:"Sweet endings to your meal",icon:"🍰"},
    {id:7,name:"Beverages",description:"Coolers, juices, and more",icon:"🥤"},
    {id:8,name:"Specials",description:"Chef's seasonal recommendations",icon:"⭐"}
  ],
  items: [
    {id:1,name:"Paneer Tikka",description:"Smoky paneer with peppers and house spices.",categoryId:1,tags:["Vegetarian","Spicy"],price:249,specialPrice:229,status:"Available",emoji:"🧀",views:192},
    {id:2,name:"Garden Fresh Salad",description:"Crisp greens, cucumber, tomato, and citrus dressing.",categoryId:2,tags:["Vegan","Gluten-Free"],price:169,specialPrice:null,status:"Available",emoji:"🥗",views:145},
    {id:3,name:"Creamy Mushroom Soup",description:"Creamy mushroom soup with herbs and toasted bread.",categoryId:2,tags:["Vegetarian"],price:149,specialPrice:null,status:"Available",emoji:"🍲",views:122},
    {id:4,name:"Margherita Pizza",description:"Classic tomato, mozzarella, and basil.",categoryId:4,tags:["Vegetarian"],price:299,specialPrice:279,status:"Available",emoji:"🍕",views:180},
    {id:5,name:"Classic Veg Burger",description:"Grilled vegetable patty, lettuce, and house sauce.",categoryId:5,tags:["Vegetarian"],price:199,specialPrice:null,status:"Limited Stock",emoji:"🍔",views:166},
    {id:6,name:"Chocolate Lava Cake",description:"Warm chocolate cake with a soft centre.",categoryId:6,tags:["Vegetarian"],price:159,specialPrice:null,status:"New Item",emoji:"🍫",views:98},
    {id:7,name:"Mango Cooler",description:"Refreshing mango drink served chilled.",categoryId:7,tags:["Vegan","Dairy-Free"],price:99,specialPrice:null,status:"Available",emoji:"🥭",views:135},
    {id:8,name:"Chef's Special Pasta",description:"Pasta tossed with seasonal vegetables and herbs.",categoryId:8,tags:["Vegetarian"],price:279,specialPrice:null,status:"Out of Stock",emoji:"🍝",views:110}
  ],
  inventory: [
    {id:1,name:"Paneer",quantity:2.5,unit:"kg",reorder:5},
    {id:2,name:"Tomatoes",quantity:8,unit:"kg",reorder:4},
    {id:3,name:"Mozzarella",quantity:1.2,unit:"kg",reorder:3},
    {id:4,name:"Lettuce",quantity:1,unit:"kg",reorder:2},
    {id:5,name:"Mango Pulp",quantity:7,unit:"litres",reorder:3}
  ]
};
let data;
try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(initialData); }
catch(e) { data = JSON.parse(JSON.stringify(initialData)); }
let digitalCategory = "All";
const $ = id => document.getElementById(id);
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN",{maximumFractionDigits:2});
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
function categoryName(id){return data.categories.find(c=>c.id===Number(id))?.name || "Uncategorised";}
function statusClass(status){return "status-"+String(status).toLowerCase().replaceAll(" ","-");}
function showToast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2600);}
function setPage(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active-page",p.id==="page-"+page));document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));const active=document.querySelector(`.nav-link[data-page="${page}"]`);$("pageHeading").textContent=active?active.textContent.trim():"Dashboard";$("sidebar").classList.remove("open");renderPage(page);}
function renderPage(page){if(page==="dashboard")renderDashboard();if(page==="categories")renderCategories();if(page==="items")renderItems();if(page==="digital-menu")renderDigitalMenu();if(page==="pricing")renderPricing();if(page==="inventory")renderInventory();if(page==="analytics")renderAnalytics();}
function renderDashboard(){
 $("statItems").textContent=data.items.length;$("statCategories").textContent=data.categories.length;$("statLowStock").textContent=data.inventory.filter(i=>Number(i.quantity)<=Number(i.reorder)).length;
 $("dashboardAlerts").innerHTML=data.inventory.filter(i=>Number(i.quantity)<=Number(i.reorder)).slice(0,4).map(i=>`<div class="alert-row"><div class="alert-icon">⚠️</div><div><strong>${esc(i.name)}</strong><small>Reorder level: ${esc(i.reorder)} ${esc(i.unit)}</small></div><span class="alert-qty">${esc(i.quantity)} ${esc(i.unit)}</span></div>`).join("")||'<p class="muted">No low-stock alerts.</p>';
 $("recentItems").innerHTML=data.items.slice(-4).reverse().map(i=>`<tr><td><div class="item-cell"><span class="food-thumb">${i.emoji||"🍽️"}</span>${esc(i.name)}</div></td><td>${esc(categoryName(i.categoryId))}</td><td>${money(i.price)}</td><td><span class="status ${statusClass(i.status)}">${esc(i.status)}</span></td></tr>`).join("");
}
function renderCategories(){
 $("categoryGrid").innerHTML=data.categories.map(c=>`<article class="category-card"><div class="category-emoji">${c.icon||"🍽️"}</div><h2>${esc(c.name)}</h2><p>${esc(c.description||"Menu category")}</p><div class="category-footer"><span>${data.items.filter(i=>i.categoryId===c.id).length} menu item(s)</span><button class="row-action delete" data-delete-category="${c.id}">Delete</button></div></article>`).join("")||'<p class="muted">No categories yet. Add your first category.</p>';
 document.querySelectorAll("[data-delete-category]").forEach(b=>b.onclick=()=>{const id=Number(b.dataset.deleteCategory);if(data.items.some(i=>i.categoryId===id)){showToast("Move or delete this category's items first.");return;}if(confirm("Delete this category?")){data.categories=data.categories.filter(c=>c.id!==id);save();renderCategories();refreshSelects();showToast("Category deleted.");}});
}
function renderItems(){
 const q=$("itemSearch").value.toLowerCase(),cat=$("categoryFilter").value,status=$("statusFilter").value;
 const rows=data.items.filter(i=>(i.name+" "+i.description+" "+i.tags.join(" ")).toLowerCase().includes(q)&&(!cat||String(i.categoryId)===cat)&&(!status||i.status===status));
 $("itemsTable").innerHTML=rows.map(i=>`<tr><td><div class="item-cell"><span class="food-thumb">${i.emoji||"🍽️"}</span><div>${esc(i.name)}<small style="display:block;color:#a09bad;font-weight:400;margin-top:4px">${esc(i.description)}</small></div></div></td><td>${esc(categoryName(i.categoryId))}</td><td>${i.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join("")||"—"}</td><td><strong>${money(i.price)}</strong></td><td><span class="status ${statusClass(i.status)}">${esc(i.status)}</span></td><td><button class="row-action" data-edit-item="${i.id}">Edit</button><button class="row-action delete" data-delete-item="${i.id}">Delete</button></td></tr>`).join("")||'<tr><td colspan="6" style="text-align:center;padding:30px">No menu items match your search.</td></tr>';
 document.querySelectorAll("[data-edit-item]").forEach(b=>b.onclick=()=>openItemDialog(Number(b.dataset.editItem)));document.querySelectorAll("[data-delete-item]").forEach(b=>b.onclick=()=>{if(confirm("Delete this menu item?")){data.items=data.items.filter(i=>i.id!==Number(b.dataset.deleteItem));save();renderItems();renderDashboard();refreshSelects();showToast("Menu item deleted.");}});
}
function refreshSelects(){
 const categoryOptions=data.categories.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");
 $("categoryFilter").innerHTML='<option value="">All categories</option>'+categoryOptions;
 $("itemCategory").innerHTML=categoryOptions;
}
function renderDigitalMenu(){
 $("digitalFilters").innerHTML=['All',...data.categories.map(c=>c.name)].map(n=>`<button class="filter-pill ${digitalCategory===n?"selected":""}" data-digital-filter="${esc(n)}">${esc(n)}</button>`).join("");
 document.querySelectorAll("[data-digital-filter]").forEach(b=>b.onclick=()=>{digitalCategory=b.dataset.digitalFilter;renderDigitalMenu();});
 const items=data.items.filter(i=>(digitalCategory==="All"||categoryName(i.categoryId)===digitalCategory)&&i.status!=="Out of Stock");
 $("digitalGrid").innerHTML=items.map(i=>`<article class="digital-item"><div class="digital-food">${i.emoji||"🍽️"}</div><div class="digital-item-content"><h3>${esc(i.name)}</h3><p>${esc(i.description)}</p><div class="digital-item-bottom"><span class="digital-price">${money(i.specialPrice||i.price)}</span><span class="badge badge-green">${esc(i.tags[0]||"Chef's choice")}</span></div></div></article>`).join("")||'<p class="muted">No items in this category.</p>';
}
function renderPricing(){
 $("pricingTable").innerHTML=data.items.map(i=>`<tr><td><div class="item-cell"><span class="food-thumb">${i.emoji||"🍽️"}</span>${esc(i.name)}</div></td><td>${money(i.price)}</td><td>${i.specialPrice?money(i.specialPrice):"—"}</td><td>${i.specialPrice?'<span class="badge badge-pink">Special offer</span>':'<span class="muted">No offer</span>'}</td><td><button class="row-action" data-price="${i.id}">Set offer</button><button class="row-action delete" data-clear-price="${i.id}">Clear</button></td></tr>`).join("");
 document.querySelectorAll("[data-price]").forEach(b=>b.onclick=()=>{const item=data.items.find(i=>i.id===Number(b.dataset.price));const value=prompt(`Enter special price for ${item.name} (₹):`,item.specialPrice??"");if(value===null)return;const n=Number(value);if(value.trim()===""||!Number.isFinite(n)||n<0||n>=item.price){showToast("Enter a valid offer below the regular price.");return;}item.specialPrice=n;save();renderPricing();renderDigitalMenu();showToast("Special price saved.");});
 document.querySelectorAll("[data-clear-price]").forEach(b=>b.onclick=()=>{const item=data.items.find(i=>i.id===Number(b.dataset.clearPrice));item.specialPrice=null;save();renderPricing();renderDigitalMenu();showToast("Special price cleared.");});
}
function renderInventory(){
 $("inventoryTable").innerHTML=data.inventory.map(i=>{const low=Number(i.quantity)<=Number(i.reorder);return `<tr><td><div class="item-cell"><span class="food-thumb">📦</span>${esc(i.name)}</div></td><td>${esc(i.quantity)}</td><td>${esc(i.unit)}</td><td>${esc(i.reorder)} ${esc(i.unit)}</td><td><span class="status ${low?"status-limited-stock":"status-available"}">${low?"Low Stock":"In Stock"}</span></td><td><button class="row-action" data-restock="${i.id}">Update</button><button class="row-action delete" data-delete-inventory="${i.id}">Delete</button></td></tr>`;}).join("");
 document.querySelectorAll("[data-restock]").forEach(b=>b.onclick=()=>{const item=data.inventory.find(i=>i.id===Number(b.dataset.restock));const value=prompt(`Update quantity for ${item.name} (${item.unit}):`,item.quantity);if(value===null)return;const n=Number(value);if(!Number.isFinite(n)||n<0){showToast("Enter a valid non-negative quantity.");return;}item.quantity=n;save();renderInventory();renderDashboard();showToast("Inventory quantity updated.");});
 document.querySelectorAll("[data-delete-inventory]").forEach(b=>b.onclick=()=>{if(confirm("Delete this ingredient?")){data.inventory=data.inventory.filter(i=>i.id!==Number(b.dataset.deleteInventory));save();renderInventory();renderDashboard();showToast("Ingredient deleted.");}});
}
function renderAnalytics(){
 $("analyticsCategories").textContent=data.categories.length;$("analyticsItems").textContent=data.items.length;
 const sorted=[...data.items].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,5);
 $("popularList").innerHTML=sorted.map((i,index)=>`<div class="popular-row"><span class="popular-rank">${index+1}</span><div><strong>${esc(i.name)}</strong><small>${esc(categoryName(i.categoryId))} · ${i.views||0} sample views</small></div><div class="popular-bar"><span style="width:${Math.max(12,((i.views||1)/(sorted[0]?.views||1))*100)}%"></span></div></div>`).join("");
}
function openItemDialog(id=null){
 if(!data.categories.length){showToast("Add a category before creating menu items.");return;}
 $("itemForm").reset();$("itemId").value="";$("itemDialogTitle").textContent=id?"Edit Menu Item":"Add Menu Item";refreshSelects();
 if(id){const i=data.items.find(x=>x.id===id);$("itemId").value=i.id;$("itemName").value=i.name;$("itemDescription").value=i.description;$("itemCategory").value=i.categoryId;$("itemPrice").value=i.price;$("itemTags").value=i.tags.join(", ");$("itemStatus").value=i.status;}
 $("itemDialog").showModal();
}
$("itemForm").addEventListener("submit",e=>{e.preventDefault();const id=Number($("itemId").value),name=$("itemName").value.trim(),price=Number($("itemPrice").value);if(!name||!Number.isFinite(price)||price<0)return;const payload={name,description:$("itemDescription").value.trim(),categoryId:Number($("itemCategory").value),price,tags:$("itemTags").value.split(",").map(t=>t.trim()).filter(Boolean),status:$("itemStatus").value};if(id){Object.assign(data.items.find(i=>i.id===id),payload);}else{data.items.push({id:Math.max(0,...data.items.map(i=>i.id))+1,...payload,specialPrice:null,emoji:"🍽️",views:0});}save();$("itemDialog").close();renderItems();renderDashboard();renderDigitalMenu();renderPricing();renderAnalytics();showToast(id?"Menu item updated.":"Menu item added.");});
$("categoryForm").addEventListener("submit",e=>{e.preventDefault();const name=$("categoryName").value.trim();if(data.categories.some(c=>c.name.toLowerCase()===name.toLowerCase())){showToast("That category already exists.");return;}data.categories.push({id:Math.max(0,...data.categories.map(c=>c.id))+1,name,description:$("categoryDescription").value.trim(),icon:"🍽️"});save();$("categoryDialog").close();$("categoryForm").reset();renderCategories();refreshSelects();renderDashboard();renderAnalytics();showToast("Category added.");});
$("inventoryForm").addEventListener("submit",e=>{e.preventDefault();data.inventory.push({id:Math.max(0,...data.inventory.map(i=>i.id))+1,name:$("ingredientName").value.trim(),quantity:Number($("ingredientQuantity").value),unit:$("ingredientUnit").value.trim(),reorder:Number($("ingredientReorder").value)});save();$("inventoryDialog").close();$("inventoryForm").reset();renderInventory();renderDashboard();showToast("Ingredient added.");});
function downloadCSV(filename,rows){const csv=rows.map(row=>row.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\r\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);showToast(filename+" downloaded.");}
$("exportMenuBtn").onclick=()=>downloadCSV("menupro-menu-catalogue.csv",[["Name","Description","Category","Dietary Tags","Regular Price","Special Price","Status"],...data.items.map(i=>[i.name,i.description,categoryName(i.categoryId),i.tags.join("; "),i.price,i.specialPrice??"",i.status])]);
$("exportInventoryBtn").onclick=()=>downloadCSV("menupro-inventory-report.csv",[["Ingredient","Quantity","Unit","Reorder Level"],...data.inventory.map(i=>[i.name,i.quantity,i.unit,i.reorder])]);
$("addItemBtn").onclick=()=>openItemDialog();$("addCategoryBtn").onclick=()=>$("categoryDialog").showModal();$("addInventoryBtn").onclick=()=>$("inventoryDialog").showModal();
document.querySelectorAll(".close-dialog").forEach(b=>b.onclick=()=>b.closest("dialog").close());
document.querySelectorAll(".nav-link").forEach(b=>b.onclick=()=>setPage(b.dataset.page));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>setPage(b.dataset.go));
$("itemSearch").addEventListener("input",renderItems);$("categoryFilter").addEventListener("change",renderItems);$("statusFilter").addEventListener("change",renderItems);
$("themeToggle").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("menupro_dark",document.body.classList.contains("dark")?"1":"0");};
if(localStorage.getItem("menupro_dark")==="1")document.body.classList.add("dark");
$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");
$("resetDemoBtn").onclick=()=>{if(confirm("Reset all MenuPro demo data to its original sample values?")){data=JSON.parse(JSON.stringify(initialData));save();refreshSelects();renderPage(document.querySelector(".page.active-page")?.id.replace("page-","")||"dashboard");showToast("Demo data reset.");}};
refreshSelects();renderDashboard();renderCategories();renderItems();renderDigitalMenu();renderPricing();renderInventory();renderAnalytics();
