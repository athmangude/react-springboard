export default ({ theme, hoverColor, backgroundColor }) => {
  return `
    background-color: ${backgroundColor || 'transparent'};

    &:hover {
      background-color: ${hoverColor || theme.palette.grey['400']} !important;
    }
  `;
};
