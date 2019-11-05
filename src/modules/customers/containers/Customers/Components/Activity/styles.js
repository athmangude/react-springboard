/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/href-no-hash */
export default (props) => `
  .activity-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    background-color: transparent;
    width: 100%;
    cursor: pointer;
    position: relative;
  }

  .timeline-line {
    width: 2px;
    background-color: #d8d8d8;
    height: 100px;
    margin-left: 20px;
    position: absolute;
  }

  .timeline-icon-container {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    box-shadow: rgba(67, 70, 86, 0.1) 1px 4px 5px 2px;
    background-color: ${(props.selectedActivity && props.activity) ? (props.selectedActivity.id === props.activity.id) ? '#fce8e6' : '#ffffff' : '#ffffff'};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .timeline-icon {
    color: ${(props.selectedActivity && props.activity) ? (props.selectedActivity.id === props.activity.id) ? '#d93024' : '#d9d9d9' : '#d9d9d9'};
    font-size: 20px; 
  }

  .timeline-list-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex: 1;
    border-bottom: 1px solid #dfdfdf;
  }

  .timeline-date-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .timeline-date {
    color: ${(props.selectedActivity && props.activity) ? (props.selectedActivity.id === props.activity.id) ? '#d93024' : '#808285' : '#808285'};
    font-size: 10px;
  }

  .activity {
    flex: 1;
    display: flex;
    flex-direction: column; 
    padding: 10px;
    justify-content: center;
    background-color: ${(props.selectedActivity && props.activity) ? (props.selectedActivity.id === props.activity.id) ? '#fce8e6' : '#fff' : '#fff'};
  }

  .activity-text {
    font-size: 12;
    font-weight: bold;
    margin: '0 3px';
    color: ${(props.selectedActivity && props.activity) ? (props.selectedActivity.id === props.activity.id) ? '#d93024' : null : null};
  }
`;
