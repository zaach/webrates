function checkRadioButtons() {
  $("input[type=radio]").parent().removeClass("active");
  $("input[type=radio]:checked").parent().addClass("active");
}

$(function() {
  checkRadioButtons();
  $("input[type=radio]").on("change", checkRadioButtons);
})