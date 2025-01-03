
export default [
  {
    hash: "welcome",
    target: "router-view",
    getTemplate: (targetElm) =>
      (document.getElementById(targetElm).innerHTML = document.getElementById("template-welcome").innerHTML),
    },
    
  {
    hash: "page-about",
    target: "router-view",
    getTemplate: (targetElm) =>
      (document.getElementById(targetElm).innerHTML = document.getElementById("template-about").innerHTML),
    },
  
  {
    hash: "best-coffee",
    target: "router-view",
    getTemplate: (targetElm) =>
      (document.getElementById(targetElm).innerHTML = document.getElementById("template-best-coffee").innerHTML),
    },
  
   {
    hash: "our-coffee-makers",
    target: "router-view",
    getTemplate: (targetElm) =>
      (document.getElementById(targetElm).innerHTML = document.getElementById("template-coffee-makers").innerHTML),
    },
   
  {
    hash: "top-list",
    target: "router-view",
    getTemplate: (targetElm) =>
      (document.getElementById(targetElm).innerHTML = document.getElementById("template-top-drinks").innerHTML),
    },
  
  {
    hash: "our-gallery",
    target: "router-view",
    getTemplate: (targetElm) =>
      (document.getElementById(targetElm).innerHTML = document.getElementById("template-gallery").innerHTML),
    },
  
  {
    hash: "feedback-section",
    target: "router-view",
     getTemplate: (targetElm) =>{
            document.getElementById(targetElm).innerHTML = document.getElementById("template-feedback").innerHTML;
            document.getElementById("feedback").onsubmit = SubmitForm;
        }
  },

  {
    hash: "impressions-section",
    target: "router-view",
    getTemplate: createHtmlOpinions,
  },

  {
    hash: "articles",
    target: "router-view",
    getTemplate: fetchAndDisplayArticles,
  },

   {
        hash:"article",
        target:"router-view",
        getTemplate: fetchAndDisplayArticleDetail
  },
   
  {
        hash:"artEdit",
        target:"router-view",
        getTemplate: editArticle
  },
   
   {
    hash: "artDelete",
    target: "router-view",
    getTemplate: deleteArticle
  },
  {
      hash: "artInsert",
      target: "router-view",
      getTemplate: submitArticleInsertForm
  }
];

function SubmitForm(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value;

    let coffeeType = document.querySelector('input[name="sort-of-coffee"]:checked');
    let coffeeTypeValue = coffeeType ? coffeeType.value : null;

    let willVisitCheckbox = document.getElementById('will-visit');
    let willVisitValue = willVisitCheckbox.checked;

    // Fix variable name
    // email.classList.remove("invalid-input");

    if (name == "" || email == "") {
        alert("Ensure you input a value in both fields!");
        // Add validation to stop execution if the form is not valid
        return;
    } else {
        alert("This form has been successfully submitted!");
        console.log(`This form has a username of ${name} and email ${email}`);
    }

    const newFeedback = {
        name: name,
        email: email,
        coffeeType: coffeeTypeValue,
        willVisitCheckbox: willVisitValue,
        message: message,
        create: new Date()
    };

    let feedbacks = [];

    if (localStorage.myCoffeeComments) {
        feedbacks = JSON.parse(localStorage.myCoffeeComments);
    }

    feedbacks.push(newFeedback);
    localStorage.myCoffeeComments = JSON.stringify(feedbacks);

    console.log(newFeedback);
    console.log(feedbacks);


    //5. Go to the opinions
    window.location.hash = "#impressions-section";
}

// const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const urlBase = "http://192.168.56.101/api";

const articlesPerPage = 3; 

function createHtmlOpinions(targetElm){
    const feedbackFromStorage = localStorage.myCoffeeComments;
      let feedbacks = [];

    if(feedbackFromStorage){
        feedbacks=JSON.parse(feedbackFromStorage);
        feedbacks.forEach(feedback => {
        feedback.createDate = (new Date(feedback.create)).toDateString();
    });
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-impressions").innerHTML,
        feedbacks);
}  

