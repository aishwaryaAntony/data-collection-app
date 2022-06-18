import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from "redux";
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography, Grid, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, MenuItem, FormHelperText, Toolbar, IconButton, TablePagination, Checkbox,
    TableContainer
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { fetchClients } from '../../actions/clientAction'
import { fetchProgramsByCientID, fetchPrograms } from '../../actions/programAction'
import { fetchStaffsByCientID, fetchSchedulesByCientID } from '../../actions/userAction';
import { fetchSessionData, addSessionData, updateSessionData } from '../../actions/sessionDataAction';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import moment from 'moment';
import _ from 'underscore';
import ClearIcon from "@material-ui/icons/Clear";
import { fetchSubCategories } from '../../actions/subCategoryAction'
import TablePaginationActions from "../../ Components/TablePaginationActions";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const styles = theme => ({
    headerTextStyle: {
        fontSize: 20,
        fontFamily: "Futura-Heavy",
        color: "#2687C4",
        fontWeight: "bold",
    },
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
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
    fontCellHeaderForView: {
        color: "#fff",
        fontWeight: "bold",
        fontFamily: "Futura-Heavy",
        padding: '14px 20px 14px 10px',
    },
    fontCellHeader: {
        fontSize: 15,
        fontFamily: "Futura-Heavy",
        color: "#2687C4",
        fontWeight: 'bold',
    },
    fontTableCellBody: {
        fontFamily: "Futura-Medium-bt",
        color: "#37474f",
        fontSize: 15,
    },
    totalFontTableCellBody: {
        color: "block",
        fontWeight: "bold",
        padding: '14px 20px 14px 10px',
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
    textStyle: {
        color: "#37474f",
        fontWeight: "bold",
        fontSize: 15,
        padding: 5
        //padding: 10   
    },
    cardText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },
    addButtons: {
        backgroundColor: "#2B99CD",
        color: "white",
        borderRadius: "10",
        textTransform: 'none',
        height: 30
    }
})


let totalIsCorrectAnswers = 0
let total = 0
let totalRecords = 0
let newSessionDataArray = [];
let resultedDatePSArray = []
let resultedDatePSSCArray = []

function countIsCorrectAnswers(isCorrectAnswer, index) {
    totalRecords = index
    if (isCorrectAnswer !== false) {
        totalIsCorrectAnswers = totalIsCorrectAnswers + 1
    }
}
function countPromptStrengthScore(psr) {
    if (psr !== null) {
        total = total + psr
    }
}

class ViewClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client_id: parseInt(props.location.state.id),
            assigned_by_id: null,
            program_name: "",
            status: "",
            dialogOpen: false,
            mode: "",
            sessionDataDialogOpen: false,
            date: null,
            date_error: false,
            invalid_date_error: false,
            session_start_time: null,
            session_start_time_error: false,
            session_end_time: null,
            session_end_time_error: false,
            invalid_session_end_time_error: null,
            is_correct_answer: "",
            is_correct_answer_error: false,
            prompt_strength: "",
            prompt_strength_error: false,
            prompt_strength_score: null,
            prompt_strength_score_error: false,
            rbt_id: null,
            id: null,
            program_id: null,
            category_id: null,
            sub_category_id: null,
            viewSessionDataDialogOpen: false,
            program: null,
            category: null,
            subCategory: null,
            trials: [],
            errorObjs: [],
            trialId: 1,
            session_data_id: null,
            read_note: false,
            rowsPerPage: 10,
            page: 0,
            viewProgressDialogopen: false,
            graph_ps: [],
            graph_pss: []
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.programs !== state.programs) {
            return {
                programs: props.programs
            }
        }
        return null;
    }
    componentDidMount() {
        this.props.dispatch(fetchClients())
        this.props.dispatch(fetchPrograms())
        this.props.dispatch(fetchSessionData())
        this.props.dispatch(fetchProgramsByCientID(this.props.location.state.id, this))
        this.props.dispatch(fetchStaffsByCientID(this.props.location.state.id, this))
        this.props.dispatch(fetchSchedulesByCientID(this.props.location.state.id, this))
        this.props.dispatch(fetchSubCategories())
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

    addSessionDataForTrial = async (mode, item, program, category, subCategory) => {

        if (mode === "ADDMODE") {
            let filtered_sub_category = this.props.subcategories.length > 0 ? this.props.subcategories.find(e => e.id === subCategory.id) : []
            this.setState({
                subCategory: filtered_sub_category,
                mode: mode, sessionDataDialogOpen: true, program_id: program.id, category_id: category.id, sub_category_id: subCategory.id, trials: [],
                errorObjs: [],
                trialId: 1
            })
        }
        else {
            let filtered_sub_category = this.props.subcategories.length > 0 ? this.props.subcategories.find(e => e.id === subCategory.id) : []

            await this.setState({
                //  subCategory: filtered_sub_category,
                sessionDataDialogOpen: true,
                subCategory: filtered_sub_category,
                session_data_id: filtered_sub_category.sessionData.id,
                mode: mode,
                date: moment(filtered_sub_category.sessionData.schedule.date).format("MM-DD-YYYY"),
                date_error: false,
                invalid_date_error: false,
                session_start_time: moment(filtered_sub_category.sessionData.schedule.session_start_time, "hh:mm A"),
                session_start_time_error: false,
                session_end_time: moment(filtered_sub_category.sessionData.schedule.session_end_time, "hh:mm A"),
                session_end_time_error: false,
                read_note: (filtered_sub_category.sessionData.have_read_note === "true" || filtered_sub_category.sessionData.have_read_note === true) ? true : false,
                invalid_session_end_time_error: null,
                trials: filtered_sub_category.sessionData.trial,
                errorObjs: [],
            })
        }
    }
    submitSessionData = () => {
        let { mode, read_note, date, client_id, program_id, category_id, sub_category_id, session_start_time, session_end_time,
            trials,
            errorObjs,
            session_data_id
        } = this.state


        let isError = false;

        if (date === null || date === "") {
            this.setState({ date_error: true })
            isError = true
        }
        // else {
        //     let today = moment().format("YYYY-MM-DD")
        //     let selectDate = moment(date).format("YYYY-MM-DD")

        //     if (selectDate === "Invalid date" || moment(selectDate).isBefore(today, "day")) {
        //         this.setState({ invalid_date_error: true })
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

        for (let trial of trials) {
            for (let key of Object.keys(trial)) {

                if (key === "is_correct_answer" && (trial[key] === "true" || trial[key] === true)) {
                    break;
                }
                if ((trial[key] === "prompt_strength_scrore" || key !== "status") && (trial[key] === null || trial[key] === "")) {
                    let errorObj = {}
                    errorObj.errorKey = key;
                    errorObj.errorId = trial.id
                    errorObjs.push(errorObj)
                    isError = true
                }
            }
        }

        if (isError === false) {

            let user_id = JSON.parse(localStorage.getItem('user')).user_id
            let sessionDataObj = {};
            sessionDataObj.client_id = client_id;
            sessionDataObj.date = moment(date, 'MM-DD-YYYY').format('YYYY-MM-DD 00:00');
            sessionDataObj.rbt_id = user_id;
            sessionDataObj.session_start_time = moment(session_start_time).format('hh:mm A');
            sessionDataObj.session_end_time = moment(session_end_time).format('hh:mm A');
            sessionDataObj.assigned_program_id = program_id;
            sessionDataObj.category_id = category_id;
            sessionDataObj.sub_category_id = sub_category_id;
            sessionDataObj.have_read_note = read_note === true ? "true" : "false";
            sessionDataObj.status = "ACTIVE"
            sessionDataObj.trials = this.state.trials

            if (mode === "ADDMODE") {
                this.props.dispatch(addSessionData(this, sessionDataObj))
            }
            else {

                this.props.dispatch(updateSessionData(this, sessionDataObj, session_data_id, this.state.trials))
            }
        }
        else {
            this.setState({ errorObjs: errorObjs })
        }
    }

    addNewTrial = (modeTrial) => {
        this.setState({ mode: modeTrial })
        let { trials, trialId } = this.state
        let sortedTrials = null
        if (modeTrial === "EDIT") {
            sortedTrials = _.sortBy(trials, 'id')

        }
        let trial = {};
        trial.id = modeTrial === "EDIT" ? sortedTrials[trials.length - 1].id + 1 : trialId;
        trial.is_correct_answer = "";
        trial.prompt_strength = null;
        trial.prompt_strength_score = null;
        trial.status = "ACTIVE";

        this.setState({ trials: [...trials, trial], trialId: modeTrial === "EDIT" ? sortedTrials[trials.length - 1].id + 1 : trialId + 1 })
    }

    removeTrial = (id) => {

        let { trials } = this.state;
        let filterTrials = trials.filter(item => item.id !== id)
        this.setState({ trials: filterTrials.length > 0 ? filterTrials : trials })
    }

    getTextValue = (key, id) => {
        let { trials } = this.state
        let isExist = trials.find(v => v.id === id);
        if (key === "is_correct_answer" && _.isEmpty(isExist) !== true) {
            return isExist[key] === "" ? "" : (isExist[key] === true || isExist[key] === "true") ? "true" : "false"
        } else {
            return isExist !== undefined ? isExist[key] : ""
        }

    }

    checkError = (id, key) => {
        let { errorObjs } = this.state;
        let findObj = errorObjs.find(item => (item.errorKey === key && item.errorId === id))
        if (findObj !== undefined) {
            return true
        }
    }

    onTextChange = (value, key, id, regex) => {
        let { trials, errorObjs } = this.state
        let isExist = trials.find(v => v.id === id);
        isExist[key] = value
        let findobj = errorObjs.find(item => (item.errorKey === key && item.errorId === id))
        let errorObjsFilter = errorObjs.filter(item => item !== findobj)
        this.setState({ trials: trials.map(trial => (trial.id === id) ? isExist : trial), errorObjs: errorObjsFilter })
    }


    viewSessionDataForTrial = (program, category, subCategory) => {
        totalIsCorrectAnswers = 0
        total = 0
        totalRecords = 0
        let filtered_sub_category = this.props.subcategories.length > 0 ? this.props.subcategories.find(e => e.id === subCategory.id) : []
        this.setState({ program: program, category: category, subCategory: filtered_sub_category, viewSessionDataDialogOpen: true })

    }

    handleClose = () => {
        this.setState({
            sessionDataDialogOpen: false,
            viewSessionDataDialogOpen: false,
            date_error: false,
            invalid_date_error: false,
            session_start_time_error: false,
            session_end_time_error: false,
            invalid_session_end_time_error: null,
            date: null,
            session_start_time: null,
            session_end_time: null,
            read_note: false,
        })
    }

    handleProgram = (event) => {
        this.setState({ program_id: parseInt(event.target.value), isClear: true, program_Id_error: false });

    }
    handleDateChange = (date) => {
        this.setState({ date: date, date_error: false, invalid_date_error: false });
    }
    handleChangeSessionEndTime = (time) => {
        this.setState({ session_end_time: time, session_end_time_error: false })

    }

    handleAssignedProgram = (event) => {
        this.setState({ program_id: parseInt(event.target.value), isClear: true, program_Id_error: false });

    }
    handleChangeSessionStartTime = (time) => {
        this.setState({ session_start_time: time, session_start_time_error: false })

    }
    handleChangeSessionEndTime = (time) => {
        this.setState({ session_end_time: time, session_end_time_error: false })

    }

    // categoryName = (data, program) => {
    //     return (data.map((e) =>
    //         <Grid item xs={6}>
    //             <Card style={{ minWidth: 600, marginTop: 2, borderRadius: 1 }} >
    //                 <Grid>
    //                     <Typography style={{ color: "white", fontSize: 15, backgroundColor: "#2EAAD4", padding: 5 }}>{e.name}</Typography>
    //                 </Grid>
    //                 <Grid style={{ marginLeft: 10 }}>
    //                     {
    //                         this.subCategoryMethod(e.subCategory, program, e)
    //                     }
    //                 </Grid>
    //             </Card>
    //         </Grid>
    //     ))
    // }
    // subCategoryMethod = (data, program, category) => {
    //     return (data.map((e) =>
    //         <Toolbar style={{ justifyContent: "space-between", padding: "0px 0px 0px 0px" }}>
    //             <Typography style={{
    //                 // color: "#2687C4",
    //                 // fontWeight: "bold",
    //                 // padding: '14px 20px 14px 10px',
    //                 fontFamily: "Futura-Medium-bt",
    //                 color: "#37474f",
    //                 fontSize: 15,
    //                 // fontFamily: "Futura-Heavy",
    //                 // color: "#2687C4",
    //                 fontWeight: 'bold',
    //             }}>{e.name}</Typography>
    //             <div>
    //                 {e.sessionData === null && _.isEmpty(e.sessionData) === true &&
    //                     <Button size="small" variant="contained" color="primary" onClick={() => this.addSessionDataForTrial("ADDMODE", this, program, category, e)} style={{
    //                         backgroundColor: "#2B99CD",
    //                         color: "white",
    //                         borderRadius: "10",
    //                         heigth: 30,
    //                         margin: 2,
    //                         textTransform: "none"
    //                     }}>
    //                         Add Session Data
    //                     </Button>}
    //                 {_.isEmpty(e.sessionData) !== true &&
    //                     <Toolbar>
    //                         <Button size="small" variant="contained" color="primary" onClick={() => this.addSessionDataForTrial("EDIT", this, program, category, e)} style={{
    //                             backgroundColor: "#2B99CD",
    //                             color: "white",
    //                             borderRadius: "10",
    //                             heigth: 30,
    //                             margin: 2,
    //                             textTransform: "none"
    //                         }}>
    //                             Edit Session Data
    //                         </Button>
    //                         <Button size="small" variant="contained" color="primary" onClick={() => this.viewSessionDataForTrial(program, category, e)} style={{
    //                             backgroundColor: "#8fa3ad",
    //                             color: "white",
    //                             borderRadius: "10",
    //                             heigth: 30,
    //                             margin: 2,
    //                             textTransform: "none"
    //                         }}>
    //                             View Session Data
    //                         </Button>
    //                     </Toolbar>
    //                 }
    //             </div>
    //         </Toolbar>))
    // }

    subCategory = (data, program, category) => {
        return (_.sortBy(data, 'id').map((e) =>
            <Toolbar style={{ justifyContent: "space-between", padding: "5px 20px 0px 0px" }}>
                <Typography style={{
                    fontFamily: "Futura-Medium-bt",
                    color: "#37474f",
                    fontSize: 14
                }}>{e.name}</Typography>
                <div>
                    {e.sessionData === null && _.isEmpty(e.sessionData) === true &&
                        <Button size="small" variant="contained" color="primary" onClick={() => this.addSessionDataForTrial("ADDMODE", this, program, category, e)} style={{
                            backgroundColor: "#2B99CD",
                            color: "white",
                            borderRadius: "10",
                            heigth: 30,
                            margin: 2,
                            textTransform: "none"
                        }}>
                            Add Session Data
                        </Button>}
                    {_.isEmpty(e.sessionData) !== true &&
                        <Toolbar>
                            <Button size="small" variant="contained" color="primary" onClick={() => this.addSessionDataForTrial("EDIT", this, program, category, e)} style={{
                                backgroundColor: "#2B99CD",
                                color: "white",
                                borderRadius: "10",
                                heigth: 30,
                                margin: 2,
                                textTransform: "none"
                            }}>
                                Edit Session Data
                            </Button>
                            <Button size="small" variant="contained" color="primary" onClick={() => this.viewSessionDataForTrial(program, category, e)} style={{
                                backgroundColor: "#8fa3ad",
                                color: "white",
                                borderRadius: "10",
                                heigth: 30,
                                margin: 2,
                                textTransform: "none"
                            }}>
                                View Session Data
                            </Button>
                        </Toolbar>
                    }
                </div>

            </Toolbar>))
    }

    handleClickForViewProgress = (programId) => {

        newSessionDataArray = [];
        resultedDatePSArray = []
        resultedDatePSSCArray = []

        let filteredSessionData = this.props.sessionData.filter((e) => e.assigned_program_id === programId)

        filteredSessionData.map((e, index) => {
            totalIsCorrectAnswers = 0
            total = 0
            totalRecords = 0

            e.trial.map((item, index) => {
                countIsCorrectAnswers(item.is_correct_answer, index + 1)
                countPromptStrengthScore(item.prompt_strength_score)
                return { totalIsCorrectAnswers, total, totalRecords };
            })

            let trial_total_prompt_strength = ((totalIsCorrectAnswers / totalRecords) * 100).toFixed(0)
            let trail_total_prompt_strength_score = total.toFixed(2)

            let newSessionDataObj = {};
            newSessionDataObj.id = e.id
            newSessionDataObj.date = e.date
            newSessionDataObj.assigned_program_id = e.assigned_program_id
            newSessionDataObj.category_id = e.category_id
            newSessionDataObj.sub_category_id = e.sub_category_id
            newSessionDataObj.trial_total_prompt_strength = parseFloat(trial_total_prompt_strength)
            newSessionDataObj.trail_total_prompt_strength_score = parseFloat(trail_total_prompt_strength_score)
            newSessionDataArray.push(newSessionDataObj)
            return newSessionDataArray;
        })

        let filteredBasedDateObj = _.groupBy(_.sortBy(newSessionDataArray, 'date'), 'date')

        for (let key in filteredBasedDateObj) {
            let resultedTotalPromptStrength = 0
            let resultedTotalPromptStrengthScore = 0

            filteredBasedDateObj[key].map(e => {
                resultedTotalPromptStrength = resultedTotalPromptStrength + e.trial_total_prompt_strength
                resultedTotalPromptStrengthScore = resultedTotalPromptStrengthScore + e.trail_total_prompt_strength_score
                return { resultedTotalPromptStrength, resultedTotalPromptStrengthScore };
            })

            //let dateArray = []
            let PSArray = []
            let PSSCArray = []

            if (new Date(key) <= new Date() && new Date(key) >= (new Date() - (30 * 24 * 3600 * 1000))) {
                PSArray.push(new Date(key))
                PSArray.push((resultedTotalPromptStrength / (filteredBasedDateObj[key].length)))

                PSSCArray.push(new Date(key))
                PSSCArray.push((parseFloat(resultedTotalPromptStrengthScore.toFixed(2)) / (filteredBasedDateObj[key].length)))
            }
            //resultedDateArray.push(PSArray)
            resultedDatePSArray.push(PSArray)
            resultedDatePSSCArray.push(PSSCArray)

        }
        this.setState({ viewProgressDialogopen: true, graph_ps: resultedDatePSArray, graph_pss: resultedDatePSSCArray })
    }
    progressDialogClose = () => {
        this.setState({
            viewProgressDialogopen: false,
        })
    }

    render() {
        const { classes } = this.props;
        //let filteredClient = this.props.clients.length > 0 ? this.props.clients.find(client => client.id === this.state.client_id) : null
        const options = {
            chart: {
                type: 'line'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Average Percent Correct & Prompt Strength'
            },

            subtitle: {
                //text: 'Source: my-aba.com'
                text: `${moment(new Date() - (30 * 24 * 3600 * 1000)).format("DD MMM YYYY")}${"-"}${moment(new Date()).format("DD MMM YYYY")}`
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        moment(moment(this.x).valueOf()).format("MMM DD YYYY")
                        + ", " + this.y;
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
            },
            xAxis: {
                title: {
                    text: "Date"
                },
                type: 'datetime',
                // dateTimeLabelFormats: {
                //     // day: "%e\%b\%y",
                //     month: "%b \'%y"
                // },
                // labels: {
                //     //align: 'left',
                //     //rotation: 0,
                //     x: 3,
                //     y: 0,
                //     // formatter: function () {
                //     //     return Highcharts.dateFormat('%a %e %b', this.value);
                //     // }
                // },
                gridLineWidth: 0.5,
                startOnTick: 'false',
                endOnTick: 'false',
                min: new Date() - (30 * 24 * 3600 * 1000).valueOf(),
                max: new Date().valueOf(),
                tickInterval: 4 * 24 * 3600 * 1000	// ticks 4days
            },

            plotOptions: {
                series: {
                    pointStart: new Date() - (30 * 24 * 3600 * 1000),
                    pointInterval: 2 * 24 * 3600 * 1000,
                    pointEnd: new Date()
                }
            },


            yAxis: [{
                min: 0,
                max: 100,
                title: {
                    text: "Percent Correct"
                },
                labels: {
                    align: 'left',
                    x: 3,
                    y: 16,
                    format: '{value:.,0f}'
                },
            }, {
                min: 0,
                max: 4,
                title: {
                    text: "Prompt Strength"
                },
                // pointStart: Date.UTC(2010, 0, 1),
                // pointInterval: 24 * 3600 * 1000 ,
                labels: {
                    align: 'right',
                    x: -3,
                    y: 16,
                    format: '{value:.,2f}'
                },
                opposite: true
            }],
            series: [{
                yAxis: 0,
                name: 'Percent Correct',
                data: this.state.graph_ps.map(item => {
                    return {
                        x: moment(item[0]).valueOf(),
                        y: item[1]
                    }
                }),
                dataLabels: {
                    enabled: true
                }

            }, {
                yAxis: 1,
                name: 'Prompt Strength',
                dashStyle: 'shortdot',
                // data: this.state.graph_ps,
                data: this.state.graph_pss.map(item => {
                    return {
                        x: moment(item[0]).valueOf(),
                        y: item[1]
                    }
                }),

            },

            ],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        };

        return (
            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Grid container justify="center">
                    <Grid item xs={12}>
                        <Toolbar style={{ justifyContent: "space-between", padding: "0px 0px 0px 0px" }}>
                            <Typography className={classes.headerTextStyle}>{"Assigned Programs"} </Typography>
                            <TablePagination
                                rowsPerPageOptions={[20]}
                                component="div"
                                count={this.props.client_programs !== null && this.props.client_programs.length}
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



                        <Grid item xs={12} sm={12} style={{ backgroundColor: "#fff", }}>
                            {/* <Table>
                                    <TableHead style={{ background: "linear-gradient(to right, #2687C4, #2A98CA, #2EAAD4, #32BCD9)" }}>
                                        <TableRow>
                                            <TableCell align="left" className={classes.fontCellHeader}>Program Name</TableCell>
                                            <TableCell align="left" className={classes.fontCellHeader}></TableCell>
                                            <TableCell align="left" className={classes.fontCellHeader}>Categories & SubCategories</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.props.client_programs !== null && this.props.client_programs.length > 0 ? (this.props.client_programs.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell align="left" className={classes.fontTableCellBody} style={{ width: 400 }}>{item.program.name}</TableCell>
                                                <TableCell>
                                                    <Toolbar style={{ justifyContent: "space-between" }}>
                                                        <Button size="small" variant="contained" color="primary" onClick={() => this.handleClickForViewProgress(item.program.id)} style={{
                                                            backgroundColor: "#8fa3ad",
                                                            color: "white",
                                                            borderRadius: "10",
                                                            heigth: 30,
                                                            margin: 2,
                                                            textTransform: "none"
                                                        }}>
                                                            View Progress
                                                        </Button>
                                                    </Toolbar>
                                                </TableCell>
                                                <TableCell align="left" className={classes.fontTableCellBody}>
                                                    <Typography >{this.categoryName(item.program.category, item.program)}</Typography>
                                                </TableCell>
                                            </TableRow>))
                                        ) :
                                            <TableCell colspan={4} style={{ textAlign: "center" }}>There are no programs</TableCell>
                                        }
                                    </TableBody>
                                </Table> */}
                            <Grid container spacing={0}>
                                {/* <Grid item xs={12} sm={12} container style={{ padding: 5 }}> */}
                                {this.props.client_programs !== null && this.props.client_programs.length > 0 ?
                                    (_.sortBy(this.props.client_programs, 'id').map((item, index) => (
                                        <Grid item xs={12} sm={12} key={index} style={{ borderRadius: "15px", padding: 5 }}>
                                            <Card
                                                style={{
                                                    cursor: "pointer",
                                                    background: "#eaeaea",
                                                    height: "100%",
                                                }}
                                            >
                                                <TableContainer style={{ backgroundColor: '#f2f2f2' }}>
                                                    <Toolbar style={{ justifyContent: "space-between", padding: "5px 20px 0px 15px", marginRight: 15 }}>
                                                        <div>
                                                            <Typography style={{
                                                                fontSize: 20,
                                                                fontFamily: "Futura-Heavy",
                                                                color: "#2687C4",
                                                                fontWeight: "bold",
                                                                //marginLeft: 20,
                                                                //padding: 5
                                                            }} >
                                                                {item.program.name}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Button size="small" variant="contained" color="primary" onClick={() => this.handleClickForViewProgress(item.program.id)} style={{
                                                                backgroundColor: "#8fa3ad",
                                                                color: "white",
                                                                borderRadius: "10",
                                                                heigth: 30,
                                                                margin: 2,
                                                                textTransform: "none"
                                                            }}>
                                                                View Progress
                                                            </Button>
                                                        </div>
                                                    </Toolbar>
                                                    {/* <div><Typography style={{ padding: 5 }}> {item.program.name}</Typography></div> */}

                                                    <Table size="small" aria-label="a dense table">
                                                        <TableHead >
                                                            <TableRow>
                                                                <TableCell align="left" className={classes.fontCellHeader}>Categories</TableCell>
                                                                <TableCell align="left" className={classes.fontCellHeader}> SubCategories</TableCell>
                                                            </TableRow>
                                                        </TableHead>

                                                        <TableBody>
                                                            {item.program.category.length > 0 ? _.sortBy(item.program.category, 'id').map((cat, index) =>
                                                                <TableRow key={index}>
                                                                    <TableCell align="left" className={classes.fontTableCellBody} style={{ width: 300 }}>{cat.name}</TableCell>
                                                                    <TableCell align="left" >
                                                                        {this.subCategory(cat.subCategory, item.program, cat)}
                                                                    </TableCell>
                                                                </TableRow>)
                                                                :
                                                                <TableCell colspan={4} style={{ textAlign: "center" }}>There are no Categories</TableCell>
                                                            }

                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Card>
                                        </Grid>)))
                                    :
                                    <Table>
                                        <TableBody>
                                            <TableCell colspan={4} style={{ textAlign: "center" }}>There are no programs</TableCell>
                                        </TableBody>
                                    </Table>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog
                    maxWidth={"xl"}
                    scroll="body"
                    open={this.state.sessionDataDialogOpen}>
                    <DialogTitle id="form-dialog-title">
                        <Typography style={{ color: "#2687C4", fontFamily: "Futura-Heavy", fontWeight: "bold", fontSize: 20, paddingLeft: 15 }}>{this.state.mode === "ADDMODE" ? "Add Session Data" : "Update Session Data"}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ overflowY: "hidden" }}>
                        <div style={{ marginTop: -20, }}></div>
                        <Grid container justify="space-between" style={{ marginRight: 10, marginLeft: 30, }}>
                            {/* <Typography paragraph={true} style={{ fontFamily: "Futura-Book", fontSize: 12, padding: 10 }}>
                                            <span styel={{ fontSize: 20 }}> Note </span>  <span> {"hjgfgdugfuusugjvfvjhvfvjsdfvhjsgfusgfijbcjsbhfnkjfifnfjbjhfibfbfjbfjfjbfjkbfbfjbfjbfjfbjfbjjfbjfjfjfjfv"}</span>
                                        </Typography> */}

                            <div style={{ display: "flex", width: "90%", alignItems: "center", flexDirection: 'row', padding: 20, backgroundColor: '#eaeaea', borderRadius: 5 }}>
                                <Typography style={{ fontFamily: "Merriweather-Italic", color: "block", fontSize: 14 }}>
                                    <Typography component="span" style={{ fontFamily: "Merriweather-Italic", color: "#686868", fontWeight: 'bold', fontSize: 14 }}>
                                        Note:
                                    </Typography>
                                    {this.state.subCategory !== null && _.isEmpty(this.state.subCategory) !== true && this.state.subCategory.note}
                                </Typography>
                            </div>
                        </Grid>
                        <Grid container justify="space-between" style={{ marginTop: -20, padding: "2% 5% 0 5%" }}>
                            <Grid item xs={4} style={{ paddingRight: 8, marginTop: 2 }} >
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
                                            disabled={this.state.mode === "EDIT" ? true : false}
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

                            <Grid item xs={4} style={{ paddingRight: 8 }} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="time-picker"
                                        mask="__:__ _M"
                                        label={<span className={classes.inputStyle}>Session Start Time</span>}
                                        value={this.state.session_start_time}
                                        onChange={this.handleChangeSessionStartTime}
                                        disabled={this.state.mode === "EDIT" ? true : false}
                                        KeyboardButtonProps={{ 'aria-label': 'change time' }}
                                        error={this.state.session_start_time_error === true ? true : false}
                                        helperText={this.state.session_start_time_error === true ? "Please Enter Session Start Time" : false}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>

                            <Grid item xs={4} style={{ paddingRight: 8 }} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="time-picker"
                                        mask="__:__ _M"
                                        label={<span className={classes.inputStyle}>Session End Time</span>}
                                        value={this.state.session_end_time}
                                        onChange={this.handleChangeSessionEndTime}
                                        disabled={this.state.mode === "EDIT" ? true : false}
                                        KeyboardButtonProps={{ 'aria-label': 'change time' }}
                                        error={this.state.session_end_time_error === true ? true : false}
                                        helperText={this.state.session_end_time_error === true ? this.state.invalid_session_end_time_error : false}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid>
                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                    <Checkbox
                                        checked={this.state.read_note}
                                        onChange={() => this.setState({ read_note: !this.state.read_note })}
                                        disabled={this.state.mode === "EDIT" ? true : false}
                                        size="small" />
                                    <Typography className={classes.textStyle} style={{ color: "#1F4160", fontWeight: 500 }}>Have you read note ?</Typography>
                                </div>
                            </Grid>

                        </Grid>

                        {this.state.trials.length <= 10 && <Toolbar style={{ justifyContent: "space-between", padding: "5px 20px 10px 10px" }}>
                            <Typography style={{ color: "#2687C4", fontWeight: "bold", fontSize: 20, padding: 10 }}>Trails</Typography>
                            <Button size="small" className={classes.addButton} onClick={() => this.addNewTrial(this.state.mode)}>Add Trial</Button>
                        </Toolbar>}

                        {this.state.trials.length === 0 ?
                            <div>
                                {this.addNewTrial(this.state.mode)}
                            </div> :
                            this.state.trials.length > 0 &&
                            _.sortBy(this.state.trials, 'id').map(trial =>
                                <Card style={{ padding: 10, margin: 5 }}>
                                    <Grid container justify="space-between" style={{ marginTop: -20, padding: "2% 5% 0 5%" }}>
                                        <Grid item xs={3} style={{ paddingRight: 8 }}>
                                            <div style={{ padding: "2% 0 2% 0" }}>
                                                <Typography style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.54)' }}>Is Correct Answer ?</Typography>
                                                <FormControl component="fieldset">
                                                    <RadioGroup aria-label="is_correct_answer"
                                                        name="is_correct_answer"
                                                        // value={this.state.is_correct_answer} 
                                                        // onChange={(event) => this.setState({ is_correct_answer: event.target.value, is_correct_answer_error: false })} 
                                                        value={this.getTextValue("is_correct_answer", trial.id)}
                                                        onChange={(event) => this.onTextChange(event.target.value, "is_correct_answer", trial.id, null)}

                                                        row>
                                                        <FormControlLabel
                                                            value="true"
                                                            control={<Radio style={{ color: "#12bdcf" }} />}
                                                            label={<span className={classes.labelStyle}>Yes</span>}
                                                            labelPlacement="end"
                                                        />
                                                        <FormControlLabel
                                                            value="false"
                                                            control={<Radio style={{ color: "#12bdcf" }} />}
                                                            label={<span className={classes.labelStyle}>No</span>}
                                                            labelPlacement="end"
                                                        />
                                                    </RadioGroup>

                                                    {this.checkError(trial.id, "is_correct_answer") === true ? <FormHelperText style={{ color: "red" }}>{"Please select  is correct answer"}</FormHelperText> : false}
                                                </FormControl>
                                            </div>
                                        </Grid>
                                        {this.getTextValue("is_correct_answer", trial.id) === "false" &&
                                            <Grid item xs={3} style={{ paddingRight: 8 }}>
                                                <TextField
                                                    id="prompt_strength"
                                                    label="Prompt Strength"
                                                    name="prompt_strength"
                                                    className={classes.margin}
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        classes: { input: classes.inputStyle }
                                                    }}
                                                    fullWidth
                                                    //error={this.state.prompt_strength_error === true ? true : false}
                                                    //helperText={this.state.prompt_strength_error === true ? "Please enter prompt strength" : false}
                                                    value={this.getTextValue("prompt_strength", trial.id)}
                                                    onChange={(event) => this.onTextChange(event.target.value, "prompt_strength", trial.id, null)}
                                                    error={this.checkError(trial.id, "prompt_strength") === true ? true : false}
                                                    helperText={this.checkError(trial.id, "prompt_strength") === true ? "Please enter Prompt Stength" : false}
                                                />
                                            </Grid>
                                        }
                                        {this.getTextValue("is_correct_answer", trial.id) === "false" &&
                                            <Grid item xs={4} style={{ paddingRight: 8 }}>
                                                <TextField
                                                    id="prompt_strength_score"
                                                    label="Prompt Strength Score"
                                                    name="prompt_strength_score"
                                                    className={classes.margin}
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        classes: { input: classes.inputStyle }
                                                    }}
                                                    fullWidth
                                                    value={this.getTextValue("prompt_strength_score", trial.id)}
                                                    onChange={(event) => this.onTextChange(event.target.value, "prompt_strength_score", trial.id, null)}
                                                    error={this.checkError(trial.id, "prompt_strength_score") === true ? true : false}
                                                    helperText={this.checkError(trial.id, "prompt_strength_score") === true ? "Please enter Prompt Stength Score" : false}
                                                />
                                            </Grid>
                                        }
                                        <IconButton style={{ height: 50 }} onClick={() => this.removeTrial(trial.id)}><ClearIcon style={{ color: "red" }} /></IconButton>
                                    </Grid>
                                </Card>)}
                        <DialogActions >
                            <Button size="small" variant="contained" color="primary" onClick={() => this.submitSessionData()} className={classes.addButton}>Submit</Button>
                            <Button size="small" onClick={() => this.handleClose()} variant="contained" color="secondary" className={classes.cancelButton}>Cancel</Button>
                        </DialogActions>

                    </DialogContent>
                </Dialog>

                <Dialog
                    maxWidth={"xl"}
                    scroll="body"
                    open={this.state.viewSessionDataDialogOpen}>
                    <DialogTitle id="form-dialog-title">
                        <Typography style={{ color: "#2687C4", fontFamily: "Futura-Heavy", fontWeight: "bold", fontSize: 20, }}>{"Session Data"}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ overflowY: "hidden", paddingLeft: 20, marginTop: -20 }}>
                        <div >
                            {this.state.subCategory !== null && _.isEmpty(this.state.subCategory.sessionData) !== true &&
                                <div style={{ paddingLeft: 10 }}>
                                    <Typography ><span style={{ color: "#2687C4", fontSize: 15, fontFamily: "Futura-Medium", padding: 2 }}>Date:</span><span style={{ fontFamily: "Futura-Book", fontSize: 15, color: 'grey', fontWeight: 'bold' }}>{moment(this.state.subCategory.sessionData.schedule.date).format("MM-DD-YYYY")}</span></Typography>
                                    <Typography ><span style={{ color: "#2687C4", fontSize: 15, fontFamily: "Futura-Medium", padding: 2 }}>Session Start Time:</span><span style={{ fontFamily: "Futura-Book", fontSize: 15, color: 'grey', fontWeight: 'bold' }}> {moment(this.state.subCategory.sessionData.schedule.session_start_time, "hh:mm").format('LT')}</span></Typography>
                                    <Typography><span style={{ color: "#2687C4", fontSize: 15, fontFamily: "Futura-Medium", padding: 2 }}>Session End Time:</span> <span style={{ fontFamily: "Futura-Book", fontSize: 15, color: 'grey', fontWeight: 'bold' }}>{moment(this.state.subCategory.sessionData.schedule.session_end_time, "hh:mm").format('LT')}</span></Typography>
                                    <Typography ><span style={{ color: "#2687C4", fontSize: 15, fontFamily: "Futura-Medium", padding: 2 }}>Program Name:</span><span style={{ fontFamily: "Futura-Book", fontSize: 15, color: 'grey', fontWeight: 'bold' }}>{this.state.program !== null && this.state.program.name}</span></Typography>
                                    <Typography ><span style={{ color: "#2687C4", fontSize: 15, fontFamily: "Futura-Medium", padding: 2 }}>Category Name:</span><span style={{ fontFamily: "Futura-Book", fontSize: 15, color: 'grey', fontWeight: 'bold' }}>{this.state.category !== null && this.state.category.name}</span></Typography>
                                    <Typography > <span style={{ color: "#2687C4", fontSize: 15, fontFamily: "Futura-Medium", padding: 2 }}>Sub Category Name:</span><span style={{ fontFamily: "Futura-Book", fontSize: 15, color: 'grey', fontWeight: 'bold' }}>{this.state.subCategory !== null && this.state.subCategory.name}</span></Typography>
                                </div>}
                            <div style={{ marginTop: 10 }}>
                                <Typography style={{ color: "#2687C4", fontFamily: "Futura-Heavy", fontWeight: "bold", fontSize: 20, padding: 2 }}>Trials</Typography>
                            </div>
                            <Table>
                                <TableHead style={{ background: "linear-gradient(to right, #2687C4, #2A98CA, #2EAAD4, #32BCD9)" }}>
                                    <TableRow>
                                        <TableCell align="left" className={classes.fontCellHeaderForView}>S.NO</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeaderForView}>Is Correct Answer</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeaderForView}>Prompt Strength</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeaderForView}>Prompt Strength Score</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeaderForView}></TableCell>
                                    </TableRow>

                                </TableHead>
                                <TableBody>
                                    {this.state.subCategory !== null && _.isEmpty(this.state.subCategory.sessionData) !== true &&
                                        this.state.subCategory.sessionData.trial.length > 0 ?
                                        (_.sortBy(this.state.subCategory.sessionData.trial, 'id').map((e, index) =>
                                            <TableRow key={index}>
                                                <TableCell align="left" className={classes.fontTableCellBody}>{index + 1}</TableCell>
                                                <TableCell align="left" className={classes.fontTableCellBody}>{e.is_correct_answer === true ? "YES" : "NO"} {countIsCorrectAnswers(e.is_correct_answer, index + 1)}
                                                </TableCell>
                                                <TableCell align="left" className={classes.fontTableCellBody}>{e.prompt_strength}</TableCell>
                                                <TableCell align="left" className={classes.fontTableCellBody}>{e.prompt_strength_score}{countPromptStrengthScore(e.prompt_strength_score)}</TableCell>
                                                <TableCell align="left" className={classes.fontTableCellBody}></TableCell>
                                            </TableRow>
                                        )
                                        ) :
                                        <TableCell colspan={4} style={{ textAlign: "center" }}>There are no trials</TableCell>
                                    }
                                    <TableRow>
                                        <TableCell align="left" className={classes.totalFontTableCellBody}>Total</TableCell>
                                        <TableCell align="left" className={classes.totalFontTableCellBody}>{((totalIsCorrectAnswers / totalRecords) * 100).toFixed(0)}{"%"}</TableCell>
                                        <TableCell align="left" className={classes.totalFontTableCellBody}></TableCell>
                                        <TableCell align="left" className={classes.totalFontTableCellBody}>{total}</TableCell>
                                        <TableCell align="left" className={classes.totalFontTableCellBody}></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <DialogActions >
                            {/* <Button size="small" onClick={() => this.handleClose()} variant="contained" color="secondary" className={classes.cancelButton}>Close</Button> */}
                            <IconButton style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                marginRight: 0
                            }} onClick={() => this.handleClose()}><ClearIcon style={{ color: "red" }} /></IconButton>
                        </DialogActions>
                    </DialogContent>
                </Dialog>

                <Dialog
                    maxWidth={"sm"}
                    open={this.state.dialogOpen}>
                    <DialogTitle id="form-dialog-title">
                        <Typography style={{ padding: "2% 5% 0 5%", }}>{this.state.mode === "ADD" ? "Assign Program" : "Update Client"}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ overflowY: "hidden" }}>
                        <Grid container justify="space-between" style={{ marginTop: -20, padding: "2% 5% 0 5%" }}>
                            <Grid item xs={12} >
                                <TextField
                                    id="program_name"
                                    select
                                    label="Program Name"
                                    name="program_name"
                                    value={this.state.program_id}
                                    onChange={this.handleProgram}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    required
                                    fullWidth
                                    error={this.state.program_id_error === true ? true : false}
                                    helperText={this.state.program_id_error === true ? "Please select Program" : false}
                                >
                                    {this.props.programs !== null && this.props.programs.map(item => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={() => this.submitForAssignProgram()} variant="contained" color="primary" className={classes.addButton}>Submit</Button>
                        <Button size="small" onClick={() => this.cancelForAssignProgram()} variant="contained" color="secondary" className={classes.cancelButton}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    maxWidth={"xl"}
                    scroll="body"
                    open={this.state.viewProgressDialogopen}
                >
                    <DialogContent>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </DialogContent>
                    <DialogActions>
                        <IconButton style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            // marginRight: 0
                        }} onClick={() => this.progressDialogClose()}><ClearIcon style={{ color: "red" }} /></IconButton>
                    </DialogActions>
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
        client_schedules: state.userReducer.client_schedules,
        sessionData: state.sessionDataReducer.sessionData,
        subcategories: state.subCategoryReducer.subcategories
    }
}
ViewClient.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), connect(mapStateToProps))(ViewClient);

