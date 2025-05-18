import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getAllMembers } from '../api/members';
import './DownloadExcel.css';

const DownloadExcel = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('⏳ Preparing Excel file...');

  useEffect(() => {
    const fetchAndDownload = async () => {
      try {
        setStatus('loading');
        const response = await getAllMembers();
        
        let membersData = [];

        if (response.error) {
          // If API fails, fall back to localStorage
          console.error('Error fetching members from API:', response.error);
          setMessage('⚠️ Using local data (API unavailable)...');
          const savedData = JSON.parse(localStorage.getItem('membersExcel')) || [];
          membersData = savedData;
        } else {
          // Format data from API to match Excel structure
          membersData = (response.members || []).map(member => ({
            Name: member.name,
            Flat: member.flat,
            Contact: member.contact,
            ID: member._id
          }));
        }

        if (membersData.length === 0) {
          setStatus('error');
          setMessage('No members found to download.');
          return;
        }

        // Generate Excel file
        const worksheet = XLSX.utils.json_to_sheet(membersData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'members.xlsx');

        setStatus('success');
        setMessage('✅ Excel file downloaded successfully!');

        // Optional: redirect back after download
        setTimeout(() => {
          window.history.back(); // or navigate to dashboard
        }, 2000);
      } catch (error) {
        console.error('Error generating Excel:', error);
        setStatus('error');
        setMessage('❌ Failed to generate Excel file.');
      }
    };

    fetchAndDownload();
  }, []);

  return (
    <div className="download-excel-container">
      <div className={`download-message ${status}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default DownloadExcel;
