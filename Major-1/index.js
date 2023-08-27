// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABYrtwXfK3SCsUZnJ3BsLDiat5ixxv-FQ",
  authDomain: "file-integrity-monitor.firebaseapp.com",
  projectId: "file-integrity-monitor",
  storageBucket: "file-integrity-monitor.appspot.com",
  messagingSenderId: "163850665892",
  appId: "1:163850665892:web:8d0fbcad0844dec6a18b31",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the variables
const auth = firebase.auth();
const database = firebase.database();

// Setting up the register function
function register() {
  // Getting all the inputs
  username = document.getElementById("username").value;
  password = document.getElementById("password").value;
}

// validate the input fields
if (
  validate_password(password) == false ||
  validate_username(username) === false
) {
  alert("Password is Outta line");
}
// Moving on with the auth
auth
  .createUserWithPassword(username, password)
  .then(function () {
    const user = auth.currentUser;

    // Add this user to the database
    const database_ref = database.ref();

    // Create User Data
    const user_data = {
      username: username,
      password: password,
      last_login: Date.now(),
    };

    database_ref.child("users/" + user.uid).set(user_data);

    alert("User Created");
  })
  .catch(function (error) {
    // Firebase will use this to alert of its errors
    const error_code = error.code;
    const error_message = error.message;

    alert(error_message);
  });

function validate_password(password) {
  if (password < 6) {
    return false;
  } else {
    return true;
  }
}

function validate_username(username) {
  if (username === null) {
    return false;
  } else {
    return true;
  }
}

function validate_fields(field) {
  if (field == null) {
    return false;
  }
  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}
