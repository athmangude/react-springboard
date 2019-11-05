export default ({ theme }) => {
  return `
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .side-navigation-link {
      background-color: #fff;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-right: 10px;
      color: #000000de;
      padding: 10px;
      width: 100%;
      display: flex;
      height: 48px;
      align-items: center;
      justify-content: space-between;

      &:hover {
        background-color: #e8eaed;
        &.wide {
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
        }
      }

      &.active {
        background-color: ${theme.lightPrimaryColor};
        color: ${theme.primaryColor};
        font-weight: bold;
        &.wide {
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
        }
      }

      &.sublink {
        height: 30px !important;
        font-size: 13px;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;

        &:hover {
          background-color: rgba(232, 234, 237, 0.5);
        }

        &.active {
          background-color: rgba(232, 234, 237, 0.5);
        }
      }
    }
  `;
};
