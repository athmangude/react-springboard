export default () => `
  z-index: 99;
  .main {
    background: radial-gradient(circle at top right, #4a4f57, #bf2a2b) !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important;
    &:hover {
      background: radial-gradient(circle at bottom left, #4a4f57, #bf2a2b) !important;
    }
  }

  .popup {
    background-color: rgba(0, 0, 0, 0.4) !important;
  }

  .fab-action {
    background-color: #4a4f57 !important;
    border-radius: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 80px !important;
    width: 80px !important;
    color: #fff !important;
    z-index: 999 !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important;

    &:hover {
      background: radial-gradient(circle at top right, #4a4f57, #bf2a2b) !important;
      color: #fff !important;
    }

    &:focus {
      background: radial-gradient(circle at top right, #4a4f57, #bf2a2b) !important;
      color: #fff !important;
    }

    &:first-child {
      border-top-right-radius: 40px !important;
      border-top-left-radius: 40px !important;
    }

    &:last-child {
      border-bottom-right-radius: 40px !important;
      border-bottom-left-radius: 40px !important;
    }
  }
`;
