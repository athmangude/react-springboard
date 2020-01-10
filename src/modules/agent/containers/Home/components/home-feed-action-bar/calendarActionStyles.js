export default ({ color, active }) => `
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    outline: none;
    background-color: ${active ? '#e8eaed80' : '#fff'};
    position: relative;

    &:hover {
      background-color: #e8eaed40;
      cursor: pointer;
    }

    i {
      color: ${color}
    }

    &.nps {
      .label {
        margin: 0 10px;
      }
    }
  `;
