let navMenuDOM= document.getElementById("mobile_Nav");
let buttonsDOM= document.getElementById("navButtons");

let buttonsItems = [
    "LOGOWANIE",
    "REJESTRACJA",
    "GRAJ"
];


populateButtons(buttonsDOM,buttonsItems);
populateSideMenu(navMenuDOM,buttonsItems);

/*
Populates the dom element with button elements that route to appropriate places
arg 1- dom element to be populated,
arg 2- button names
*/
function populateButtons(buttonsDOM,buttonsItems){
    buttonsItems.forEach(function(item) {
        var buttonElement=createButtonElement("btn_"+item,item);
        //when clicked scroll to section with id= buttonName
        buttonElement.onclick= function() {scrollToSection(item)};
        buttonsDOM.appendChild(buttonElement);
    });

}


/*
Populates the dom element with button elements that route to appropriate places
arg 1- dom element to be populated,
arg 2- button names
*/
function populateSideMenu(navMenuDOM,buttonsItems){
    buttonsItems.forEach(function(item) {
        var buttonElement=createButtonElement("btn_"+item,item);
        //when clicked scroll to section with id= buttonName
        buttonElement.onclick= function() {
            scrollToSection(item);
            closeNav();
        };
        navMenuDOM.appendChild(buttonElement);
    });

}


/* Open the sidenav */
function openNav() {
    navMenuDOM.style.width = "100%";
  }
  
/* Close/hide the sidenav */
function closeNav() {
    navMenuDOM.style.width = "0";
} 


function createButtonElement(id,innerHTML){
    var temp=document.createElement('button');
    if(id!=null){temp.id=id;}
    if(innerHTML!=null){temp.innerHTML=innerHTML;}
    return temp;
}

function scrollToSection(sectionID) {
    document.getElementById(sectionID).scrollIntoView({behavior: 'smooth'});
}



