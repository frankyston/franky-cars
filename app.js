(function(win, doc) {
  'use strict';

  function app(){
    var $companyElement = new DOM('[data-js="company"]');
    var $phoneElement = new DOM('[data-js="phone"]');
    var $formCar = new DOM('[data-js="form-car"]');
    var $tableTBody = new DOM('[data-js="table-tbody"]');
    var $row = new DOM('[data-js="row-car"]');
    var $image = new DOM('[data-js="image"]');
    var $model = new DOM('[data-js="model"]');
    var $age = new DOM('[data-js="age"]');
    var $board = new DOM('[data-js="board"]');
    var $color = new DOM('[data-js="color"]');
    var ajax;
    var ajaxLoadData;
    var data;
    var cloneRow;

    var cars;

    function init(){
      cloneRow = $row.get()[0].cloneNode(true);
      $tableTBody.get()[0].removeChild($row.get()[0]);
    }

    function ajax(){
      ajax = new XMLHttpRequest();
      ajax.open('GET', './company.json');
      ajax.send();

      ajax.addEventListener('readystatechange', function(){
        if(isRequestOk(ajax)){
          data = JSON.parse(ajax.responseText);
          $companyElement.get()[0].appendChild(doc.createTextNode(data.name))
          $phoneElement.get()[0].appendChild(doc.createTextNode(data.phone))
        }
      }, false);

    }

    function loadAjaxApi(verb, url, params = null){
      console.log(params);
      console.log(url);
      ajaxLoadData = new XMLHttpRequest();
      ajaxLoadData.open(verb, url, true);
      if(verb === "POST"){
        ajaxLoadData.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajaxLoadData.send(params);
      } else {
        ajaxLoadData.send();
      }
      return ajaxLoadData;
    }

    function loadData(){
      clearTable();
      var ajax = loadAjaxApi('GET', 'http://localhost:3000/car');

      ajax.addEventListener('readystatechange', function(){
        if(isRequestOk(ajaxLoadData)){
          cars = JSON.parse(ajaxLoadData.responseText);
          if(cars.length > 0)
            populateTableCar(cars);
        }
      });

    }

    function populateTableCar(cars){
      removeEventClick();
      cars.forEach(function(car){
        addRow(car)
      });
      addEventClickRemove();
    }

    function clearTable(){
      Array.prototype.map.call($tableTBody.get()[0].children, function(item){
        $tableTBody.get()[0].removeChild(item);
      });
    }

    function isRequestOk(ajax){
      return ajax.readyState === 4 && ajax.status === 200
    }

    function addRow(car){
      cloneRow = $row.get()[0].cloneNode(true);
      $tableTBody.get()[0].appendChild(cloneRow);

      cloneRow.children[0].appendChild(createImageCar(car.image));
      cloneRow.children[1].appendChild(doc.createTextNode(car.brandModel));
      cloneRow.children[2].appendChild(doc.createTextNode(car.year));
      cloneRow.children[3].appendChild(doc.createTextNode(car.plate));
      cloneRow.children[4].appendChild(doc.createTextNode(car.color));
      var newButton = doc.createElement("button");
      newButton.setAttribute('class', 'remove');
      newButton.setAttribute('data-id', car.plate);
      newButton.appendChild(doc.createTextNode("Excluir"));
      cloneRow.children[5].appendChild(newButton);
      // cloneRow.children[5].childNodes[0].setAttribute('data-id', car.plate);
      clearForm();
    }

    function saveCar(){
      var car = createSchemaCar();
      var ajax = loadAjaxApi('POST', 'http://localhost:3000/car', car);
      ajax.addEventListener('readystatechange', function(){
        if(isRequestOk(ajaxLoadData)){
          alert("Carro cadastrado com sucesso.");
        }
      });
      loadData();
    }

    function deleteCar(carId){
      var ajax = loadAjaxApi('DELETE', 'http://localhost:3000/car', carId);
      ajax.addEventListener('readystatechange', function(){
        if(isRequestOk(ajaxLoadData)){
          alert("Carro excluído com sucesso.");
        }
      });
      loadData();
    }

    function createSchemaCar(){
      return "image="+ $formCar.get()[0].children[0].value +
        "&brandModel="+ $formCar.get()[0].children[1].value +
        "&year="+ $formCar.get()[0].children[2].value +
        "&plate="+ $formCar.get()[0].children[3].value +
        "&color="+ $formCar.get()[0].children[4].value;
    }

    function createImageCar(src){
      var img = doc.createElement('img');
      img.src = src;
      img.width = 100;
      img.height = 100;
      return img;
    }

    function isValidateForm(){
      return Array.prototype.every.call($formCar.get()[0].children, function(input, index){
        return input.value !== ""
      });
    }

    function clearForm(){
      Array.prototype.forEach.call($formCar.get()[0].children, function(input, index){
        if(input.getAttribute('type') === 'text')
          input.value = ""
      });
    }

    function addEventClickRemove(){
      var $buttonsDelete = doc.querySelectorAll('.remove');
      Array.prototype.map.call($buttonsDelete, function(button){
        button.addEventListener('click', function(){
          var carId = button.getAttribute('data-id');
          deleteCar("plate="+carId);
          loadData();
          // $tableTBody.get()[0].removeChild(button.parentNode.parentNode);
        }, false);
      });
    }

    function removeEventClick(){
      var $buttonsDelete = doc.querySelectorAll('.remove');
      Array.prototype.forEach.call($buttonsDelete, function(button){
        button.removeEventListener('click', function(){}, false);
      });
    }

    $formCar.on('submit', function(e){
      e.preventDefault();
      if (isValidateForm())
        saveCar();
      else
        alert("Todos os campos devem ser preenchidos!")
    });

    ajax();
    init();
    loadData();
  }

  win.app = app();

})(window, document);
