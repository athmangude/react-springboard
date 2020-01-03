export default ({ theme }) => {
  return `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    >.editor-container {
      flex-grow: 1.5;
      display: flex;
      .editor {
        
      }
    }

    >.preview {
      flex-grow: 1;
      display: flex;
      border-left: solid 2px ${theme.palette.grey.A700};
      padding: 10px;
      height: 100%;
    }
  `;
};