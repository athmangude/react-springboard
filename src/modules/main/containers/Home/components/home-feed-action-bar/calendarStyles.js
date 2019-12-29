export default () => `
    position: absolute;
    top: -5px
    right: 10px;
    z-index: 2;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    flex-wrap: wrap;

    .calendar-label-container {
      border-bottom: solid 1px #d9d9d9;
      width: 100%;
      padding: 10px 0 11px;
      display: flex;
      align-items: center;
      justify-content: center;

      .calendar-label {
        font-weight: bolder;
      }
    }
  `;
