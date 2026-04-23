import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]); //all users
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [edit, setEdit] = useState(null); //Stores _id of user being edited

  //  FIX: only ONE token (state)
  const [token, setToken] = useState(localStorage.getItem("token")); //read token from browser storage


 const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

  // //  fetch users 
  useEffect(() => {
    // console.log("TOKEN:", token);

    if (!token) return;

    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data || res.data; //Sometimes backend returns:{ data: [...] } ||[...]

        //  FIX: ensure always array //Prevents .map() crash
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log("ERROR:", err.response?.data || err.message);
      });
  }, [token]);

  // register
  const registerUser = async () => {
    try {
      await axios.post(`${API_URL}`, {
        name,
        age,
        email,
        password,
      });

      alert("Registered successfully");

      setName("");
      setAge("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
    }
  };

  // login
  const loginUser = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // console.log("TOKEN:", res.data.token);

      alert("Login success");

      setToken(res.data.token); //trigger useeffect
      setEmail("");      // <-- CLEAR
      setPassword("");
    } catch (err) {
      console.log(err);
    }
  };

  // add user
  const addUser = async () => {
    if (!name || !age || !email || !password) {
      alert("All fields required");
      return;
    }

    if (isNaN(age)) {
      alert("Age must be a number");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}`,
        { name, age, email, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setUsers([...users, res.data.data || res.data]);

      alert("User added");

      setName("");
      setAge("");
      setEmail("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (user) => {
    setEdit(user._id);
    setName(user.name);
    setAge(user.age);
    setEmail(user.email);
  };

  const updateUser = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/${edit}`, //id
        { name, age, email },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updated = users.map((user) =>
        user._id === edit ? res.data.data || res.data : user,
      );

      setUsers(updated);

      setEdit(null);
      setName("");
      setAge("");
      setEmail("");
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");

    // ✅ FIX: no reload
    setToken(null);
    setUsers([]);
  };

  return (
    <div className="container">
      <h1>User App (JWT)</h1>

      {!token ? (
        <>
          <h3>Register</h3>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={registerUser}>Register</button>

          <h3>Login</h3>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={loginUser}>Login</button>
        </>
      ) : (
        <>
          <button onClick={logout}>Logout</button>

          <h3>{edit ? "Edit User" : "Add User"}</h3>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <button onClick={edit ? updateUser : addUser}>
            {edit ? "Update" : "Add"}
          </button>

          {edit && (
            <button
              onClick={() => {
                (setEdit(null), setName(""), setAge(""), setEmail(""));
              }}
            >
              Cancel
            </button>
          )}

          <table border={1} cellPadding={4} cellSpacing={4}>
            <thead>
              <tr>
                <td>Name</td>
                <td>Age</td>
                <td>Email</td>
                <td>Actions</td>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(users) &&
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => handleEdit(user)}>Edit</button>
                      <button onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default App;

//Register → Login → Get token → Use API

// import { useState, useEffect } from "react";
// import axios from "axios";

// function App() {
//   const [users, setUsers] = useState([]); //all users
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [email, setEmail] = useState("");

//   // Fetch users
//   useEffect(() => {
//     axios.get("http://localhost:3000/api/users")
//       .then(res => setUsers(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   // Add user
//   const addUser = async () => {
//     try {
//       await axios.post("http://localhost:3000/api/users", {
//         name,
//         age,
//         email
//       });

//       // Update UI without reload
//       setUsers([...users, { name, age, email }]);

//       // Clear inputs
//       setName("");
//       setAge("");
//       setEmail("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h1>User App</h1>

//       <input
//         placeholder="Enter name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       /> <br />

//       <input
//         placeholder="Enter age"
//         value={age}
//         onChange={(e) => setAge(e.target.value)}
//       /> <br />

//       <input
//         placeholder="Enter email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       /> <br />

//       <button onClick={addUser}>Add</button>

//       <ul>
//         {users.map((user, index) => (
//           <li key={user._id || index}>
//             {user.name} - {user.age} - {user.email}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
