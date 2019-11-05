/* eslint-disable jsx-a11y/href-no-hash */
export default () => {
  const triangleSize = 8;
  const stop1 = triangleSize * 1.42;
  const stop2 = triangleSize * 0.7;
  const stop1r = stop1 + 0.01;
  const stop2r = stop2 + 0.01;
  return `
    width: 100%;
    position: relative;
    .bottom-teared-container {
      background:
        linear-gradient(135deg, white ${stop2}px, transparent ${stop2r}px) bottom left,
        linear-gradient(45deg, transparent ${stop1}px, white ${stop1r}px) bottom left;
      background-repeat: repeat-x;
      background-size: ${triangleSize * 2}px ${triangleSize}px;
      padding: ${triangleSize}px 0;
      margin-bottom: 20px;
      margin-top: 10px;
      filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
      .teared-list {
        background-color: white;
      }
    }
    .top-teared-container {
      background: 
        linear-gradient(135deg, transparent ${stop1}px, white ${stop1r}px) top left,
        linear-gradient(45deg, white ${stop2}px, transparent ${stop2r}px) top left;
      background-repeat: repeat-x;
      background-size: ${triangleSize * 2}px ${triangleSize}px;
      padding: ${triangleSize}px 0;
      margin-bottom: 20px;
      margin-top: 10px;
      filter: drop-shadow(0px 0 2px rgba(0, 0, 0, 0.3));
      .teared-list {
        background-color: white;
      }
    }
  `;
};
