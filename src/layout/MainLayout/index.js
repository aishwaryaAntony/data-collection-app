import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TopBar from "../../layout-components/TopBar"
import Sidebar from "../../layout-components/SideBar";
import Snackbar from '@material-ui/core/Snackbar';
import { ALERT_DETAIL } from '../../actions/actionTypes'
import Alert from '@material-ui/lab/Alert';
import { compose } from "redux";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useState } from 'react';
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    paddingTop: 56,
    [MyComponent()]: {
      paddingTop: 56,
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  },

}));

function MyComponent() {
  const theme = useTheme();
  const matches = theme.breakpoints.up('sm');
  return matches;
}

const Main = props => {

  const { children, openAlert, alertSeverity, alertMessage, } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [openSidebar, setOpenSidebar] = useState(false);


  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div>
      <TopBar onSidebarOpen={handleSidebarOpen} />

      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop
        })}
      >
        <Snackbar
          open={openAlert}
          onClose={() => props.dispatch({ type: ALERT_DETAIL, data: false, message: "", severity: "" })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={3000} >
          <Alert icon={false} variant="filled" severity={alertSeverity} >{alertMessage}</Alert>
        </Snackbar>

        <Sidebar
          onClose={handleSidebarClose}
          open={shouldOpenSidebar}
          variant={isDesktop ? 'persistent' : 'temporary'}
        />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};





const mapStateToProps = (state) => {
  return {
    openAlert: state.userReducer.openAlert,
    alertSeverity: state.userReducer.alertSeverity,
    alertMessage: state.userReducer.alertMessage
  };
};

Main.propTypes = {
  children: PropTypes.node,
};

export default compose(connect(mapStateToProps))(Main);