import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from "redux";
import {
    Table, TableBody, TableCell, TableHead, TableRow, Toolbar,
    Typography, Grid, Button, Dialog, DialogActions, TablePagination,
    DialogContent, DialogTitle, TextField, TableContainer
} from '@material-ui/core';
import { fetchCategoryById, addSubCategory, updateSubCategory } from "../../actions/subCategoryAction";
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
        fontFamily: "bold",
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
        //textTransform: 'none',
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
class SubCategory extends Component {
    constructor() {
        super();
        this.state = {
            categories: null,
            dialogOpen: false,
            id: null,
            name: "",
            name_error: false,
            code: "",
            code_error: false,
            note: "",
            note_error: false,
            mode: "",
            rowsPerPage: 10,
            page: 0,
        }
    }


    static getDerivedStateFromProps(props, state) {
        if (props.categories !== state.categories) {
            return {
                categories: props.categories
            }
        }
        return null;
    }

    componentDidMount() {
        this.props.dispatch(fetchCategoryById(this.props.location.state.id))
    }

    handleClick = (item, mode) => {
        if (mode === "ADD") {
            this.setState({ mode: mode, dialogOpen: true })
        }
        else {
            this.setState({
                id: item.id,
                dialogOpen: true,
                mode: mode,
                name: item.name,
                name_error: false,
                code: item.code,
                code_error: false,
                note: item.note,
                note_error: false,
            })
        }
    }
    handleClose = () => {
        this.setState({
            dialogOpen: false,
            id: null,
            name: "",
            name_error: false,
            code: "",
            code_error: false,
            note: "",
            note_error: false,
            //  mode: ""
        })
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


    handleSubmit = (mode) => {
        let { id, name, note } = this.state
        let isError = false;
        if (name === "" || name === null) {
            this.setState({ name_error: true })
            isError = true;
        }
        if (note === "" || note === null) {
            this.setState({ note_error: true })
            isError = true;
        }
        if (isError === false) {
            let subCategoryObject = {};
            subCategoryObject.category_id = this.props.location.state.id;
            subCategoryObject.name = name;
            subCategoryObject.note = note;
            subCategoryObject.status = "ACTIVE"
            if (mode === "ADD") {
                this.props.dispatch(addSubCategory(this, subCategoryObject))
            }
            else {
                this.props.dispatch(updateSubCategory(this, subCategoryObject, id))
            }
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{ padding: "0px 20px 0px 20px" }}>
                <Grid container spacing={0} style={{ marginTop: 10, }}>
                    <Grid item xs={12} sm={12}>
                        <Toolbar style={{ justifyContent: "space-between", padding: "5px 20px 0px 0px" }}>
                            <Typography className={classes.textStyle}>{this.props.category !== null && this.props.category.name}-SubCategories</Typography>
                            <TablePagination
                                rowsPerPageOptions={[20]}
                                component="div"
                                count={this.props.category !== null && this.props.category.subCategory !== null && this.props.category.subCategory.length}
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
                                        <TableCell align="left" className={classes.fontCellHeader}>Name</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeader}>Note</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeader}>Status</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeader}>Edit</TableCell>
                                        <TableCell align="left" className={classes.fontCellHeader}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(this.props.category !== null && this.props.category.subCategory !== null) && this.props.category.subCategory.length > 0 ? (this.props.category.subCategory.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell align="left" className={classes.fontTableCellBody}>{item.name}</TableCell>
                                            <TableCell align="left" className={classes.fontTableCellBody}>{item.note}</TableCell>
                                            <TableCell align="left" className={classes.fontTableCellBody}>{item.status}</TableCell>
                                            <TableCell align="left" className={classes.fontTableCellBody}>
                                                <Button size="small" className={classes.editButton} onClick={() => this.handleClick(item, "EDIT")}>Edit</Button>
                                            </TableCell>
                                            <TableCell align="left" className={classes.fontTableCellBody}>
                                            </TableCell>
                                        </TableRow>)
                                    ))
                                        :
                                        <TableCell colspan={5} style={{ textAlign: "center" }}>There are no sub categories</TableCell>
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
                        <Typography style={{ padding: "2% 5% 0 5%", fontFamily: "Futura-Heavy" }}>{this.state.mode === "ADD" ? "Add SubCategory" : "Update SubCategory"}</Typography>
                    </DialogTitle>
                    <DialogContent style={{ overflowY: "hidden" }}>
                        <Grid container justify="space-between" style={{ marginTop: -20, padding: "2% 5% 0 5%" }}>
                            <Grid item xs={12} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="name"
                                    label="Name"
                                    name="name"
                                    className={classes.margin}
                                    value={this.state.name}
                                    onChange={(event) => this.setState({ name: event.target.value, name_error: false })}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    fullWidth
                                    error={this.state.name_error === true ? true : false}
                                    helperText={this.state.name_error === true ? "Please enter name" : false}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ paddingRight: 8 }}>
                                <TextField
                                    id="note"
                                    label="note"
                                    name="note"
                                    className={classes.margin}
                                    value={this.state.note}
                                    onChange={(event) => this.setState({ note: event.target.value, note_error: false })}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        classes: { input: classes.inputStyle }
                                    }}
                                    fullWidth
                                    error={this.state.note_error === true ? true : false}
                                    helperText={this.state.note_error === true ? "Please enter note" : false}
                                />
                            </Grid>

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
        subcategories: state.subCategoryReducer.subcategories,
        categories: state.categoryReducer.categories,
        category: state.categoryReducer.category,
    }
}
SubCategory.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), connect(mapStateToProps))(SubCategory);