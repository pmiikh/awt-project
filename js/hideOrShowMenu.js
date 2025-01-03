function displayOrHideMenu(elemID) {
    var elem = document.getElementById(elemID);
    
    if (elem) {
        elem.classList.toggle("show-menu");
    }
}