export default ({ theme, hideBottomBorder }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;

    .tabs-control {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-diretion: row;
      width: 100%
      overflow-x: auto;
      border-bottom: ${hideBottomBorder ? 'none' : `solid 1px #e8eaed`};
      height: 64px;

      .tabs-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-diretion: row;
        height: 100%

        .tab {
          padding: 5px 15px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          &.active {
            border-bottom: solid 3px ${theme.primaryColor};
          }
        }
      }

      .right-control {
        height: 60px;
        width: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .tab-content-view {
      overflow: auto;
      height: calc(100% - 64px);
      width: 100%;
    }
  `;
