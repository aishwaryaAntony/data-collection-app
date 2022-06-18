import React, { Component } from 'react';
import {
    Typography, Grid, Dialog, DialogContent
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from "redux";
import Card from '@material-ui/core/Card';
import { fetchProgramsByCientID } from "../../actions/programAction";
import { fetchStaffsByCientID, fetchSchedulesByCientID } from "../../actions/userAction";
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popover from '@material-ui/core/Popover';
import EventIcon from '@material-ui/icons/Event';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer'
const localizer = momentLocalizer(moment);

const styles = theme => ({
    root: {
        flexGrow: 1,
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
class ClientDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewEventModal: false,
            popoverId: null,
            anchorEl: null,
            events: null,
            viewAllEventModal: false,
            allEvents: null,
        }
    }

    componentDidMount() {
        let client_id = JSON.parse(localStorage.getItem('user')).user_id
        this.props.dispatch(fetchSchedulesByCientID(client_id, this))
        this.props.dispatch(fetchProgramsByCientID(client_id))
        this.props.dispatch(fetchStaffsByCientID(client_id, this))
        this.props.dispatch(fetchSchedulesByCientID(client_id, this))
    }
    handleClickEvent = (event, e) => {
        this.setState({ anchorEl: e.currentTarget, events: event, viewEventModal: Boolean(e.currentTarget), popoverId: this.state.viewEventModal ? 'simple-popover' : undefined });
    };
    render() {
        const { client_schedules } = this.props;
        // let allClientProgram = this.props.client_programs
        let filteredAssignedRbt = this.props.client_staff !== null && this.props.client_staff.length > 0 ? this.props.client_staff.filter((e) => e.role_code === "RBT") : null
        let filteredAssignedCaseManager = this.props.client_staff !== null && this.props.client_staff.length > 0 ? this.props.client_staff.filter((e) => e.role_code === "CMR") : null
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
            eventArray.push(eventObj)
            return eventArray
        }
        )
        const { classes } = this.props;
        return (
            <div style={{ margin: 10 }}>
                <Grid container className={classes.root} spacing={3} direction="row"
                    justify="flex-start"
                    alignItems="flex-start">
                    <Grid item xs={6}>
                        <Card className={classes.card} >
                            <Typography style={{ backgroundColor: "#2EAAD4", padding: 10 }} className={classes.cardText} >Assigned-RBT's</Typography>
                            {
                                filteredAssignedRbt !== null && filteredAssignedRbt.length > 0 ? (filteredAssignedRbt.map((item, index) => {
                                    return (
                                        <div>
                                            <Typography key={index} className={classes.cardTextStyle}> {index + 1}.{item.rbt.userProfile.first_name} {item.rbt.userProfile.last_name}</Typography>
                                        </div>
                                    )
                                }))
                                    :
                                    <Typography style={{ display: "flex", justifyContent: "center" }}>There are no assigned rbts</Typography>
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card className={classes.card} >
                            <Typography style={{ backgroundColor: "#2EAAD4", padding: 10 }} className={classes.cardText} >Assigned-Case Managers</Typography>
                            {
                                filteredAssignedCaseManager !== null && filteredAssignedCaseManager.length > 0 ? (filteredAssignedCaseManager.map((item, index) => {
                                    return (
                                        <div>
                                            <Typography key={index} className={classes.cardTextStyle}> {index + 1}.{item.caseManager.userProfile.first_name} {item.caseManager.userProfile.last_name}</Typography>
                                        </div>
                                    )
                                }))
                                    :
                                    <Typography style={{ display: "flex", justifyContent: "center" }}>There are no assigned case managers</Typography>
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography className={classes.scheduleTitleText}>Schedules Calender :</Typography>
                        <TableContainer component={Paper} style={{ backgroundColor: '#f2f2f2', boxShadow: "0px 0px 1px 0px", borderRadius: 5, paddingTop: 10 }}>
                            <Calendar
                                selectable
                                events={eventArray}
                                startAccessor="start"
                                endAccessor="end"
                                view="month"
                                views={["month"]}
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

                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        client_programs: state.programReducer.client_programs,
        client_staff: state.userReducer.client_staff,
        client_schedules: state.userReducer.client_schedules
    }
}
ClientDashBoard.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), connect(mapStateToProps))(ClientDashBoard);