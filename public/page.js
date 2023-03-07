const tab_swichers = document.querySelectorAll("[data-switcher]");

console.log(tab_swichers);

for(let i = 0; i < tab_swichers.length; i++){
    const tab_switcher = tab_swichers[i];
    const page_id = tab_switcher.dataset.tab;
    tab_switcher.addEventListener("click",()=>{
        const tab = document.querySelector(".tabs .tab.is-active");
        tab.classList.remove("is-active");
        tab_switcher.parentNode.classList.add("is-active");
        Switch_page(page_id);
    })
}

function Switch_page(id){
    const currentPage = document.querySelector(".pages .page.is-active");
    currentPage.classList.remove("is-active");
    const nextPage = document.querySelector(`.pages .page[data-page="${id}"]`);
    nextPage.classList.add("is-active");
}