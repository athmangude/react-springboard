export default ({ theme }) => `
  display: flex;
  align-items: row;
  width: 100%;
  flexWrap: wrap;

  button {
    background-color: ${theme.lightBorderColor} !important;
    // box-shadow: 0 0 0 2px ${theme.borderColor} !important;
    border: none !important;
    margin: 0 5px !important;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child {
      margin-left: 0px !important;
    }

    &:last-child {
      margin-right: 0px !important;
    }

    &.active {
      background-color: ${theme.lightPrimaryColor} !important;
      color: ${theme.primaryColor} !important;
      box-shadow: none !important;

      i {
        color: ${theme.primaryColor} !important;
      }
    }

    &:hover {
      color: ${theme.primaryColor} !important;

      i {
        color: ${theme.primaryColor} !important;
      }
    }

    i {
      color: #808285;
    }
  }
`;
