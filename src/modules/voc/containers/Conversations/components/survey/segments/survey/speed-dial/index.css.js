export default ({ theme }) => `
  position: fixed;
  bottom: 100px;
  right: 100px;
  z-index: 10;
  >button {
    background-color: ${theme.primaryColor};
    &:hover {
      background-color: ${theme.primaryColor};
    }
  }
  .speed-dial-action {
    background-color: #fff;
  }
`;
