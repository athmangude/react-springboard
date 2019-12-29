export default () => `
  position: fixed;
  bottom: 10px;
  left: 10px;
  background-color: #fff;

  button.help-launcher {
    border: none;
    background-color: #d9d9d9;
    height: 40px;
    width: 40px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;

    &:hover {
      background-color: #b6b6b6;
    }
  }

  .menu {
    width: fit-content;
    min-width: 150px;
    height: fit-content;
    min-height: 200px;
    position: absolute;
    left: 20px;
    bottom: 60px;
    box-shadow: 0 0 10px #e8eaed;
    border-radius: 8px;
    padding-bottom: 10px;
    background-color: #fff;

    hr {
      border: solid 1px #d9d9d9;
      border-top: none;
    }

    .labels {
      margin: 10px;
      color: #686868;
    }

    .menu-item {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      outline: none;
      border: none;

      &:hover {
        background-color: #e8eaed;
        color: inherit;
      }

      // &:first-child {
      //   border-top-right-radius: 8px;
      //   border-top-left-radius: 8px;
      // }

      &.mini {
        height: 30px;
        font-size: 12px;
        color: #686868;

        &:hover {
          color: inherit;
        }
      }
    }
  }
`;
