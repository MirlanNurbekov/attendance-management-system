import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceList = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/attendance', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setStudents(response.data.students);
  };

  const markPresent = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/attendance/mark', { id }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Attendance List</h2>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.name} - {student.present ? 'Present' : 'Absent'}
            {!student.present && (
              <button onClick={() => markPresent(student.id)}>Mark Present</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceList;
