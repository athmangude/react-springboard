import React from 'react';
import themes from 'SharedComponents/themes';
const { primaryColor, lightPrimaryColor } = themes.light;
const noData = require('Images/no_data.png');

const ErrorState = ({ image, text, style }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', ...style }}>
            <img src={image ? image : noData} />
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',width: '100%', margin: '20px 0px 20px 0px'}}>
                {text ? text : 'No data to display'}
            </div>
        </div>
    );
}

export default ErrorState;