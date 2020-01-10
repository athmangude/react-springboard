export default ({ theme }) => `
  background: #fff;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 10px;
  width: 100%;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  outline: none;


  &:hover {
    background-color: ${theme.palette.primary['100']};
    color: ${theme.palette.primary.dark};
    font-weight: bold;
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
  }

  &.active {
    background-color: ${theme.palette.primary['200']};
    color: ${theme.palette.primary.dark};
    font-weight: bold;
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
  }

  &.sublink {
    height: 30px !important;
    font-size: 13px;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;

    &:hover {
      background-color: rgba(232, 234, 237, 0.5);
    }

    &.active {
      background-color: rgba(232, 234, 237, 0.5);
    }
  }
`;
