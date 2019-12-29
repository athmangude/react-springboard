import Color from 'color';

export default ({ theme, large, disabled, primary, secondary }) => {
  return `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: ${disabled ? theme.surfaceTextColor : primary ? theme.primaryTextColor : secondary ? theme.accentTextColor : theme.actionSurfaceTextColor};
    border-radius: ${large ? '27px' : '17.5px'};
    margin: 0px 5px;
    padding: ${large ? '15px' : '10px'};
    outline: none;
    cursor: pointer;
    // height: 35px;
    background-color: ${disabled ? theme.actionSurfaceDisabledColor : primary ? theme.primaryColor : secondary ? theme.accentColor : theme.surfaceColor};
    border: none;

    &:hover {
      background-color: ${disabled ? theme.actionSurfaceDisabledColor : primary ? Color(theme.primaryColor).darken(0.3) : secondary ? Color(theme.accentColor).darken(0.3) : Color(theme.surfaceColor).darken(0.02)};
      color: ${disabled ? theme.surfaceTextColor : primary ? theme.primaryTextColor : secondary ? theme.accentTextColor : theme.surfaceTextColor};
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
    }
  `;
};
