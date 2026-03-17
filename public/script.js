
const form = document.getElementById("uploadForm");
const counter = document.getElementById("counter");
const resetBtn = document.getElementById("resetBtn");

form.addEventListener("submit", async (e)=>{

 e.preventDefault();

 const data = new FormData(form);

 await fetch("/upload",{
  method:"POST",
  body:data
 });

 form.reset();

 loadList();

});

resetBtn.addEventListener("click", async ()=>{

 if(!confirm("모든 사진을 삭제할까요?")) return;

 await fetch("/reset",{method:"POST"});

 loadList();

});

async function loadList(){

 const res = await fetch("/list");
 const data = await res.json();

 counter.innerText = `${data.count} / 25 제출`;

 const list = document.getElementById("list");

 list.innerHTML="";

 data.files.forEach(item=>{

  const div = document.createElement("div");
  div.className="card";

  div.innerHTML=`
  <img src="/uploads/${item.file}">
  <div>${item.name}</div>
  `;

  list.appendChild(div);

 });

}

loadList();
