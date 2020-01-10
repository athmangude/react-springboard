export default () => `
  .DateRangePickerInput {
    background-color: transparent;

    .DateInput {
      background-color: transparent;

      input {
        background-color: transparent;
      }
    }
  }

  .CalendarDay__selected {
    background: #002366 !important;
    border: none;
    border-radius: 50%;
  }

  .CalendarDay__default {
    border: none;

    &:hover {
      background-color: #ff5d60;
      border: none;
      color: #fff;
      border-radius: 50%;
    }
  }

  .CalendarDay__selected_span {
    background: #ff898b;
    border: none;
    border-radius: 50%;

    &:hover {
      background-color: #ff5d60;
      border: none;
      color: #fff;
      border-radius: 50%;
    }
  }

  .CalendarDay__hovered_span {
    background-color: #ff898b;
    border: none;
    color: #fff;
    border-radius: 50%;
  }

  .DateInput_input {
    border-bottom: solid 2px #808285;
  }

  .DateInput_input__focused {
    border-bottom: solid 2px #808285;
  }
`;
