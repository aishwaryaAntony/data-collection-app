import React, { Component } from "react";
import { AppBar, Hidden } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { logout } from "../../../src/actions/userAction";
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from "redux";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from "prop-types";

const styles = theme => ({
  root: {
    flexGrow: 1,
    background: "linear-gradient(to right, #2687C4, #2A98CA, #2EAAD4, #32BCD9)",
    height: 55,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  flexGrow: {
    flexGrow: 1
  },

  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: "10",
    flexDirection: "row"
  },
  logoutText: {
    color: "#32BCD9",
    fontFamily: "unicode.futurab",
    fontSize: 13,
    fontWeight: "500"
  }
})

class ButtonAppBar extends Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
    }
  }


  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, className, onSidebarOpen, ...rest } = this.props;
    return (
      <div>
        <AppBar
          position="fixed"
          //   color="default"
          //   className={clsx(classes.root)}
          {...rest}
          color="default"
          className={clsx(classes.root, className)}
        >
          <Toolbar style={{ justifyContent: "space-between", }}>
            <Hidden lgUp>
              <IconButton
                color="whilte"
                onClick={onSidebarOpen}
              >
                <MenuIcon style={{ color: "#FFFFFF" }} />
              </IconButton>
            </Hidden>
            <Typography style={{ color: 'white' }}>
            </Typography>
            <Typography style={{ color: "#FFFFFF", fontFamily: "Futura-Heavy", fontSize: 20, marginLeft: window.innerWidth < 1000 ? 0 : 240, fontWeight: 'bold', textAlign: "center" }}>
              My ABA
            </Typography>
            <Button size="small" onClick={() => this.props.dispatch(logout(this))} variant="contained" className={classes.logoutButton} color="#FFFFFF">
              <Typography className={classes.logoutText}>
                Logout
              </Typography>

              <ExitToAppIcon style={{ color: "#32BCD9", marginLeft: "5px", width: 16, height: 16 }} />
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user
  }
}

ButtonAppBar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), connect(mapStateToProps))(ButtonAppBar);


