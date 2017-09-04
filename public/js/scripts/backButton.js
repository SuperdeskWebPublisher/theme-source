$(document).ready(function(){
  var lastPage = sessionStorage.getItem('lastPage');
  if (lastPage) $('.button--back').attr('href', lastPage);
});
