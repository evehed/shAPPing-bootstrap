var ShoppingModel = function () {

  let shoppingCart = [];
  var observers = [];
  var searchFilter = "";
  var currentProduct ="";
  var _this = this;
  var allGroceriesDb = []
  var currentUserModel;

  var allGroceries = [{
    "id": 49993,
    "title": "Milk",
    "section":"dairy",
    "description": "Milk is a white liquid produced by the mammary glands of mammals. It is the primary source of nutrition for infant mammals (including humans who are breastfed) before they are able to digest other types of food. ",
    "price": 14 ,
    "img": "https://www.cannadish.net/wp-content/uploads/2017/06/milk.jpg"

  },
  {
    "id": 537176,
    "title": "Bulgur",
    "section": "grain",
    "description": "Bulgur is recognized as a whole grain by the United States Department of Agriculture.[3] Bulgur is sometimes confused with cracked wheat, which is crushed wheat grain that has not been parboiled.[4] Instead, bulgur is cracked wheat that has been partially cooked. Bulgur is a common ingredient in cuisines of many countries of the Middle East and Mediterranean Basin.",
    "price": 10,
    "img": "http://dieteticdirections.com/wp-content/uploads/2014/06/5.jpg"

  }];

  var modelCart = [];

  var notifyObservers = function(obj) {
    for(var i=0; i<observers.length; i++){
      observers[i].update(obj);
    }
  }

  this.setCurrentUser = function(id){
    currentUserModel = currentUser

  }

  this.addObserver = function(observer) {
    observers.push(observer);
  }

  this.addToCart = function (id) {
    var product = _this.getProductInfo(id)
    //console.log("asdasdasd" + currentUserModel.uid)
    firebase.firestore().doc('users/'+ currentUserModel.uid).collection('shoppingCart')
      .add(product)
      .then(function() {
        //resolved promise
        modelCart.push(product)
        //console.log("TTTTT")
        var successMsgElement = document.getElementById("success-message");
        successMsgElement.innerHTML = "Successfully added to cart!"
        successMsgElement.style.display = "block";
        //notifyObservers();
      }, function() {
        //rejected promise
        var successMsgElement = document.getElementById("success-message");
        successMsgElement.innerHTML = "Not successful in adding to cart :("
        successMsgElement.className = "alert alert-danger";     
        successMsgElement.style.display = "block";    
        //notifyObservers();    
      });

  }

  async function removeFromCart(product){
    var newShoppingCart = []
    var wait = await firebase.firestore().doc('users/'+ currentUserModel.uid).collection('shoppingCart').get()
    .then(function(shoppingCartDb) {
      shoppingCartDb.forEach(function(doc) {
        if(doc.data().id == product){
          firebase.firestore().doc('users/'+ currentUserModel.uid).collection('shoppingCart').doc(doc.id).delete()
          .then(function() {
            shoppingCart = shoppingCart.filter(obj => obj.id != product);
            notifyObservers()
          }, function() {
            console.log("removeFromCart failade somehow")
          });;
        }
      })
    })
  }

  /*
  const removeFromCart = async message => {
    
  }*/

  this.runRemove = function(product){
    removeFromCart(product)
  }
  /*
  this.removeFromCart = function (product) {
    firebase.firestore().doc('users/'+ currentUserModel.uid).collection('shoppingCart').get()
    .then(function(shoppingCartDb) {
      shoppingCartDb.forEach(function(doc) {
        if(doc.data().id == product){
          firebase.firestore().doc('users/'+ currentUserModel.uid).collection('shoppingCart').doc(doc.id).delete();
        }
      })
    })

    notifyObservers()
  }*/



  this.setSearchFilter = function(val){
    searchFilter = val;
    notifyObservers();
  }
  this.setCurrentProduct = function(p){
    currentProduct = p;
    notifyObservers();
  }
  this.getCurrentProductInfo = function(){
    var result;
    allGroceriesDb.forEach(function(grocery){
      if(grocery.id == currentProduct){
        result = grocery;
      }
    })
    return result;
  }
  this.getProductInfo = function(id){
    var result;
    allGroceriesDb.forEach(function(grocery){
      if(grocery.id == id){
        result = grocery;
      }
    })
    return result;
  }
  this.getAllGroceries = function(){
    return allGroceriesDb;
  }

  this.getAllGroceriesDb = function(){
    var getDatabaseInfo = firebase.firestore().collection("groceries").get()
    .then(function(query) {
      query.forEach(function(doc) {
        allGroceriesDb.push(doc.data())
        notifyObservers();
      })
    });
  }

  this.getFilteredGroceries = function(){

    return allGroceriesDb.filter(function(g){
      //console.log("gggge"+g)
      var found = true;
      if(searchFilter != ""){
        found = false;
        var product = g.title.toLowerCase()
        if(product.indexOf(searchFilter) != -1){
          found = true
          console.log(g.title)
        }
        return found;
      }
      else{
        return found
      }
    })
  }



  const loadShoppingCart = async message => {
    shoppingCart = [];
    currentUserModel = currentUser
    //console.log("CURRENT USER IS SET")
    var bajs = await firebase.firestore().doc('users/'+ currentUserModel.uid).collection('shoppingCart').get()
    .then(function(query) {
      query.forEach(function(doc) {
        shoppingCart.push(doc.data())
      })
    });

    //console.log("shopping caaaary:" + JSON.stringify(shoppingCart))
    //console.log(shoppingCart)
    notifyObservers()
  }

  this.runShoppingCartLoader = function(){
    loadShoppingCart();
  }

  this.returnShoppingCart = function(currentUser){
    return shoppingCart;
  }


    _this.getAllGroceriesDb();

}
