export default function styles(props) {
  return `
    .sidebar-actions {
      // width: 100%;
      width: ${props.open || props.windowDimensions.width > 1440 ? '100%' : '68px'};
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;

      .action {
        color: #fff;
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        height: 64px;
        background-color: #fff;
        margin: 0;
        padding: 0;
        outline: none;

        &.active {
          background-color: #ececec;
        }

        &:hover {
          background-color: #edecec94;
        }

        .icon {
          height: 68px;
          width: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #2574a6;

          &:hover {
            background-color: #2574a6;
          }

          i {
            color: #fff;
            margin: 0;
            padding: 0;
          }
        }

        .link-text {
          color: #6d6e71;
          display: ${props.open || props.windowDimensions.width > 1440 ? 'flex' : 'none'};
          align-items: center;
          justify-content: space-between;
          padding: 0 10px 0 20px;
          height: 64px;
          font-size: 13px;
          font-weight: 500;
          width: 100%;

          .action-toggle {
            margin: 0;
            padding: 0;
            align-self: flex-end;
          }
        }
      }

      .sublinks {
        width: 100%;
        align-self: flex-end;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;

        .link {
          color: #6d6e71;
          font-size: 12px;
          padding: 10px 10px 10px 30px;
          width: 100%;

          &.active {
            background-color: #ececec;
          }

          &:hover {
            background-color: #ececec;
          }
        }
      }
    }
  `;
}
