//Storage Controller
if("serviceWorker" in navigator)
    {
    navigator.serviceWorker.register("Wallet/service.js").then(register=>
    {
    console.log("SW Registerd!");
    console.log(registration);

    }).catch(error => {
        console.log("SW Registerd Faild!");
        console.log(error);
    });
}

const StorageController = (function () {
  //public methods
  //object that is responsible for the Storage control (get,set,update,delete,clear)
  return {
    storeItem: function (item) {
      let items;
      //check if any items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        //push new items
        items.push(item);
        //set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemStorage: function (itemToDeleteID) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (itemToDeleteID === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    removeAllItems: function () {
      localStorage.removeItem("items");
    },
  };
})();

//Item Controller
const ItemController = (function () {
//Construct the Items id san parametro ?

  const Item = function (name, euros, cost, date) {
    this.id = id.next().value;
    this.euros = euros;
    this.name = name;
    this.cost = cost;
    this.date = date;
    
    
  };
  //Generate new ID
  function* genID() {
    let id = 1;
    while (true) {
      yield id++;
    }
  }
  const id = genID();

  // Data Structure / State
  const data = {
    items: StorageController.getItemFromStorage(),
    currentItem: null,
    totalEuros: 0,
  };

 
  return {
    getItems: function () {
      return data.items;
    },

    logData: function () {
      return data;
    },
    addItem: function (name, euros, cost, date) {
      const newItem = new Item(name, parseFloat(euros), parseFloat(cost), date);
      data.items.push(newItem);
      
      return newItem;
    },
    getTotEuros: function () {
      let euro = 0;
      data.items.forEach((item) => {
        euro += item.euros;
      });
      data.totalEuros = euro;
      return data.totalEuros;
    },
    getItemByID: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItemByID: function (id, name, euros, cost, date) {
      let updatedItem = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          item.name = name;
          item.euros = parseFloat(euros);
          item.cost = parseFloat(cost);
          item.date = date;
          updatedItem = item;
        }
      });
      return updatedItem;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    itemToBeDeleted: function (id) {
      //Get ids;
      const ids = data.items.map((item) => {
        return item.id;
      });
      const index = ids.indexOf(id);

      //Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
  };
})();

//UI Controller
const UIController = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemEurosInput: "#item-euro",
    cryptoCostInput: "#item-cost",
    dateInput: "#item-date",
    totalEuros: ".total-euros",
    euroHide: ".btn-warning",
    removeAll: "#remove-all",
    
  };

//Methods
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `<li class="collection-item text-center" id="item-${item.id}">
              At date <em>${item.date}</em> you bought <strong>${item.name.toUpperCase()}</strong> for <span id="money-inside" style= color:#006400;><strong>${item.euros}€</strong></span>
               at the price of <span style= color:#FF8C00;>${item.cost}€ </span>
              <a href= "" class="secondary-content "><i class="edit-item fa fa-pencil"><strong style="color: blue;">Edit</strong></i></a>
              </li>`;

      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    clearEditState: function () {
      UIController.clearInputs();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        euros: document.querySelector(UISelectors.itemEurosInput).value,
        cost: document.querySelector(UISelectors.cryptoCostInput).value,
        date: document.querySelector(UISelectors.dateInput).value,
      };
    },
    addListItem(item) {
      const li = document.createElement("li");
      li.className = "collection-item text-center";
      li.id = `item-${item.id}`;
      li.innerHTML = `
      At date <em>${item.date}</em> you bought <strong>${item.name.toUpperCase()}</strong> for <span id="money-inside" style= color:#006400;><strong>${item.euros}€</strong></span>
      at the price of <span style= color:#FF8C00;>${item.cost}€ </span>
      <a href= "" class="secondary-content">
      <i class="edit-item fa fa-pencil">Edit</i></a>`;
      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },
    clearInputs: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemEurosInput).value = "";
      document.querySelector(UISelectors.cryptoCostInput).value = "";
    },
    statusList: function (status) {
      document.querySelector(UISelectors.itemList).style.display = status;
    },
    updateTotEuros: function (totalEuros) {
      document.querySelector(UISelectors.totalEuros).innerHTML =` <span id="money-hide" style= color:#006400;><strong> ${totalEuros}€</strong></span>`;
    },
    addItemToForm: function () {
      const currentItem = ItemController.getCurrentItem();
      document.querySelector(UISelectors.itemNameInput).value = currentItem.name;
      document.querySelector(UISelectors.itemEurosInput).value = currentItem.euros;
      document.querySelector(UISelectors.cryptoCostInput).value = currentItem.cost;
      document.querySelector(UISelectors.dateInput).value = currentItem.date;
      UIController.showEditState();
    },
    updateListItem: function (item) {
      const listItems = document.querySelectorAll("#item-list li");
      const listItemsConvert = Array.from(listItems);
      listItemsConvert.forEach((li) => {
        const liID = li.getAttribute("id");
        if (liID === `item-${parseInt(item.id)}`) {
          li.innerHTML = `
          At date <em>${item.date}</em> you bought <strong>${item.name.toUpperCase()}</strong> for <span id="money-inside" style= color:#006400;><strong>${item.euros}€</strong></span>
               at the price of <span style= color:#FF8C00;>${item.cost}€ </span>
            <a href= "" class="secondary-content">
            <i class="edit-item fa fa-pencil">Edit</i></a>`;
        }
      });
    },
    removeLiItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    removeAllItems: function () {
      const items = document.getElementById("item-list");
      items.innerHTML = "";
    },
  };
})();





