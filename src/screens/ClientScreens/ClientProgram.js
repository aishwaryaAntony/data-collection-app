import React, { Component } from 'react'
import {
    Table, TableBody, TableCell, TableHead, TableRow, Toolbar,
    Typography, Grid, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TablePagination, TableContainer

} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from "redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fetchProgramsByCientID } from "../../actions/programAction";
import { Card, IconButton } from '@material-ui/core';
import moment from 'moment';
import _ from 'underscore';
import { fetchSubCategories } from '../../actions/subCategoryAction'
import TablePaginationActions from "../../ Components/TablePaginationActions";
import { fetchSessionData } from "../../actions/sessionDataAction";
import ClearIcon from "@material-ui/icons/Clear";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const styles = theme => ({
    headerTextStyle: {
        fontSize: 20,
        fontFamily: "Futura-Heavy",
        color: "#2687C4",
        fontWeight: "bold",
    },
    textStyle: {
        fontFamily: "Futura-Heavy",
        color: "#2687C4",
        //fontFamily: "bold",
        fontSize: 25,
        //padding: 10
    },
    creditTextStyle: {
        fontFamily: "Futura-Heavy",
        color: "#37474f",
        fontWeight: "bold",
        fontSize: 15,
        paddingTop: 10
    },
    CategoryAddButton: {
        backgroundColor: "#2B99CD",
        color: "white",
        fontFamily: "unicode.futurab",
        borderRadius: "10",
        heigth: 30
        // width:"70"
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
        fontFamily: "Futura-Book",
        fontSize: 14
    },
    labelStyle: {
        fontFamily: "Futura-Book",
        fontSize: 14
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

class ClientProgram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewSessionDataDialogOpen: false,
            viewProgressDialogopen: false,
            mode: "",
            program: null,
            category: null,
            subCategory: null,
            rowsPerPage: 10,
            page: 0,
            graph_ps: [],
            graph_pss: []
        }
    }
    componentDidMount() {
        let user_id = JSON.parse(localStorage.getItem('user')).user_id
        this.props.dispatch(fetchProgramsByCientID(user_id))
        this.props.dispatch(fetchSubCategories())
        this.props.dispatch(fetchSessionData())
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

    viewSessionDataForTrial = (program, category, subCategory) => {
        totalIsCorrectAnswers = 0
        total = 0
        totalRecords = 0
        let filtered_sub_category = this.props.subcategories.length > 0 ? this.props.subcategories.find(e => e.id === subCategory.id) : []

        this.setState({ program: program, category: category, subCategory: filtered_sub_category, viewSessionDataDialogOpen: true })
    }

    progressDialogClose = () => {
        this.setState({
            viewProgressDialogopen: false,
        })
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
                countIsCorrectAnswers(item.is_correct_answer, index + 1);
                countPromptStrengthScore(item.prompt_strength_score);
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
                resultedTotalPromptStrength = resultedTotalPromptStrength + e.trial_total_prompt_strength;
                resultedTotalPromptStrengthScore = resultedTotalPromptStrengthScore + e.trail_total_prompt_strength_score;
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
            console.log(JSON.stringify(PSArray))
        }
        this.setState({ viewProgressDialogopen: true, graph_ps: resultedDatePSArray, graph_pss: resultedDatePSSCArray })
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
    //         <Toolbar style={{ justifyContent: "space-between", padding: "5px 20px 0px 0px" }}>
    //             <Typography style={{
    //                 color: "#2687C4",
    //                 fontWeight: "bold",
    //                 padding: '14px 20px 14px 10px',
    //             }}>{e.name}</Typography>
    //             <div>
    //                 {_.isEmpty(e.sessionData) !== true &&
    //                     <Toolbar>
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
                    {_.isEmpty(e.sessionData) !== true &&
                        <Toolbar>
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


    handleClose = () => {
        this.setState({
            viewSessionDataDialogOpen: false,
        })
    }
    render() {
        const { classes } = this.props;
        const options = {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Average Percent Correct & Prompt Strength'
            },

            subtitle: {
                //text: 'Source: my-aba.com'
                text: `${moment(new Date() - (30 * 24 * 3600 * 1000)).format("MMM DD YYYY")}${"-"}${moment(new Date()).format("MMM DD YYYY")}`
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        moment(moment(this.x).valueOf()).format("MMM DD YYYY")
                        + ", " + this.y;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
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
                gridLineWidth: 1,
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
            <div style={{ margin: 10 }}>
                <Toolbar style={{ justifyContent: "space-between", padding: "0px 0px 0px 0px" }}>
                    <Typography className={classes.scheduleTitleText}>Assigned Programs</Typography>
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
                {/* <Grid item xs={8} sm={12} style={{ backgroundColor: "#fff", borderRadius: 5, boxShadow: "0px 0px rgba(0, 0, 0, 0.2)", borderTop: "1px solid #2687C4" }}>
                    <Table>
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
                                    <TableCell align="left" className={classes.fontTableCellBody} style={{ width: 400 }}>
                                        {item.program.name}
                                    </TableCell>
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
                            ) : <TableCell colspan={4} style={{ textAlign: "center" }}>There are no programs</TableCell>
                            }
                        </TableBody>
                    </Table>
                </Grid> */}
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
                                                        <TableCell align="left" className={classes.fontTableCellBody} style={{ width: 300 }} >{cat.name}</TableCell>
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
                <Dialog
                    maxWidth={"xl"}
                    scroll="body"
                    open={this.state.viewSessionDataDialogOpen}>
                    <DialogTitle id="form-dialog-title">
                        <Typography className={classes.headerTextStyle}>{"Session Data"}</Typography>
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
                                <Typography className={classes.headerTextStyle}>Trials</Typography>
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
                                        (this.state.subCategory.sessionData.trial.map((e, index) =>
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
                    maxWidth={"xl"}
                    scroll="body"
                    open={this.state.viewProgressDialogopen}
                >
                    <DialogContent style={{ width: 500 }}>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                        <DialogActions>
                            <IconButton style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                marginRight: 0
                            }} onClick={() => this.progressDialogClose()}><ClearIcon style={{ color: "red" }} /></IconButton>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        client_programs: state.programReducer.client_programs,
        subcategories: state.subCategoryReducer.subcategories,
        sessionData: state.sessionDataReducer.sessionData
    }
}
ClientProgram.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), connect(mapStateToProps))(ClientProgram);