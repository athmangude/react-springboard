import Color from 'color';

export default ({ theme, color, backgroundColor, size }) => `
  background-color: ${backgroundColor ? backgroundColor : theme.surfaceColor} !important;
  color: ${color ? color : theme.primaryColor} !important;
  margin: 0;
  padding: 0;
  width: ${size === 'large' ? '40px' : size === 'medium' ? '30px' : size === 'small' ? '20px' : '40px'};
  height: ${size === 'large' ? '40px' : size === 'medium' ? '30px' : size === 'small' ? '20px' : '40px'};
  border-radius: ${size === 'large' ? '20px' : size === 'medium' ? '15px' : size === 'small' ? '10px' : '20px'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0 3px;
  border: solid 2px ${theme.borderColor};
  outline: none;

  i.material-icons {
    color: ${color ? color : theme.primaryColor} !important;
    font-weight: bold;
    margin: 0 !important;
    padding: 0 !important;
    font-size: ${size === 'large' ? '20px' : size === 'medium' ? '15px' : size === 'small' ? '10px' : '20px'};
    position: unset !important;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 3px #d9d9d9;
    border: none;
    background-color: ${Color(theme.surfaceColor).darken(0.2)} !important;
  }

  &.primary {
    &:hover {
      filter: brightness(90%);
      transform: scale(1.1);
    }
  }
`;

// .circular-button.cta:hover {
//   transform: scale(1.05);
// }
