import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from "redux";
import {
    Typography, Grid, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, MenuItem, Toolbar, TableContainer, Paper
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker
} from '@material-ui/pickers';
import Card from '@material-ui/core/Card';
import { fetchClients, assignProgram, assignStaffForClient, assignScheduleForClient, reScheduleForClient } from '../../actions/clientAction'
import { fetchPrograms, fetchProgramsByCientID } from '../../actions/programAction'
import { fetchStaffsByCientID, fetchSchedulesByCientID } from '../../actions/userAction';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popover from '@material-ui/core/Popover';
import EventIcon from '@material-ui/icons/Event';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import _ from 'underscore';

const localizer = momentLocalizer(moment);

const styles = theme => ({
    headerTextStyle: {
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
    addButton: {
        margin: 2,
        backgroundColor: "#2EAAD4",
        color: "white",
        textTransform: 'none',
        borderRadius: "10",
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
    fontCellHeader: {
        fontFamily: "Futura-Book",
        color: "#78909c",
        fontWeight: 900,
        padding: '14px 20px 14px 0px',
    },
    fontTableCellBody: {
        fontFamily: "Futura-Medium-bt",
        color: "#37474f",
        padding: '14px 20px 14px 0px',
    },
    inputStyle: {
        fontSize: 14,
        width: 200
    },
    labelStyle: {

        fontSize: 14
    },
    card: {
        backgroundColor: '#f2f2f2',
        minWidth: 100,
        marginTop: 15,
        borderRadius: 1
    },
    gridRow: {
        direction: "row"
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
    textStyle: {
        fontFamily: "Futura-Heavy",
        color: "#37474f",
        fontWeight: "bold",
        fontSize: 15,
        padding: 5
    },
    cardText: {
        fontFamily: "Futura-Heavy",
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },
    viewButton: {
        backgroundColor: "#2EAAD4",
        margin: 8,
        color: "white",
        fontFamily: "unicode.futurab",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        },
    },
    eventDiv: {
        backgroundColor: "#ff"
    },
    eventTitleView: {
        display: 'flex',
        background: "linear-gradient(to right, #2687C4, #2A98CA, #2EAAD4, #32BCD9)",
        top: 0,
        padding: "20px",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    eventTitle: {
        fontSize: 20,
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
        fontFamily: "Futura-Heavy",
    },
    eventNameRow: {
        display: 'flex',
        flexDirection: "row",
        padding: "10px 0px 10px 0px"
    },
    eventNameText: {
        fontSize: 15,
        marginLeft: 15,
        fontFamily: "Futura-Heavy",
    },
    popoverPaper: {
        display: 'flex',
        flexDirection: 'column',
        width: "25%"
    },
    eventCancelButton: {
        backgroundColor: "#8fa3ad",
        color: "white",
        fontFamily: "unicode.futurab",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        },
        alignItems: "flex-end",
        paadingBottom: 20
    },
    scheduleTitleText: {
        color: "#2687C4",
        fontFamily: "Futura-Heavy",
        fontWeight: "600",
        fontSize: 18,
        padding: 10,
        marginBottom: 10
    }
})

class ViewClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client_id: parseInt(props.location.state.id),
            assigned_by_id: null,
            program_id: null,
            program_id_error: false,
            program_name: "",
            status: "",
            staff_role_type: "",
            staff_role_type_error: false,
            staff_name_error: false,
            staff_id: null,
            staff_id_error: false,
            dialogOpen: false,
            dialogOpenForStaff: false,
            dialogOpenForSchedule: false,
            mode: "",
            date: "",
            date_error: false,
            day: "",
            session_start_time: "",
            session_start_time_error: false,
            session_end_time: "",
            session_end_time_error: false,
            invalid_session_end_time_error: null,
            rbt_name: "",
            rbt_id_error: false,
            rbt_id: null,
            rbt_ref: null,
            rbt_ref_error: false,
            viewEventModal: false,
            popoverId: null,
            anchorEl: null,
            events: null,
            viewAllEventModal: false,
            allEvents: null,
            note: "",
            schedule_id: null,
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchClients())
        this.props.dispatch(fetchPrograms())
        this.props.dispatch(fetchProgramsByCientID(this.props.location.state.id, this))
        this.props.dispatch(fetchStaffsByCientID(this.props.location.state.id, this))
        this.props.dispatch(fetchSchedulesByCientID(this.props.location.state.id, this))
    }
    assignProgram = (mode) => {
        if (mode === "ADD") {
            this.setState({ mode: mode, dialogOpen: true })
        }
        else {
            this.setState({
                dialogOpen: true,
                mode: mode,
            })
        }
    }
    assignRbt = (mode) => {
        if (mode === "ADD") {
            this.setState({ mode: mode, dialogOpenForStaff: true })
        }
        else {
            this.setState({
                dialogOpenForStaff: true,
                mode: mode,
            })
        }
    }

    submitForAssignProgram = () => {
        let { client_id, program_id, note, mode } = this.state
        let user_id = JSON.parse(localStorage.getItem('user')).user_id
        let isError = false;
        if (program_id === "" || program_id === null) {
            this.setState({ program_id_error: true })
            isError = true;
        }
        if (isError === false) {
            let assignedProgramObj = {};
            assignedProgramObj.client_id = client_id
            assignedProgramObj.program_id = program_id
            assignedProgramObj.assigned_by_id = user_id
            assignedProgramObj.note = note
            assignedProgramObj.status = "ACTIVE"
            if (mode === "ADD") {
                this.props.dispatch(assignProgram(this, assignedProgramObj))
            }
        }
    }

    shedule = (mode, item) => {
        if (mode === "ADD") {
            this.setState({ mode: mode, dialogOpenForSchedule: true })
        }
        else {
            this.setState({
                viewEventModal: false,
                viewAllEventModal: false,
                dialogOpenForSchedule: true,
                mode: mode,
                schedule_id: item.id,
                date: moment(item.date).format("MM-DD-YYYY"),
                date_error: false,
                invalid_date_error: false,
                day: moment(item.date).format('dddd'),
                client_id: item.client_id,
                rbt_id: item.rbt_id,
                schedule_by_id: item.schedule_by_id,
                session_start_time: moment(item.session_start_time, "hh:mm A"),
                session_start_time_error: false,
                session_end_time: moment(item.session_end_time, "hh:mm A"),
                session_end_time_error: false,
                status: "ACTIVE"
            })
        }
    }

    cancelForAssignProgram = () => {
        this.setState({
            dialogOpen: false,
            dialogOpenForStaff: false,
            dialogOpenForSchedule: false,
            id: null,
            date: "",
            date_error: false,
            session_start_time: "",
            session_start_time_error: false,
            session_end_time: "",
            session_end_time_error: false,
            rbt_id: "",
            rbt_id_error: false,
            rbt_ref: "",
            rbt_ref_error: false,
            program_id: "",
            staff_role_type: "",
            staff_role_type_error: false,
            staff_id: "",
            staff_id_error: false,
            program_id_error: false,
            note: "",
            schedule_id: null
        }

        )
    }

    submitForAssignRbt = () => {
        let { date, client_id, rbt_ref, mode } = this.state
        let user_id = JSON.parse(localStorage.getItem('user')).user_id
        let isError = false;
        // if (date === null || date === "") {
        //     this.setState({ date_error: true })
        //     isError = true
        // } else {
        //     let today = moment().format("YYYY-MM-DD")
        //     let selectDate = moment(date).format("YYYY-MM-DD")

        //     if (selectDate === "Invalid date" || moment(selectDate).isBefore(today, "day")) {
        //         this.setState({ invalid_date_error: true })
        //         isError = true
        //     }
        // }
        if (rbt_ref === "" || rbt_ref === null) {
            this.setState({ rbt_ref_error: true })
            isError = true;
        }
        if (isError === false) {
            let assignedProgramObj = {};
            assignedProgramObj.date = moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD 00:00');
            assignedProgramObj.client_id = client_id
            assignedProgramObj.staff_ref = rbt_ref
            assignedProgramObj.assigned_by_id = user_id
            assignedProgramObj.status = "ACTIVE"
            assignedProgramObj.role_code = "RBT"
            if (mode === "ADD") {
                this.props.dispatch(assignStaffForClient(this, assignedProgramObj))
            }
        }
    }

    submitForSchedule = () => {
        let { date, client_id, rbt_id, session_start_time, session_end_time, mode } = this.state
        let user_id = JSON.parse(localStorage.getItem('user')).user_id
        let isError = false;
        if (date === null || date === "") {
            this.setState({ date_error: true })
            isError = true
        }
        // else {
        //     let today = moment().format("YYYY-MM-DD")
        //     let selectDate = moment(date).format("YYYY-MM-DD")

        //     if (selectDate === "Invalid date" || moment(selectDate).isAfter(today, "day")) {
        //         this.setState({ date_error: true })
        //         isError = true
        //     }
        // }
        if (session_start_time === "" || session_start_time === null) {
            this.setState({ session_start_time_error: true })
            isError = true;
        }
        if (session_end_time === "" || session_end_time === null) {
            this.setState({ session_end_time_error: true, invalid_session_end_time_error: "Please enter Session End Time" })
            isError = true;
        }

        if (session_start_time >= session_end_time) {
            this.setState({ session_end_time_error: true, invalid_session_end_time_error: "Invalid Session End Time" })
            isError = true
        }

        if (rbt_id === "" || rbt_id === null) {
            this.setState({ rbt_id_error: true })
            isError = true;
        }
        if (isError === false) {
            let sheduleObj = {};
            sheduleObj.date = moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD 00:00');
            sheduleObj.day = moment(date).format('dddd');
            sheduleObj.client_id = client_id
            sheduleObj.rbt_id = rbt_id
            sheduleObj.schedule_by_id = user_id
            sheduleObj.session_start_time = moment(session_start_time).format('hh:mm A');
            sheduleObj.session_end_time = moment(session_end_time).format('hh:mm A');
            sheduleObj.status = "ACTIVE"
            if (mode === "ADD") {
                this.props.dispatch(assignScheduleForClient(this, sheduleObj))
            }
            else {
                this.props.dispatch(reScheduleForClient(this, sheduleObj))
            }
        }
    }

    handleProgram = (event) => {
        this.setState({ program_id: parseInt(event.target.value), isClear: true, program_id_error: false });
    }

    handleStaffType = (event) => {
        this.setState({ staff_role_type: event.target.value, isClear: true, staff_role_type_error: false });

    }
    handleRBT = (event) => {
        this.setState({ rbt_ref: parseInt(event.target.value), isClear: true, rbt_ref_error: false });

    }
    handleAssignedRbt = (event) => {
        this.setState({ rbt_id: parseInt(event.target.value), isClear: true, rbt_id_error: false });
    }
    handleAssignedProgram = (event) => {
        this.setState({ program_id: parseInt(event.target.value), isClear: true, program_Id_error: false });

    }
    handleDateChange = (date) => {
        this.setState({ date: date, date_error: false, invalid_date_error: false });
    }

    handleChangeSessionStartTime = (time) => {
        this.setState({ session_start_time: time, session_start_time_error: false })

    }
    handleChangeSessionEndTime = (time) => {
        this.setState({ session_end_time: time, session_end_time_error: false, invalid_session_end_time_error: null })

    }
    handleChangeToTime = (time) => {
        this.setState({ to_time: time, to_time_error: false, invalid_to_time_error: null })
    }
    handleClickEvent = (event, e) => {
        this.setState({ anchorEl: e.currentTarget, events: event, viewEventModal: Boolean(e.currentTarget), popoverId: this.state.viewEventModal ? 'simple-popover' : undefined });
    };
    submitForViewClientPromrams = (id) => {
        this.props.history.push("/admin/viewClientPrograms", { 'id': id })
    }

    render() {
        const { classes, client_schedules } = this.props;
        let filteredClient = this.props.clients.length > 0 ? this.props.clients.find(client => client.id === this.state.client_id) : null
        let filteredRbts = this.props.clients.length > 0 ? this.props.clients.filter((e) => e.userRole[0].role.name === "RBT") : null
        let filteredAssignedRbt = this.props.client_staff !== null && this.props.client_staff.length > 0 ? this.props.client_staff.filter((e) => e.role_code === "RBT") : null
        let eventArray = [];
        client_schedules !== null && client_schedules.length > 0 && client_schedules.map((e) => {
            let eventObj = {};
            eventObj.id = e.id;
            eventObj.title = `${e.rbt.userProfile.first_name} ${e.rbt.userProfile.last_name}   ${moment(e.session_start_time, "hh:mm").format('LT')} - ${moment(e.session_end_time, "hh:mm").format('LT')}`;
            eventObj.start = e.date
            eventObj.end = e.date;
            eventObj.startTime = moment(e.session_start_time, "hh:mm").format('LT');
            eventObj.endTime = moment(e.session_end_time, "hh:mm").format('LT');
            eventObj.first_name = e.rbt.userProfile.first_name;
            eventObj.last_name = e.rbt.userProfile.last_name;
            eventObj.date = e.date
            eventObj.session_start_time = e.session_start_time
            eventObj.session_end_time = e.session_end_time
            eventObj.client_id = e.client_id
            eventObj.rbt_id = e.rbt_id
            eventObj.schedule_by_id = e.schedule_by_id
            eventArray.push(eventObj)
            return eventArray
        }
        )
        return (
            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Toolbar style={{ justifyContent: "space-between", padding: "5px 0px 0px 0px" }}>
                    {filteredClient !== null && _.isEmpty(filteredClient) !== true && <Typography className={classes.headerTextStyle}>{filteredClient.userProfile.first_name} {filteredClient.userProfile.last_name}</Typography>}
                    <div>
                        <Button size="small" className={classes.viewButton} onClick={() => this.assignProgram("ADD")}>Assign Program</Button>
                        <Button size="small" className={classes.editButton} onClick={() => this.assignRbt("ADD")}>Assign RBT</Button>
                    </div>
                </Toolbar>
                <Grid container className={classes.root} spacing={3} direction="row"
                    justify="flex-start"
                    alignItems="flex-start">

                    <Grid item xs={6}>
                        <Card className={classes.card} >
                            <Typography style={{ backgroundColor: "#2EAAD4", padding: 10 }} className={classes.cardText} >Assigned-RBTS</Typography>
                            {
                                filteredAssignedRbt !== null && filteredAssignedRbt.length > 0 ? filteredAssignedRbt.map((item, index) => {
                                    return (
                                        <div>
                                            <Typography key={index} className={classes.textStyle}> {index + 1}.{item.rbt.userProfile.first_name} {item.rbt.userProfile.last_name}</Typography>
                                        </div>
                                    )
                                })
                                    : <div>
                                        <Typography className={classes.textStyle}>{"There are no assigned rbts"}</Typography>
                                    </div>
                            }
                        </Card>
                    </Grid>
                </Grid>
                <Dialog
                    maxWidth={"sm"}
                    open={this.state.dialogOpen}>
                    <DialogTitle id="form-dialog-title">
                        <Typography style={{ padding: "2% 5% 0 5%", fontFamily: "Futura-Heavy" }}>{this.state.mode === "ADD" ? "Assign Program" : "Update Client"}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ overflowY: "hidden" }}>
                        <Grid container justify="space-between" style={{ marginTop: -20, padding: "2% 5% 0 5%" }}>
                            <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="program_id"
                                    select
                                    label="Program Name"
                                    name="program_id"
                                    value={this.state.program_id}
                                    onChange={this.handleProgram}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}

                                    fullWidth
                                    error={this.state.program_id_error === true ? true : false}
                                    helperText={this.state.program_id_error === true ? "Please select program" : false}
                                >
                                    {this.props.programs !== null && this.props.programs.map(item => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="note"
                                    label="Note"
                                    name="note"
                                    placeholder="Note [optional]"
                                    //className={classes.margin}
                                    value={this.state.note}
                                    onChange={(event) => this.setState({ note: event.target.value, note_error: false })}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    fullWidth
                                // error={this.state.name_error === true ? true : false}
                                // helperText={this.state.name_error === true ? "Please enter name" : false}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={() => this.submitForAssignProgram()} variant="contained" color="primary" className={classes.addButton}>Submit</Button>
                        <Button size="small" onClick={() => this.cancelForAssignProgram()} variant="contained" color="secondary" className={classes.cancelButton}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    maxWidth={"sm"}
                    open={this.state.dialogOpenForStaff}>
                    <DialogTitle id="form-dialog-title">
                        <Typography style={{ padding: "2% 5% 0 5%", fontFamily: "Futura-Heavy" }}>{this.state.mode === "ADD" ? "Assign RBT" : "Update Assign RBT"}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ overflowY: "hidden" }}>
                        <Grid container justify="space-between" style={{ marginTop: -20, padding: "2% 5% 0 5%" }}>
                            {/* <Grid item xs={6} style={{ paddingRight: 8 }} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Date"
                                            format="MM/dd/yyyy"
                                            value={this.state.date}
                                            required
                                            disableFuture={false}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            InputProps={{
                                                classes: { input: classes.inputStyle }
                                            }}
                                            fullWidth
                                            onChange={this.handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={this.state.date_error === true ? true : this.state.invalid_date_of_birth_error === true ? true : false}
                                            helperText={this.state.date_error === true ? "Please enter date" : false}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid> */}
                            <Grid item xs={12} style={{ paddingRight: 8 }} >
                                <TextField
                                    id="rbt_ref"
                                    select
                                    label="RBT Name"
                                    name="rbt_ref"
                                    value={this.state.rbt_ref}
                                    onChange={this.handleRBT}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    required
                                    fullWidth
                                    error={this.state.rbt_ref_error === true ? true : false}
                                    helperText={this.state.rbt_ref_error === true ? "Please select RBT " : false}
                                >
                                    {
                                        filteredRbts !== null && filteredRbts.map(item => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.userProfile.first_name} {item.userProfile.last_name}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={() => this.submitForAssignRbt()} variant="contained" color="primary" className={classes.addButton}>Submit</Button>
                        <Button size="small" onClick={() => this.cancelForAssignProgram()} variant="contained" color="secondary" className={classes.cancelButton}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    maxWidth={"sm"}
                    open={this.state.dialogOpenForSchedule}>
                    <DialogTitle id="form-dialog-title">
                        <Typography style={{ padding: "2% 5% 0 5%", fontFamily: "Futura-Heavy" }}>{this.state.mode === "ADD" ? "Schedule" : "Update Schedule"}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ overflowY: "hidden" }}>
                        <Grid container justify="space-between" style={{ marginTop: -20, padding: "2% 5% 0 5%" }}>
                            <Grid item xs={6} style={{ paddingRight: 8 }} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Date"
                                            format="MM/dd/yyyy"
                                            value={this.state.date}
                                            required
                                            disableFuture={false}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            InputProps={{
                                                classes: { input: classes.inputStyle }
                                            }}
                                            fullWidth
                                            onChange={this.handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={this.state.date_error === true ? true : this.state.invalid_date_error === true ? true : false}
                                            helperText={this.state.date_error === true ? "Please enter date " : this.state.invalid_date_error === true ? "Please enter correct  date" : false}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={6} style={{ paddingRight: 8 }} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="time-picker"
                                        format="hh:mm"
                                        label={<span className={classes.inputStyle}>Session Start Time</span>}
                                        value={this.state.session_start_time}
                                        onChange={this.handleChangeSessionStartTime}
                                        KeyboardButtonProps={{ 'aria-label': 'change time' }}
                                        error={this.state.session_start_time_error === true ? true : false}
                                        helperText={this.state.session_start_time_error === true ? "Please Enter Session Start Time" : false}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={6} style={{ paddingRight: 8 }} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="time-picker"
                                        format="hh:mm"
                                        label={<span className={classes.inputStyle}>Session End Time</span>}
                                        value={this.state.session_end_time}
                                        onChange={this.handleChangeSessionEndTime}
                                        KeyboardButtonProps={{ 'aria-label': 'change time' }}
                                        error={this.state.session_end_time_error === true ? true : false}
                                        helperText={this.state.session_end_time_error === true ? this.state.invalid_session_end_time_error : false}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={6} style={{ paddingRight: 8 }} >
                                <TextField
                                    id="rbt_name"
                                    select
                                    label="RBT Name"
                                    name="rbt_name"
                                    value={this.state.rbt_id}
                                    onChange={this.handleAssignedRbt}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    required
                                    fullWidth
                                    error={this.state.rbt_id_error === true ? true : false}
                                    helperText={this.state.rbt_id_error === true ? "Please select RBT" : false}
                                >
                                    {filteredAssignedRbt !== null && filteredAssignedRbt.map(item => (
                                        <MenuItem key={item.rbt_ref} value={item.rbt_ref}>
                                            {item.rbt.userProfile.first_name} {item.rbt.userProfile.last_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={() => this.submitForSchedule()} variant="contained" color="primary" className={classes.addButton}>Submit</Button>
                        <Button size="small" onClick={() => this.cancelForAssignProgram()} variant="contained" color="secondary" className={classes.cancelButton}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Grid item xs={12} sm={12} >
                    <Toolbar style={{ justifyContent: "space-between", padding: "5px 20px 0px 0px" }}>
                        <Typography className={classes.scheduleTitleText}>Schedules Calender :</Typography>
                        <div>
                            <Button size="small" className={classes.viewButton} onClick={() => this.shedule("ADD", null)}>Schedule</Button>
                            <Button size="small" className={classes.editButton} onClick={() => this.submitForViewClientPromrams(parseInt(this.props.location.state.id))}>View Assigned Programs</Button>
                        </div>
                    </Toolbar>
                    <TableContainer component={Paper} style={{ backgroundColor: '#f2f2f2', boxShadow: "0px 0px 1px 0px", borderRadius: 5, paddingTop: 10 }}>
                        <Calendar
                            selectable
                            events={eventArray}
                            startAccessor="start"
                            endAccessor="end"
                            view="month"
                            defaultDate={moment().toDate()}
                            localizer={localizer}
                            onSelectEvent={this.handleClickEvent}
                            onShowMore={(events, date) => {
                                this.setState({ allEvents: events, viewAllEventModal: true })
                            }}
                            drilldownView="month"
                            eventPropGetter={(event, start, end, isSelected) => {
                                var style = {
                                    backgroundColor: "#2995C9",
                                    borderRadius: '2px',
                                    opacity: 1,
                                    color: '#fff',
                                    border: '0px',
                                    display: 'flex',
                                    fontSize: 12,
                                    marginTop: 7,
                                    padding: 3,
                                    fontFamily: "unicode.futurab",
                                    fontWeight: "600"
                                };
                                return {
                                    style: style
                                };
                            }}
                            style={{ height: '500pt', width: '100%', padding: 5 }}
                        />
                    </TableContainer>
                </Grid>

                <Popover
                    id={this.state.popoverId}
                    open={this.state.viewEventModal}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'right-start',
                        horizontal: 'left',
                    }}
                    className={classes.popover}
                    classes={{
                        paper: classes.popoverPaper,
                    }}
                >
                    <div className={classes.eventDiv}>
                        <div
                            className={classes.eventTitleView}>
                            <EditIcon onClick={() => this.shedule("EDIT", this.state.events)} style={{ width: 25, height: 25, color: "#EACE09", position: "absolute", left: 10 }}></EditIcon>
                            <Typography className={classes.eventTitle}>Event</Typography>
                            <CloseIcon onClick={() => this.setState({ viewEventModal: false })} style={{ width: 25, height: 25, color: "#fff", position: "absolute", right: 10 }} />
                        </div>
                        <div style={{ padding: 10 }}>
                            <div className={classes.eventNameRow}>
                                <EventIcon style={{ width: 20, height: 20, color: "#6E83B7" }} />
                                <Typography className={classes.eventNameText}>{this.state.events !== null && this.state.events !== undefined && (this.state.events.first_name + " " + this.state.events.last_name)} </Typography>
                            </div>
                            <div className={classes.eventNameRow}>
                                <AccessTimeIcon style={{ width: 20, height: 20, color: "#6E83B7" }} />
                                <Typography className={classes.eventNameText}>{this.state.events !== null && this.state.events !== undefined && `${this.state.events.startTime} - ${this.state.events.endTime}`}</Typography>
                            </div>
                        </div>
                    </div>
                </Popover>
                <Dialog
                    maxWidth={"md"}
                    open={this.state.viewAllEventModal}
                    PaperProps={{
                        style: {
                            width: "25%"
                        },
                    }}
                >
                    <div className={classes.eventDiv}>
                        <div className={classes.eventTitleView}>
                            <Typography className={classes.eventTitle}>Events</Typography>
                            <CloseIcon onClick={() => this.setState({ viewAllEventModal: false })} style={{ width: 25, height: 25, color: "#fff", position: "absolute", right: 10 }} />
                        </div>
                        {this.state.allEvents !== null && this.state.allEvents.length !== undefined && this.state.allEvents.map((e) => {
                            return (
                                <DialogContent dividers>
                                    <div>
                                        <EditIcon onClick={() => this.shedule("EDIT", e)} style={{ width: 25, height: 25, color: "#EACE09", position: "absolute", right: 10 }}></EditIcon>
                                        <div className={classes.eventNameRow}>
                                            <EventIcon style={{ width: 20, height: 20, color: "#6E83B7" }} />
                                            <Typography className={classes.eventNameText}>{e !== null && e !== undefined && (e.first_name + " " + e.last_name)} </Typography>
                                        </div>
                                        <div className={classes.eventNameRow}>
                                            <AccessTimeIcon style={{ width: 20, height: 20, color: "#6E83B7" }} />
                                            <Typography className={classes.eventNameText}>{e.startTime} - {e.endTime}</Typography>
                                        </div>
                                    </div>
                                </DialogContent>
                            )
                        })}
                    </div>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        clients: state.clientReducer.clients,
        programs: state.programReducer.programs,
        client_programs: state.programReducer.client_programs,
        client_staff: state.userReducer.client_staff,
        client_schedules: state.userReducer.client_schedules
    }
}
ViewClient.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), connect(mapStateToProps))(ViewClient);

