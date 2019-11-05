export default ({ opacity }) => `
  width: 100%;
    
  .content {
    position: relative;
    width: 100%;
  }

  .blured-component {
    opacity: ${ opacity };
    background-color: rgba(255, 255, 255, 0.85);      
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;