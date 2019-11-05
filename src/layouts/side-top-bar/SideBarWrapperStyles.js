export default function styles(props) {
  return `
    width: 300px;
    display: ${props.activeApp.showActivityLog && props.windowDimensions.width > 1440 ? 'flex' : 'none'};
    height: calc(100% - 64px);
    overflow: auto;
    position: fixed;
    top: 64px;
    right: 0;
    box-shadow: 1px 3px 2px 0px rgba(0, 0, 0, 0.4);
    ::-webkit-scrollbar {
    display: none;
  }
  `;
}
