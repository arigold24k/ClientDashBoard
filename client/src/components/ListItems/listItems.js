import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CollectionsBookmarkOutlined from '@material-ui/icons/CollectionsBookmarkOutlined';
import BarChartIcon from '@material-ui/icons/BarChart';
import Icon from '@mdi/react'
import { mdiLogoutVariant } from '@mdi/js'



export const mainListItems = (homepage, inv_manag, report, signoutFunction) => (
    <div>
        <ListItem onClick={homepage} button>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem onClick={inv_manag} button>
            <ListItemIcon>
                <CollectionsBookmarkOutlined />
            </ListItemIcon>
            <ListItemText primary="Material" />
        </ListItem>
        <ListItem onClick={report} button>
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText  primary="Reports" />
        </ListItem>
        <ListItem onClick={signoutFunction}  button>
            <ListItemIcon>
                <Icon path={mdiLogoutVariant}
                      size={1.5}
                      horizontal
                      vertical
                      rotate={90}
                      color="#86af49"
                      spin/>
            </ListItemIcon>
            <ListItemText primary="Log Out" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Saved reports</ListSubheader>
        <ListItem button>
            <ListItemIcon>
                {/*<AssignmentIcon />*/}
            </ListItemIcon>
            <ListItemText primary="Current month" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                {/*<AssignmentIcon />*/}
            </ListItemIcon>
            <ListItemText primary="Last quarter" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                {/*<AssignmentIcon />*/}
            </ListItemIcon>
            <ListItemText primary="Year-end sale" />
        </ListItem>
    </div>
);


