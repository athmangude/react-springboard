/* eslint-disable radix, no-extra-boolean-cast, no-nested-ternary, no-param-reassign, react/destructuring-assignment */

import React from "react";

import SimpleLayoutExtended from "Layouts/simple-layout-extended";

export default () => {
  return (
    <SimpleLayoutExtended>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <h1>Build something amazing!</h1>
      </div>
    </SimpleLayoutExtended>
  );
}
