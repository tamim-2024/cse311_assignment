const logedinuser=JSON.parse(window.localStorage.getItem('user'));
 console.log(location.href);

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || username == '') {
    alert('Please insert username');
    return;
  }
  if (!password || password == '') {
    alert('Please insert password');
    return;
  }

  const user = { username: username, password: password };

  fetch('http://localhost:3000/user_check', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
   
  })
  .then(function (res) { 
    return res.json(); 
  })
  .then(function (res) { 
    console.log(res); 
    if (res.message === "Login successful") {
       window.localStorage.setItem('user',JSON.stringify(res.user));
       window.location.href = "./user_home.html";
      // return false;
    } else {
      alert(res.error || "Unknown error occurred.");
    }
  })
  .catch(function (error) {
    console.error('Error:', error);
    alert("An error occurred while processing your request.");
  });
}