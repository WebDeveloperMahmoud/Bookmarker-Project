let inputTxt = document.querySelector("input[type='text']");
let inputUrl = document.querySelector("input.urlinput");
let form = document.querySelector("form");
let tBody = document.querySelector("tbody");
let thead = document.querySelector("thead");
let iconStatus1 = document.querySelector("#iconStatus1");
let iconStatus2 = document.querySelector("#iconStatus2");
let sites = JSON.parse(localStorage.getItem("sites")) || [];
let regexName = /^[A-Za-z0-9\s._-]{3,50}$/i;
let regexUrl = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
let button = document.querySelector("button[type='submit']");
let updateIndex=null;
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let siteName = inputTxt.value.trim();
    let siteUrl = inputUrl.value.trim();
    if (!regexName.test(siteName.toLowerCase()) || !regexUrl.test(siteUrl.toLowerCase()) || siteName.toLowerCase() === "" || siteUrl.toLowerCase() === "") {
            Swal.fire({
              html: `
              <div style="margin-bottom:30px;">
                <span style="display:inline-block;width:20px;height:20px;background-color:#f05f5c; border-radius:50%; margin-right:3px;"></span>
                <span style="display:inline-block;width:20px;height:20px;background-color:#ffbe2e; border-radius:50%; margin-right:3px;"></span>
                <span style="display:inline-block;width:20px;height:20px;background-color:#4db748; border-radius:50%; margin-right:4px;"></span>
              </div>
              <h5 style="margin-bottom:30px;">Site Name or URL is not valid,Please follow the rules below :</h5>
        <div style="text-align:left; font-size:1rem;">
            <ul style="list-style:none; padding:0; margin:0;">
                <li style="margin-bottom:20px; color:#000000;">
                    <i class="fa-solid fa-circle-arrow-right" style="color:#c0392b;"></i> 
                    Site name must contain at least <strong>3 characters</strong>
                </li>
                <li style="color:#000000;">
                    <i class="fa-solid fa-circle-arrow-right" style="color:#c0392b;"></i> 
                    Site URL must be a <strong>valid one</strong>
                </li>
            </ul>
        </div>`,
                confirmButtonText: "OK",
                confirmButtonColor: "#d33",
                showCloseButton: true,
                showConfirmButton: false,
                background: "#fff",
                color: "#2c3e50",
                width: "500px",
                customClass: {
                popup: "shadow-lg rounded-4",
                title: "fw-bold text-start",
                },
            });
        return;
    }
    let exist = sites.some((site) => site.name.toLowerCase() === siteName.toLowerCase() || site.url.toLowerCase() === siteUrl.toLowerCase())
    if(exist){
        Swal.fire({
            icon: "warning",
            title: "Dublicate Entry",
            text: "This site already exists in your list!",
            confirmButtonColor: "#f39c12",
        });
        return;
    }
    let site = {
        name: siteName,
        url: siteUrl,
    };
    if (button.innerHTML === "Submit") {
        sites.push(site);
    }
    else if (button.innerHTML === "Update") {
        sites[updateIndex] = site;
        button.innerHTML = "Submit";
        updateIndex = null;
    }
    localStorage.setItem("sites", JSON.stringify(sites));
    displaySite();
    clearInputAfterDisplay();
    clearIconAfterDisplay();
    inputTxt.style.border = "1px solid #e4e0da";
    inputUrl.style.border = "1px solid #e4e0da";
});
inputTxt.addEventListener("input", function () {
    if (this.value.length < 3) {
        this.style.boxShadow = "0 0 8px 5px #f58d98ff";
        this.style.border = "1px solid #f58d98ff";
        iconStatus1.style.display = "block";
        iconStatus1.className ="fa-solid fa-circle-exclamation position-absolute text-danger me-2";
    } else {
        this.style.boxShadow = "0 0 8px 5px #76ac94ff";
        this.style.border = "1px solid #76ac94ff";
        iconStatus1.style.display = "block";
        iconStatus1.className ="fa-solid fa-check position-absolute text-success me-2";
    }
});
inputTxt.addEventListener("change", function () {
    this.style.boxShadow = "none";
})
inputTxt.addEventListener("blur", function () {
    if (this.value.length < 3) {
        this.style.boxShadow = "0 0 8px 5px #f58d98ff";
        this.style.border = "1px solid #f58d98ff";
        iconStatus1.style.display = "block";
        iconStatus1.className ="fa-solid fa-circle-exclamation position-absolute text-danger me-2";
    } else {
        this.style.boxShadow = "0 0 8px 5px #76ac94ff";
        this.style.border = "1px solid #76ac94ff";
        iconStatus1.style.display = "block";
        iconStatus1.className ="fa-solid fa-check position-absolute text-success me-2";
    }
});
inputUrl.addEventListener("input", function () {
    if (!regexUrl.test(this.value)) {
        this.style.boxShadow = "0 0 8px 5px #f58d98ff";
        this.style.border = "1px solid #f58d98ff";
        iconStatus2.className ="fa-solid fa-circle-exclamation position-absolute text-danger me-2";
    } else {
        this.style.boxShadow = "0 0 8px 5px #76ac94ff";
        this.style.border = "1px solid #76ac94ff";
        iconStatus2.className ="fa-solid fa-check position-absolute text-success me-2";
    }
});
inputUrl.addEventListener("change", function () {
    this.style.boxShadow = "none";
});
function clearIconAfterDisplay() {
    iconStatus1.style.display = "none";
    iconStatus2.style.display = "none";
}
function displaySite() {
    if (sites.length===0) {
        thead.style.display = "none";
    }
    else {
        thead.style.display = "table-header-group";
    }
    let trs = "";
    for (let i = 0; i < sites.length; i++){
        trs += `<tr class="text-center">
                        <td>${i + 1}</td>
                        <td>${sites[i].name}</td>
                        <td><a href="${/^https?:\/\//i.test(sites[i].url) ? sites[i].url : "https://" + sites[i].url}" target="_blank" class="btn btn-success"><i class="fa-solid fa-eye"></i> Visit</a></td>
                        <td><button class="btn btn-primary" onclick="updateSite(${i})"><i class="fa-solid fa-pen-to-square"></i> Update</button></td>
                        <td><button class="btn btn-danger" onclick="deleteSite(${i})"><i class="fa-solid fa-trash-can"></i> Delete</button></td>
                    </tr>`;
    }
    tBody.innerHTML = trs;
}
function clearInputAfterDisplay() {
    inputTxt.value = "";
    inputUrl.value = "";
}
function deleteSite(index) {
    sites.splice(index, 1);
    localStorage.setItem("sites", JSON.stringify(sites));
    displaySite();
}
function updateSite(index) {
    inputTxt.value = sites[index].name;
    inputUrl.value = sites[index].url;
    button.innerHTML = "Update";
    updateIndex = index;
}
displaySite();
