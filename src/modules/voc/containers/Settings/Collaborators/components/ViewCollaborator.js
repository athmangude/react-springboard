import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

const ViewCollaborator = ({ collaborator, roles, onCloseSidePanel }) => {
  const role = roles.find((item) => item.id === collaborator.roleId) || {};
  const colorMix = stringToHexColor(`${collaborator.firstName} ${collaborator.lastName}`);
  return (
    <div style={{ width: '100%', backgroundColor: '#fff' }}>
      <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
        <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Collaborator Details</h2>
        <IconButton icon="close" onClick={onCloseSidePanel} />
      </div>
      <div style={{ padding: '0 10px 0 10px' }}>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
            <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(`${collaborator.firstName} ${collaborator.lastName}`)}</div>
            <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>
              {collaborator.firstName}
              &nbsp;
              {collaborator.lastName}
            </span>
          </div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>Status</div>
          <div>{collaborator.active ? (<span style={{ background: '#80c582', color: '#ffffff', padding: '2px 10px 3px 10px', borderRadius: 10 }}>Active</span>) : (<span style={{ background: '#002366', color: '#ffffff', padding: '2px 10px 3px 10px', borderRadius: 10 }}>Deactivated</span>)}</div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>Username</div>
          <div>{collaborator.username}</div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>E-Mail</div>
          <div>{collaborator.email}</div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>Role</div>
          <div>{role.name}</div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>Country</div>
          <div>{collaborator.country}</div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>Last Login</div>
          <div>{moment.utc(collaborator.lastLogin).local().fromNow()}</div>
        </div>
        <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '0 10px' }}>Create Date</div>
          <div>{moment.utc(collaborator.createDate).local().fromNow()}</div>
        </div>
      </div>
    </div>
  );
};

ViewCollaborator.propTypes = {
  collaborator: PropTypes.object,
  roles: PropTypes.array,
  onCloseSidePanel: PropTypes.func,
};

export default ViewCollaborator;
