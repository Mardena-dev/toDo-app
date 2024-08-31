/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import "./app.css";

function Field({ inputValue, handleInputChange }) {
  return (
    <input
      className="taskField"
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder="Type something..."
    />
  );
}

function Button({ handleSubmit }) {
  return (
    <button className="newTaskButton" onClick={handleSubmit}>
      Add Task
    </button>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleSubmit() {
    if (inputValue.trim() && selectedDate && selectedTime) {
      const reminderDateTime = new Date(
        selectedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())
      );

      const newTodo = {
        text: inputValue.trim(),
        completed: false,
        reminderTime: reminderDateTime,
      };

      setTodos([...todos, newTodo]);
      setInputValue("");
      setSelectedDate(null);
      setSelectedTime(null);
      scheduleNotification(newTodo);
    }
  }

  function handleDelete(index) {
    setTodos(todos.filter((_, i) => i !== index));
  }

  function handleToggleComplete(index) {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function scheduleNotification(todo) {
    const timeUntilReminder = todo.reminderTime - new Date();

    if (timeUntilReminder > 0) {
      setTimeout(() => {
        // Replace the following line with your custom sound logic
        // const audio = new Audio('path-to-your-sound-file.mp3');
        // audio.play();
        console.log(`Notification: ${todo.text}`); // This is where the notification sound would trigger
      }, timeUntilReminder);
    }
  }

  function groupTodosByDate(todos) {
    const groupedTodos = {};

    todos.forEach((todo, index) => {
      const dateKey = todo.reminderTime.toDateString();
      if (!groupedTodos[dateKey]) {
        groupedTodos[dateKey] = [];
      }
      groupedTodos[dateKey].push({ ...todo, originalIndex: index });
    });

    return groupedTodos;
  }

  const groupedTodos = groupTodosByDate(todos);

  return (
    <div className="appContainer">
      <div className="inputSection">
        <Field inputValue={inputValue} handleInputChange={handleInputChange} />
        <div className="dateTimePickerContainer">
          <div className="datePicker">
            <FaCalendarAlt />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select Date"
              minDate={new Date()} // Disables past dates
            />
          </div>
          <div className="timePicker">
            <FaClock />
            <DatePicker
              selected={selectedTime}
              onChange={(time) => setSelectedTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Select Time"
            />
          </div>
        </div>
        <Button handleSubmit={handleSubmit} />
      </div>
      <div className="remindersSection">
        {Object.keys(groupedTodos).map((dateKey, index) => (
          <div key={index} className="taskGroup">
            <h3>Date: {dateKey}</h3>
            <ul className="taskList">
              {groupedTodos[dateKey].map((todo, i) => (
                <li
                  key={i}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: todo.completed ? "lightgrey" : "black",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.originalIndex)}
                  />
                  {todo.text} - {todo.reminderTime && todo.reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <button onClick={() => handleDelete(todo.originalIndex)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
