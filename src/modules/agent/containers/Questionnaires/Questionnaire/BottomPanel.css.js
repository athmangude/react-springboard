export default () => `
  height: 58px;
  display: flex;
  align-items: baseline;
  justify-content: baseline;
  flex-direction: column;

  &>.progress-container {
    width: 100%;
    height: 10px;

    .progress-bar {
      height: 10px;
    }
  }

  &>.actions-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    width: 100%;
    margin: 3px 0
    height: 48px;
  }
`;
