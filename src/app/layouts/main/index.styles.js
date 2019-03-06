export default ({ theme }) => {
  console.log('[theme]', theme);
  return `
    aside.main {
      background-color: ${theme.primaryColor};
      height: 64px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: ${theme.primaryTextColor};
    }

    section.main {
      height: calc(100vh - 64px);
      width: 100%;
      overflow: auto;
      background-color: ${theme.neutralColor};
      color: ${theme.neutralTextColor};
    }
  `;
}
