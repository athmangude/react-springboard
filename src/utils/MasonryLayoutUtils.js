export function getBlockWidth(current, xl = (1/3), lg=(1/2), md=(1/2), sm=(1), xs=(1)) {
  if (current) {
    const { columns } = current;
    const { clientWidth } = current.container;

    if (clientWidth <= 576) {
      // xs viewport
      return xs * columns;
    } else if (clientWidth <= 768) {
      // sm viewport
      return sm * columns;
    } else if (clientWidth <= 992) {
      // md viewport
      return md * columns;
    } else if (clientWidth <= 1200) {
      // lg viewport
      return lg * columns;
    } else {
      // xl viewport
      return xl * columns;
    }

    return columns;
  }

  return 1;
}
