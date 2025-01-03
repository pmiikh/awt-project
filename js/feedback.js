// let FeedbackForm = document.getElementById("feedback");

// FeedbackForm.addEventListener("submit", (event) => {
//     event.preventDefault();

//     let name = document.getElementById("name");
//     let email = document.getElementById("email");
//     let message = document.getElementById("message");

//     let coffeeType = document.querySelector('input[name="sort-of-coffee"]:checked');
//     let coffeeTypeValue = coffeeType ? coffeeType.value : null;


//     let willVisitCheckbox = document.getElementById('will-visit');
//     let willVisitValue = willVisitCheckbox.checked;

   
//     name.classList.remove("invalid-input");
//     email.classList.remove("invalid-input");

//     if (name.value == "" || email.value == "") {
//         alert("Ensure you input a value in both fields!");
//     } else {
    
//         alert("This form has been successfully submitted!");
//         console.log(
//             `This form has a username of ${name.value} and email ${email.value}`
//         );
//     }

//     console.log(`${name.value}'s massage is: ${message.value}`);
//     console.log(`Favorite Coffee Type: ${coffeeTypeValue}`);
//     console.log(`Plan to Visit: ${willVisitValue}`);

// });






function resetForm() {
  document.getElementById("feedback").reset();
}


// Keep your resetArticleForm function as it is, without the event listener setup





//переделать функцию, чтобы использовать её в routers.js