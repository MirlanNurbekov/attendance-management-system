import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

const studentsPerGroup = 6;
const groupNames = [
  "CS-11-24",
  "CS-12-24",
  "CS-13-24",
  "CS-14-24",
  "CS-15-24",
  "CS-16-24"
];

const getStudentLabel = (index) => `Student ${index+1}`;

const periods = [
  {
    period: 1,
    time: "10:00 - 11:20",
    groups: [
      "Физика\nпреп. Кулубаева Б.У.\nБЛ3",
      "",
      "",
      "",
      "",
      ""
    ]
  },
  {
    period: 2,
    time: "11:30 - 12:50",
    groups: [
      "Введение в компьютерную\nнауку\nпреп. Бейшеналиева А.Ж.\nкаб.203",
      "Алгебра\nст.преп. Колодрова Е.А.\nкаб.0-2",
      "English\nпреп. Моис Р.Т.\nкаб.307",
      "Веб разработка\nасс.преп. Мамакекирмова А\nкаб.202",
      "English\nпреп. Сейітбекова Б.\nкаб.104",
      "Веб разработка\nасс.преп. Завирбекова М.\nкаб.201"
    ]
  }
];

const MondayTimeTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(null);
  const [attendance, setAttendance] = useState({});

  const openModal = (periodIndex, groupIndex) => {
    setSelectedGroupIndex(groupIndex);
    setSelectedPeriodIndex(periodIndex);

    const key = `${periodIndex}-${groupIndex}`;
    if (!attendance[key]) {
      const initial = Array(studentsPerGroup).fill(0);
      setAttendance(prev => ({ ...prev, [key]: initial }));
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedGroupIndex(null);
    setSelectedPeriodIndex(null);
  };

  const handleCheckboxChange = (i) => {
    if (selectedPeriodIndex === null || selectedGroupIndex === null) return;
    const key = `${selectedPeriodIndex}-${selectedGroupIndex}`;
    const current = attendance[key] || Array(studentsPerGroup).fill(0);
    const updated = [...current];
    updated[i] = updated[i] === 0 ? 1 : 0;
    setAttendance(prev => ({ ...prev, [key]: updated }));
  };

  const handleSubmit = async () => {
    if (selectedPeriodIndex === null || selectedGroupIndex === null) return;
    const key = `${selectedPeriodIndex}-${selectedGroupIndex}`;
    const attendanceToSave = attendance[key] || Array(studentsPerGroup).fill(0);
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/attendance/record', {
        periodIndex: selectedPeriodIndex,
        groupIndex: selectedGroupIndex,
        attendance: attendanceToSave
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("Attendance submitted:", attendanceToSave);
      closeModal();
    } catch (err) {
      console.error("Failed to submit attendance:", err);
    }
  };

  const currentKey = (selectedPeriodIndex !== null && selectedGroupIndex !== null)
    ? `${selectedPeriodIndex}-${selectedGroupIndex}`
    : null;
  const currentAttendance = currentKey && attendance[currentKey]
    ? attendance[currentKey]
    : Array(studentsPerGroup).fill(0);

  return (
    <div className="timetable-container">
      <h2 className="timetable-title">Расписание на Понедельник</h2>
      <table className="timetable">
        <thead>
          <tr>
            <th>Пара</th>
            <th>Время</th>
            {groupNames.map((g,i) => <th key={i}>{g}</th>)}
          </tr>
        </thead>
        <tbody>
          {periods.map((p, periodIndex) => (
            <tr key={p.period}>
              <td>{p.period}</td>
              <td>{p.time}</td>
              {p.groups.map((subject, groupIndex) => (
                <td key={groupIndex}
                  className={subject.trim() !== "" ? "clickable-cell" : ""}
                  onClick={() => subject.trim() !== "" && openModal(periodIndex, groupIndex)}
                >
                  {subject.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalOpen} onClose={closeModal}>
        {(selectedGroupIndex !== null && selectedPeriodIndex !== null) && (
          <>
            <h3>
              Список студентов ({groupNames[selectedGroupIndex]}, Пара {periods[selectedPeriodIndex].period})
            </h3>
            <ul className="student-list">
              {currentAttendance.map((val, i) => (
                <li key={i} className="student-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={val === 1}
                      onChange={() => handleCheckboxChange(i)}
                    />{" "}
                    {getStudentLabel(i)}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={handleSubmit}>Submit</button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MondayTimeTable;
