export default ({ theme }) => {
  return `
    width: 100%;
    position: relative;
    padding: 0 10px 10px;
    height: 100%;
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
  `;
};
