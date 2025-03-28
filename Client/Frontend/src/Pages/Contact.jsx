import React, { useEffect, useState } from 'react';
import './Contact.css';
import profile from '../Images/profile.png';
import EditForm from './EditForm'; // Import the EditForm component
import CreateForm from './CreateContact';
import { baseurl } from './Api';
const DataTable = () => {
  const [data, setData] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isAscending, setIsAscending] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm,setsearchTerm] = useState("")
  const openCreateForm = () => {
    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
  };

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };
  useEffect(() => {
    fetchUpdatedData();
  }, [searchTerm,isAscending]);

   
  const fetchUpdatedData = () => {
    let url;
    if (searchTerm === '') {
      url = `${baseurl}`;
    } else {
      url = `${baseurl}/search?name=${searchTerm}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let newdata = []
        if(isAscending){
          newdata=data.mappedarray.slice().sort((a, b) => a.firstName.localeCompare(b.firstName));
        }else{
          newdata= data.mappedarray.slice().sort((a, b) => b.firstName.localeCompare(a.firstName));
        }
        setData(newdata);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const openEditForm = (contactData) => {
    setEditFormData(contactData);
    setShowEditForm(true);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
  };

  const handleSaveEdit = (editedData) => {
    // Prepare the URL by appending the contact's ID to the base URL.
    const url = `${baseurl}/${editedData._id}`;

    // Create the request body as JSON.
    const requestBody = JSON.stringify(editedData);

    // Define the PUT request options.
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    };

    // Send the PUT request to update the contact.
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update contact');
        }
      })
      .then(() => {
        // Fetch updated data after successful update.
        fetchUpdatedData();
        
        // Close the edit form.
        closeEditForm();
      })
      .catch((error) => {
        console.error('Error updating contact:', error);
        // Handle error scenarios as needed.
      });
  };

  
 const handleDelete=async (contact)=>{
  try {
   
    const response = await fetch(`${baseurl}/${contact._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Successful deletion
       alert(`${contact.firstName} ${contact.lastName} has deleted succesfully`)
       fetchUpdatedData();
    } else {
      // Handle non-successful response (e.g., show an error message)
      console.error('Failed to delete contact');
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Error deleting contact:', error);
  }

  
 }



 const handleCreate = (newData) => {
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newData.email)) {
    alert('Please enter a valid email address.');
    return; 
  }
  const phoneNumberRegex = /^\d+$/;
  if (!phoneNumberRegex.test(newData.phoneNumber)) {
    alert('Please enter a valid phone number containing only numbers.');
    return;
  }
  const url = `${baseurl}`;


  const requestBody = JSON.stringify(newData);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  };

  fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create contact");
      }
      alert("Contact Added")
    })
    .then(() => {
      fetchUpdatedData();
      closeCreateForm();
    })
    .catch((error) => {
      console.error("Error creating contact:", error);
    });
};

const handleSearchInputChange =async (e)=>{
  e.preventDefault
   setsearchTerm(e.target.value)
}
return (
  <>
    <div className="header">
      Customer Management App
    </div>
    <div className="container">
      <div className="search-bar">
        <input
          className="search-input"
          type="search"
          placeholder="Search Customer..."
          onChange={(e) => setsearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button className="button" onClick={openCreateForm}>Create Contact</button>
        <button className="button sorting-button" onClick={toggleSortOrder}>
          Sort {isAscending ? '⬆ A-Z' : '⬇ Z-A'}
        </button>
      </div>
     
      <table className="data-table">
        <thead>
          <tr>
            <th className="highlight">Name</th>
            <th className="highlight">Email</th>
            <th className="highlight">Mobile Number</th>
            <th className="highlight">Created Date</th>
            <th className="highlight">Edit Contact</th>
            <th className="highlight">Delete Customer</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>
                <div style={{ display: 'flex', textAlign: 'end' }}>
                  <img width={'30px'} src={profile} alt="Profile"style={{ marginLeft: '40px' }} />
                  <span style={{ marginLeft: '70px', marginTop: '5px' }}>
                    {item.firstName} {item.lastName}
                  </span>
                </div>
              </td>
              <td>{item.email}</td>
              <td>{item.code} {item.phoneNumber}</td>
              <td>{item.createDate}</td>
              <td>
                <button className="update-button" onClick={() => openEditForm(item)}>
                  Edit
                </button>
              </td>
              <td>
                <button className="delete-button" onClick={()=>handleDelete(item)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
      {showEditForm && (
      <EditForm contactData={editFormData} onClose={closeEditForm} onSave={handleSaveEdit} />
    )}
    {showCreateForm && <CreateForm onClose={closeCreateForm} onCreate={handleCreate} />}
    </div>
  </>
);
};

export default DataTable;