function fetchAndDisplayArticles(targetElm, my_offset = 0){

    const maxResults = 3;
    my_offset = Math.min(520, Math.max(0, my_offset));
    const url = `http://192.168.56.101/api/article/?max=${maxResults}&offset=${my_offset}`;

    function reqListener () {
        console.log(this.responseText)
        if (this.status == 200) {
            const responseJSON = JSON.parse(this.responseText)
            addArtDetailLink2ResponseJson(responseJSON);
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles").innerHTML,
                    responseJSON
                );
            const prevLink = document.getElementById("prevLink");
            const nextLink = document.getElementById("nextLink");

            if (my_offset > 0) {
                prevLink.style.display = "block";
                prevLink.addEventListener("click", () => {
                    fetchAndDisplayArticles(targetElm, my_offset - 3);
                });         
            } else {
                prevLink.style.display = "none";
            }
            if (my_offset < 9) {
                nextLink.style.display = "block";
                 nextLink.addEventListener("click", () => {
                    fetchAndDisplayArticles(targetElm,my_offset + 3);
                });
            } else {
                nextLink.style.display = "none";
            }
        } else {
            const errMsgObj = {errMessage:this.responseText};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        }

    }

    console.log(url)
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
}

function addArtDetailLink2ResponseJson(responseJSON){
  responseJSON.articles = responseJSON.articles.map(
    article =>(
     {
       ...article,
       detailLink:`#article/${article.id}/${responseJSON.meta.offset}/${responseJSON.meta.totalCount}`
     }
    )
  );
}  

function fetchAndDisplayArticleDetail(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash) {
    fetchAndProcessArticle(...arguments,false);
}                   

/**
 * Gets an article record from a server and processes it to html according to 
 * the value of the forEdit parameter. Assumes existence of the urlBase global variable
 * with the base of the server url (e.g. "https://wt.kpi.fei.tuke.sk/api"),
 * availability of the Mustache.render() function and Mustache templates )
 * with id="template-article" (if forEdit=false) and id="template-article-form" (if forEdit=true).
 * @param targetElm - id of the element to which the acquired article record 
 *                    will be rendered using the corresponding template
 * @param artIdFromHash - id of the article to be acquired
 * @param offsetFromHash - current offset of the article list display to which the user should return
 * @param totalCountFromHash - total number of articles on the server
 * @param forEdit - if false, the function renders the article to HTML using 
 *                            the template-article for display.
 *                  If true, it renders using template-article-form for editing.
 */
function fetchAndProcessArticle(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash,forEdit){
    const url = `${urlBase}/article/${artIdFromHash}`;

    function reqListener () {
        // stiahnuty text
        console.log(this.responseText)
        if (this.status == 200) {
            const responseJSON = JSON.parse(this.responseText)
            if(forEdit){
                responseJSON.formTitle="Article Edit";
                responseJSON.submitBtTitle="Save article";
                responseJSON.backLink=`#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;

                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article-form").innerHTML,
                        responseJSON
                    );
                if(!window.artFrmHandler){
                    window.artFrmHandler= new articleFormsHandler("http://192.168.56.101/api");
                }
                window.artFrmHandler.assignFormAndArticle("articleForm","hiddenElm",artIdFromHash,offsetFromHash,totalCountFromHash);
            }else{      
                responseJSON.backLink=`#articles/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.editLink=
                  `#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.deleteLink=
                  `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;

                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article").innerHTML,
                        responseJSON
                    );
            }
        } else {
            const errMsgObj = {errMessage:this.responseText};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        }
        
    }

    console.log(url)
    var ajax = new XMLHttpRequest(); 
    ajax.addEventListener("load", reqListener); 
    ajax.open("GET", url, true); 
    ajax.send();
} 

function editArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(...arguments,true);
}   

function deleteArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    const url = `${urlBase}/article/${artIdFromHash}`;

    console.log(`Deleting article with ID ${artIdFromHash} at URL: ${url}`);

    function reqListener() {
        console.log(`Response status: ${this.status}`);
        if (this.status == 200) {
            console.log(`Article ${artIdFromHash} deleted successfully.`);
          window.location.hash = `#articles/${offsetFromHash}/${totalCountFromHash}`;
          window.alert("The article deleted!");
        } else {
            const errMsgObj = { errMessage: this.responseText };
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        }
    }

    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("DELETE", url, true);
    ajax.send();
  
}

function submitArticleInsertForm() {
    const title = document.getElementById("new_title").value;
    const author = document.getElementById("new_author").value;
    const content = document.getElementById("new_content").value;
    const tags = document.getElementById("new_tags").value.split(",");

    const formData = {
        title: title,
        author: author,
        content: content,
        tags: tags
    };

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://192.168.56.101/api/articles", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Define the callback function for successful response
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Insertion successful
            console.log("Article inserted successfully:", xhr.responseText);

            // After successful insertion, navigate back to the articles list
            // window.location.hash = "#articles";
        } else {
            console.error("Error during article insertion:", xhr.statusText);
            // Handle error if needed
        }
    };
    xhr.onerror = function () {
        console.error("Network error during article insertion");
        // Handle error if needed
    };

    xhr.send(JSON.stringify(formData));
}
