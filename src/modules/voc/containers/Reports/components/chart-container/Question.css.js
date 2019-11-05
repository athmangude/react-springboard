export default ({ theme }) => `
  width: 100%;
  background-color: #ffffff;
  padding: 10px
  border-radius: 8px;
  box-shadow: 0 0 0px 2px ${theme.lightBorderColor};
  margin-bottom: 20px;
  margin-top: 10px;

  &:hover {
    box-shadow: 0 0 10px 2px ${theme.lightBorderColor};
  }

  .chart-container .card-action {
    color: #808285;
  }
  .chart-container .card-action:hover {
    color: #6d6e71;
    cursor: pointer;
  }

  .chart-container .drop-down-container .ui.pointing.dropdown > .menu {
    left: -60px;
    top: 60%;
  }

  .question-level {
    min-width: 50px;
    height: 50px;
    background-color: #f7f7f7;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-family: Lato;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.5px;
    text-align: center;
    color: #6d6e71;
    padding: 0 3px;
  }
`;