//App Controller
const App = (function (ItemController, StorageController, UIController) {
  //load event listener
  const loadEventListeners = function () {
    const UISelectors = UIController.getSelectors();

    //add item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

    // Update one item
    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);


    //Delete one item
    document.querySelector(UISelectors.deleteBtn).addEventListener("click", deleteItem);

    //CLear the LocalStorage
    document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItem);

    //Hide the money
    document.querySelector(UISelectors.euroHide).addEventListener("click", hideMoney);

    
  }; 

  //add item submit
  const itemAddSubmit = function (e) {
    //Get form input 
    const input = UIController.getItemInput();
    if (input.name !== "" && input.euros !== "" && input.cost!=="" && input.date!=="") {
      const newItem = ItemController.addItem(input.name, input.euros, input.cost, input.date);

      //add item to the UI
      UIController.addListItem(newItem);

      //Get total euros
      const totalEuros = ItemController.getTotEuros();

      //Update euros.
      UIController.updateTotEuros(totalEuros);

      // made list appeared
      UIController.statusList("block");

      //store in localStorage
      StorageController.storeItem(newItem);

      //clear input fields
      UIController.clearInputs();
    }
    else
      alert("fill the gaps");
      e.preventDefault();
  };

  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      //Get List item id
      const listID = e.target.parentNode.parentNode.id;

      //split the item-id to get the id
      const listIdArr = listID.split("-");
      
      // get the id number
      const id = parseInt(listIdArr[1]);

      //Get Item
      const itemToEdit = ItemController.getItemByID(id);

      //set curret item
      ItemController.setCurrentItem(itemToEdit);

      //add item to form
      UIController.addItemToForm();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    const input = UIController.getItemInput();
    const itemId = ItemController.getCurrentItem().id;

    // update the data
    const updatedItemSubmit = ItemController.updateItemByID(
      itemId,
      input.name,
      input.euros,
      input.cost,
      input.date,
    );

    // udpate item list in UI
    UIController.updateListItem(updatedItemSubmit);

    //Get total euros
    const totalEuros = ItemController.getTotEuros();

    //Update euros.
    UIController.updateTotEuros(totalEuros);

    //set ititial states
    UIController.clearEditState();

    //Udpate local storage
    StorageController.updateItemStorage(updatedItemSubmit);

    //clear input fields
    UIController.clearInputs();

    e.preventDefault();
  };

  const deleteItem = function (e) {
    // retrieve the item id
    const itemToDeleteID = ItemController.getCurrentItem().id;

    ItemController.itemToBeDeleted(itemToDeleteID);

    UIController.removeLiItem(itemToDeleteID);

    //Get total euros
    const totalEuros = ItemController.getTotEuros();

    //Update euros.
    UIController.updateTotEuros(totalEuros);

    //delete fron local storage
    StorageController.deleteItemStorage(itemToDeleteID);

    //set ititial states
    UIController.clearEditState();

    e.preventDefault();
  };

  const clearAllItem = function (e) {
   if(confirm("Are you sure for that?")){
    //remove all item in items list
    ItemController.clearAllItems();

    //Remove items in UI
    UIController.removeAllItems();

    StorageController.removeAllItems();

    //Get total euros
    const totalEuros = ItemController.getTotEuros();

    //Update euros.
    UIController.updateTotEuros(totalEuros);

    //hide the list
    UIController.statusList("none");

    e.preventDefault();
  }
 
  };

  const hideMoney = function(){
    const totalEuros = ItemController.getTotEuros();
    const hide = document.getElementById("money-hide")
    if (hide.innerText !== "*"){
      hide.innerHTML = "*";
    }
    else
      {
        hide.innerHTML = `${totalEuros}€`;
      }  
  }



  //public method
  return {
    init: function () {
      //set ititial states
      UIController.clearEditState();

      //Fetch items from data structur
      const items = ItemController.getItems();

      const totalEuros = ItemController.getTotEuros();
      //   update UI consequentlz to totCal
      UIController.updateTotEuros(totalEuros);

      //Check if ther is any items
      if (items.length === 0) {
        UIController.statusList("none");
      } else {
        //Populate list with items
        UIController.populateItemList(items);
      }

      //load Event Listeneers
      loadEventListeners();
    },
  };
})(ItemController, StorageController, UIController);

//Initilizing App
App.init();
