export default ({ theme }) => {
  return `
    display: flex;
    flex-direction: column;

    &.MuiSnackbarContent-root {
      display: flex;
      flex-direction: column !important;
      max-width: 300px;
      color: ${theme.palette.text.primary};
      background-color: ${theme.palette.background.paper};

      .snackbar-dialog-content {
        display: flex;

        .message-container {
          margin: 0 0 0 5px;
          display: flex;
          flex-direction: column;

          .title {
            font-size: 16px;
            margin-bottom: 10px;
          }

          .message {

          }

          .adornment-container {
            margin: 10px 0;
            background-color: ${theme.palette.grey['300']};
            padding: 10px;
          }
        }

        .icon-container {
          margin: 0 5px 0 0;
        }
      }
    }
  `;
};