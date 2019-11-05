export default () => `
  width: calc(100% - 20px);
  border-radius: 8px;
  min-height: 100px;
  margin: 10px;
  box-shadow: 0 0 0 2px #d9d9d9;
  color: #24292e;

  &:hover {
    box-shadow: 0 0 10px 2px #d9d9d9;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;

    .source {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .icon {
        margin: 0 10px 0 0;
        font-size: 40px;
      }

      .profile-timestamp {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        .name {
          font-size: 18px;
          color: #818181;
        }
      }
    }

    .sentiment {
      .icon {
        margin: 0 10px 0 0;
        font-size: 20px;
        border-radius: 50%;
        padding: 0;
      }
    }
  }

  .body {
    margin: 10px 0;
    padding: 0 10px;
    width: calc(100% - 20px);
    color: #24292e;
  }

  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: solid 2px #d9d9d9;

    .indicator {
      width: 50px;
    }

    .publication {
      width: calc(100% - 100px);

      span {
        text-transform: capitalize;
      }
    }

    .link {
      width: 40px;
      margin: 0 5px;
      cursor: pointer;
      display: flex; align-items: center;
      justify-content: center;
      border-radius: 50%;

      &:hover {
        box-shadow: 0 0 3px #d9d9d9;
        background-color: #e8eaed;
      }

      &.circular {
        height: 40px;
      }
    }



    .icon {
      margin: 5px;
      font-size: 40px;

      &.smaller {
        font-size: 30px;
      }
    }
  }
`;
