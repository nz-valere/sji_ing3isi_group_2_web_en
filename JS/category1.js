const ul = $("<div class ='list-group'></div>") 
const child = $('.child-container')
const loadCategory = function(category){
  for (const iterator of category){
    ul.append(`<div class = 'small-container ${iterator.name}'>${iterator.name}</div>`)
    console.log(ul);
}
child.append(ul)
console.log('hi');
}

$(document).ready(function(){
  $.getJSON('../HTML/questions.json', function(data){
    let category = data.categories
    console.log(category);
    loadCategory(category)
    $('.small-container').on('click', function(){
      var click = $(this).text();
      console.log(click);
      $('h4').html('<strong>"click"</strong>');
      $('body').css('backgroundColor','orange');
      $('#Sports').slideToggle().animate({fontSize: '25px'});
      $('.img img').attr('src','../Assets/images/Sports.jpg');
      console.log('hello');
    })
  })
  
})


