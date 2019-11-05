export default ({ style, blur }) => `
  width: 100%

  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(255, 255, 255);
    padding: 10px;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px;
    margin-bottom: 20px;
    margin-top: 10px;
    min-height: calc(100% - 20px);
    ${style}
  }

  .title {
    height: 18px;
    margin: 16px 0px 8px;
    color: rgb(74, 74, 74);
    font: 300 18px/14px Roboto, sans-serif;
    letter-spacing: 0px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .button-container {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }

  .content-container {
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
  }

  .graph-container {
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  .spinner-area {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center; 
  }

  .no-data-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 20px;
  }
`;