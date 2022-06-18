/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';



const defaultTheme = createMuiTheme();
const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    
  },
  button: {
    color: "#000",
    padding: '15px 15px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontFamily: "Futura-Book",
    //fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: "#6E83B7",
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: defaultTheme.spacing(2),   
  },
  active: {
    color: "#2B99CD",
    borderRadius: "0px",
    backgroundColor: "#E5F6FD",
    borderRight: '3px solid rgb(38, 135, 196)',    
    fontFamily: "Futura-Book",
    fontWeight: "bold",
    '& $icon': {
      color: "#2B99CD",
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));


export const SideBarNav = props => {
  const { pages, className, ...rest } = props;
    // console.log(JSON.stringify(pages))

  const classes = useStyles();

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        <ListItem
          className={classes.item}
          disableGutters
          key={page.title}
        >
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={page.href}
          >
            <div className={classes.icon}>{page.icon}</div>
            {page.title}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

SideBarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};


