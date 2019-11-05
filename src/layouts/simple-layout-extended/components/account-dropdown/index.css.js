import Color from 'color';

export default ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 5px;

  span.name {
    color: #181c20;
  }

  button {
    background-color: #2574a6;
    color: #fff;
    height: 40px;
    width: 40px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    just-comtent: center;
    margin: 0 10px;
    outline: none;
    border: none;

    &:hover {
      background-color: #3593cf;
    }
  }

  .account-brand-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &.on-premise {
      box-shadow: 0 0 0 1px ${theme.borderColor};
      border-radius: 6px;
      padding: 3px 7px;

      .brand-logo {
        height: 40px;
        margin: 0 10px 0 0;
      }

      &:hover {
        cursor: pointer;
        background-color: ${Color(theme.lightPrimaryColor).lighten(0.01)};
        box-shadow: 0 0 0 2px ${theme.lightPrimaryColor};
      }
    }
  }

  .avatar {
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    border: solid 1px #a1b1be;
    display: flex;
    align-items: center;
    justify-content: center;
    marrgin: 0 10px;

    &.on-premise {
      border: none;
      background-color: transparent;
    }
  }

  .user-name {
    font-family: Avenir;
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #181c20;
    margin: 0 10px;
  }

  .actions-container {
    position: absolute;
    top: 0;
    right: 0;
    // height: 200px;
    min-width: 220px;
    background-color: #fff;
    z-index: 1;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;

    .active-user {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-direction: row;
      padding: 10px;

      .user {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;

        .user-name, .profile-name {
          margin: 0;
        }
      }

      .logout-container {
        button {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          &.signout-button {
            background-color: ${theme.lightPrimaryColor} !important;
            color: ${theme.primaryColor} !important;

            &:hover {
              background-color: ${Color(theme.lightPrimaryColor).lighten(
    0.01,
  )} !important;
              color: ${Color(theme.primaryColor).darken(0.2)} !important;
              cursor: pointer;
            }
          }
        }
      }
    }

    .actions {
      width: 100%;

      .link {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background-color: #fff;
        color: #6d6e71;
        margin: 0;
        padding: 10px;
        cursor: pointer;

        &:hover {
          color: #6d6e71;
          background-color: #ececec;
          border-radius: 0;
        }
      }
    }

    div.divider {
      width: 100%
      display: flex;
      border-top: solid 1px #d9d9d9;
    }

    .accounts {
      width: 100%;
      max-height: 300px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 3px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      &::-webkit-scrollbar-thumb {
        background: #888;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      .account {
        width: 100%;
        height: 60px;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        margin: 0;
        padding: 10px;
        cursor: pointer;
        background-color: #fff;
        border-radius: 0;
        color: #6d6e71;

        &:hover {
          background-color: #ececec;
          cursor: pointer;
        }

        .avatar {
          width: 40px;
          min-width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
        }

        .profile-name {
          margin-left: 10px;
          text-align: left;
        }
      }
    }
  }
`;
