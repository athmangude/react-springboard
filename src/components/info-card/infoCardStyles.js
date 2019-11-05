export default () => `
  width: calc(100% - 20px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  min-height: 300px;
  border-radius: 8px;
  margin: 10px;

  .title {
    height: 45px;
    padding-left: 10px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #6d6e71;
    font-size: 20px;
  }

  .divider {
    border: none;
    border-top: solid 2px #f2f2f2;
    margin: 0;
    padding: 0;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      color: #808080;

      &:hover {
        background-color: #e8eaed;
      }
    }
  }
`;
