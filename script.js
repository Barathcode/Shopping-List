const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearButton = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
let isEditMode = false
const formButton = itemForm.querySelector('button')

function onAddItemSubmit(e){
  e.preventDefault()
  
  const newItem = itemInput.value

  //validate input
  if(newItem === ''){
    alert('Please add an Item')
    return 
  }

  //check for edit mode
  if(isEditMode){
    const itemToEdit = itemList.querySelector('.edit-mode')

    removeItemFromLocalStorage(itemToEdit.textContent)
    itemToEdit.classList.remove('edit-mode')
    itemToEdit.remove()
    isEditMode = false
  }else{
    if(avoidDuplicates(newItem)){
      alert('That item already exists!')
      return
    }
  }

  addItemToDOM(newItem)
  addItemToStorage(newItem)
  
  checkUI()

  itemInput.value=''
}

function addItemToDOM(item){
  //create list element
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(item))

  const button = createButton('remove-item btn-link text-red')
  li.appendChild(button)

  itemList.appendChild(li)
}

function addItemToStorage(item){
  const itemsFromStorage = getItemFromStorage()
  
  //push new item to local storage
  itemsFromStorage.push(item)

  //convert it to stringify format and add to local storage
  localStorage.setItem('items',JSON.stringify(itemsFromStorage))
}

function getItemFromStorage(){
  let itemsFromStorage;

  if(localStorage.getItem('items') === null){
    itemsFromStorage = []
  }else{
    itemsFromStorage = JSON.parse(localStorage.getItem('items'))
  }
  return itemsFromStorage
}

function displayItems(){
  const itemsFromStorage = getItemFromStorage()

  itemsFromStorage.forEach(item=>addItemToDOM(item))
  checkUI()
}

function createButton(classes){
  const button = document.createElement('button')
  button.className = classes
  const icon = createIcon('fa-solid fa-xmark')
  button.appendChild(icon)
  return button
}

function createIcon(classes){
  const icon = document.createElement('i')
  icon.className=classes
  return icon
}

function onClickItem(e){
  if(e.target.parentElement.classList.contains('remove-item')){
    removeItem(e.target.parentElement.parentElement)
  }else{
    setItemToEdit(e.target)
  }
}

function avoidDuplicates(item){
  const itemsFromStorage = getItemFromStorage()

  return (itemsFromStorage.includes(item))
}

function setItemToEdit(item){
  isEditMode = true

  itemList.querySelectorAll('li').forEach((i)=>i.classList.remove('edit-mode'))

  item.classList.add('edit-mode')
  formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
  formButton.style.backgroundColor='#228B22'
  itemInput.value = item.textContent
}

function removeItem(item){
    if(confirm('Are you sure?')){

      //remove item from DOM
      item.remove()

      //remove item from localstorage
      removeItemFromLocalStorage(item.textContent)

      checkUI()
    }
  }

function removeItemFromLocalStorage(item){
  let itemsFromStorage = getItemFromStorage()

  //filter out the matched item from localstorage
  itemsFromStorage = itemsFromStorage.filter((i)=> i !== item)

  //Again push that to localstorage
  localStorage.setItem('items',JSON.stringify(itemsFromStorage))
}

function clearItems(){
  while (itemList.firstChild){
    itemList.removeChild(itemList.firstChild)
  }

  //clear all items from localstorage
  localStorage.removeItem('items')

  checkUI()
}
function checkUI(){
  itemInput.value = '';

  const items = itemList.querySelectorAll('li')
  if(items.length === 0){
    clearButton.style.display='none'
    itemFilter.style.display='none'
  }else{
    clearButton.style.display='block'
    itemFilter.style.display='block'
  }
  formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
  formButton.style.backgroundColor='#333'

  isEditMode = false
}

function filterItems(e){
  const items = itemList.querySelectorAll('li')
  const text = e.target.value.toLowerCase()

  items.forEach((item)=>{
    const itemName = item.firstChild.textContent.toLowerCase()

    if(itemName.indexOf(text) !== -1){
      item.style.display = 'flex'
    }else{
      item.style.display = 'none'
    }
  })
}

function init(){
  itemForm.addEventListener('submit',onAddItemSubmit)
  itemList.addEventListener('click',onClickItem)
  clearButton.addEventListener('click',clearItems)
  checkUI()
  itemFilter.addEventListener('input',filterItems)
  document.addEventListener('DOMContentLoaded',displayItems)
}

init()

