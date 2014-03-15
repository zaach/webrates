function checkRadioButtons() {
  $("input[type=radio]").parent().removeClass("active");
  $("input[type=radio]:checked").parent().addClass("active");
}

$(function() {
  checkRadioButtons();
  $("input[type=radio]").on("change", checkRadioButtons);


  $(".form_group_2").hide();
  $("#submit-rate").prop('disabled', true);

  $("#input-rate").on("input", function() {
    $("#submit-rate").prop('disabled', false);
  });

  $("#input-rate, #submit-rate").on("keyup", function(e) {
    if (e.which === 13) {
      $(".form_group_2").show();
    }
  });

  $("#submit-rate").on("click", function() {
    //$("#input-rate").attr('required', true);
    $(".form_group_2").show();
  });

  // checked attr in html didn't work
  $("#input-usd").prop('checked', true);
})
