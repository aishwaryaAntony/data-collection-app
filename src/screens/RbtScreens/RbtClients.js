import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from "redux";
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography, Grid, Button, Toolbar,
    TablePagination, TableContainer
} from '@material-ui/core';
import { fetchClients } from "../../actions/clientAction"
import { fetchAllAssignedStaffs } from "../../actions/userAction"
import TablePaginationActions from "../../ Components/TablePaginationActions";
import _ from 'underscore';

const styles = theme => ({
    textStyle: {
        fontSize: 20,
        fontFamily: "Futura-Heavy",
        color: "#2687C4",
        fontWeight: "bold",
    },
    creditTextStyle: {
        fontFamily: "Futura-Heavy",
        color: "#37474f",
        fontWeight: "bold",
        fontSize: 15,
        paddingTop: 10
    },
    cancelButton: {
        backgroundColor: "#8fa3ad",
        color: "white",
        fontFamily: "unicode.futurab",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        }
    },
    viewButton: {
        backgroundColor: "#2687C4",
        margin: 8,
        color: "white",
        fontFamily: "unicode.futurab",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        },

    },
    fontCellHeader: {
        fontFamily: "Futura-Book",
        color: "#fff",
        fontWeight: 900,
        padding: '14px 20px 14px 10px',

    },
    fontTableCellBody: {
        fontFamily: "Futura-Medium-bt",
        color: "#37474f",
        padding: '14px 20px 14px 10px',
    },
    inputStyle: {
        fontFamily: "Futura-Book",
        fontSize: 14
    },
    labelStyle: {
        fontFamily: "Futura-Book",
        fontSize: 14
    },
})

class RbtClients extends Component {
    constructor() {
        super();
        this.state = {
            clients: [],
            dialogOpen: false,
            rowsPerPage: 10,
            page: 0,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.clients !== state.clients) {
            return {
                clients: props.clients
            }
        }
        return null;
    }

    componentDidMount() {
        this.props.dispatch(fetchClients())
        this.props.dispatch(fetchAllAssignedStaffs());
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        });
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({
            page: 0, rowsPerPage: parseInt(event.target.value, 10)
        });
    }



    submitForViewClient = (item) => {
        this.props.history.push("/rbt/viewClients", { 'id': item.id })
    }
    render() {
        let user_id = JSON.parse(localStorage.getItem('user')).user_id
        let filteredClients = this.props.clients !== null && this.props.clients.length > 0 ? this.props.clients.filter((e) => e.userRole[0].role.name === "Client") : null
        let filteredAssignClients = this.props.assigned_all_staffs !== null && this.props.assigned_all_staffs.length > 0 ? this.props.assigned_all_staffs.filter((item) => (item.rbt_ref === user_id)) : null
        let rbtClients = []
        filteredAssignClients !== null && filteredAssignClients.map(item => {
            let clientObj = filteredClients !== null && filteredClients.find(e => e.id === item.client_id)
            rbtClients.push(clientObj)
            return rbtClients
        })

        const { classes } = this.props;
        return (
            <div style={{ margin: 5 }}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={12}>
                        <Toolbar style={{ justifyContent: "space-between", padding: "5px 20px 0px 0px" }}>
                            <Typography className={classes.textStyle} style={{ paddingLeft: 10 }}>Clients</Typography>
                            <TablePagination
                                rowsPerPageOptions={[20]}
                                component="div"
                                count={filteredClients !== null && filteredClients.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                labelRowsPerPage={null}
                                labelDisplayedRows={
                                    ({ from, to, count }) => null
                                }
                                ActionsComponent={
                                    TablePaginationActions
                                }
                            />
                        </Toolbar>
                    </Grid>
                    <Grid item xs={12} sm={12} style={{ backgroundColor: "#fff", borderRadius: 5, boxShadow: "0ppx 0px rgba(0, 0, 0, 0.2)", margin: 2 }}>
                        <TableContainer style={{ backgroundColor: '#f2f2f2' }}>
                            <Table>
                                <TableHead style={{ background: "linear-gradient(to right, #2687C4, #2A98CA, #2EAAD4, #32BCD9)" }}>
                                    <TableRow>
                                        <TableCell align="left" className={classes.fontCellHeader}>First Name</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeader}>Last Name</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeader}>User Name</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeader}>Actions</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        rbtClients.length > 0 ? (rbtClients.map((item) => (
                                            <TableRow key={item.id}>
                                                {_.isEmpty(item.userProfile) !== true && <TableCell align="left" className={classes.fontTableCellBody}>{item.userProfile.first_name}</TableCell>}
                                                {_.isEmpty(item.userProfile) !== true && <TableCell align="left" className={classes.fontTableCellBody}>{item.userProfile.last_name}</TableCell>}
                                                {_.isEmpty(item.userProfile) !== true && <TableCell align="left" className={classes.fontTableCellBody}>{item.userProfile.user_name}</TableCell>}
                                                <TableCell align="left" className={classes.fontTableCellBody}>
                                                    <Button size="small" className={classes.viewButton} onClick={() => this.submitForViewClient(item)}>View</Button>
                                                </TableCell>
                                            </TableRow>

                                        )
                                        ))
                                            :
                                            <TableCell colspan={4} style={{ textAlign: "center" }}>There are no clients </TableCell>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

            </div>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        clients: state.clientReducer.clients,
        assigned_all_staffs: state.userReducer.assigned_all_staffs
    }
}
RbtClients.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), connect(mapStateToProps))(RbtClients);