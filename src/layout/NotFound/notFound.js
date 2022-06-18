import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
// import Logo from "../../assets/images/logo.png";
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
// import { unauthenticate } from "../../actions/sessionAction"
import { connect } from 'react-redux';
import { compose } from "redux";
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
});

class NotFound extends Component {
//   componentDidMount() {
//     this.props.dispatch(unauthenticate())
//   }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar
          color="default"
          style={{
            boxShadow: 'none',
            background: "linear-gradient(to right, #2687C4, #2A98CA, #2EAAD4, #32BCD9)"
          }}
        >
          <Toolbar>
            <RouterLink to="/">
            </RouterLink>
          </Toolbar>
        </AppBar>
        <Grid
          container
          justify="center"
          spacing={4}
        >
          <Grid
            item
            lg={8}
            xs={12}
          >
            <div className={classes.content}>
              <Typography variant="h5" style={{ fontFamily: "Futura-Heavy" }}>
                Your Session has Expired
                </Typography>
              <div style={{ height: 2 }}></div>
              <Typography variant="h8" style={{ fontFamily: "Futura-Book" }}>
                Please sign in to your Data Collection App account <Link variant="contained" color="primary" style={{ color: "#12bcdf", textTransform: "initial", fontFamily: "Futura-Heavy", textDecoration: "underline" }} href="/">go to home</Link>
              </Typography>
              <div style={{ height: 13 }}></div>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default compose(withStyles(styles), connect(null))(NotFound);
