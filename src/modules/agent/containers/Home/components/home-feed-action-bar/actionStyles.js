export default (props) => `
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 6px 0 0;
    outline: none;
    border-bottom: ${props.tab && props.active ? 'solid 3px #e23840' : 'none'};
    &:hover {
      cursor: pointer;
      border-bottom: ${props.tab && !props.active ? 'solid 3px #e23840b0' : props.tab && props.active ? 'solid 3px #e23840' : 'none'};
    }

    i {
      color: ${props.color}
    }

    &.nps {
      .label {
        margin: 0 10px;
      }
    }
  `;
