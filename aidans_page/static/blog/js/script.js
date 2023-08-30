$('.main-nav__search').on('click', function(){
  $('#search').select();
  $('.search-popup').addClass('search-popup--active').find('input[type="text"]').focus();
});

$('.search-popup__close').on('click', function(){
  $(this).closest('.search-popup').removeClass('search-popup--active');
});

$('.nav-toggle__icon').on('click', function(){
  $('.main-nav').addClass('main-nav--mobile');
  $('.content-overlay').addClass('content-overlay--active');
});

$('.content-overlay').on('click', function(){
  $('.main-nav').removeClass('main-nav--mobile');
  $(this).closest('.content-overlay').removeClass('content-overlay--active');
});