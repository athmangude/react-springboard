export default function ({ isbottomsheetopen }) {
  return `
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
    z-index: 1;
    position: relative;
    position: fixed;
    bottom: 0;

    .bottom-navigation {
      height: ${isbottomsheetopen === 'true' ? 'fill-content' : '0px'};
      transition: height 0.3s;
      max-height: calc(100vh - 112px - 60px);
      overflow: auto;
      width: 100%;
      position: absolute;
      bottom: 48px;
      background-color: #fff;
      box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: start;
      justify-content: start;
      flex-direction: column;

      .sublink {
        background-color: #fff;
        padding: 10px;
        cursor: pointer;
        color: #000000de;
        width: 100%;

        &.active {
          background-color: #e8eaed;
        }

        &:hover {
          background-color: #e8eaed;
        }
      }
    }

    .action {
      height: 100%;
      padding: 0 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      flex-grow: 1;
      color: #808285;

      i.material-icons {
        font-size: 20px;
        transition: transform 0.3s;
      }

      small.label {
        font-size: 60%;
        transition: font-size 0.3s;
      }

      &.active {
        color: #33597f;

        i.material-icons {
          transform: scale(1.3);
          color: #33597f;
        }

        small.label {
          font-size: 80%;
        }
      }

      &:hover {
        i.material-icons {
          transform: scale(1.3);
          transition: transform 0.3s;
        }

        small.label {
          font-size: 80%;
        }
      }
    }
  `;
}
