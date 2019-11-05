/* eslint-disable jsx-a11y/href-no-hash */
export default ({ style }) => `
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow-x: scroll;
  overflow-y: visible;
  position: relative;
  ${style}

  .action-group {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: visible;
    height: 100%;

    &.nps-actions {
      max-width: calc(100% - 160px);
      min-width: fit-content;
      justify-content: flex-start;

      .label {
        text-transform: capitalize;
      }
    }

    &.filter-actions {
      width: 160px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
`;
