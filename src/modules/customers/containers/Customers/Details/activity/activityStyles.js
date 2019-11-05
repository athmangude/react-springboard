export default () => `
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .log-item {
    width: 100%;
    padding: 10px;
    margin: 4px 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;

    .content-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;

      .avatar {
        width: 40px;
      }

      .content {
        width: calc(100% - 60px);
        padding: 10px
      }
    }

    .time {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    &:hover {
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
      transform: scale(1.01);
    }
  }
`;
