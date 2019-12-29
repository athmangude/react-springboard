export default ({ theme }) => `
  display: flex;
  flex-direction: row;
  border: none;
  border-bottom: solid 1px ${theme.primaryColor};
  position: relative;


  >input.text-input {
    padding: 10px 50px 10px 5px !important;
    border-radius: 0px;
    border: none !important;
    width: 100%;
  }

  >.adornment-container {
    margin: 5px;
    position: absolute;
    right: 0;
    bottom: 0px;
  }
`;
