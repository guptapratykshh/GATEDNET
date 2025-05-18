import React, { useEffect, useState } from 'react';
import { getAllMembers, deleteMember, updateMember } from '../api/members';
import './UpdateMembers.css';

const UpdateMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', flat: '', contact: '' });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await getAllMembers();
      if (response.error) {
        setError(response.error);
        // Fallback to localStorage if API fails
        const savedData = JSON.parse(localStorage.getItem('membersExcel')) || [];
        setMembers(savedData.map((member, index) => ({
          _id: `local-${index}`,
          name: member.Name,
          flat: member.Flat,
          contact: member.Contact
        })));
      } else {
        setMembers(response.members || []);
      }
    } catch (err) {
      setError('Failed to load members');
      console.error('Error fetching members:', err);
      // Fallback to localStorage if API fails
      const savedData = JSON.parse(localStorage.getItem('membersExcel')) || [];
      setMembers(savedData.map((member, index) => ({
        _id: `local-${index}`,
        name: member.Name,
        flat: member.Flat,
        contact: member.Contact
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await deleteMember(id);
        if (response.error) {
          setError(response.error);
        } else {
          setMembers(members.filter(member => member._id !== id));
          // Update localStorage for consistency
          updateLocalStorage();
        }
      } catch (err) {
        setError('Failed to delete member');
        console.error('Error deleting member:', err);
      }
    }
  };

  const startEditing = (member) => {
    setEditingMember(member._id);
    setEditForm({
      name: member.name,
      flat: member.flat,
      contact: member.contact
    });
  };

  const cancelEditing = () => {
    setEditingMember(null);
    setEditForm({ name: '', flat: '', contact: '' });
  };

  const handleEditFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const saveEdit = async (id) => {
    try {
      const response = await updateMember(id, editForm);
      if (response.error) {
        setError(response.error);
      } else {
        setMembers(members.map(member => 
          member._id === id ? { ...member, ...editForm } : member
        ));
        cancelEditing();
        // Update localStorage for consistency
        updateLocalStorage();
      }
    } catch (err) {
      setError('Failed to update member');
      console.error('Error updating member:', err);
    }
  };

  const updateLocalStorage = () => {
    const localStorageFormat = members.map(member => ({
      Name: member.name,
      Flat: member.flat,
      Contact: member.contact
    }));
    localStorage.setItem('membersExcel', JSON.stringify(localStorageFormat));
  };

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  return (
    <div className="update-members-container">
      <h2>📋 All Society Members</h2>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {members.length === 0 ? (
        <p>No members found. Please add some.</p>
      ) : (
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Flat</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                {editingMember === member._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="flat"
                        value={editForm.flat}
                        onChange={handleEditFormChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="contact"
                        value={editForm.contact}
                        onChange={handleEditFormChange}
                        required
                      />
                    </td>
                    <td>
                      <button 
                        className="save-btn" 
                        onClick={() => saveEdit(member._id)}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{member.name}</td>
                    <td>{member.flat}</td>
                    <td>{member.contact}</td>
                    <td>
                      <button 
                        className="edit-btn" 
                        onClick={() => startEditing(member)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(member._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UpdateMembers;
