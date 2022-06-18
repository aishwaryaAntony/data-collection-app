import React, { Component } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Typography, Dialog,
    DialogContent, TableContainer, Grid, Paper
} from '@material-ui/core';
import moment from 'moment';
import Popover from '@material-ui/core/Popover';
import EventIcon from '@material-ui/icons/Event';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { compose } from "redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fetchSchedulesByRbtID } from "../../actions/userAction";


const localizer = momentLocalizer(moment);
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
        margin: 2,
        backgroundColor: "#2EAAD4",
        color: "white",
        textTransform: 'none',
        borderRadius: "10",
    },
    cancelButton: {
        backgroundColor: "#8fa3ad",
        color: "white",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        }
    },
    editButton: {
        backgroundColor: "#8fa3ad",
        margin: 2,
        color: "white",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        }
    },
    fontCellHeader: {
        color: "#78909c",
        fontWeight: 900,
        padding: '14px 20px 14px 0px',

    },
    popoverPaper: {
        display: 'flex',
        flexDirection: 'column',
        width: "25%"
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
    eventNameRow: {
        display: 'flex',
        flexDirection: "row",
        padding: "10px 0px 10px 0px"
    },
    fontTableCellBody: {
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
    // textStyle: {
    //     color: "#37474f",
    //     fontWeight: "bold",
    //     fontSize: 15,
    //     padding: 5
    // },
    cardText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },

    eventNameText: {
        fontSize: 15,
        marginLeft: 15,
    },

    eventCancelButton: {
        backgroundColor: "#8fa3ad",
        color: "white",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        },
        alignItems: "flex-end",
        paadingBottom: 20
    },
    scheduleTitleText: {
        color: "#2687C4",
        fontWeight: "600",
        fontSize: 18,
        padding: 10,
        marginBottom: 10
    },
    viewButton: {
        backgroundColor: "#2EAAD4",
        margin: 8,
        color: "white",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(143, 163, 173, 0.8)',
        },
    }
})


class SchedulCalender extends Component {
    constructor() {
        super();
        this.state = {
            viewAllScheduleModal: false,
            id: null,
            events: null,
            allEvents: null,
        }
    }

    componentDidMount() {
        let user_id = JSON.parse(localStorage.getItem('user')).user_id
        this.props.dispatch(fetchSchedulesByRbtID(user_id, this))
    }
    handleClickEvent = (event, e) => {
        this.setState({ anchorEl: e.currentTarget, events: event, viewEventModal: Boolean(e.currentTarget), popoverId: this.state.viewEventModal ? 'simple-popover' : undefined });
    };
    render() {
        const { classes } = this.props;
        let rbtScheduleArray = [];
        let rbtSchedules = this.props.rbt_schedules
        rbtSchedules !== null && rbtSchedules.length > 0 && rbtSchedules.map((e) => {
            let rbtScheduleObj = {};
            rbtScheduleObj.id = e.id;
            rbtScheduleObj.title = `${e.user.userProfile.first_name} ${e.user.userProfile.last_name} ${moment(e.session_start_time, "hh:mm").format('LT')} - ${moment(e.session_end_time, "hh:mm").format('LT')}`;
            rbtScheduleObj.start = e.date
            rbtScheduleObj.end = e.date;
            rbtScheduleObj.startTime = moment(e.session_start_time, "hh:mm").format('LT');
            rbtScheduleObj.endTime = moment(e.session_end_time, "hh:mm").format('LT');
            // rbtScheduleObj.name = e.user.user_name;
            rbtScheduleObj.first_name = e.user.userProfile.first_name
            rbtScheduleObj.last_name = e.user.userProfile.last_name
            rbtScheduleArray.push(rbtScheduleObj)
            return rbtScheduleArray

        }
        )
        return (
            <Grid item xs={12} sm={12} style={{ padding: 10 }}>
                <Typography className={classes.scheduleTitleText}>Schedule Calender</Typography>
                <TableContainer component={Paper} style={{ backgroundColor: '#f2f2f2', boxShadow: "0px 0px 1px 0px", borderRadius: 5, paddingTop: 10 }}>
                    <Calendar
                        selectable
                        events={rbtScheduleArray}
                        startAccessor="start"
                        endAccessor="end"
                        // view="month"
                        view="month"
                        views={["month"]}
                        defaultDate={moment().toDate()}
                        localizer={localizer}
                        onSelectEvent={this.handleClickEvent}
                        onShowMore={(events, date) => {
                            this.setState({ allEvents: events, viewAllScheduleModal: true })
                        }}
                        // style={{ padding: "0 3vw", height: "70vh", width: "70vw" }}
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
                                <Typography className={classes.eventNameText}>{this.state.events !== null && this.state.events !== undefined && (this.state.events.first_name + " " + this.state.events.last_name)}</Typography>
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
                    open={this.state.viewAllScheduleModal}
                    PaperProps={{
                        style: {
                            width: "25%"
                        },
                    }}
                >
                    <div className={classes.eventDiv}>
                        <div className={classes.eventTitleView}>
                            <Typography className={classes.eventTitle}>Events</Typography>
                            <CloseIcon onClick={() => this.setState({ viewAllScheduleModal: false })} style={{ width: 25, height: 25, color: "#fff", position: "absolute", right: 10 }} />
                        </div>
                        {this.state.allEvents !== null && this.state.allEvents.length !== undefined && this.state.allEvents.map((e) => {
                            return (
                                <DialogContent dividers>
                                    <div>
                                        <div className={classes.eventNameRow}>
                                            <EventIcon style={{ width: 20, height: 20, color: "#6E83B7" }} />
                                            <Typography className={classes.eventNameText}>{e !== null && e !== undefined && (e.first_name + " " + e.last_name)}</Typography>
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
        )
    }
}
const mapStateToProps = (state) => {
    return {

        rbt_schedules: state.userReducer.rbt_schedules,
        client_schedules: state.userReducer.client_schedules
    }
}
SchedulCalender.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), connect(mapStateToProps))(SchedulCalender);