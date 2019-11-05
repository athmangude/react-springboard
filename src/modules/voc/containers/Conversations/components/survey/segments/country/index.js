import React from 'react';
// import PropTypes from 'prop-types';

import CountryPicker from 'SharedComponents/mwamba-country-picker';
import './index.css';

const Country = ({ countries, form, onChangeCountryChanged }) => (
    <div className="country-segment" style={{ width: '100%', display: 'flex', flexDirection: 'column', margin: '10px 0 30px', border: 'solid 2px #d9d9d9' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center', justifyContent: 'center', margin: '0px 0 0', flexWrap: 'wrap', marginBottom: 0 }}>
            <div className="country-dropdown" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                <CountryPicker
                    options={countries}
                    value={form.country}
                    large
                    onChange={onChangeCountryChanged}
                    style={{ height: 50, borderRadius: 0, margin: '0 !important', width: '100%', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }}
                    buttonStyle={{ height: 50, borderBottom: 0, marginLeft: 10 }}
                    optionStyle={{ top: 50 }}
                />
            </div>
        </div>
    </div>
);

export default Country;