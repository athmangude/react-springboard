/* eslint-disable jsx-a11y/href-no-hash */
export default function actionDropDownStyles(props) {
  const {
    open, container, scrollLeft, parent, windowDimensions, position, top,
  } = props;

  const windowOffset = windowDimensions.width <= 1920 ? 0 : (windowDimensions.width - 1920) / 2;

  return `
    top: ${open ? '5px' : 0};
    align-self: ${open ? 'baseline' : 'unset'};
    .container {

      .menu-trigger {
        position: relative;
        top: ${open ? '10px' : 0};
      }

      .menu {
        box-shadow: ${open ? '0 0 3px 0px rgba(0, 0, 0, 0.3)' : 'none'};
        margin: 0 3px;
        z-index: ${open ? 1 : 0};
        width: fit-content;
        background-color: #fff;
        position: ${position || 'fixed'};
        top: ${top || 68}px;
        left: ${parent.current && container.current ? parent.current.offsetLeft + windowOffset + container.current.offsetLeft - scrollLeft : 0}px;
        transition: left 0.1s;
        border-radius: 8px;
        padding-bottom: 8px;
        max-height: 390px;
        overflow-y: auto;

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 3px;
          width: 100%;
          height: ${open ? '40px' : '100%'};
        }

        .options {
          .option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: row;
            padding: 10px;

            &:hover {
              background-color: #e8eaed;
              cursor: pointer;
            }
          }
        }
      }
    }
  `;
}
