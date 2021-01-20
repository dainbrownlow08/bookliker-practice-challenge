//document.addEventListener("DOMContentLoaded", function() {});
const bookURL = 'http://localhost:3000/books'
const listPanel = document.getElementById('list')
const showPanel = document.getElementById('show-panel')
const you = {id:1, username:"pouros"}
let allBooks = []

getAllBooks()

// Data 
// GET

function getAllBooks(){
    fetch(bookURL)
    .then(res => res.json())
    .then(books => {
        allBooks = books
        populateList()
    })
}

function getOne(id){
    fetch(bookURL + `/${id}`)
    .then(res => res.json())
    .then(book => {
        showBook(book)
    })
}

// PATCH

function likeBook(book){
    let flag;
    let current = book.users
    current.forEach(u => {
        if(u.id === you.id){
            flag = true
        }
    })
    if(flag != true){
        const addUser = [...book.users,you]
        fetch(bookURL + `/${book.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({users: addUser})
        })
        .then(res => res.json())
        .then(book => {
            showBook(book)
            onOff()
        })
        .catch(error => console.log(error))
    }else{
       const removeUser = book.users.slice(0, book.users.length - 1);
       fetch(bookURL + `/${book.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({users: removeUser})
        })
        .then(res => res.json())
        .then(book => {
            showBook(book)
            onOff()
        })
        .catch(error => console.log(error))
    }
}
    

// DOM

function populateList(){
    allBooks.forEach(book => {
        createBook(book)
    })
}

function onOff(){
    //debugger
    let likeBtn = document.querySelector('button')
    if(likeBtn.textContent == 'Like'){
        likeBtn.textContent = 'Unlike'
    }else{
        likeBtn.textContent = 'Like'
    }
}

function createBook(bookObj){
    const li = document.createElement('li')
    li.textContent = bookObj.title
    li.id = bookObj.id
    li.addEventListener('click',handleClick)
    listPanel.appendChild(li)
}

function showBook(book){
    showPanel.innerHTML = ''
    let container = document.createElement('div')
    let img = document.createElement('img')
    let title = document.createElement('h3')
    let subTitle = document.createElement('h3')
    let author = document.createElement('h3')
    let description = document.createElement('p')
    let likes = document.createElement('ul')
    let likeButton = document.createElement('button')
    container.className = 'container'
    img.src = book.img_url
    title.textContent = book.title
    if(book.subtitle){
        subTitle.textContent = book.subtitle
    }
    
    author.textContent = book.author
    description.textContent = book.description
    book.users.forEach(u => {
        let li = document.createElement('li')
        li.textContent = u.username
        likes.append(li)
    })
    likeButton.textContent = 'Like'
    likeButton.id = 'like-button'
    likeButton.addEventListener('click',() => handleLike(book))
    container.append(img,title,subTitle,author,description,likes,likeButton)
    showPanel.appendChild(container)
}

//handlers

function handleClick(e){
    getOne(e.target.id)
}

function handleLike(book){
    //console.log(book)
    //onOff()
    likeBook(book)
    //debugger
    
}
