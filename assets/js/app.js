const cl=console.log;

const loginForm = document.getElementById("loginForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userIdControl = document.getElementById("userId");
const postContainer = document.getElementById("postContainer");
const submitBtn = document.getElementById("submitBtn");
const UpdateBtn = document.getElementById("UpdateBtn");


const baseUrl=`https://jsonplaceholder.typicode.com`;

const postUrl=`${baseUrl}/posts`;


const templating =(arr)=>{
     postContainer.innerHTML = arr.map(obj=>{
        return`
        <div class="card mb-4" id="${obj.id}">
            <div class="card-header ">
                 <h3>${obj.title}</h3>
            </div>
            <div class="card-body">
                 <p>${obj.body}</p>
            </div>
        <div class="card-footer d-flex justify-content-between">
           <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
           <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
            
        </div>
     </div>
        
        `
     }).join("");
}

const addCard = (ele)=>{
    let card=document.createElement("div");
    card.id= ele.id;
    card.className="card mb-4";
    card.innerHTML=`
            <div class="card-header ">
                 <h3>${ele.title}</h3>
          </div>
            <div class="card-body">
                <p>${ele.content}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
             
         </div>
    `
    postContainer.prepend(card);
}


const makeApicall=(methodName,apiUrl,msgBody)=>{
    loader.classList.remove("d-none");
    let xhr=new XMLHttpRequest();
    xhr.open(methodName,apiUrl);
    xhr.setRequestHeader(`Content-type`,"application/json");
    xhr.setRequestHeader(`Authrization`,"Breaer Token from Local Storage");
    xhr.send(JSON.stringify(msgBody));
    xhr.onload = function(){
        if(xhr.status >=200 && xhr.status <300){
            cl(xhr.response)
            let res = JSON.parse(xhr.response);
            loader.classList.add("d-none");
            cl(res)
            if(methodName === "GET"){
                if(Array.isArray(res)){
                    templating(res);
                }else{
                    titleControl.value = res.title;
                    contentControl.value = res.body;
                    userIdControl.value = res.userId;    
                    UpdateBtn.classList.remove("d-none");
                    submitBtn.classList.add("d-none");
                    window.scrollTo(0,0);

                }
            }else if(methodName === "POST"){
                msgBody.id = res.id;
                cl(msgBody)
                addCard(res);
                loginForm.reset();
             loader.classList.add("d-none");
             Swal.fire({
                title: `${res.title} is Added successfully`,
                icon: "success"
              });
  
                
            }else if(methodName === "PATCH"){
                loginForm.reset();
                UpdateBtn.classList.add("d-none");
                submitBtn.classList.remove("d-none");
                let card=[...document.getElementById(res.id).children];
                card[0].innerHTML =`<h3>${res.title}</h3>`;
                card[1].innerHTML =`<p>${res.content}</p>`;
                cl(card)
            }else if(methodName === "DELETE"){
                let id = localStorage.getItem("deleteId");
                cl(id)
                document.getElementById(id).remove()
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                  }); 
            }
            
            }
        }
    }

makeApicall("GET",postUrl)

const onAddPost = (ele)=>{
   ele.preventDefault();
   let newPost={
      title :titleControl.value,
      content :contentControl.value,
      userId : userIdControl.value
   }
   cl(newPost)
   
   loader.classList.remove("d-none");
   makeApicall("POST",postUrl,newPost)
   

}

const onEdit=(ele)=>{
    let editId = ele.closest(".card").id;
    cl(editId)
    localStorage.setItem("editId",editId);
    let editUrl= `${baseUrl}/posts/${editId}`;
    makeApicall("GET",editUrl)
}

const onUpdate=(ele)=>{
    let updateId=localStorage.getItem("editId");
    cl(updateId);
    let updatedUrl=`${baseUrl}/posts/${updateId}`;
    cl(updateId);
    let updatedObj={
        title:titleControl.value,
        content:contentControl.value,
        userId:userIdControl.value
    }
    cl(updatedObj)
    makeApicall("PATCH",updatedUrl,updatedObj);
    Swal.fire({
        title: `${updatedObj.title} is Updated successfully`,
        icon: "success"
      });
}

const onDelete=(ele)=>{
    let DeleteId =ele.closest(`.card`).id;
    localStorage.setItem("deleteId",DeleteId);
    let deleteUrl =`${baseUrl}/posts/${DeleteId}`;
   
    Swal.fire({
        title: "Are you sure you want to delete this file?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            loader.classList.remove("d-none");
            makeApicall("DELETE",deleteUrl);
           
          
        }

      });
      loader.classList.add("d-none");
}

loginForm.addEventListener("submit",onAddPost);
UpdateBtn.addEventListener("click",onUpdate);