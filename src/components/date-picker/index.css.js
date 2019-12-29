export default () => {
  return `
    .container {
      max-width: 360px;
      max-height: 480px;
    }

    .flex-row {
      display: flex;
      flex-direction: row;
    }

    .flex-col {
      display: flex;
      flex-direction: column;
    }

    .flex-1 {
      flex: 1;
    }

    .flex-2 {
      flex: 2;
    }

    .flex-3 {
      flex: 3;
    }

    .flex-4 {
      flex: 4;
    }

    .flex-5 {
      flex: 5;
    }

    .flex-6 {
      flex: 6;
    }

    .flex-7 {
      flex: 7;
    }

    .flex-8 {
      flex: 8;
    }

    .flex-9 {
      flex: 9;
    }

    .flex-10 {
      flex: 10;
    }

    .flex-11 {
      flex: 11;
    }

    .flex-12 {
      flex: 12;
    }

    .center {
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .header {
      width: 100%;
      min-width: 350px;
      background-color: #336699;
      padding: 60px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .header-month {
      font-size: 1.8em;
      font-weight: lighter;
    }

    .header-day {
      font-size: 4em;
      font-weight: bold;
    }

    .padding {
      padding: 10px;
    }

    .month {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0px 20px 0px;
    }

    .month-title {
      text-align: center;
      flex: 4;
    }

    .month-year {
      font-size: 0.8em;
      color: #aaa;
    }

    .month-arrow-left {
      flex: 1;
      width: 24px;
      height: 24px;
    }

    .month-arrow-right {
      width: 24px;
      height: 24px;
      flex: 1;
    }

    .footer {
      width: 100%;
      /* min-width: 400px; */
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: row wrap;
      text-align: center;
      cursor: default;
    }

    .noselect {
      -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
         -khtml-user-select: none; /* Konqueror */
           -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none;
    }

    .day-headers {
      flex-basis: 14%;
      justify-content: center;
      align-items: center;
      /* padding: 8px 0px 8px 0px; */
      font-weight: bold;
    }


    .day {
      flex-basis: 14%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      /* padding: 8px 0px 8px 0px; */
      position: relative;
      width: 50px;
      height: 50px;
    }

    .day, p {
      /* padding-left: 8px; */
      /* padding-right: 8px; */
    }

    .current {
      position: absolute;
      top: calc(50% - 15px);
      left: calc(50% - 15px);
      border: 2px solid #336699;
      border-radius: 15px;
      width: 30px;
      height: 30px;
      z-index: -80;
    }

    .selected {
      position: absolute;
      top: calc(50% - 15px);
      left: calc(50% - 15px);
      background-color: #336699;
      border-radius: 15px;
      width: 30px;
      height: 30px;
      z-index: -100;
    }


    .non-current {
      opacity: 0.2;
    }
  `;
}
