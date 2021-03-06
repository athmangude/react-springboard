export default () => `
  .action-button {
    background-color: none;

    &:hover {
      background-color: #d9d9d9 !important;
    }

    &:disabled {
      background-color: #d9d9d9 !important;

      &:hover {
        background-color: #d9d9d9 !important;
      }
    }
  }

  .action-button.primary {
    &:hover {
      background-color: #002366 !important;
      filter: brightness(90%);
    }

    &:disabled {
      background-color: #d9d9d9 !important;
    }
  }

  .action-button.cta:hover {
    transform: scale(1.05);
  }
`;
