import { stringToHexColor } from '../UtilFunctions';

export default (props) => {
  const colorMix = props.icon ? stringToHexColor(props.icon) : stringToHexColor(props.name);

  return `
    margin: 0 10px;
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background-color: ${colorMix.backgroundColor};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colorMix.color}
  `;
};
