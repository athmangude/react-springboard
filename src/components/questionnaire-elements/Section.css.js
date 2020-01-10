export default ({ theme }) => {
  return `
  width: 100%;
  padding: 10px;
  .section-title-container {
    position: sticky;
    top: 0px;
    z-index: 2;
    background-color: ${theme.palette.background.paper};
    margin: -10px -10px 10px -10px;
    padding: 10px;
    box-shadow: 0 0 0 1px ${theme.palette.grey['300']};

    .section-title {
      background-color: ${theme.palette.primary['100']};
      color: ${theme.palette.primary.dark};
      padding: 10px;
      border-radius: 3px;
    }
  }

  &>.button-primary {
    margin: 10px 0 20px;
  }

  &>.divider {
    margin: 10px;
  }
`;
};
