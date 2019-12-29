export default () => `
  width: fit-content;
  position: relative;

  .tooltip-bubble {
    width: fit-content;
    height: fit-content;
    position: absolute;
    z-index: 10;
    &::after {
      content: '';
      position: absolute;
    }
  }

  .tooltip-top {
    bottom: 100%;
    left: 50%;
    padding-bottom: 9px;
    transform: translateX(-50%);

    &::after {
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 9px solid rgba(0,0,0,.7);
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .tooltip-bottom {
    top: 100%;
    left: 50%;
    padding-top: 9px;
    transform: translateX(-50%);

    &::after {
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid rgba(0,0,0,.7);
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .tooltip-left {
    top: 50%;
    right: 100%;
    padding-right: 9px;
    transform: translateY(-50%);

    &::after {
      border-left: 9px solid rgba(0,0,0,.7);
      border-top: 9px solid transparent;
      border-bottom: 9px solid transparent;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }

  .tooltip-right {
    top: 50%;
    left: 100%;
    padding-left: 9px;
    transform: translateY(-50%);

    &::after {
      border-right: 9px solid rgba(0,0,0,.7);
      border-top: 9px solid transparent;
      border-bottom: 9px solid transparent;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }

  .tooltip-message {
    background: rgba(0,0,0,.7);
    border-radius: 3px;
    color: #fff;
    font-size: .75rem;
    line-height: 1.4;
    padding: .75em;
    text-align: center;
  }
`;
