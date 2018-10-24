document.addEventListener("DOMContentLoaded", function(event) {

  const imageContainer = document.getElementById("images-container")
  const commentContainer = document.getElementById("comments")

  let list = []
  let commentList = []

  fetch('http://localhost:3000/images/?_limit=3&_page=3')
    .then((response) => {
      return response.json()
    })
    .then((postJsonObj) => {
      list = postJsonObj

      list.forEach((data) => {
        imageContainer.innerHTML += `<div align="center">
                                      <img src=${data.url} alt="pic" style="width:575px; height:400px;">
                                      <h5>${data.caption}</h5>
                                      <button class="waves-effect waves-light btn modal-trigger">Like ${data.like_count}</button>
                                      <br>
                                      <br>
                                      </div>`
        data.comments.forEach((comment) => {
          imageContainer.innerHTML += `<div align="center" style="font-size: 23px;"><p>${comment.content}</p></div>`

        })

      }) //end of forEach

})




}); //end of dom content loader
