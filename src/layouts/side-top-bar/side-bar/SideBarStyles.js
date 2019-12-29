/* eslint-disable no-nested-ternary */

export default function styles(props) {
  return `
    width: ${!props.canOpen ? '64px' : props.open || props.windowDimensions.width > 1440 ? '312px' : '64px'};
    height: calc(100vh - 64px);
    overflowY: auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;
    font-family: Avenir;
    position: ${props.open && props.windowDimensions.width < 1440 ? 'absolute' : 'relative'};
    top: 80;
    left: 0;
    box-shadow: ${props.open && props.windowDimensions.width < 1440 ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : 'none'};
    z-index: 1;
    background-color: #fff;

    .apps-container {
      width: 64px;
      height: 100%;

      .app-button {
        width: 100%;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        color: #181c20;

        &:hover {
          background-color: #edecec94;
          color: #4183c4ed;
        }

        &.active {
          background-color: #ececec;
          color: #4183C4;
        }
      }
    }

    .sidebar-actions-container {
      width: ${props.open || props.windowDimensions.width > 1440 ? 'calc(100% - 55px)' : '0px'};
      height: 100%;
      overflow: auto;
      background-color: #fff;
    }
  `;
}
