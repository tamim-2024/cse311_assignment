

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function register() {
  const formData = new FormData();
  formData.append('profile_picture', document.getElementById('profile_picture').files[0]);
  formData.append('fname', document.getElementById('first_name').value);
  formData.append('lname', document.getElementById('last_name').value);
  formData.append('gender', document.getElementById('gender').value);
  formData.append('dob', document.getElementById('date').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('password', document.getElementById('password').value);
  formData.append('retypePassword', document.getElementById('retype_password').value);

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const retypePassword = document.getElementById('retype_password').value;

  if (!validateEmail(email)) {
    alert('Invalid email');
    return;
  }
  if (password.length < 5) {
    alert('Password should be at least 5 characters long');
    return;
  }
  if (password !== retypePassword) {
    alert('Passwords do not match');
    return;
  }
  const user = {profile_picture:profile_picture, fname: first_name, lname: last_name, email: email, dob: date, gender: gender, password: password };
  fetch('http://localhost:3000/add_user', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(res => {
    if (res.result) {
      window.localStorage.setItem('user', JSON.stringify(res.user));
      window.location.href = "./login.html";
    } else {
      alert(res.error || "Unknown error occurred.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("An error occurred while processing your request.");
  });
}
