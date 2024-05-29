// const loggedInUser = JSON.parse(window.localStorage.getItem('user'));
// console.log(loggedInUser);
// if (loggedInUser == null) {
//     window.location.href = "./user_login.html";
// }

// function logout() {
//     localStorage.removeItem('user');
//     window.location.href = "./login.html";
// }

// fetch('http://localhost:3000/home_page', {
//         method: 'post',
//         headers: {
//             'Accept': 'application/json, text/plain, */*',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ ID: loggedInUser.ID })
//     })
//     .then(res => res.json())
//     .then(data => {
//         console.log(data);
//         const tableBody = document.getElementById("userBody");
//         data.result.forEach(user => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
                
//                 <td>${user.fname}</td>
//                 <td>${user.lname}</td>
//                 <td>${user.email}</td>
//                 <td>${user.gender}</td>
//                 <td>${user.dob}</td>
//             `;
//             tableBody.appendChild(row);
//         });
//     })
//     .catch(error => console.error('Error fetching data:', error));

// console.log("after fetch");
