export default ({ colorMix }) => `
  display: flex;
  flex-direction: column;
  align-Items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: none;
  padding: 10px;

  &:hover {
    box-shadow: 0 3px 3px #d9d9d9;
    border-top: solid 1px #d9d9d9;

    background-color: #ececec91;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;

    .avatar {
      text-transform: uppercase;
      background-color: ${colorMix.backgroundColor};
      height: 30px;
      width: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${colorMix.color};
      font-weight: bold;
      fontSize: 12px;
      margin: 0 10px 0 0;
    }

    .name {
      font-size: 11;
      color: #808285;
      font-weight: bold;
      width: calc(100% - 40px);
      text-transform: capitalize;

      &>b {
        color: #3d4553;
      }
    }
  }

  .body {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    width: calc(100% - 10px);
    padding: 5px;
    flex-direction: column;

    .info-container {
      display: flex;
      align-items: center;
      justify-content: center;

      &.list {
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        width: 100%;
        margin-top: 5px;

        .list-group {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          flex-direction: column;

          .list-title {
            margin: 15px 0 10px;
            font-weight: bold;
          }
        }

        .list-item {
          width: 100%;
          padding: 5px 0px;
          border-top: solid 1px #d9d9d9;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-transform: capitalize;

          &.apart {
            justify-content: space-between;
          }

          .icon {
            font-size: 20px;
          }

          .email {
            margin: 0 0 0 5px;
          }
        }

        &.filters {
          .list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
      }
    }
  }

  .footer {
    font-size: 10px;
    color: #c4c4c4;
    align-self: flex-start;
    margin-left: 40px;
  }
`;
