import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from "redux";
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography, Grid, Button, Dialog, DialogActions, Toolbar,
    DialogContent, DialogTitle, TextField, InputAdornment, IconButton, TablePagination, TableContainer
} from '@material-ui/core';
import { fetchClients, addClients, updateClient } from "../../actions/clientAction"
import { FiEye, FiEyeOff } from "react-icons/fi";
import TablePaginationActions from "../../ Components/TablePaginationActions";

const styles = theme => ({
    textStyle: {
        fontSize: 20,
        fontFamily: "Futura-Heavy",
        color: "#2687C4",
        fontWeight: "bold",
    },
    creditTextStyle: {
        color: "#37474f",
        fontWeight: "bold",
        fontSize: 15,
        paddingTop: 10
    },
    addButton: {
        backgroundColor: "#2B99CD",
        color: "white",
        fontFamily: "unicode.futurab",
        borderRadius: "10",
    },
    cancelButton: {
        backgroundColor: "#8fa3ad",
        color: "white",
        fontFamily: "unicode.futurab",
        // textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        }
    },
    editButton: {
        backgroundColor: "#8fa3ad",
        margin: 2,
        color: "white",
        fontFamily: "unicode.futurab",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        }
    },
    viewButton: {
        backgroundColor: "#2687C4",
        margin: 2,
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
        fontWeight: 700,
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

class Client extends Component {
    constructor() {
        super();
        this.state = {
            clients: [
            ],
            dialogOpen: false,
            id: null,
            user_type: "",
            user_type_error: false,
            first_name: "",
            first_name_error: false,
            last_name: "",
            last_name_error: false,
            user_name: "",
            user_name_error: false,
            password: "",
            password_error: false,
            confirm_password: "",
            confirm_password_error: false,
            mode: "",
            user_profile_id: null,
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

    handleClick = (item, mode) => {
        if (mode === "ADD") {
            this.setState({ mode: mode, dialogOpen: true })
        }
        else {
            this.setState({
                id: item.id,
                user_profile_id: item.userProfile.id,
                dialogOpen: true,
                mode: mode,
                first_name: item.userProfile.first_name,
                first_name_error: false,
                last_name: item.userProfile.last_name,
                last_name_error: false
            })
        }
    }

    handleClose = () => {
        this.setState({
            dialogOpen: false,
            id: null,
            user_type: "",
            user_type_error: false,
            first_name: "",
            first_name_error: false,
            last_name: "",
            last_name_error: false,
            user_name: "",
            user_name_error: false,
            password: "",
            password_error: false,
            confirm_password: "",
            confirm_password_error: false,
            //mode: ""
        })
    }



    handleSubmit = (mode) => {

        let { user_profile_id, first_name, last_name, user_name, password, confirm_password } = this.state

        let isError = false;
        if (mode === "ADD") {
            if (first_name === "" || first_name === null) {
                this.setState({ first_name_error: true })
                isError = true;
            }

            if (last_name === "" || last_name === null) {
                this.setState({ last_name_error: true })
                isError = true;
            }
            if (user_name === "" || user_name === null) {
                this.setState({ user_name_error: true })
                isError = true;
            }
            if (password === "" || password === null) {
                this.setState({ password_error: true })
                isError = true;
            }
            if (confirm_password === "" || confirm_password === null) {
                this.setState({ confirm_password_error: true })
                isError = true;
            }
        } else {
            if (first_name === "" || first_name === null) {
                this.setState({ first_name_error: true })
                isError = true;
            }

            if (last_name === "" || last_name === null) {
                this.setState({ last_name_error: true })
                isError = true;
            }
        }


        if (isError === false) {
            if (mode === "ADD") {
                let clientObj = {};
                clientObj.id = this.props.clients.length + 1
                clientObj.first_name = first_name;
                clientObj.last_name = last_name;
                clientObj.user_name = user_name;
                clientObj.password = password;
                clientObj.user_type = "CLT";
                this.props.dispatch(addClients(this, clientObj))
            }
            else {
                let clientProfile = {}
                clientProfile.user_profile_id = user_profile_id;
                clientProfile.first_name = first_name;
                clientProfile.last_name = last_name;
                this.props.dispatch(updateClient(this, clientProfile, user_profile_id))
            }
        }
    }


    submitForViewClient = (item) => {
        this.props.history.push("/viewClient", { 'id': item.id })
    }
    render() {
        let filteredClients = this.props.clients !== null && this.props.clients.length > 0 ? this.props.clients.filter((e) => e.userRole[0].role.name === "Client") : null
        const { classes } = this.props;
        return (
            <div style={{ padding: "0px 20px 0px 20px", backgroundColor: "F6F8FB" }}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={12}>
                        <Toolbar style={{ justifyContent: "space-between", padding: "5px 20px 0px 0px" }}>
                            <Typography className={classes.textStyle}>Clients</Typography>
                            {/* </Grid> */}
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
                            {/* <Grid item xs={12} sm={3} style={{ float: 'left' }}> */}
                            <Button size="small" variant="contained" color="primary" className={classes.addButton} onClick={() => this.handleClick(null, "ADD")} >
                                Add
                            </Button>
                        </Toolbar>
                    </Grid>
                    <Grid item xs={12} sm={12} style={{ backgroundColor: "#fff", borderRadius: 5, boxShadow: "0ppx 0px rgba(0, 0, 0, 0.2)" }}>
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
                                        filteredClients !== null && filteredClients.length > 0 ? (filteredClients.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell align="left" className={classes.fontTableCellBody}>{item.userProfile.first_name}</TableCell>
                                                <TableCell align="left" className={classes.fontTableCellBody}>{item.userProfile.last_name}</TableCell>
                                                <TableCell align="left" className={classes.fontTableCellBody}>{item.userProfile.user_name}</TableCell>
                                                <TableCell align="left" className={classes.fontTableCellBody}>
                                                    {/* <IconButton onClick={() => this.handleClick(item, "EDIT")}><img src={Edit} height="20" alt="icon" /></IconButton > */}
                                                    <Button size="small" className={classes.editButton} onClick={() => this.handleClick(item, "EDIT")}>Edit</Button>
                                                    <Button size="small" className={classes.viewButton} onClick={() => this.submitForViewClient(item)}>View</Button>
                                                </TableCell>
                                            </TableRow>)
                                        ))
                                            :
                                            <TableCell colspan={4} style={{ textAlign: "center" }}>There are no clients </TableCell>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <Dialog
                    maxWidth={"sm"}
                    open={this.state.dialogOpen}>
                    <DialogTitle id="form-dialog-title">
                        <Typography style={{ padding: "2% 5% 0 5%", fontFamily: "Futura-Heavy" }}>{this.state.mode === "ADD" ? "Add Client" : "Update Client"}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ overflowY: "hidden" }}>
                        <Grid container justify="space-between" style={{ marginTop: -20, padding: "2% 5% 0 5%" }}>
                            {/* <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="user_type"
                                    select
                                    label="User Type"
                                    name="user_type"
                                    value={this.state.user_type}
                                 onChange={this.handleUserTypeChange}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    required
                                    fullWidth
                                     error={this.state.user_type_error === true ? true : false}
                                   helperText={this.state.user_type_error === true ? "Please select User Type" : false}
                                >
            
                                        <MenuItem key={"ADM"} value={"ADM"}>
                                        {"Admin"}
                                        </MenuItem>
                                        <MenuItem key={"CMR"} value={"CMR"}>
                                        {"Case Manager"}
                                        </MenuItem>
                                  
                                </TextField>
                            </Grid> */}
                            <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="name"
                                    label="First Name"
                                    name="name"
                                    className={classes.margin}
                                    value={this.state.first_name}
                                    onChange={(event) => this.setState({ first_name: event.target.value, first_name_error: false })}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    fullWidth
                                    error={this.state.first_name_error === true ? true : false}
                                    helperText={this.state.first_name_error === true ? "Please enter firstname" : false}
                                />
                            </Grid>
                            <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="code"
                                    label="Last Name"
                                    name="code"
                                    // disabled={this.state.mode === "EDIT" ? true : false}
                                    className={classes.margin}
                                    value={this.state.last_name}
                                    onChange={(event) => this.setState({ last_name: event.target.value, last_name_error: false })}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    fullWidth
                                    error={this.state.last_name_error === true ? true : false}
                                    helperText={this.state.last_name_error === true ? "Please enter lastname" : false}
                                />
                            </Grid>
                            {this.state.mode !== "EDIT" && < Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField

                                    id="code"
                                    label="User Name"
                                    name="code"
                                    // disabled={this.state.mode === "EDIT" ? true : false}
                                    className={classes.margin}
                                    value={this.state.user_name}
                                    onChange={(event) => this.setState({ user_name: event.target.value, user_name_error: false })}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    fullWidth
                                    error={this.state.user_name_error === true ? true : false}
                                    helperText={this.state.user_name_error === true ? "Please enter username" : false}
                                />
                            </Grid>}
                            {this.state.mode !== "EDIT" && <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="code"
                                    label="Password"
                                    name="code"
                                    type={this.state.passwordVisible ? 'text' : 'password'}
                                    // disabled={this.state.mode === "EDIT" ? true : false}
                                    className={classes.margin}
                                    value={this.state.password}
                                    onChange={(event) => this.setState({ password: event.target.value, password_error: false })}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle, underline: classes.underline, root: classes.inputRoot },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => this.setState({ passwordVisible: !this.state.passwordVisible })}
                                                >
                                                    {this.state.passwordVisible ? <FiEye size={20} color="#6E8CA8" /> : <FiEyeOff size={20} color="#6E8CA8" />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    fullWidth
                                    error={this.state.password_error === true ? true : false}
                                    helperText={this.state.password_error === true ? "Please enter password" : false}
                                />
                            </Grid>}
                            {this.state.mode !== "EDIT" && <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="code"
                                    label="Confirm Password"
                                    name="code"
                                    // disabled={this.state.mode === "EDIT" ? true : false}
                                    type="password"
                                    className={classes.margin}
                                    value={this.state.confirm_password}
                                    onChange={(event) => this.setState({ confirm_password: event.target.value, confirm_password_error: false })}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    fullWidth
                                    error={this.state.confirm_password_error === true ? true : false}
                                    helperText={this.state.confirm_password_error === true ? "Please enter confirm password" : false}
                                />
                            </Grid>}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={() => this.handleSubmit(this.state.mode)} variant="contained" color="primary" className={classes.addButton}>Submit</Button>
                        <Button size="small" onClick={() => this.handleClose()} variant="contained" color="secondary" className={classes.cancelButton}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        clients: state.clientReducer.clients
    }
}
Client.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), connect(mapStateToProps))(Client);