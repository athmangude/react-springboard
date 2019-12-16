export default () => `
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 5px;
  margin: 20px 0 10px;
  background-color: #fff;
  height: 20px;

  .nps-group {
    all: unset;
    height: 10px;

    &.detractors {
      background-color: #fd9681;
    }

    &.passives {
      background-color: #fcda6e;
    }

    &.promoters {
      background-color: #80c582
    }

    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    &:hover {
      height: 20px;
      cursor: pointer;
      transition: height 0.3s
    }
  }
`;
