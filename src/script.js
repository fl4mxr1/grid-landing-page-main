function toggleSidebar() {
    let htmlSidebar = document.querySelector("#sidebar");
    if (htmlSidebar.getAttribute("data-visible") != null) {
        console.log("hide")
        htmlSidebar.removeAttribute("data-visible")
    } else {
        console.log("show")
        htmlSidebar.setAttribute("data-visible", "");
    }
}