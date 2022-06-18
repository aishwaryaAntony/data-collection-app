import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { Typography } from '@material-ui/core';

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props, name) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  let from = (parseInt(page) * parseInt(rowsPerPage)) + 1;
  let intermediate = (parseInt(page) + 1) * parseInt(rowsPerPage);
  let to = intermediate > count ? count : ((parseInt(page) + 1) * parseInt(rowsPerPage));
  // alert(JSON.stringify(props))

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }
  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon style={{color:'#2687C4'}} /> : <FirstPageIcon style={{color:'#2687C4'}} />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight  style={{ fontWeight: 'bold', color:'#2687C4' }} />
        ) : (
            <KeyboardArrowLeft style={{ fontWeight: 'bold', color:'#2687C4' }} />
          )}
      </IconButton>

      <Typography variant="caption" style={{ fontWeight: 'bold', color: "#F19536" }}>
        {count === 0
          ? `0 - ${to} of ${count}`
          : `${from} - ${to} of ${count}`
        }

      </Typography>

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft  style={{ fontWeight: 'bold', color:'#2687C4' }} />
        ) : (
            <KeyboardArrowRight  style={{ fontWeight: 'bold', color:'#2687C4' }} />
          )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon style={{color:'#2687C4'}} /> : <LastPageIcon style={{color:'#2687C4'}} />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

export default TablePaginationActions;
