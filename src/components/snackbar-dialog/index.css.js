export default ({ theme }) => {
  return `
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
        }

        .icon-container {
          margin: 0 5px 0 0;
        }
      }
    }
  `;
};