export default ({ theme, hoverColor, backgroundColor }) => `
  background-color: ${backgroundColor || 'transparent'};

  &:hover {
    background-color: ${hoverColor || theme.palette.grey['400']} !important;
  }
`;
