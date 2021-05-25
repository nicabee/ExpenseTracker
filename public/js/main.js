function checkPasswordMatch() {
  var password = $("#newpassword").val();
  var confirmPassword = $("#confirmnewpassword").val();

  if (password != confirmPassword)
    $("#divCheckPasswordMatch").html("Passwords do not match!");
  else $("#divCheckPasswordMatch").html("Passwords match!");
}

$(document).ready(function () {
  $("#txtNewPassword, #txtConfirmPassword").keyup(checkPasswordMatch);
});

function Validate() {
  var password = document.getElementById("newpassword").value;
  var confirmPassword = document.getElementById("confirmnewpassword").value;
  if (password != confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }
  return true;
}
