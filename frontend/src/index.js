document.addEventListener("DOMContentLoaded", function(event) {

  const imageContainer = document.getElementById("images-container")
  const commentContainer = document.getElementById("comments")
  const addImageButton = document.getElementById("new-picture-button")
  const newImage = document.getElementById("new-image")
  const imageForm = document.getElementById("photo-form")
  const searchField = document.getElementById("search-input")
  console.log(imageContainer)

  let list = []
  let commentList = []

  fetch('http://localhost:3000/images/')
    .then((response) => {
      return response.json()
    })
    .then((postJsonObj) => {
      list = postJsonObj
      list.forEach((data) => {
        imageContainer.innerHTML += `<div align="center">
                                      <img src=${data.url} alt="pic" style="width:575px; height:400px;">
                                      <h5 data-id="${data.id}">${data.caption}</h5>
                                      <button data-id="${data.id}" class="waves-light btn"><span>${data.like_count} </span> Likes</button>
                                      <br>
                                      <br>
                                      </div>`

        data.comments.forEach((comment) => {
          imageContainer.innerHTML += `<div align="center" style="font-size: 23px;"><p>${comment.content}</p></div>`

        })
      }) //end of forEach
    }) //end of second promise

  //************************ADDING/POST IMAGES***********************//
  function formDiv() {
    const newDiv = document.getElementsByClassName("modal-content")
    newImage.style.display = "block" //show the div holding the form
  }

  addImageButton.addEventListener("click", formDiv)

  imageForm.addEventListener("submit", function(event) {
    event.preventDefault()

    const inputURL = document.getElementById("image-url").value
    const inputCaption = document.getElementById("caption").value

    imageContainer.innerHTML += `<div align="center">
                                    <img src=${inputURL} alt="pic" style="width:575px; height:400px;">
                                    <h5>${inputCaption}</h5>
                                    <button id="like-button" class="waves-light btn"><span>0 </span> Likes</button>
                                    </div>`

    newImage.parentElement.remove()

    fetch('http://localhost:3000/images/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: inputURL,
          caption: inputCaption,
          like_count: 0,
          comments: []
        }) //end of body object
      })
      .then((response) => {
        return response.json()
      })
      .then((jsonObj) => {
        list.push(jsonObj)
      }) //push object to new array
  })
  //************************ADDING/POST IMAGES***********************//


  document.addEventListener("click", function(event) {
    //event delegation
    if (event.target.className === "waves-light btn") {
      //find buttonID
      let likeButtonId = event.target.dataset.id

      let findLike = list.find((data) => {
        return data.id == likeButtonId
      })

      findLike.like_count++

      event.target.firstElementChild.innerText = findLike.like_count

      fetch(`http://localhost:3000/images/${likeButtonId}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          like_count: findLike.like_count
          })
        })

      } //end of if statement

  }) //end of listener for button

  searchField.addEventListener("input", function(event) { //no need to fetch POST/PATCHS
    const searchInput = searchField.value //assigns variable the input of value.

    const filteredImages = list.filter((image) => {
      return image.caption.includes(searchInput)
    })

    let newlist = filteredImages.map((image) => { //entire content of the div and re-rendering
      return `<div align="center">
              <img src="${image.url}" alt="pic" style="width:575px; height:400px;">
              <h5>${image.caption}</h5>
              <button id="like-button" class="waves-light btn"><span>${image.like_count} </span> Likes</button>
              <br>
              </div>
              <br>`
    }).join('')

    imageContainer.innerHTML = newlist

  }) //end of event listener




}); //end of dom content loader
