export default () => `
  width: 100%;
  background-color: #fff;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  border-bottom: solid 1px #d9d9d9;

  &:hover {
    box-shadow: 0 0 10px #e8eaed;
  }


  .button:hover {
    background-color: #F0F0F0 !important;
    cursor: pointer;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  .wide-conversation-list-item .link:hover {
    color: #4a4f57 !important;
  }

  .wide-conversation-list-item .circular-progress-bar .CircularProgressbar-text {
    fill: #000000de;
    font-size: 25px;
  }
`;
