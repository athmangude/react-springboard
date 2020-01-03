export default ({ theme }) => {
  return `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    >.editor-container {
      flex-grow: 2;
      display: flex;
      height: 100%;
      .editor {
        height: 100% !important;
        width: 100% !important;
      }
    }

    >.preview {
      flex-grow: 0.5;
      display: flex;
      padding: 10px;
      height: 100%;
      box-shadow: -3px 0 3px ${theme.palette.grey['300']};
      overflow: auto;
    }
`;
};