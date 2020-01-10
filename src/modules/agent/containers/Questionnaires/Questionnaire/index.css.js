export default ({ theme }) => {
  return `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    position: relative;
    overflow: auto;

    &>.questionnaire-title {
      margin-top: 10px;
    }

    &>.section-container {
      .section-title {
        background-color: ${theme.palette.primary['100']};
        color: ${theme.palette.primary.dark};
        padding: 10px;
        border-radius: 3px;
        position: sticky;
        top: -10px;
        z-index: 2;
      }
    }

    >.editor-container {
      flex-grow: 2;
      display: flex;
      height: 100%;
      flex-direction: column;
      .editor {
        height: calc(100% - 50px) !important;
        width: 100% !important;
      }
      .editor-controls {
        height: 50px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &>.button {
          margin: 0 10px;
        }
      }
    }

    >.preview {
      
    }
`;
};