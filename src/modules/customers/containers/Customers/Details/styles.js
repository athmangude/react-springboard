export default () => `
    width: 100%;
    padding: 10px;
    position: relative;

    .profile-summary {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // position: sticky;
      // top: 10px;

      .summary-data {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;

        .name {
          text-transform: capitalize;
          font-size: 14px;
        }
      }
    }
  `;
