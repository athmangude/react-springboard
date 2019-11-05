export default ({ theme }) => {
  return `
    aside.main {
      background-color: ${theme.surfaceColor};
      height: 64px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: ${theme.surfaceTextColor};
    }

    section.main {
      width: 100%;
      overflow: auto;
      background-color: ${theme.surfaceColor};
      color: ${theme.surfaceTextColor};
    }

    // button {
    //   border: none;
    //   background-color: transparent;
    //   outline: none;
    // }

    // input {
    //   border: none;
    // }
  `;
}
