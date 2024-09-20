
import React from 'react';

const TutorialModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Task Manager Tutorial</h2>
        <ul>
          <li>
            <strong>Creating new tasks:</strong> Type in the task title in the input field and click the "Create Task" button.
          </li>
          <li>
            <strong>Updating task status:</strong> Click the check icon to toggle its status.
          </li>
          <li>
            <strong>Deleting tasks:</strong> Click the "Delete" icon next to delete the selected task.
          </li>
          <li>
            <strong>Deleting multiple tasks:</strong> Check the checkbox next to the tasks to select the desired tasks. Then, click the  "Delete Selected" button and confirm your decision.

          </li>
          <li>
            <strong>Editing task titles:</strong> Click the pencil icon to edit its title.
          </li>
          <li>
            <strong>Filtering tasks:</strong> Click the "Show All Tasks", "Show Completed Tasks", or "Show Pending Tasks" buttons to filter the tasks.
          </li>
        </ul>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;