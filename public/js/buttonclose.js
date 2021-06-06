$("#redAlert").hide();
$("#wowAlert").on("closed.bs.alert", function () {
  console.log("Wow alert closed");
});

$("#tempAlert").on("closed.bs.alert", function () {
  console.log("temp alert closed");
});

window.setTimeout(function () {
  $("#tempAlert")
    .fadeTo(200, 0)
    .slideUp(500, function () {
      $(this).remove();
    });
}, 3000);

window.setTimeout(function () {
  $("#redAlert").fadeIn(1000).slideDown(1000);
}, 4000);
